'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  const formattedCurrent = currentQuestionIndex + 1;

  return (
    <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 text-sm">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
            Soalan {formattedCurrent} daripada {totalQuestions}
          </span>
          <span className="text-slate-500 font-medium hidden sm:inline">
            ({percentage}% selesai)
          </span>
        </div>

        {/* Current challenge score */}
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <span className="text-slate-500 font-medium text-xs">Mata Cabaran:</span>
          <span className="bg-amber-100 text-amber-900 px-3 py-1 rounded-lg border border-amber-300">
            {currentScore} / {maxScore}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
        <motion.div
          className="h-full bg-linear-to-r from-blue-600 to-indigo-600 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
