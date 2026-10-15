'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface ProgressBarProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  currentScore: number;
  maxScore: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentQuestionIndex,
  totalQuestions,
  currentScore,
  maxScore
}) => {
  const percentage = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-lg">
      <div className="flex items-center justify-between gap-4 mb-3">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-cyan-400 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded-full">
            Soalan {currentQuestionIndex + 1} / {totalQuestions}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            ({percentage}% Selesai)
          </span>
        </div>

        {/* Current challenge score */}
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 bg-amber-950/40 border border-amber-800/50 px-3 py-1 rounded-full">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>Markah Cabaran: {currentScore} / {maxScore}</span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden p-0.5">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};
