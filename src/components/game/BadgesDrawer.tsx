'use client';

import React from 'react';
import { Award, Lock, Sparkles } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white border-2 border-slate-200 rounded-3xl p-6 sm:p-7 space-y-5 shadow-sm"
    >
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-base sm:text-lg text-slate-900">
              {isEn ? 'Station Achievement Badges' : 'Lencana Pencapaian Stesen'}
            </h4>
            <p className="text-sm text-slate-600 font-medium">
              {isEn ? 'Unlocked as your team completes key discoveries' : 'Dibuka apabila pasukan anda membuat penemuan penting'}
            </p>
          </div>
        </div>
        <span className="font-black text-sm text-blue-700 bg-blue-100 px-3.5 py-1 rounded-full border border-blue-200">
          {unlockedCount} / {badges.length} {isEn ? 'Unlocked' : 'Dibuka'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {badges.map(badge => (
          <motion.button
            key={badge.id}
            type="button"
            whileHover={!shouldReduceMotion && badge.isUnlocked ? { scale: 1.02 } : {}}
            whileTap={!shouldReduceMotion && badge.isUnlocked ? { scale: 0.97 } : {}}
            onClick={() => {
              if (badge.isUnlocked) playSuccessChime();
              else playPopSound();
            }}
            className={`p-4 rounded-2xl border-2 text-left transition-all flex items-start gap-3 cursor-pointer ${
              badge.isUnlocked
                ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950 shadow-2xs hover:border-emerald-500'
                : 'bg-slate-50 border-slate-200 text-slate-400 opacity-70'
            }`}
          >
            <span className="text-3xl shrink-0 mt-0.5 filter drop-shadow-2xs">{badge.icon}</span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-slate-900 truncate">
                  {badge.name}
                </span>
                {badge.isUnlocked ? (
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 font-medium line-clamp-2 leading-relaxed">
                {badge.description}
              </p>
              <span className={`inline-block text-xs font-black uppercase tracking-wider pt-0.5 ${
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
