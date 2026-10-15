'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ShieldAlert, KeyRound, Clock, Target, CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ChallengeInstructionsProps {
  meta: ChallengeMeta;
  onStart: () => void;
}

export const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({ meta, onStart }) => {
  const IconComponent = meta.id === 'phishing' ? ShieldAlert : KeyRound;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-6 py-4"
    >
      {/* Return home link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Laman Utama</span>
        </Link>
      </div>

      {/* Main Instruction Card */}
      <div className="rounded-3xl border-2 border-slate-700 bg-slate-900/90 p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.accentColor} flex items-center justify-center text-white shadow-lg`}>
              <IconComponent className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-bold text-cyan-400 tracking-wider">
                  {meta.badgeText}
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400 font-medium">Tahap: {meta.difficulty}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {meta.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-semibold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{meta.estimatedTime}</span>
          </div>
        </div>

        {/* Learning Objective */}
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-800/50">
          <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm mb-1.5">
            <Target className="w-4 h-4 text-cyan-400" />
            <span>Objektif Pembelajaran</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            {meta.learningObjective}
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">
            Panduan Menjawab untuk Pasukan Stesen:
          </h3>
          <ul className="space-y-2.5">
            {meta.instructions.map((inst, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary note */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            Cabaran ini mengandungi <strong>{meta.totalQuestions} soalan</strong>. Setiap jawapan yang tepat menyumbang <strong>10 mata</strong> (Maksimum: {meta.maxScore} mata).
          </span>
        </div>

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all duration-200 shadow-xl shadow-cyan-500/20 hover:scale-[1.01] cursor-pointer"
          >
            <span>Mulakan Cabaran Pasukan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
