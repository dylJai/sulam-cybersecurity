'use client';

import React, { useState } from 'react';
import { PasswordCompareQuestion, PasswordSample } from '@/types/challenge';
import { ShieldCheck, ShieldAlert, Clock, Check, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
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
      {/* Educational Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
        <KeyRound className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-cyan-200">
            Aktiviti Interaktif: Bandingkan Kekuatan Kata Laluan
          </p>
          <p className="text-slate-300 text-xs mt-0.5">
            Klik pada setiap contoh kata laluan rekaan di bawah untuk menyemak anggaran masa komputer penggodam memecahkannya.
          </p>
        </div>
      </div>

      {/* 3 Password Sample Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {question.passwords.map((pw: PasswordSample) => {
          const isActive = activePasswordId === pw.id;

          let badgeColor = 'bg-rose-950 text-rose-300 border-rose-800';
          let borderColor = 'border-slate-800';

          if (pw.entropy === 'strong') {
            badgeColor = 'bg-emerald-950 text-emerald-300 border-emerald-800';
          } else if (pw.entropy === 'weak') {
            badgeColor = 'bg-amber-950 text-amber-300 border-amber-800';
          }

          if (isActive) {
            borderColor = pw.entropy === 'strong' ? 'border-emerald-500 shadow-emerald-950/40' : 'border-cyan-500 shadow-cyan-950/40';
          }

          return (
            <button
              key={pw.id}
              type="button"
              onClick={() => setActivePasswordId(pw.id)}
              className={`p-4 rounded-2xl border-2 text-left transition-all duration-150 flex flex-col justify-between cursor-pointer bg-slate-900/90 shadow-lg ${borderColor} ${
                isActive ? 'ring-2 ring-cyan-500/30' : 'hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-300">{pw.label}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                    {pw.entropy === 'strong' ? 'Kukuh' : pw.entropy === 'weak' ? 'Lemah' : 'Sangat Lemah'}
                  </span>
                </div>

                {/* Password text box */}
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-sm text-cyan-300 break-all select-none">
                  {pw.passwordText}
                </div>
              </div>

              {/* Crack time preview */}
              <div className="mt-3 pt-3 border-t border-slate-800 flex items-center gap-1.5 text-xs text-slate-400">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Masa Pecah: <strong className="text-slate-200">{pw.crackTimeEstimate}</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sample Deep-Dive Inspector */}
      {activeSample && (
        <motion.div
          key={activeSample.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border-2 bg-slate-900/90 shadow-xl ${
            activeSample.entropy === 'strong'
              ? 'border-emerald-500/60 bg-emerald-950/15'
              : 'border-slate-800'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              {activeSample.entropy === 'strong' ? (
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-5 h-5 text-amber-400" />
              )}
              <h4 className="font-bold text-sm text-slate-100">
                Analisis Keselamatan: <span className="font-mono text-cyan-300">{activeSample.passwordText}</span>
              </h4>
            </div>

            <span className="text-xs font-semibold text-slate-300 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
              Anggaran Masa Pecah: {activeSample.crackTimeEstimate}
            </span>
          </div>

          <ul className="space-y-1.5 text-xs sm:text-sm text-slate-300">
            {activeSample.characteristics.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold mt-0.5">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Decision Question and Answer Choices */}
      <div className="pt-2">
        <h4 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span>{question.questionPrompt}</span>
        </h4>

        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-slate-800 bg-slate-900/80 hover:border-cyan-500 hover:bg-slate-900';

            if (isSelected) {
              optionStyles = 'border-cyan-500 bg-cyan-950/40 text-cyan-100 shadow-md shadow-cyan-950/50';
            }

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-emerald-500 bg-emerald-950/50 text-emerald-100';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-rose-500 bg-rose-950/50 text-rose-100';
              } else {
                optionStyles = 'border-slate-800 bg-slate-900/40 opacity-50';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => onSelectOption(option.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all duration-150 flex items-start gap-3 cursor-pointer ${optionStyles}`}
              >
                <span
                  className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-sm font-medium leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
