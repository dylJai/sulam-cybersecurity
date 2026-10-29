'use client';

/**
 * Universal Voice-Over engine for Sulam CyberSafe.
 * Supports pre-recorded authentic Malaysian/English audio assets (.m4a)
 * with automatic Web Speech API (speechSynthesis) fallback for dynamic text.
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

    // 1. If audio file is provided, prioritize real audio playback
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
          console.warn('Audio playback error, attempting SpeechSynthesis fallback', e);
          if (text) {
            this.playSpeechSynthesis(text, lang, rate, pitch, onStart, onEnd, onError);
          } else {
            this.stopAll();
            onError?.(e);
          }
        };

        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn('Audio play auto-policy warning:', err);
            // Fallback to text synthesis if direct playback is blocked
            if (text) {
              this.playSpeechSynthesis(text, lang, rate, pitch, onStart, onEnd, onError);
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
      window.speechSynthesis.cancel();

      // Clean text: remove bracketed labels like [Audio Nota Suara]:
      const cleanText = text.replace(/\[.*?\]:?/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Language selection
      utterance.lang = lang === 'en' ? 'en-US' : 'ms-MY';
      utterance.rate = rate;
      utterance.pitch = pitch;

      // Match voice if available
      const voices = window.speechSynthesis.getVoices();
      if (voices && voices.length > 0) {
        if (lang === 'bm') {
          const malayVoice = voices.find(
            (v) =>
              v.lang.toLowerCase().includes('ms') ||
              v.name.toLowerCase().includes('amira') ||
              v.name.toLowerCase().includes('damayanti') ||
              v.name.toLowerCase().includes('malay')
          );
          if (malayVoice) utterance.voice = malayVoice;
        } else {
          const englishVoice = voices.find(
            (v) =>
              (v.lang.toLowerCase().includes('en-us') || v.lang.toLowerCase().includes('en-gb')) &&
              (v.name.toLowerCase().includes('samantha') ||
                v.name.toLowerCase().includes('daniel') ||
                v.name.toLowerCase().includes('natural') ||
                v.name.toLowerCase().includes('google'))
          );
          if (englishVoice) utterance.voice = englishVoice;
        }
      }

      this.isSpeechSynthesisActive = true;

      utterance.onstart = () => {
        onStart?.();
      };

      utterance.onend = () => {
        this.isSpeechSynthesisActive = false;
        this.currentOnEnd = null;
        onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeechSynthesisActive = false;
        this.currentOnEnd = null;
        onError?.(e);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      this.isSpeechSynthesisActive = false;
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
