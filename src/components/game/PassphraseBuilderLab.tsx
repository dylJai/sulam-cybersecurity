'use client';

import React, { useState } from 'react';
import { KeyRound, Trash2, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const WORD_BANK = [
  'kucing', 'hujan', 'pisang', 'basikal',
  'merah', 'sedap', 'pagi', 'sungai',
  'deras', 'kopi', 'pantai', 'gunung'
];

interface PassphraseBuilderLabProps {
  onPassphraseCompleted: (assembledPassphrase: string) => void;
  onReset?: () => void;
}

export const PassphraseBuilderLab: React.FC<PassphraseBuilderLabProps> = ({ onPassphraseCompleted, onReset }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

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

  let crackTime = 'Tiada Frasa Laluan';
  let strengthLabel = 'KOSONG';
  let meterPercentage = 5;
  let meterColor = 'bg-[#8A241C]';

  if (wordCount === 1) {
    crackTime = 'Kurang 0.001 saat';
    strengthLabel = 'SANGAT LEMAH (1 Perkataan Mudah Diteka)';
    meterPercentage = 25;
    meterColor = 'bg-[#8A241C]';
  } else if (wordCount === 2) {
    crackTime = 'Kira-kira 3 jam';
    strengthLabel = 'SEDERHANA (Masih Berisiko)';
    meterPercentage = 50;
    meterColor = 'bg-[#8A5B1C]';
  } else if (wordCount === 3) {
    crackTime = '85 tahun';
    strengthLabel = 'KUKUH (Sukar Diteka)';
    meterPercentage = 75;
    meterColor = 'bg-[#1E4D2B]';
  } else if (wordCount >= 4) {
    crackTime = '55,000+ TAHUN! (KEBAL)';
    strengthLabel = 'KUBU BESI 🛡️ (Tahap Keselamatan Tertinggi)';
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
            Makmal Bina Frasa Laluan Sendiri
          </span>
        </div>
        <span className="text-[#575953] bg-[#ECEAE2] px-2.5 py-1 rounded-xs font-bold">
          Sasaran: Gabungkan 4 Perkataan Melayu
        </span>
      </div>

      {/* Two-Column Split: Left = Passphrase Monitor & Crack Time; Right = Word Bank & Submit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: The Output, Meter, & Security Principle (Col 1-6) */}
        <div className="lg:col-span-6 rounded-sm border-2 border-[#171914]/25 bg-[#FAF9F5] p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171914] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#171914]" />
                <span>1. Frasa Laluan Terbina</span>
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[#575953] font-bold">
                  {wordCount} / 4 Perkataan • {charCount} Aksara
                </span>
                {wordCount > 0 && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-2 py-1 text-xs font-mono font-bold text-[#8A241C] bg-white border border-[#8A241C]/30 hover:bg-[#8A241C] hover:text-white rounded-xs cursor-pointer flex items-center gap-1 transition-colors min-h-[30px]"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>[Set Semula]</span>
                  </button>
                )}
              </div>
            </div>

            {/* Word Blocks Tray */}
            <div className="min-h-16 flex flex-wrap items-center gap-2 bg-white p-3.5 border-2 border-[#171914]/25 rounded-xs">
              {selectedWords.length === 0 ? (
                <span className="text-xs sm:text-sm text-[#82847C] font-mono italic">
                  Klik 4 butang perkataan di sebelah kanan untuk membina kata laluan anda...
                </span>
              ) : (
                selectedWords.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => handleRemoveWord(word)}
                    title="Klik untuk buang perkataan ini"
                    className="px-3.5 py-2 bg-[#171914] text-[#D9FA62] font-mono font-bold text-sm sm:text-base rounded-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#8A241C] hover:text-white transition-colors min-h-[44px] shadow-xs"
                  >
                    <span>{word}</span>
                    <span className="text-xs opacity-70">✕</span>
                  </button>
                ))
              )}
            </div>

            {/* Live Crack-Time Meter */}
            <div className="p-4 bg-white border-2 border-[#171914]/15 rounded-xs space-y-2 font-mono text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                <span className="uppercase text-[#7C7E77] font-bold text-xs">
                  Masa Pemecahan Komputer Penggodam:
                </span>
                <span className="font-black text-sm sm:text-base text-[#171914] bg-[#FAF9F5] px-2 py-0.5 border border-[#171914]/15 rounded-xs">
                  {crackTime}
                </span>
              </div>

              <div className="h-3 w-full bg-[#E4E1D6] rounded-xs overflow-hidden border border-[#171914]/15">
                <motion.div
                  className={`h-full ${meterColor}`}
                  animate={{ width: `${meterPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#575953] pt-0.5">
                <span>Status: <strong>{strengthLabel}</strong></span>
                {wordCount >= 4 && (
                  <span className="text-[#1E4D2B] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lencana Kubu Besi Dibuka!</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Educational Principle Callout */}
          <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-xs text-[#123E23] leading-relaxed">
            <strong>Mengapa 4 perkataan begitu kuat?</strong> Komputer penyerang mudah meneka kata laluan pendek seperti <code className="bg-white px-1 border border-[#1E4D2B]/30 font-bold">Kampung123!</code> dalam beberapa saat. Namun, menggabungkan 4 perkataan rawak menghasilkan lebih 20 aksara yang memerlukan ribuan tahun untuk dipecahkan!
          </div>
        </div>

        {/* RIGHT COLUMN: The Word Bank & Confirmation Button (Col 7-12) */}
        <div className="lg:col-span-6 rounded-sm border-2 border-[#171914]/25 bg-white p-5 flex flex-col justify-between space-y-4 shadow-xs">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171914]">
                2. Peti Perkataan Melayu (Pilih 4)
              </span>
              <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs text-[#171914]">
                {selectedWords.length} / 4 Dipilih
              </span>
            </div>

            {/* 12 Big Comfortable Tiles for Elderly Users */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {WORD_BANK.map((w) => {
                const isUsed = selectedWords.includes(w);

                return (
                  <button
                    key={w}
                    type="button"
                    disabled={isUsed || selectedWords.length >= 4}
                    onClick={() => handleAddWord(w)}
                    className={`p-3.5 rounded-sm font-mono text-sm sm:text-base font-bold transition-all text-center border-2 flex items-center justify-center gap-1.5 min-h-[50px] ${
                      isUsed
                        ? 'bg-[#ECEAE2] text-[#82847C] border-transparent opacity-40 cursor-not-allowed'
                        : 'bg-white text-[#171914] border-[#171914] hover:bg-[#D9FA62] active:bg-[#CCF050] cursor-pointer shadow-xs hover:scale-[1.02]'
                    }`}
                  >
                    <span>+ {w}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Confirmation Button */}
          <div className="pt-3 border-t border-[#171914]/15 space-y-2">
            <div className="font-mono text-xs text-[#7C7E77]">
              {wordCount >= 4
                ? 'Sempurna! Frasa laluan 4 perkataan ini sedia untuk disimpan.'
                : `Sila pilih ${4 - wordCount} perkataan lagi di atas.`}
            </div>

            <button
              type="button"
              disabled={wordCount < 4}
              onClick={() => onPassphraseCompleted(assembledString)}
              className={`w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                wordCount >= 4
                  ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                  : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
              }`}
            >
              <span>Sahkan Frasa Laluan (+10 Mata)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
