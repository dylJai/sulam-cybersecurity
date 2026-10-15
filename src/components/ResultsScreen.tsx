'use client';

import React from 'react';
import { ChallengeMeta } from '@/types/challenge';
import { Trophy, CheckCircle, RotateCcw, ArrowRight, ShieldCheck, Home, Star, BookOpen } from 'lucide-react';
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

  // Encouraging feedback tailored to support learners of all ages
  let encouragementTitle = 'Tahniah! Usaha Yang Sangat Baik!';
  let encouragementText = 'Setiap kesilapan adalah peluang pembelajaran terbaik untuk melindungi diri dan keluarga anda daripada jenayah siber.';
  let badgeColor = 'from-cyan-500 to-blue-600';

  if (percentage >= 80) {
    encouragementTitle = 'Hebat Sekali! Anda Wira Siber Komuniti!';
    encouragementText = 'Pasukan anda menunjukkan kefahaman tinggi terhadap helah penipuan siber. Kongsikan ilmu berharga ini dengan jiran tetangga dan rakan-rakan!';
    badgeColor = 'from-amber-400 to-emerald-500';
  } else if (percentage >= 60) {
    encouragementTitle = 'Bagus! Asas Keselamatan Siber Yang Mantap!';
    encouragementText = 'Anda berjaya mengesan kebanyakan perangkap bahaya. Dengan sentiasa beringat dan berwaspada, akaun anda akan sentiasa selamat.';
    badgeColor = 'from-cyan-500 to-teal-500';
  }

  const nextChallengeId = meta.id === 'phishing' ? 'passwords' : 'phishing';
  const nextChallengeTitle = meta.id === 'phishing' ? 'Password Protector' : 'Phishing Detection';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl mx-auto space-y-8 py-4"
    >
      {/* Top Trophy Banner */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-slate-700 bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-4 rounded-3xl bg-gradient-to-br from-amber-500/20 to-cyan-500/20 border border-amber-500/40 text-amber-300 shadow-xl mb-4">
          <Trophy className="w-12 h-12 animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          {encouragementTitle}
        </h2>

        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          {encouragementText}
        </p>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg mx-auto">
          {/* Points */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Jumlah Mata
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-300 mt-1 block">
              {score}
              <span className="text-xs text-slate-500 font-normal"> / {maxScore}</span>
            </span>
          </div>

          {/* Correct Answers */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Jawapan Tepat
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 mt-1 block">
              {correctCount}
              <span className="text-xs text-slate-500 font-normal"> / {totalQuestions}</span>
            </span>
          </div>

          {/* Percentage */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Ketepatan
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-400 mt-1 block">
              {percentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Key Lessons / Takeaways Box */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4 text-cyan-300">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h3 className="text-base font-bold text-white">
            Rumusan Pelajaran Penting ({meta.title})
          </h3>
        </div>

        <ul className="space-y-3">
          {meta.keyTakeaways.map((takeaway, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-slate-300 leading-relaxed">
              <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
              <span>{takeaway}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 pt-2">
        <button
          onClick={onPlayAgain}
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all cursor-pointer shadow-md hover:scale-[1.01]"
        >
          <RotateCcw className="w-4 h-4 text-cyan-400" />
          <span>Cuba Semula Cabaran Ini</span>
        </button>

        <Link
          href={`/challenge/${nextChallengeId}`}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-lg shadow-cyan-500/25 hover:scale-[1.01]"
        >
          <span>Teruskan ke {nextChallengeTitle}</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </Link>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Menu Utama</span>
        </Link>
      </div>
    </motion.div>
  );
};
