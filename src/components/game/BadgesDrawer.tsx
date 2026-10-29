'use client';

import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime } from '@/lib/sound';

export interface BadgeItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
}

interface BadgesDrawerProps {
  badges: BadgeItem[];
}

export const BadgesDrawer: React.FC<BadgesDrawerProps> = ({ badges }) => {
  const { language } = useLanguage();
  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const isEn = language === 'en';

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 space-y-4 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
              {isEn ? 'Station Achievement Badges' : 'Lencana Pencapaian Stesen'}
            </h4>
            <p className="text-xs text-slate-500">
              {isEn ? 'Unlocked as your team completes key discoveries' : 'Dibuka apabila pasukan anda membuat penemuan penting'}
            </p>
          </div>
        </div>
        <span className="font-extrabold text-xs sm:text-sm text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
          {unlockedCount} / {badges.length} {isEn ? 'Unlocked' : 'Dibuka'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {badges.map(badge => (
          <motion.button
            key={badge.id}
            type="button"
            whileHover={badge.isUnlocked ? { scale: 1.02 } : {}}
            whileTap={badge.isUnlocked ? { scale: 0.97 } : {}}
            onClick={() => {
              if (badge.isUnlocked) playSuccessChime();
              else playPopSound();
            }}
            className={`p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${
              badge.isUnlocked
                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs hover:border-emerald-400'
                : 'bg-slate-50 border-slate-200/80 text-slate-400 opacity-70'
            }`}
          >
            <span className="text-2xl shrink-0 mt-0.5 filter drop-shadow-2xs">{badge.icon}</span>
            <div className="min-w-0 flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 truncate">
                  {badge.name}
                </span>
                {badge.isUnlocked ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                ) : (
                  <Lock className="w-3 h-3 text-slate-400 shrink-0" />
                )}
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                {badge.description}
              </p>
              <span className={`inline-block text-[11px] font-bold pt-0.5 ${
                badge.isUnlocked ? 'text-emerald-700' : 'text-slate-400'
              }`}>
                {badge.isUnlocked ? (isEn ? '✓ Unlocked' : '✓ Dibuka') : (isEn ? 'Locked' : 'Terkunci')}
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};
