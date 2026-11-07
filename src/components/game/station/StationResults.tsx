'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';

export interface HomeTip {
  title: string;
  description: string;
}

export interface StationResultsProps {
  stationNumber: string | number;
  score?: number;
  maxScore?: number;
  rating?: 'Gold' | 'Silver' | 'Bronze';
  ratingTitle?: string;
  ratingDescription?: string;
  homeTips: HomeTip[];
  badges?: BadgeItem[];
  onReset: () => void;
  homeHref?: string;
}

export const StationResults: React.FC<StationResultsProps> = ({
  stationNumber,
  score,
  maxScore = 50,
  rating = 'Gold',
  ratingTitle,
  ratingDescription,
  homeTips,
  badges,
  onReset,
  homeHref = '/'
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

  const medalEmoji = rating === 'Gold' ? '🥇' : rating === 'Silver' ? '🥈' : '🥉';

  const defaultRatingTitle =
    rating === 'Gold'
      ? isEn
        ? 'Gold Fortress Rank (Exemplary)'
        : 'Peringkat Kubu Emas (Cemerlang)'
      : rating === 'Silver'
      ? isEn
        ? 'Silver Shield Rank (Strong)'
        : 'Peringkat Perisai Perak (Kukuh)'
      : isEn
      ? 'Bronze Rank (Needs Hardening)'
      : 'Peringkat Gangsa (Perlu Diperkukuh)';

  return (
    <main
      aria-label={isEn ? `Station ${formattedStationNumber} Results` : `Keputusan Stesen ${formattedStationNumber}`}
      className="w-full space-y-6"
    >
      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
        {/* Medal Hero Card */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <motion.div
            initial={shouldReduceMotion ? false : { scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 mx-auto rounded-3xl bg-blue-50 border-2 border-blue-200 flex items-center justify-center text-5xl shadow-sm"
          >
            {medalEmoji}
          </motion.div>

          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-blue-700 tracking-wider">
              {isEn
                ? `Station ${formattedStationNumber} • Final Assessment`
                : `Stesen ${formattedStationNumber} • Penilaian Akhir Pasukan`}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              {ratingTitle || defaultRatingTitle}
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              {ratingDescription ||
                (isEn
                  ? 'Great job completing all challenges and strengthening your defense decisions.'
                  : 'Tahniah kerana berjaya menyelesaikan semua cabaran dan memperkukuh pertahanan keselamatan anda.')}
            </p>
          </div>
        </div>

        {/* Badges Drawer (Shown in Results Screen) */}
        {badges && badges.length > 0 && (
          <div className="pt-2">
            <BadgesDrawer badges={badges} />
          </div>
        )}

        {/* 3 Practical Action Tips at Home */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-200 pb-3 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>{isEn ? '3 Key Things to Do at Home:' : '3 Perkara Boleh Buat di Rumah:'}</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {homeTips.map((tip, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <strong className="text-lg font-bold text-slate-900 block">
                    {tip.title}
                  </strong>
                  <p className="text-base text-slate-600 font-medium leading-relaxed">
                    {tip.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workshop Navigation: Reset for next group OR return home */}
        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <button
            type="button"
            onClick={onReset}
            className="min-h-[56px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
          >
            <RotateCcw className="w-5 h-5" />
            <span>{isEn ? '🔄 Reset for Next Group' : '🔄 Set Semula untuk Kumpulan Seterusnya'}</span>
          </button>

          <Link
            href={homeHref}
            className="min-h-[56px] px-6 py-4 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
          >
            <span>{isEn ? 'Back to Challenge Hub' : 'Kembali ke Menu Utama'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
};
