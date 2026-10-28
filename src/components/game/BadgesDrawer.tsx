'use client';

import React from 'react';
import { Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

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

  return (
    <div className="bg-white border border-[#171914]/15 rounded-sm p-4 space-y-3 shadow-xs">
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-[#171914]" />
          <span className="font-bold uppercase tracking-wider text-[#171914]">
            {language === 'en' ? 'Station Investigation Badges' : 'Lencana Siasatan Stesen'}
          </span>
        </div>
        <span className="font-bold text-[#171914] bg-[#ECEAE2] px-2 py-0.5 rounded-xs">
          {unlockedCount} / {badges.length} {language === 'en' ? 'Unlocked' : 'Dibuka'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {badges.map(badge => (
          <div
            key={badge.id}
            className={`p-2.5 rounded-xs border text-xs transition-colors flex items-center gap-2.5 ${
              badge.isUnlocked
                ? 'bg-[#E7F3EB] border-[#1E4D2B]/30 text-[#123E23]'
                : 'bg-[#FAF9F5] border-[#171914]/10 text-[#82847C] opacity-60'
            }`}
          >
            <span className="text-xl shrink-0">{badge.icon}</span>
            <div className="min-w-0">
              <span className="font-bold block truncate font-mono text-[11px]">
                {badge.name}
              </span>
              <span className="text-[10px] text-[#575953] block truncate">
                {badge.isUnlocked ? (language === 'en' ? '✓ Unlocked' : '✓ Dibuka') : (language === 'en' ? 'Locked' : 'Terkunci')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
