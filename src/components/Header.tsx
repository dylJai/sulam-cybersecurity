'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw, ShieldCheck, Sparkles, Type, Volume2, VolumeX } from 'lucide-react';
import { getStationRecords, getOverallStats, resetStationRecords } from '@/lib/storage';
import { useLanguage, FontSize } from '@/context/LanguageContext';
import { getSoundEnabled, setSoundEnabled, playPopSound } from '@/lib/sound';

export const Header: React.FC = () => {
  const { language, setLanguage, fontSize, setFontSize, t } = useLanguage();
  const [stats, setStats] = useState({ totalScore: 0, maxPossibleScore: 300, completedCount: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const refreshStats = () => {
    const records = getStationRecords();
    setStats(getOverallStats(records));
  };

  useEffect(() => {
    refreshStats();
    setSoundOn(getSoundEnabled());
    const handleUpdate = () => refreshStats();
    window.addEventListener('cybersafe-storage-updated', handleUpdate);
    return () => window.removeEventListener('cybersafe-storage-updated', handleUpdate);
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
    if (next) {
      playPopSound();
    }
  };

  const handleReset = () => {
    resetStationRecords();
    setShowResetConfirm(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <Link
            href="/"
            onClick={() => playPopSound()}
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-xl py-1 px-1.5 transition-all"
            aria-label="CyberSafe Community Home"
          >
            <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform duration-200 shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                CyberSafe Komuniti
              </span>
              <span className="text-xs text-slate-600 font-medium">
                {language === 'en' ? 'Community Cybersecurity Workshop' : 'Bengkel Keselamatan Siber Komuniti'}
              </span>
            </div>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sound Toggle Button */}
            <button
              type="button"
              onClick={toggleSound}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
                soundOn
                  ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-2xs'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
              title={soundOn ? (language === 'en' ? 'Mute Sound Effects' : 'Matikan Bunyi Interaktif') : (language === 'en' ? 'Enable Sound Effects' : 'Hidupkan Bunyi Interaktif')}
              aria-label="Toggle Sound"
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-blue-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden md:inline">{soundOn ? (language === 'en' ? 'Sound On' : 'Bunyi Hidup') : (language === 'en' ? 'Muted' : 'Senyap')}</span>
            </button>

            {/* Font Size Adjuster for older adults & general accessibility */}
            <div
              className="hidden sm:flex items-center bg-slate-100/90 border border-slate-200/90 rounded-xl p-1 shadow-xs"
              title={t('header.fontSize')}
            >
              <span className="text-[11px] font-semibold text-slate-600 px-2 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-slate-600" />
                <span className="hidden md:inline">{t('header.fontSize')}:</span>
              </span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => { playPopSound(); setFontSize('normal'); }}
                  className={`px-2 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer active:scale-95 ${
                    fontSize === 'normal'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  aria-label="Saiz teks biasa"
                >
                  A
                </button>
                <button
                  type="button"
                  onClick={() => { playPopSound(); setFontSize('large'); }}
                  className={`px-2 py-1 rounded-lg text-sm font-bold transition-all cursor-pointer active:scale-95 ${
                    fontSize === 'large'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  aria-label="Saiz teks besar"
                >
                  A+
                </button>
                <button
                  type="button"
                  onClick={() => { playPopSound(); setFontSize('xlarge'); }}
                  className={`px-2 py-1 rounded-lg text-base font-bold transition-all cursor-pointer active:scale-95 ${
                    fontSize === 'xlarge'
                      ? 'bg-white text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  aria-label="Saiz teks sangat besar"
                >
                  A++
                </button>
              </div>
            </div>

            {/* Language Switcher Pill (BM | EN) */}
            <div className="flex items-center border border-slate-200 bg-slate-100/90 rounded-xl p-1 shadow-xs text-xs font-bold">
              <button
                type="button"
                onClick={() => { playPopSound(); setLanguage('bm'); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                  language === 'bm'
                    ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Tukar ke Bahasa Melayu"
              >
                BM
              </button>
              <button
                type="button"
                onClick={() => { playPopSound(); setLanguage('en'); }}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95 ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title="Switch to English"
              >
                EN
              </button>
            </div>

            {/* Station Score Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-emerald-50 border border-emerald-200/80 rounded-xl shadow-xs text-xs sm:text-sm min-h-[42px] transition-transform hover:scale-105 duration-200">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-pulse" />
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-0.5 sm:gap-1.5">
                <span className="text-emerald-800 font-medium text-[11px] sm:text-xs hidden md:inline">
                  {t('nav.scoreLabel')}
                </span>
                <span className="font-extrabold text-emerald-900">
                  {stats.totalScore}
                  <span className="text-emerald-700 font-normal"> / {stats.maxPossibleScore}</span>
                </span>
              </div>
            </div>

            {/* Reset Station for Next Team */}
            <button
              onClick={() => { playPopSound(); setShowResetConfirm(true); }}
              title={t('nav.resetBtn')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-red-700 bg-white hover:bg-red-50 border border-slate-200 hover:border-red-200 rounded-xl transition-all cursor-pointer min-h-[42px] shadow-xs active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{t('nav.resetBtn')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Friendly Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {t('nav.resetConfirmTitle')}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  CyberSafe Komuniti
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {t('nav.resetConfirmDesc')}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              >
                {t('nav.resetCancel')}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl transition-all cursor-pointer shadow-sm min-h-[44px]"
              >
                {t('nav.resetConfirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
