/**
 * Audio feedback & celebration utilities for Sulam CyberSafe.
 * Uses Web Audio API synthesizers to avoid needing large audio assets.
 * Respects user interaction and silent mode.
 */
import confetti from 'canvas-confetti';

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (typeof window !== 'undefined') {
    localStorage.setItem('cybersafe_sound', enabled ? 'true' : 'false');
  }
};

export const getSoundEnabled = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cybersafe_sound');
    if (saved !== null) {
      soundEnabled = saved === 'true';
    }
  }
  return soundEnabled;
};

const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

/**
 * Soft, gentle pop sound on tapping choices or clues
 */
export const playPopSound = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch {
    // Ignore audio autoplay restrictions
  }
};

/**
 * Warm uplifting double-chime for correct answers or findings
 */
export const playSuccessChime = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const noteTime = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.15, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.28);
    });
  } catch {
    // Ignore audio restrictions
  }
};

/**
 * Low cautionary notification for warnings or incorrect selections
 */
export const playWarningTone = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // Ignore audio restrictions
  }
};

/**
 * Confetti burst animation for celebrations & results
 */
export const triggerCelebration = () => {
  playSuccessChime();
  if (typeof window !== 'undefined') {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#2563EB', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
      });
    } catch {
      // Ignore
    }
  }
};
