'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ChallengeInstructionsProps {
  meta: ChallengeMeta;
  onStart: () => void;
}

export const ChallengeInstructions: React.FC<ChallengeInstructionsProps> = ({ meta, onStart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-2xl mx-auto space-y-6 py-4"
    >
      {/* Return home link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#7C7E77] hover:text-[#171914] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>[KEMBALI KE MENU UTAMA]</span>
        </Link>
      </div>

      {/* Main Instruction Card */}
      <div className="rounded-sm border border-[#171914]/20 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        {/* Header Block */}
        <div className="pb-6 border-b border-[#171914]/15">
          <div className="flex items-center justify-between gap-4 font-mono text-xs mb-2">
            <span className="font-bold text-[#171914] bg-[#D9FA62] px-2 py-0.5 rounded-xs border border-[#171914]/20">
              {meta.badgeText}
            </span>
            <span className="text-[#7C7E77]">
              MASA: {meta.estimatedTime} • TAHAP: {meta.difficulty}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
            {meta.title}
          </h1>
          <p className="text-sm text-[#575953] mt-2 leading-relaxed">
            {meta.shortDescription}
          </p>
        </div>

        {/* Learning Objective Block */}
        <div className="p-4 bg-[#F5F4EE] border border-[#171914]/12 rounded-sm space-y-1">
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#171914] block">
            Objektif Pembelajaran
          </span>
          <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
            {meta.learningObjective}
          </p>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-3">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
            Panduan Stesen:
          </span>
          <ul className="space-y-2">
            {meta.instructions.map((inst, index) => (
              <li key={index} className="flex items-start gap-3 text-xs sm:text-sm text-[#575953]">
                <span className="font-mono font-bold text-[#171914] shrink-0 mt-0.5">
                  0{index + 1}.
                </span>
                <span className="leading-relaxed">{inst}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Summary note */}
        <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs font-mono text-xs text-[#575953]">
          FORMAT: <strong>{meta.totalQuestions} soalan</strong> • <strong>10 mata setiap jawapan</strong> (Maksimum: {meta.maxScore} mata)
        </div>

        {/* Start Action Button */}
        <div className="pt-2">
          <button
            onClick={onStart}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs"
          >
            <span>Mulakan Cabaran Pasukan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
