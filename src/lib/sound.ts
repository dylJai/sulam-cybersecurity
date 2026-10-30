/**
 * Audio feedback & celebration utilities for Sulam CyberSafe.
 * Uses custom gentle Web Audio API synthesizers from the original deployment.
 * Soft bubbly sine pop, warm C-E-G major triad chime, and gentle caution tone.
 * Fully resilient against browser autoplay restrictions and suspended audio contexts.
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

// Global unlock on first user gesture
if (typeof window !== 'undefined') {
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

/**
 * Soft, gentle pop sound on tapping choices or clues (original 420Hz -> 750Hz sine sweep)
 */
export const playPopSound = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const play = () => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(750, now + 0.08);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  } catch {
    // Ignore audio autoplay restrictions
  }
};

/**
 * Warm uplifting double-chime for correct answers or findings (original C-E-G major triad)
 */
export const playSuccessChime = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const play = () => {
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      const now = ctx.currentTime;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        const noteTime = now + idx * 0.09;
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(0.18, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteTime);
        osc.stop(noteTime + 0.28);
      });
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
  } catch {
    // Ignore audio restrictions
  }
};

/**
 * Low cautionary notification for warnings or incorrect selections (original 260Hz -> 200Hz sine drop)
 */
export const playWarningTone = () => {
  if (!getSoundEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const play = () => {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.18);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(play).catch(() => {});
    } else {
      play();
    }
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
