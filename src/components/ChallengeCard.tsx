'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ShieldAlert, KeyRound, Clock, ArrowRight, CheckCircle2, Award } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ChallengeCardProps {
  meta: ChallengeMeta;
  scoreRecord?: { score: number; maxScore: number; completedAt: string };
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ meta, scoreRecord }) => {
  const IconComponent = meta.id === 'phishing' ? ShieldAlert : KeyRound;
  const isCompleted = !!scoreRecord;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-3xl border-2 bg-slate-900/90 overflow-hidden shadow-xl flex flex-col justify-between transition-colors ${
        isCompleted
          ? 'border-emerald-500/60 shadow-emerald-950/20'
          : 'border-slate-800 hover:border-cyan-500/80 shadow-slate-950'
      }`}
    >
      {/* Decorative top accent gradient bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${meta.accentColor}`} />

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
        <div>
          {/* Top badges */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                {meta.badgeText}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {meta.difficulty}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{meta.estimatedTime}</span>
            </div>
          </div>

          {/* Icon & Title */}
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.accentColor} flex items-center justify-center text-white shrink-0 shadow-md`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">
                {meta.title}
              </h3>
              <p className="text-xs text-cyan-300 font-medium mt-0.5">
                5 Soalan Interaktif • {meta.maxScore} Markah
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-300 mt-4 leading-relaxed">
            {meta.shortDescription}
          </p>
        </div>

        {/* Status / Score Bar */}
        <div className="space-y-4 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Status Stesen:</span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Selesai ({scoreRecord.score} / {scoreRecord.maxScore} Mata)
              </span>
            ) : (
              <span className="text-slate-500 font-medium">Belum Mula</span>
            )}
          </div>

          {/* Start Challenge Button */}
          <Link
            href={`/challenge/${meta.id}`}
            className={`w-full py-3.5 px-5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 cursor-pointer shadow-lg ${
              isCompleted
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 shadow-cyan-500/20 hover:scale-[1.01]'
            }`}
          >
            <span>{isCompleted ? 'Ulang Cabaran Ini' : 'Mula Cabaran'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};
