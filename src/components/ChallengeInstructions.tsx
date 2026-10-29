'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

interface ChallengeInstructionsProps {
  meta: ChallengeMeta;
  onStart: () => void;
}

export const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({ meta, onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto space-y-6 py-4"
    >
      {/* Return home link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Menu Utama</span>
        </Link>
      </div>

      {/* Main Instruction Card */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header Block */}
        <div className="pb-6 border-b border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs mb-3">
            <span className="font-bold text-blue-800 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {meta.badgeText}
            </span>
            <div className="flex items-center gap-2">
              <VoiceOverButton
                text={`${meta.title}. ${meta.shortDescription}. Objektif pembelajaran: ${meta.learningObjective}`}
                variant="pill"
              />
              <span className="text-slate-500 font-medium">
                Masa: {meta.estimatedTime} • Tahap: {meta.difficulty}
              </span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {meta.title}
          </h1>
          <p className="text-base text-slate-600 mt-2 leading-relaxed">
            {meta.shortDescription}
          </p>
        </div>

        {/* Learning Objective Block */}
        <div className="p-4 sm:p-5 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-900 block">
            🎯 Objektif Pembelajaran
          </span>
          <p className="text-sm sm:text-base text-blue-950 leading-relaxed font-medium">
            {meta.learningObjective}
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-800 block">
            Panduan Menjalankan Stesen:
          </span>
          <ul className="space-y-2.5">
            {meta.instructions.map((inst, index) => (
              <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <span className="font-bold text-blue-700 bg-white border border-blue-200 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary note */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-600">
          Format: <strong>{meta.totalQuestions} soalan</strong> • <strong>10 mata setiap jawapan</strong> (Maksimum: {meta.maxScore} mata)
        </div>

        {/* Start Action Button */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md active:scale-[0.985]"
          >
            <span>Mulakan Cabaran Pasukan</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
