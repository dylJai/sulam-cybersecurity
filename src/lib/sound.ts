/**
 * Audio feedback & celebration utilities for Sulam CyberSafe.
 * Uses high-fidelity studio sound assets (.m4a) with Web Audio API synthesis fallback.
 * Highly responsive, supports rapid clicks, and respects user sound settings.
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
    if (saved === 'false') {
      soundEnabled = false;
    } else {
      soundEnabled = true;
    }
  }
  return soundEnabled;
};

// Global audio context for fallback synthesis
export const getAudioContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  return audioCtx;
};

// Preload audio assets into browser cache on startup
if (typeof window !== 'undefined') {
  const preloadAudio = (src: string) => {
    try {
      const a = new Audio();
      a.preload = 'auto';
      a.src = src;
    } catch {
      // ignore
    }
  };

  preloadAudio('/audio/pop.m4a');
  preloadAudio('/audio/success.m4a');
  preloadAudio('/audio/warning.m4a');

  // Unlock audio context on first user interaction
  const unlockAudio = () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
    } catch {
      // ignore
    }
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };

  window.addEventListener('click', unlockAudio, { passive: true });
  window.addEventListener('touchstart', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

// Fallback synthetic pop sound if audio file cannot play
const playSynthPop = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(480, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.1);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch {
    // ignore
  }
};

// Fallback synthetic success chime
const playSynthSuccess = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      const noteTime = now + idx * 0.09;
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.3, noteTime);
      gain.gain.linearRampToValueAtTime(0.001, noteTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.3);
    });
  } catch {
    // ignore
  }
};

// Fallback synthetic warning tone
const playSynthWarning = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.linearRampToValueAtTime(200, now + 0.18);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // ignore
  }
};

const playSoundFile = (src: string, volume = 0.7, fallback: () => void = playSynthPop) => {
  if (!getSoundEnabled() || typeof window === 'undefined') return;

  try {
    const audio = new Audio(src);
    audio.volume = volume;
    const promise = audio.play();

    if (promise !== undefined) {
      promise.catch((err) => {
        // Fallback to Web Audio oscillator if audio file play is blocked
        console.warn('Audio asset playback fallback:', err);
        fallback();
      });
    }
  } catch {
    fallback();
  }
};

/**
 * Satisfying, tactile pop sound on tapping buttons, choices, or clues
 */
export const playPopSound = () => {
  playSoundFile('/audio/pop.m4a', 0.8, playSynthPop);
};

/**
 * Warm uplifting chime for correct answers, findings, or badges
 */
export const playSuccessChime = () => {
  playSoundFile('/audio/success.m4a', 0.75, playSynthSuccess);
};

/**
 * Low cautionary notification for warnings or incorrect selections
 */
export const playWarningTone = () => {
  playSoundFile('/audio/warning.m4a', 0.75, playSynthWarning);
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
