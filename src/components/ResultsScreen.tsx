'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { RotateCcw, ArrowRight, Home, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ResultsScreenProps {
  meta: ChallengeMeta;
  score: number;
  maxScore: number;
  correctCount: number;
  totalQuestions: number;
  onPlayAgain: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  meta,
  score,
  maxScore,
  correctCount,
  totalQuestions,
  onPlayAgain
}) => {
  const percentage = Math.round((score / maxScore) * 100);

  let statusLabel = 'USAHA YANG SANGAT BAIK';
  let messageTitle = 'Pembelajaran Berjaya Dilengkapkan';
  let messageText = 'Setiap kesilapan adalah peluang pembelajaran berharga untuk melindungi diri dan keluarga anda daripada jenayah siber di dunia sebenar.';

  if (percentage >= 80) {
    statusLabel = 'PENCAPAIAN CEMERLANG';
    messageTitle = 'Wira Keselamatan Siber Komuniti!';
    messageText = 'Pasukan anda menunjukkan kefahaman tinggi terhadap helah penipuan siber. Kongsikan ilmu berharga ini bersama jiran tetangga dan keluarga!';
  } else if (percentage >= 60) {
    statusLabel = 'PENCAPAIAN BAIK';
    messageTitle = 'Asas Keselamatan Siber Mantap';
    messageText = 'Pasukan anda berjaya mengesan kebanyakan perangkap bahaya. Sentiasa amalkan prinsip berwaspada semasa dalam talian.';
  }

  const nextChallengeId = meta.id === 'phishing' ? 'passwords' : 'phishing';
  const nextChallengeTitle = meta.id === 'phishing' ? '02 / Pelindung Kata Laluan' : '01 / Pengesanan Phishing';

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto space-y-6 py-4"
    >
      {/* Scorecard Header */}
      <div className="rounded-sm border border-[#171914]/20 bg-white p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#171914]/15 font-mono text-xs">
          <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
            {statusLabel}
          </span>
          <span className="text-[#7C7E77]">
            {meta.title.toUpperCase()} / KEPUTUSAN
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
            {messageTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#575953] mt-2 leading-relaxed max-w-xl">
            {messageText}
          </p>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-3 gap-3 border-t border-b border-[#171914]/10 py-5">
          {/* Total Score */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C7E77] block">
              Jumlah Mata
            </span>
            <span className="font-mono text-2xl sm:text-4xl font-extrabold text-[#171914] mt-1 block">
              {score}
              <span className="text-xs font-normal text-[#82847C]"> / {maxScore}</span>
            </span>
          </div>

          {/* Correct Count */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C7E77] block">
              Jawapan Tepat
            </span>
            <span className="font-mono text-2xl sm:text-4xl font-extrabold text-[#171914] mt-1 block">
              {correctCount}
              <span className="text-xs font-normal text-[#82847C]"> / {totalQuestions}</span>
            </span>
          </div>

          {/* Percentage */}
          <div>
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7C7E77] block">
              Ketepatan
            </span>
            <span className="font-mono text-2xl sm:text-4xl font-extrabold text-[#171914] mt-1 block">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-3 pt-1">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
            Rumusan Pelajaran Penting:
          </span>
          <ul className="space-y-2">
            {meta.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#575953] leading-relaxed">
                <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Cuba Semula</span>
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Menu Utama</span>
        </Link>

        <Link
          href={`/challenge/${nextChallengeId}`}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs"
        >
          <span>Seterusnya: {nextChallengeTitle}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
};
