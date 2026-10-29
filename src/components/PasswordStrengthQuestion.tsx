'use client';

import React, { useState } from 'react';
import { PasswordCompareQuestion, PasswordSample } from '@/types/challenge';
import { Clock, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PasswordStrengthProps {
  question: PasswordCompareQuestion;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  isSubmitted: boolean;
}

export const PasswordStrengthQuestionView: React.FC<PasswordStrengthProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  isSubmitted
}) => {
  const [activePasswordId, setActivePasswordId] = useState<string>('pw-3');

  const activeSample = question.passwords.find(p => p.id === activePasswordId) || question.passwords[0];

  return (
    <div className="space-y-6">
      {/* Activity Guide Header */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-bold text-blue-900">
          🔑 Aktiviti Perbandingan: Klik Contoh Kata Laluan
        </span>
        <span className="text-blue-800 bg-white px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto font-semibold">
          Pilihan Semasa: {activeSample.label}
        </span>
      </div>

      {/* 3 Password Sample Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {question.passwords.map((pw: PasswordSample) => {
          const isActive = activePasswordId === pw.id;

          let badgeStyles = 'bg-rose-50 text-rose-800 border-rose-200';
          if (pw.entropy === 'strong') {
            badgeStyles = 'bg-emerald-50 text-emerald-800 border-emerald-200';
          } else if (pw.entropy === 'weak') {
            badgeStyles = 'bg-amber-50 text-amber-800 border-amber-200';
          }

          return (
            <button
              key={pw.id}
              type="button"
              onClick={() => setActivePasswordId(pw.id)}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer active:scale-[0.985] ${
                isActive
                  ? 'border-2 border-blue-600 bg-blue-50/40 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2.5 text-xs">
                  <span className="font-bold text-slate-800">{pw.label.split(':')[0]}</span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${badgeStyles}`}>
                    {pw.entropy === 'strong' ? 'Kukuh' : pw.entropy === 'weak' ? 'Lemah' : 'Sgt Lemah'}
                  </span>
                </div>

                {/* Password Monospace Box */}
                <div className="p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-xs sm:text-sm text-slate-900 break-all select-none">
                  {pw.passwordText}
                </div>
              </div>

              {/* Crack Time Preview */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Pecah: <strong className="text-slate-800">{pw.crackTimeEstimate}</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sample Deep-Dive Inspector */}
      {activeSample && (
        <motion.div
          key={activeSample.id}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] uppercase font-semibold text-slate-500 block">
                Analisis Karakteristik
              </span>
              <span className="font-mono text-sm sm:text-base font-bold text-slate-900">
                &ldquo;{activeSample.passwordText}&rdquo;
              </span>
            </div>

            <div className="text-xs sm:text-sm text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 self-start sm:self-auto font-medium">
              Anggaran Masa Penggodam: <strong className="text-blue-700">{activeSample.crackTimeEstimate}</strong>
            </div>
          </div>

          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {activeSample.characteristics.map((c, i) => (
              <li key={i} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="font-bold text-blue-600">•</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Decision Question and Answer Choices */}
      <div className="pt-2">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>{question.questionPrompt}</span>
        </h4>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-slate-200 bg-white hover:border-blue-400 hover:bg-slate-50 text-slate-800';

            if (isSelected) {
              optionStyles = 'border-2 border-blue-600 bg-blue-50/50 text-blue-950 shadow-sm';
            }

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-2 border-emerald-600 bg-emerald-50 text-emerald-950';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-2 border-rose-500 bg-rose-50 text-rose-950';
              } else {
                optionStyles = 'border-slate-100 bg-slate-50 text-slate-400';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => onSelectOption(option.id)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 cursor-pointer min-h-[56px] ${optionStyles}`}
              >
                <span
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-sm sm:text-base leading-relaxed font-medium">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
