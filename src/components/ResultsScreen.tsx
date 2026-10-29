'use client';

import React, { useEffect } from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { RotateCcw, ArrowRight, Home, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { playPopSound, triggerCelebration } from '@/lib/sound';

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
  useEffect(() => {
    triggerCelebration();
  }, []);

  const percentage = Math.round((score / maxScore) * 100);

  let statusLabel = 'USAHA YANG SANGAT BAIK';
  let messageTitle = 'Pembelajaran Berjaya Dilengkapkan!';
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="max-w-3xl mx-auto space-y-6 py-4"
    >
      {/* Scorecard Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 w-fit">
            {statusLabel}
          </span>
          <span className="text-slate-500 text-xs font-semibold">
            {meta.title} • KEPUTUSAN MISI
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {messageTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed max-w-xl">
            {messageText}
          </p>
        </div>

        {/* Big Numbers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-y border-slate-100 py-5">
          {/* Total Score */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
              Jumlah Mata
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-blue-700 mt-1 block">
              {score}
              <span className="text-sm font-normal text-slate-400"> / {maxScore}</span>
            </span>
          </div>

          {/* Correct Count */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
              Jawapan Tepat
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-emerald-700 mt-1 block">
              {correctCount}
              <span className="text-sm font-normal text-slate-400"> / {totalQuestions}</span>
            </span>
          </div>

          {/* Percentage */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center sm:text-left">
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block">
              Ketepatan
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 block">
              {percentage}%
            </span>
          </div>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-3 pt-1">
          <span className="text-sm font-bold uppercase tracking-wider text-slate-900 block">
            Rumusan Pelajaran Penting:
          </span>
          <ul className="space-y-2.5">
            {meta.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
        <button
          onClick={() => { playPopSound(); onPlayAgain(); }}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-sm active:scale-[0.985]"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Cuba Semula</span>
        </button>

        <Link
          href="/"
          onClick={() => playPopSound()}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 transition-colors cursor-pointer shadow-sm active:scale-[0.985]"
        >
          <Home className="w-4 h-4" />
          <span>Menu Utama</span>
        </Link>

        <Link
          href={`/challenge/${nextChallengeId}`}
          onClick={() => playPopSound()}
          className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm active:scale-[0.985]"
        >
          <span>Seterusnya: {nextChallengeTitle}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};
