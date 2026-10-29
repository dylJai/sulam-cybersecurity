'use client';

import React, { useState } from 'react';
import { KeyRound, ArrowRight, ShieldCheck, Sparkles, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, triggerCelebration } from '@/lib/sound';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

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
    playPopSound();
    const newWords = [...selectedWords, word];
    setSelectedWords(newWords);
    if (newWords.length === 4) {
      playSuccessChime();
    }
  };

  const handleRemoveWord = (word: string) => {
    playPopSound();
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
  let meterColor = 'bg-red-500';

  if (wordCount === 1) {
    crackTime = isEn ? 'Less than 0.001 seconds' : 'Kurang 0.001 saat';
    strengthLabel = isEn ? 'VERY WEAK (1 Word Is Easily Guessed)' : 'SANGAT LEMAH (1 Perkataan Mudah Diteka)';
    meterPercentage = 25;
    meterColor = 'bg-red-500';
  } else if (wordCount === 2) {
    crackTime = isEn ? 'Around 3 hours' : 'Kira-kira 3 jam';
    strengthLabel = isEn ? 'MODERATE (Still Risky)' : 'SEDERHANA (Masih Berisiko)';
    meterPercentage = 50;
    meterColor = 'bg-amber-500';
  } else if (wordCount === 3) {
    crackTime = isEn ? '85 years' : '85 tahun';
    strengthLabel = isEn ? 'STRONG (Hard to Guess)' : 'KUKUH (Sukar Diteka)';
    meterPercentage = 75;
    meterColor = 'bg-emerald-600';
  } else if (wordCount >= 4) {
    crackTime = isEn ? '55,000+ YEARS! (UNBREAKABLE)' : '55,000+ TAHUN! (KEBAL)';
    strengthLabel = isEn ? 'IRON FORTRESS 🛡️ (Maximum Security)' : 'KUBU BESI 🛡️ (Tahap Keselamatan Tertinggi)';
    meterPercentage = 100;
    meterColor = 'bg-emerald-600';
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {isEn ? 'Interactive Passphrase Builder Lab' : 'Makmal Bina Kata Laluan Sendiri'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Combine 4 simple words into an unbreakable secret shield' : 'Gabungkan 4 perkataan mudah menjadi kubu kata laluan yang kebal'}
            </p>
          </div>
        </div>
        <span className="text-blue-700 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full text-xs font-bold self-start sm:self-auto">
          {isEn ? 'Target: Choose 4 Words' : 'Sasaran: Pilih 4 Perkataan'}
        </span>
      </div>

      {/* Two-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Passphrase Monitor & Crack Time */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-slate-50/80 p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{isEn ? 'Your Passphrase:' : 'Frasa Laluan Anda:'}</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-slate-600 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                  {wordCount} / 4 {isEn ? 'Words' : 'Perkataan'}
                </span>
                {wordCount > 0 && (
                  <div className="flex items-center gap-1.5">
                    <VoiceOverButton
                      text={selectedWords.join(' ')}
                      label={isEn ? 'Listen' : 'Dengar'}
                      variant="badge"
                    />
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-2.5 py-1 text-xs font-bold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer flex items-center gap-1 transition-colors min-h-[30px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Reset' : 'Padam'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Display Box */}
            <div className="p-5 bg-white border-2 border-slate-300 rounded-2xl min-h-[84px] flex items-center justify-center shadow-xs">
              {wordCount === 0 ? (
                <span className="text-sm sm:text-base text-slate-400 font-medium text-center">
                  {isEn ? '← Click the word buttons on the right to start building' : '← Klik butang perkataan di sebelah kanan untuk membina'}
                </span>
              ) : (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {selectedWords.map((word, idx) => (
                    <React.Fragment key={word}>
                      <button
                        type="button"
                        onClick={() => handleRemoveWord(word)}
                        title={isEn ? 'Click to remove this word' : 'Klik untuk buang perkataan ini'}
                        className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 rounded-xl font-bold text-sm sm:text-base text-blue-900 hover:bg-red-50 hover:border-red-200 hover:text-red-700 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{word}</span>
                        <span className="text-xs text-slate-400 font-normal">×</span>
                      </button>
                      {idx < selectedWords.length - 1 && (
                        <span className="font-extrabold text-slate-400 text-lg">-</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>

            {/* Strength meter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-slate-600 font-bold">
                  {isEn ? 'Security Level:' : 'Tahap Kekuatan:'}
                </span>
                <span className="font-extrabold text-slate-900">{strengthLabel}</span>
              </div>
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${meterColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${meterPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Crack Time Highlight */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-1">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                {isEn ? 'Estimated Hacker Crack Time:' : 'Anggaran Masa Penjenayah Siber Memecahkannya:'}
              </span>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {crackTime}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pt-1">
                {isEn
                  ? 'A 4-word passphrase creates an astronomically large mathematical combination that brute-force computers cannot crack in a lifetime!'
                  : 'Gabungan 4 perkataan rawak menghasilkan trilion kombinasi matematik yang mustahil dipecahkan oleh komputer penggodam sepanjang hayat!'}
              </p>
            </div>
          </div>

          {/* Submit Passphrase Button */}
          <div className="pt-2">
            <button
              type="button"
              disabled={wordCount < 4}
              onClick={() => {
                triggerCelebration();
                onPassphraseCompleted(assembledString);
              }}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all min-h-[52px] active:scale-[0.985] ${
                wordCount >= 4
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md hover:shadow-lg'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span>
                {wordCount >= 4
                  ? (isEn ? 'Use This Strong Passphrase (Next) →' : 'Gunakan Kata Laluan Kebal Ini (Seterusnya) →')
                  : (isEn ? `Select ${4 - wordCount} More Words` : `Pilih Lagi ${4 - wordCount} Perkataan`)}
              </span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Word Bank */}
        <div className="lg:col-span-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-extrabold text-sm sm:text-base text-slate-900">
                {isEn ? 'Bank of Easy Daily Words:' : 'Pilihan Perkataan Harian Mudah:'}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {isEn ? 'Click to add' : 'Klik untuk tambah'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isEn
                ? 'Select 4 words that are easy for you to remember. You do not need confusing symbols or strange numbers!'
                : 'Pilih 4 perkataan yang senang diingati. Anda tidak perlu pening menghafal simbol pelik atau huruf ganjil!'}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {wordBank.map(word => {
                const isSelected = selectedWords.includes(word);
                return (
                  <button
                    key={word}
                    type="button"
                    disabled={isSelected || selectedWords.length >= 4}
                    onClick={() => handleAddWord(word)}
                    className={`py-3 px-3.5 rounded-xl text-sm sm:text-base font-bold transition-all text-center min-h-[48px] flex items-center justify-center ${
                      isSelected
                        ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed opacity-50'
                        : 'bg-slate-50 hover:bg-blue-50 text-slate-800 hover:text-blue-700 border border-slate-200 hover:border-blue-300 shadow-2xs hover:shadow-xs cursor-pointer'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
            <strong>{isEn ? '💡 Pro-Tip:' : '💡 Petua Keselamatan:'}</strong>{' '}
            {isEn
              ? 'Words like "pisang-kopi-pantai-gunung" are easy for humans to picture in their mind, but impossible for computers to brute-force crack!'
              : 'Perkataan seperti "kucing-hujan-pisang-pantai" sangat mudah dibayangkan di fikiran manusia, tetapi mustahil diteka oleh komputer penjenayah!'}
          </div>
        </div>
      </div>
    </div>
  );
};
