'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

export interface TakeawayCardProps {
  takeawayNumber?: number | string;
  title?: string;
  text: string;
  variant?: 'emerald' | 'blue';
  className?: string;
}

export const TakeawayCard: React.FC<TakeawayCardProps> = ({
  takeawayNumber = 1,
  title,
  text,
  variant = 'emerald',
  className = ''
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const defaultTitle = isEn
    ? `Golden Takeaway #${takeawayNumber}:`
    : `Prinsip Emas #${takeawayNumber}:`;

  const isEmerald = variant === 'emerald';

  return (
    <div
      role="region"
      aria-label={title || defaultTitle}
      className={`p-4 sm:p-5 rounded-2xl border-2 flex items-start justify-between gap-4 transition-all ${
        isEmerald
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-blue-50 border-blue-300 text-blue-950'
      } ${className}`}
    >
      <div className="flex items-start gap-3">
        <Sparkles
          className={`w-6 h-6 shrink-0 mt-0.5 ${
            isEmerald ? 'text-emerald-700' : 'text-blue-700'
          }`}
        />
        <div className="space-y-0.5">
          <strong className="text-base font-black block">
            {title || defaultTitle}
          </strong>
          <p className="text-base font-medium leading-relaxed">
            {text}
          </p>
        </div>
      </div>

      <div className="shrink-0 self-start">
        <VoiceOverButton
          text={`${title || defaultTitle} ${text}`}
          variant="badge"
          label={isEn ? 'Listen' : 'Dengar'}
        />
      </div>
    </div>
  );
};
