'use client';

import React, { useState } from 'react';
import { KeyRound, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const WORD_BANK = [
  'kucing', 'hujan', 'pisang', 'basikal',
  'merah', 'sedap', 'pagi', 'sungai',
  'deras', 'kopi', 'pantai', 'gunung'
];

interface PassphraseBuilderLabProps {
  onPassphraseCompleted: (assembledPassphrase: string) => void;
}

export const PassphraseBuilderLab: React.FC<PassphraseBuilderLabProps> = ({ onPassphraseCompleted }) => {
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
  };

  const assembledString = selectedWords.join('-');
  const charCount = assembledString.length;
  const wordCount = selectedWords.length;

  let crackTime = 'Tiada Frasa Laluan';
  let strengthLabel = 'KOSONG';
  let meterPercentage = 5;
  let meterColor = 'bg-[#8A241C]';

  if (wordCount === 1) {
    crackTime = 'Kurang daripada 0.001 saat';
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
    crackTime = '55,000+ TAHUN (KEBAL DARIPADA PENGGODAM!)';
    strengthLabel = 'KUBU BESI 🛡️ (Tahap Keselamatan Tertinggi)';
    meterPercentage = 100;
    meterColor = 'bg-[#1E4D2B]';
  }

  return (
    <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-7 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#171914]/15 font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <KeyRound className="w-5 h-5 text-[#171914]" />
          <span className="font-bold uppercase tracking-wider text-[#171914]">
            Makmal Bina Frasa Laluan Sendiri
          </span>
        </div>
        <span className="text-[#575953] bg-[#ECEAE2] px-2.5 py-1 rounded-xs font-bold">
          Sasaran: Pilih 4 Perkataan Mudah
        </span>
      </div>

      {/* Assembled Passphrase Display Area */}
      <div className="p-4 sm:p-5 bg-[#F5F4EE] border-2 border-[#171914] rounded-sm space-y-3">
        <div className="flex items-center justify-between font-mono text-xs sm:text-sm">
          <span className="text-[#7C7E77] uppercase font-bold">
            Frasa Laluan Anda:
          </span>
          <div className="flex items-center gap-3">
            <span className="text-[#575953] font-bold">
              {wordCount} / 4 Perkataan • {charCount} Aksara
            </span>
            {wordCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="px-2.5 py-1 text-xs font-mono font-bold text-[#8A241C] bg-white border border-[#8A241C]/30 hover:bg-[#8A241C] hover:text-white rounded-xs cursor-pointer flex items-center gap-1 transition-colors min-h-[34px]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>[Kosongkan]</span>
              </button>
            )}
          </div>
        </div>

        {/* Word Blocks Tray */}
        <div className="min-h-14 flex flex-wrap items-center gap-2.5 bg-white p-3 border-2 border-[#171914]/20 rounded-xs">
          {selectedWords.length === 0 ? (
            <span className="text-xs sm:text-sm text-[#82847C] font-mono italic">
              Klik butang perkataan besar di bawah untuk menambah ke dalam frasa anda...
            </span>
          ) : (
            selectedWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleRemoveWord(word)}
                title="Klik untuk buang perkataan ini"
                className="px-4 py-2 bg-[#171914] text-[#D9FA62] font-mono font-bold text-sm sm:text-base rounded-xs flex items-center gap-2 cursor-pointer hover:bg-[#8A241C] transition-colors min-h-[44px] shadow-xs"
              >
                <span>{word}</span>
                <span className="text-xs text-white/70">✕</span>
              </button>
            ))
          )}
        </div>

        {/* Live Crack-Time Meter */}
        <div className="pt-2 space-y-2 font-mono text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="uppercase text-[#7C7E77] font-bold text-xs">
              Masa Pemecahan Komputer Penggodam:
            </span>
            <span className="font-extrabold text-sm sm:text-base text-[#171914] bg-white px-2 py-0.5 border border-[#171914]/15 rounded-xs">
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
              <span className="text-[#1E4D2B] font-bold text-xs sm:text-sm">
                ✓ Lencana Kubu Besi Diperoleh!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Word Tile Bank - Large, Comfortable Buttons for Elderly */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171914] block">
            Peti Perkataan Bahasa Melayu (Klik 4 perkataan):
          </span>
          <span className="font-mono text-xs text-[#7C7E77]">
            {selectedWords.length} / 4 Dipilih
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {WORD_BANK.map(w => {
            const isUsed = selectedWords.includes(w);
            return (
              <button
                key={w}
                type="button"
                disabled={isUsed || selectedWords.length >= 4}
                onClick={() => handleAddWord(w)}
                className={`p-3.5 sm:p-4 rounded-sm font-mono text-sm sm:text-base font-bold transition-all text-center border-2 flex items-center justify-center gap-2 min-h-[52px] ${
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

      {/* Confirmation Button */}
      <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <span className="font-mono text-xs sm:text-sm text-[#7C7E77]">
          {wordCount >= 4
            ? 'Tahniah! Frasa laluan 4 perkataan ini sangat kebal daripada serangan penggodam.'
            : `Sila tambah ${4 - wordCount} lagi perkataan untuk melengkapkan kata laluan.`}
        </span>

        <button
          type="button"
          disabled={wordCount < 4}
          onClick={() => onPassphraseCompleted(assembledString)}
          className={`w-full sm:w-auto px-8 py-3.5 rounded-sm font-mono font-bold text-sm uppercase tracking-wider transition-colors min-h-[50px] flex items-center justify-center gap-2 ${
            wordCount >= 4
              ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
              : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
          }`}
        >
          <span>Sahkan Frasa Laluan (+10 Mata) →</span>
        </button>
      </div>
    </div>
  );
};
