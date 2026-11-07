'use client';

import React from 'react';
import { Clock, RotateCcw, Lock } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export interface StationTopBarProps {
  stationNumber: string | number;
  stationName: string;
  stepLabel: string;
  stepIndex: number;
  stepTotal: number;
  timer?: {
    formatted: string;
    isCritical: boolean;
    timeLeft: number;
  };
  onReset: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'slim';
}

export const StationTopBar: React.FC<StationTopBarProps> = ({
  stationNumber,
  stationName,
  stepLabel,
  stepIndex,
  stepTotal,
  timer,
  onReset,
  icon,
  variant = 'default'
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

  const formattedStationNumber =
    typeof stationNumber === 'number'
      ? stationNumber < 10
        ? `0${stationNumber}`
        : `${stationNumber}`
      : stationNumber;

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((stepIndex / Math.max(1, stepTotal)) * 100))
  );

  if (variant === 'slim') {
    return (
      <header
        aria-label={timer ? (isEn ? 'Station timer and step progress' : 'Pemasa stesen dan kemajuan langkah') : (isEn ? 'Station step progress' : 'Kemajuan langkah stesen')}
        className="w-full bg-white border-2 border-slate-200 rounded-2xl shadow-xs mb-4 overflow-hidden"
      >
        <div className="px-4 py-3 sm:px-5 sm:py-3.5 flex items-center justify-between gap-3 flex-wrap">
          {/* Station & Case Pills */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-blue-800 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">
              {icon && <span className="w-4 h-4 shrink-0 flex items-center justify-center">{icon}</span>}
              <span>{isEn ? `Station ${formattedStationNumber}: ${stationName}` : `Stesen ${formattedStationNumber}: ${stationName}`}</span>
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 font-mono">
              {isEn ? `Case ${stepIndex} of ${stepTotal}` : `Kes ${stepIndex} daripada ${stepTotal}`}
            </span>
          </div>

          {/* Timer & Reset Station */}
          <div className="flex items-center gap-2.5 ml-auto sm:ml-0">
            {timer && (
              <div
                role="timer"
                aria-live="polite"
                aria-atomic="true"
                className={`flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-xl border-2 font-mono text-lg sm:text-xl font-black transition-all ${
                  timer.isCritical
                    ? `bg-amber-100 text-amber-900 border-amber-400 ${shouldReduceMotion ? 'ring-2 ring-amber-500' : 'animate-pulse'}`
                    : 'bg-slate-100 text-slate-900 border-slate-300'
                }`}
              >
                <Clock className={`w-4 h-4 sm:w-5 sm:h-5 ${timer.isCritical ? 'text-amber-700' : 'text-blue-600'}`} />
                <span>{timer.formatted}</span>
                {timer.isCritical && (
                  <span className="text-[11px] font-sans font-bold text-amber-800 hidden md:inline">
                    ({isEn ? 'Hurry!' : 'Pantas!'})
                  </span>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={onReset}
              title={isEn ? 'Reset Station for Next Group' : 'Set Semula Stesen untuk Kumpulan Seterusnya'}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span className="hidden sm:inline">{isEn ? 'Reset Station' : 'Set Semula'}</span>
            </button>
          </div>
        </div>

        {/* Thin 6px Progress Bar under the row */}
        <div className="w-full bg-slate-100 h-[6px] overflow-hidden border-t border-slate-200">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>
    );
  }

  return (
    <header
      aria-label={timer ? (isEn ? 'Station timer and step progress' : 'Pemasa stesen dan kemajuan langkah') : (isEn ? 'Station step progress' : 'Kemajuan langkah stesen')}
      className="w-full bg-white border-2 border-slate-200 rounded-3xl p-4 sm:p-5 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-2xs shrink-0">
          {icon || <Lock className="w-6 h-6" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-black uppercase tracking-wider text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
              {isEn ? `Station ${formattedStationNumber}: ${stationName}` : `Stesen ${formattedStationNumber}: ${stationName}`}
            </span>
            <span className="text-xs font-bold text-slate-500 font-mono">
              {isEn
                ? `Step ${stepIndex} of ${stepTotal}`
                : `Langkah ${stepIndex} daripada ${stepTotal}`}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mt-0.5">
            {stepLabel}
          </h2>
        </div>
      </div>

      {/* Timer & Reset Controls */}
      <div className="flex items-center gap-3 justify-between md:justify-end">
        {/* Countdown Timer */}
        {timer && (
          <div
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 font-mono text-xl sm:text-2xl font-black transition-all ${
              timer.isCritical
                ? `bg-amber-100 text-amber-900 border-amber-400 ${shouldReduceMotion ? 'ring-2 ring-amber-500' : 'animate-pulse'}`
                : 'bg-slate-100 text-slate-900 border-slate-300'
            }`}
          >
            <Clock className={`w-5 h-5 ${timer.isCritical ? 'text-amber-700' : 'text-blue-600'}`} />
            <span>{timer.formatted}</span>
            {timer.isCritical && (
              <span className="text-[11px] font-sans font-bold text-amber-800 hidden sm:inline">
                ({isEn ? 'Hurry!' : 'Pantas!'})
              </span>
            )}
          </div>
        )}

        {/* Reset Station Button */}
        <button
          type="button"
          onClick={onReset}
          title={isEn ? 'Reset Station for Next Group' : 'Set Semula Stesen untuk Kumpulan Seterusnya'}
          className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-sm transition-all active:scale-95 cursor-pointer shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span className="hidden sm:inline">{isEn ? 'Reset Station' : 'Set Semula'}</span>
        </button>
      </div>

      {/* Progress Bar (Mobile) */}
      <div className="w-full md:hidden">
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
          <div
            className="bg-blue-600 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </header>
  );
};
