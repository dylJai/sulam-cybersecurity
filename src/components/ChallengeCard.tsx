'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ArrowRight, CheckCircle2, Clock, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound } from '@/lib/sound';

interface ChallengeCardProps {
  meta: ChallengeMeta;
  numberIndex: string; // e.g. "01", "02"
  scoreRecord?: { score: number; maxScore: number; completedAt: string };
}

const MISSION_ICONS: Record<string, string> = {
  '01': '📩',
  '02': '🔑',
  '03': '📞',
  '04': '📲',
  '05': '📈',
  '06': '🛡️'
};

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ meta, numberIndex, scoreRecord }) => {
  const { language, t } = useLanguage();
  const isCompleted = !!scoreRecord;
  const isEn = language === 'en';

  // Bilingual titles & descriptions
  const indexInt = parseInt(numberIndex, 10);
  const title = isEn ? t(`m${indexInt}.title`) || meta.title : meta.title;
  const description = isEn ? t(`m${indexInt}.desc`) || meta.shortDescription : meta.shortDescription;
  const difficulty = isEn ? (meta.difficulty === 'Asas' ? 'Beginner-Friendly' : 'Intermediate') : (meta.difficulty === 'Asas' ? 'Mudah & Santai' : 'Pertengahan');
  const timeEst = isEn ? '5-7 Mins' : meta.estimatedTime;
  const emoji = MISSION_ICONS[numberIndex] || '🛡️';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="relative rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 flex flex-col justify-between transition-shadow duration-200 shadow-sm hover:shadow-xl hover:border-blue-400 group h-full"
    >
      <div>
        {/* Top Header: Badge & Status */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl filter drop-shadow-xs group-hover:scale-110 transition-transform duration-200" role="img" aria-label="Icon">
              {emoji}
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                {isEn ? `Mission ${numberIndex}` : `Misi ${numberIndex}`}
              </span>
            </div>
          </div>

          <div>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>{scoreRecord.score} / {scoreRecord.maxScore} {isEn ? 'Pts' : 'Mata'}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-slate-500 px-3 py-1 rounded-full bg-slate-100 text-xs font-semibold">
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>50 {isEn ? 'Points' : 'Mata'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 mt-2.5 leading-relaxed">
          {description}
        </p>

        {/* Friendly Metadata Pills */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{timeEst}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>{difficulty}</span>
          </span>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-7 pt-4 border-t border-slate-100">
        <Link
          href={`/challenge/${meta.id}`}
          onClick={() => playPopSound()}
          className={`w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between transition-all cursor-pointer shadow-xs active:scale-[0.985] ${
            isCompleted
              ? 'bg-slate-100 hover:bg-slate-200/80 text-slate-800 border border-slate-200'
              : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-md'
          }`}
        >
          <span>
            {isCompleted
              ? (isEn ? 'Review / Play Again' : 'Ulang Kaji / Cuba Semula')
              : (isEn ? 'Start Mission' : 'Mula Cabaran')}
          </span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" />
        </Link>
      </div>
    </motion.div>
  );
};
