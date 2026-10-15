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
      <div className="p-3.5 bg-[#ECEAE2] border border-[#171914]/15 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <span className="font-bold text-[#171914] uppercase tracking-wider">
          Aktiviti Perbandingan: Klik Contoh Kata Laluan
        </span>
        <span className="text-[#575953] bg-white px-2 py-0.5 rounded-xs border border-[#171914]/10 self-start sm:self-auto">
          Pilihan Semasa: {activeSample.label}
        </span>
      </div>

      {/* 3 Password Sample Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {question.passwords.map((pw: PasswordSample) => {
          const isActive = activePasswordId === pw.id;

          let badgeStyles = 'bg-[#FCE8E6] text-[#8A241C] border-[#8A241C]/30';
          if (pw.entropy === 'strong') {
            badgeStyles = 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30';
          } else if (pw.entropy === 'weak') {
            badgeStyles = 'bg-[#FAF0E6] text-[#8A5B1C] border-[#8A5B1C]/30';
          }

          return (
            <button
              key={pw.id}
              type="button"
              onClick={() => setActivePasswordId(pw.id)}
              className={`p-4 rounded-sm border text-left transition-colors flex flex-col justify-between cursor-pointer ${
                isActive
                  ? 'border-2 border-[#171914] bg-[#F5F4EE] shadow-xs'
                  : 'border-[#171914]/15 bg-white hover:border-[#171914]/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2 font-mono text-xs">
                  <span className="font-bold text-[#171914]">{pw.label.split(':')[0]}</span>
                  <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-xs border ${badgeStyles}`}>
                    {pw.entropy === 'strong' ? 'Kukuh' : pw.entropy === 'weak' ? 'Lemah' : 'Sgt Lemah'}
                  </span>
                </div>

                {/* Password Monospace Box */}
                <div className="p-2 bg-[#ECEAE2] border border-[#171914]/10 rounded-xs font-mono text-xs text-[#171914] break-all select-none">
                  {pw.passwordText}
                </div>
              </div>

              {/* Crack Time Preview */}
              <div className="mt-3 pt-2.5 border-t border-[#171914]/10 flex items-center gap-1.5 font-mono text-[11px] text-[#575953]">
                <Clock className="w-3.5 h-3.5 text-[#7C7E77]" />
                <span>Pecah: <strong>{pw.crackTimeEstimate}</strong></span>
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
          className="p-4 rounded-sm bg-white border border-[#171914]/20 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#171914]/10">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">
                Analisis Karakteristik
              </span>
              <span className="font-mono text-sm font-bold text-[#171914]">
                &ldquo;{activeSample.passwordText}&rdquo;
              </span>
            </div>

            <div className="font-mono text-xs text-[#171914] bg-[#ECEAE2] px-2.5 py-1 rounded-xs border border-[#171914]/10 self-start sm:self-auto">
              Anggaran Masa Penggodam: <strong>{activeSample.crackTimeEstimate}</strong>
            </div>
          </div>

          <ul className="space-y-1.5 text-xs text-[#575953]">
            {activeSample.characteristics.map((c, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono font-bold text-[#171914]">—</span>
                <span className="leading-relaxed">{c}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Decision Question and Answer Choices */}
      <div className="pt-2">
        <h4 className="text-base font-bold text-[#171914] mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#7C7E77]" />
          <span>{question.questionPrompt}</span>
        </h4>

        <div className="space-y-2.5">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            let optionStyles = 'border-[#171914]/20 bg-white hover:border-[#171914] text-[#171914]';

            if (isSelected) {
              optionStyles = 'border-2 border-[#171914] bg-[#F5F4EE] text-[#171914] shadow-xs';
            }

            if (isSubmitted) {
              if (option.isCorrect) {
                optionStyles = 'border-2 border-[#1E4D2B] bg-[#E7F3EB] text-[#123E23]';
              } else if (isSelected && !option.isCorrect) {
                optionStyles = 'border-2 border-[#8A241C] bg-[#FAF0E6] text-[#78271C]';
              } else {
                optionStyles = 'border-[#171914]/10 bg-[#ECEAE2]/40 text-[#82847C]';
              }
            }

            return (
              <button
                key={option.id}
                type="button"
                disabled={isSubmitted}
                onClick={() => onSelectOption(option.id)}
                className={`w-full p-3.5 rounded-sm border text-left transition-colors flex items-start gap-3 cursor-pointer ${optionStyles}`}
              >
                <span
                  className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5 ${
                    isSelected
                      ? 'bg-[#171914] text-[#D9FA62]'
                      : 'bg-[#ECEAE2] text-[#171914]'
                  }`}
                >
                  {option.id}
                </span>
                <span className="text-sm leading-relaxed">{option.text}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
