'use client';

import React, { useState } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

const WORD_BANK_BM = [
  'kucing', 'hujan', 'pisang', 'basikal',
  'merah', 'sedap', 'pagi', 'sungai',
  'deras', 'kopi', 'pantai', 'gunung'
];

const WORD_BANK_EN = [
  'banana', 'coffee', 'bicycle', 'river',
  'yellow', 'morning', 'mountain', 'breeze',
  'garden', 'forest', 'island', 'sunset'
];

interface PassphraseBuilderLabProps {
  onPassphraseCompleted: (assembledPassphrase: string) => void;
  onReset?: () => void;
}

export const PassphraseBuilderLab: React.FC<PassphraseBuilderLabProps> = ({ onPassphraseCompleted, onReset }) => {
  const { language } = useLanguage();
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const isEn = language === 'en';
  const wordBank = isEn ? WORD_BANK_EN : WORD_BANK_BM;

  const handleAddWord = (word: string) => {
    if (selectedWords.includes(word) || selectedWords.length >= 4) return;
    setSelectedWords(prev => [...prev, word]);
  };

  const handleRemoveWord = (word: string) => {
    setSelectedWords(prev => prev.filter(w => w !== word));
  };

  const handleReset = () => {
    setSelectedWords([]);
    onReset?.();
  };

  const assembledString = selectedWords.join('-');
  const charCount = assembledString.length;
  const wordCount = selectedWords.length;

  let crackTime = isEn ? 'No Passphrase Yet' : 'Tiada Frasa Laluan';
  let strengthLabel = isEn ? 'EMPTY' : 'KOSONG';
  let meterPercentage = 5;
  let meterColor = 'bg-[#8A241C]';

  if (wordCount === 1) {
    crackTime = isEn ? 'Less than 0.001 seconds' : 'Kurang 0.001 saat';
    strengthLabel = isEn ? 'VERY WEAK (1 Word Is Easily Guessed)' : 'SANGAT LEMAH (1 Perkataan Mudah Diteka)';
    meterPercentage = 25;
    meterColor = 'bg-[#8A241C]';
  } else if (wordCount === 2) {
    crackTime = isEn ? 'Around 3 hours' : 'Kira-kira 3 jam';
    strengthLabel = isEn ? 'MODERATE (Still Risky)' : 'SEDERHANA (Masih Berisiko)';
    meterPercentage = 50;
    meterColor = 'bg-[#8A5B1C]';
  } else if (wordCount === 3) {
    crackTime = isEn ? '85 years' : '85 tahun';
    strengthLabel = isEn ? 'STRONG (Hard to Guess)' : 'KUKUH (Sukar Diteka)';
    meterPercentage = 75;
    meterColor = 'bg-[#1E4D2B]';
  } else if (wordCount >= 4) {
    crackTime = isEn ? '55,000+ YEARS! (UNBREAKABLE)' : '55,000+ TAHUN! (KEBAL)';
    strengthLabel = isEn ? 'IRON FORTRESS 🛡️ (Maximum Security)' : 'KUBU BESI 🛡️ (Tahap Keselamatan Tertinggi)';
    meterPercentage = 100;
    meterColor = 'bg-[#1E4D2B]';
  }

  return (
    <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs space-y-5">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#171914]/15 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#171914]" />
          <span className="font-bold uppercase tracking-wider text-[#171914]">
            {isEn ? 'Interactive Passphrase Builder Lab' : 'Makmal Bina Frasa Laluan Sendiri'}
          </span>
        </div>
        <span className="text-[#575953] bg-[#ECEAE2] px-2.5 py-1 rounded-xs font-bold">
          {isEn ? 'Target: Chain 4 Everyday Words' : 'Sasaran: Gabungkan 4 Perkataan Mudah'}
        </span>
      </div>

      {/* Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Passphrase Monitor & Crack Time */}
        <div className="lg:col-span-6 rounded-sm border-2 border-[#171914]/25 bg-[#FAF9F5] p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171914] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#171914]" />
                <span>{isEn ? '1. Built Passphrase' : '1. Frasa Laluan Terbina'}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#575953] font-bold">
                  {wordCount} / 4 {isEn ? 'Words' : 'Perkataan'} • {charCount} {isEn ? 'Chars' : 'Aksara'}
                </span>
                {wordCount > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2 py-1 text-xs font-mono font-bold text-[#8A241C] bg-white border border-[#8A241C]/30 hover:bg-[#8A241C] hover:text-white rounded-xs cursor-pointer flex items-center gap-1 transition-colors min-h-[30px]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isEn ? 'Reset' : 'Kosongkan'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Display Box */}
            <div className="p-4 bg-white border-2 border-[#171914] rounded-sm min-h-[72px] flex items-center justify-center shadow-xs">
              {wordCount === 0 ? (
                <span className="text-xs sm:text-sm text-[#7C7E77] italic font-mono text-center">
                  {isEn ? '← Click words on the right to build your passphrase' : '← Klik perkataan di sebelah kanan untuk membina frasa'}
                </span>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {selectedWords.map((word, idx) => (
                    <React.Fragment key={word}>
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(word)}
                        title={isEn ? 'Click to remove this word' : 'Klik untuk padam perkataan ini'}
                        className="px-2.5 py-1 bg-[#D9FA62] border border-[#171914] rounded-xs font-mono font-bold text-xs sm:text-sm text-[#171914] hover:bg-[#8A241C] hover:text-white transition-colors cursor-pointer"
                      >
                        {word} <span className="text-[10px] ml-0.5 opacity-60">×</span>
                      </button>
                      {idx < selectedWords.length - 1 && (
                        <span className="font-mono font-bold text-[#171914]">-</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Strength meter */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-mono text-xs">
                <span className="text-[#575953] font-bold">
                  {isEn ? 'Strength Rating:' : 'Tahap Ketahanan:'}
                </span>
                <span className="font-bold text-[#171914]">{strengthLabel}</span>
              </div>
              <div className="h-2.5 w-full bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/15">
                <motion.div
                  className={`h-full ${meterColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${meterPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Supercomputer Crack Time Result */}
            <div className="p-3.5 bg-white border border-[#171914]/15 rounded-xs space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#7C7E77] font-bold">
                {isEn ? 'Supercomputer Crack Time Estimate:' : 'Anggaran Masa Superkomputer Meretas:'}
              </div>
              <div className={`font-mono text-base sm:text-lg font-black ${
                wordCount >= 4 ? 'text-[#1E4D2B]' : wordCount === 3 ? 'text-[#1E4D2B]' : 'text-[#8A241C]'
              }`}>
                {crackTime}
              </div>
            </div>
          </div>

          {/* Golden Rule Note */}
          <div className="p-3 bg-[#F5F4EE] rounded-xs border border-[#171914]/10 text-xs text-[#575953] leading-relaxed">
            <strong>{isEn ? 'The Golden Security Rule:' : 'Petua Emas Keselamatan:'}</strong>{' '}
            {isEn
              ? 'Password length beats complex symbols! A 25+ character passphrase made of 4 simple words is 100x easier to remember and infinitely harder for hacker computers to crack.'
              : 'Panjang kata laluan mengalahkan simbol pelik! Frasa 4 perkataan sepanjang 25+ aksara jauh lebih mudah diingati manusia dan mustahil diteka oleh komputer peretas.'}
          </div>
        </div>

        {/* RIGHT COLUMN: Word Bank & Finalize */}
        <div className="lg:col-span-6 rounded-sm border-2 border-[#171914]/25 bg-white p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-[#171914]/10">
              <span className="font-bold uppercase tracking-wider text-[#171914]">
                {isEn ? '2. Choose 4 Everyday Words' : '2. Pilih 4 Perkataan Mudah'}
              </span>
              <span className="text-[#7C7E77]">
                {4 - wordCount > 0
                  ? (isEn ? `Need ${4 - wordCount} more` : `Perlu ${4 - wordCount} lagi`)
                  : (isEn ? 'Complete!' : 'Lengkap!')}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {wordBank.map(word => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={word}
                    type="button"
                    disabled={isSelected || wordCount >= 4}
                    onClick={() => handleAddWord(word)}
                    className={`p-3 rounded-xs border font-mono text-xs sm:text-sm font-bold transition-all text-center min-h-[46px] ${
                      isSelected
                        ? 'bg-[#ECEAE2] text-[#82847C] border-[#171914]/10 cursor-not-allowed line-through'
                        : wordCount >= 4
                        ? 'bg-white text-[#82847C] border-[#171914]/10 cursor-not-allowed opacity-50'
                        : 'bg-[#FAF9F5] text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#D9FA62] cursor-pointer shadow-xs active:scale-95'
                    }`}
                  >
                    + {word}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submission CTA */}
          <div className="pt-3 border-t border-[#171914]/15">
            <button
              type="button"
              disabled={wordCount < 4}
              onClick={() => onPassphraseCompleted(assembledString)}
              className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                wordCount >= 4
                  ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                  : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{isEn ? 'Lock In 4-Word Passphrase (+10 Points)' : 'Kunci Frasa 4 Perkataan (+10 Mata)'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
