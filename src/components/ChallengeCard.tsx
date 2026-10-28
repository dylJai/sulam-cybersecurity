'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ChallengeCardProps {
  meta: ChallengeMeta;
  numberIndex: string; // e.g. "01", "02"
  scoreRecord?: { score: number; maxScore: number; completedAt: string };
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ meta, numberIndex, scoreRecord }) => {
  const { language, t } = useLanguage();
  const isCompleted = !!scoreRecord;

  // Bilingual titles & descriptions
  const title = language === 'en' ? t(`m${parseInt(numberIndex, 10)}.title`) || meta.title : meta.title;
  const description = language === 'en' ? t(`m${parseInt(numberIndex, 10)}.desc`) || meta.shortDescription : meta.shortDescription;
  const difficulty = language === 'en' ? (meta.difficulty === 'Asas' ? 'Beginner' : 'Intermediate') : meta.difficulty;
  const timeEst = language === 'en' ? '5-7 Mins' : meta.estimatedTime;

  return (
    <div className="relative rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 flex flex-col justify-between transition-colors shadow-xs hover:border-[#171914] group">
      <div>
        {/* Top Header: Number & Badge */}
        <div className="flex items-start justify-between pb-4 mb-4 border-b border-[#171914]/15">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-3xl sm:text-4xl font-extrabold text-[#171914] tracking-tighter">
              {numberIndex}
            </span>
            <span className="font-mono text-xs text-[#7C7E77] uppercase tracking-wider">
              {language === 'en' ? '/ WORKSHOP MODULE' : '/ MODUL BENGKEL'}
            </span>
          </div>

          <div className="font-mono text-xs">
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-xs bg-[#E7F3EB] text-[#123E23] border border-[#1E4D2B]/30 font-bold">
                <Check className="w-3 dot-3" />
                {scoreRecord.score} / {scoreRecord.maxScore} {language === 'en' ? 'PTS' : 'MATA'}
              </span>
            ) : (
              <span className="text-[#82847C] px-2 py-0.5 rounded-xs bg-[#ECEAE2]">
                50 {language === 'en' ? 'POINTS' : 'MATA'}
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight group-hover:underline">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#575953] mt-2 leading-relaxed">
          {description}
        </p>

        {/* Compact Metadata Grid */}
        <div className="mt-6 pt-4 border-t border-[#171914]/10 grid grid-cols-2 gap-2 font-mono text-[11px] text-[#575953]">
          <div>
            <span className="text-[#7C7E77] block text-[10px] uppercase">
              {language === 'en' ? 'Estimated Time' : 'Anggaran Masa'}
            </span>
            <span className="font-bold text-[#171914]">{timeEst}</span>
          </div>
          <div>
            <span className="text-[#7C7E77] block text-[10px] uppercase">
              {language === 'en' ? 'Target Level' : 'Tahap Peserta'}
            </span>
            <span className="font-bold text-[#171914]">{difficulty}</span>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-8 pt-4 border-t border-[#171914]/15">
        <Link
          href={`/challenge/${meta.id}`}
          className={`w-full py-3.5 px-5 min-h-[48px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between transition-colors cursor-pointer border-2 ${
            isCompleted
              ? 'bg-[#ECEAE2] hover:bg-[#E4E1D6] text-[#171914] border-[#171914]/20'
              : 'bg-[#171914] hover:bg-[#2A2D25] text-[#D9FA62] border-[#171914] shadow-xs'
          }`}
        >
          <span>
            {isCompleted
              ? (language === 'en' ? 'Review This Mission' : 'Ulang Kaji Cabaran Ini')
              : (language === 'en' ? 'Start This Mission' : 'Mulakan Cabaran Ini')}
          </span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
