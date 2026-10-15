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
  const formattedCurrent = String(currentQuestionIndex + 1).padStart(2, '0');
  const formattedTotal = String(totalQuestions).padStart(2, '0');

  return (
    <div className="w-full bg-white border border-[#171914]/15 rounded-sm p-4 sm:p-5 shadow-xs">
      <div className="flex items-center justify-between gap-4 mb-3 font-mono text-xs">
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#171914] bg-[#ECEAE2] px-2 py-0.5 rounded-xs">
            SOALAN {formattedCurrent} / {formattedTotal}
          </span>
          <span className="text-[#82847C] hidden sm:inline">
            [{percentage}% Lengkap]
          </span>
        </div>

        {/* Current challenge score */}
        <div className="flex items-center gap-1.5 font-bold text-[#171914]">
          <span className="text-[#82847C] font-normal uppercase text-[10px] tracking-wider">Mata Cabaran:</span>
          <span className="bg-[#D9FA62] px-2 py-0.5 rounded-xs border border-[#171914]/20">
            {currentScore} / {maxScore}
          </span>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="h-2 w-full bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
        <motion.div
          className="h-full bg-[#171914]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        />
      </div>
    </div>
  );
};
