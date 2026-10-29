'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceOverManager } from '@/lib/voice-over';
import { playPopSound } from '@/lib/sound';
import { useLanguage } from '@/context/LanguageContext';

export interface VoiceOverButtonProps {
  text?: string;
  audioSrc?: string;
  label?: string;
  playingLabel?: string;
  lang?: 'bm' | 'en';
  variant?: 'pill' | 'compact' | 'primary' | 'badge';
  className?: string;
}

export const VoiceOverButton: React.FC<VoiceOverButtonProps> = ({
  text,
  audioSrc,
  label,
  playingLabel,
  lang: explicitLang,
  variant = 'pill',
  className = ''
}) => {
  const { language } = useLanguage();
  const currentLang = explicitLang || language || 'bm';
  const isEn = currentLang === 'en';

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (isPlaying) {
        voiceOverManager.stopAll();
      }
    };
  }, [isPlaying]);

  const defaultLabel = isEn ? 'Voice-Over' : 'Dengar Suara';
  const defaultPlayingLabel = isEn ? 'Stop Audio' : 'Hentikan Audio';

  const displayLabel = label || defaultLabel;
  const displayPlayingLabel = playingLabel || defaultPlayingLabel;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    playPopSound();

    if (isPlaying) {
      voiceOverManager.stopAll();
      setIsPlaying(false);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      voiceOverManager.play({
        audioSrc,
        text,
        lang: currentLang,
        rate: 0.95,
        onStart: () => {
          setIsLoading(false);
          setIsPlaying(true);
        },
        onEnd: () => {
          setIsPlaying(false);
          setIsLoading(false);
        },
        onError: () => {
          setIsPlaying(false);
          setIsLoading(false);
        }
      });
    }
  };

  // 1. Badge Variant (Very small, fits neatly into message header tags)
  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? displayPlayingLabel : displayLabel}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer select-none ${
          isPlaying
            ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
            : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
        } ${className}`}
      >
        {isPlaying ? (
          <>
            <Square className="w-3 h-3 fill-rose-700 text-rose-700" />
            <span>{displayPlayingLabel}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{displayLabel}</span>
          </>
        )}
      </button>
    );
  }

  // 2. Primary Variant (Prominent button for briefings / important warnings)
  if (variant === 'primary') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? displayPlayingLabel : displayLabel}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-xs min-h-[42px] select-none ${
          isPlaying
            ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200'
            : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
        } ${className}`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <>
            <Square className="w-4 h-4 fill-white" />
            <span>{displayPlayingLabel}</span>
            {/* Live equalizer wave bars */}
            <span className="flex items-center gap-0.5 ml-1 h-3.5">
              {[6, 12, 8, 14, 7].map((h, i) => (
                <motion.span
                  key={i}
                  animate={{ height: [3, h, 3] }}
                  transition={{ repeat: Infinity, duration: 0.5 + i * 0.12, ease: 'easeInOut' }}
                  className="w-1 bg-white rounded-full inline-block"
                />
              ))}
            </span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>{displayLabel}</span>
          </>
        )}
      </button>
    );
  }

  // 3. Compact Variant (Circular or mini button)
  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? displayPlayingLabel : displayLabel}
        title={isPlaying ? displayPlayingLabel : displayLabel}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
          isPlaying
            ? 'bg-rose-600 text-white hover:bg-rose-700'
            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
        } ${className}`}
      >
        {isPlaying ? (
          <Square className="w-4 h-4 fill-white" />
        ) : (
          <Volume2 className="w-4 h-4" />
        )}
      </button>
    );
  }

  // 4. Default Pill Variant (Clean, intuitive pill with sound wave)
  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? displayPlayingLabel : displayLabel}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer border select-none ${
        isPlaying
          ? 'bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100 shadow-xs'
          : 'bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 border-slate-200 hover:border-emerald-300 shadow-2xs'
      } ${className}`}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
      ) : isPlaying ? (
        <>
          <Square className="w-3 h-3 fill-rose-600 text-rose-600" />
          <span>{displayPlayingLabel}</span>
          {/* Animated sound wave bars */}
          <span className="flex items-center gap-0.5 ml-0.5 h-3">
            {[4, 10, 6, 12, 5].map((h, i) => (
              <motion.span
                key={i}
                animate={{ height: [2, h, 2] }}
                transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
                className="w-0.5 bg-rose-600 rounded-full inline-block"
              />
            ))}
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{displayLabel}</span>
        </>
      )}
    </button>
  );
};
