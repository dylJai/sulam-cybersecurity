'use client';

/**
 * Universal Voice-Over engine for Sulam CyberSafe.
 * Supports pre-recorded authentic Malaysian/English audio assets (.m4a)
 * with automatic Web Speech API (speechSynthesis) fallback for dynamic text.
 * Resilient against browser autoplay policies and cross-platform speech engine gaps.
 */

type VoiceOverCallback = () => void;
type ProgressCallback = (currentTime: number, duration: number) => void;

interface VoiceOverOptions {
  audioSrc?: string;
  text?: string;
  lang?: 'bm' | 'en';
  rate?: number;
  pitch?: number;
  onStart?: VoiceOverCallback;
  onEnd?: VoiceOverCallback;
  onError?: (err: unknown) => void;
  onProgress?: ProgressCallback;
}

class VoiceOverManager {
  private activeAudio: HTMLAudioElement | null = null;
  private isSpeechSynthesisActive = false;
  private progressInterval: NodeJS.Timeout | null = null;
  private currentOnEnd: VoiceOverCallback | null = null;
  private activeUtterance: SpeechSynthesisUtterance | null = null; // Prevent Chromium GC mid-speech
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public stopAll(): void {
    // Stop HTML Audio
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }

    // Stop SpeechSynthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isSpeechSynthesisActive = false;
    this.activeUtterance = null;

    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }

    if (this.currentOnEnd) {
      const cb = this.currentOnEnd;
      this.currentOnEnd = null;
      cb();
    }
  }

  public play(options: VoiceOverOptions): void {
    this.stopAll();

    const {
      audioSrc,
      text,
      lang = 'bm',
      rate = 0.95,
      pitch = 1.0,
      onStart,
      onEnd,
      onError,
      onProgress
    } = options;

    this.currentOnEnd = onEnd || null;

    // 1. If audio file is provided, attempt playback first
    if (audioSrc) {
      try {
        const audio = new Audio(audioSrc);
        this.activeAudio = audio;

        audio.onplay = () => {
          onStart?.();
          if (onProgress) {
            this.progressInterval = setInterval(() => {
              if (audio) {
                onProgress(audio.currentTime, audio.duration || 0);
              }
            }, 100);
          }
        };

        audio.onended = () => {
          this.stopAll();
        };

        audio.onerror = (e) => {
          console.warn('Audio asset error, falling back to speech synthesis:', e);
          if (text) {
            this.playSpeechSynthesis(text, lang, rate, pitch, onStart, onEnd, onError);
          } else {
            this.stopAll();
            onError?.(e);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              onStart?.();
            })
            .catch((err) => {
              console.warn('Audio play auto-policy warning, attempting fallback:', err);
              if (text) {
                this.playSpeechSynthesis(text, lang, rate, pitch, onStart, onEnd, onError);
              } else {
                this.stopAll();
                onError?.(err);
              }
            });
        }
        return;
      } catch (err) {
        console.warn('Could not initialize audio:', err);
      }
    }

    // 2. Fallback to Web Speech API
    if (text) {
      this.playSpeechSynthesis(text, lang, rate, pitch, onStart, onEnd, onError);
    }
  }

  private playSpeechSynthesis(
    text: string,
    lang: 'bm' | 'en',
    rate: number,
    pitch: number,
    onStart?: VoiceOverCallback,
    onEnd?: VoiceOverCallback,
    onError?: (err: unknown) => void
  ): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onError?.(new Error('SpeechSynthesis not supported'));
      return;
    }

    try {
      // Avoid immediate speak bug by delaying 50ms after cancel
      window.speechSynthesis.cancel();

      setTimeout(() => {
        try {
          // Clean text: strip bracketed tags like [Audio Nota Suara]:
          const cleanText = text.replace(/\[.*?\]:?/g, '').trim();
          if (!cleanText) {
            onEnd?.();
            return;
          }

          const utterance = new SpeechSynthesisUtterance(cleanText);
          this.activeUtterance = utterance; // Retain reference to prevent garbage collection

          utterance.rate = rate;
          utterance.pitch = pitch;

          // Check voices
          const voices =
            this.cachedVoices.length > 0
              ? this.cachedVoices
              : window.speechSynthesis.getVoices();
          this.cachedVoices = voices;

          if (lang === 'bm') {
            // Find Malay voice
            const malayVoice = voices.find(
              (v) =>
                v.lang.toLowerCase().includes('ms') ||
                v.name.toLowerCase().includes('amira') ||
                v.name.toLowerCase().includes('damayanti') ||
                v.name.toLowerCase().includes('malay')
            );

            if (malayVoice) {
              utterance.voice = malayVoice;
              utterance.lang = malayVoice.lang;
            } else {
              // Indonesian fallback (universally available on Windows/Chrome/Android and phonetically equivalent)
              const indonesianVoice = voices.find(
                (v) =>
                  v.lang.toLowerCase().includes('id') ||
                  v.name.toLowerCase().includes('indonesia')
              );
              if (indonesianVoice) {
                utterance.voice = indonesianVoice;
                utterance.lang = indonesianVoice.lang;
              } else {
                utterance.lang = 'id-ID';
              }
            }
          } else {
            // English voice
            const englishVoice = voices.find(
              (v) =>
                (v.lang.toLowerCase().includes('en-us') ||
                  v.lang.toLowerCase().includes('en-gb') ||
                  v.lang.toLowerCase().includes('en-my')) &&
                (v.name.toLowerCase().includes('samantha') ||
                  v.name.toLowerCase().includes('daniel') ||
                  v.name.toLowerCase().includes('natural') ||
                  v.name.toLowerCase().includes('google'))
            );
            if (englishVoice) {
              utterance.voice = englishVoice;
              utterance.lang = englishVoice.lang;
            } else {
              utterance.lang = 'en-US';
            }
          }

          this.isSpeechSynthesisActive = true;

          utterance.onstart = () => {
            onStart?.();
          };

          utterance.onend = () => {
            this.isSpeechSynthesisActive = false;
            this.activeUtterance = null;
            this.currentOnEnd = null;
            onEnd?.();
          };

          utterance.onerror = (e) => {
            console.warn('SpeechSynthesis event error:', e);
            this.isSpeechSynthesisActive = false;
            this.activeUtterance = null;
            this.currentOnEnd = null;
            onError?.(e);
          };

          window.speechSynthesis.speak(utterance);
        } catch (innerErr) {
          this.isSpeechSynthesisActive = false;
          this.activeUtterance = null;
          onError?.(innerErr);
        }
      }, 60);
    } catch (err) {
      this.isSpeechSynthesisActive = false;
      this.activeUtterance = null;
      this.currentOnEnd = null;
      onError?.(err);
    }
  }

  public isPlaying(): boolean {
    return (
      (this.activeAudio !== null && !this.activeAudio.paused) ||
      this.isSpeechSynthesisActive
    );
  }
}

export const voiceOverManager = new VoiceOverManager();
