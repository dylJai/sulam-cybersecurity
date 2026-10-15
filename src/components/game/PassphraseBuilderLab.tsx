'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Sparkles, RefreshCw, KeyRound, Award, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WORD_BANK = [
  'kucing', 'hujan', 'pisang', 'basikal',
  'merah', 'sedap', 'pagi', 'sungai',
  'deras', 'kopi', 'pantai', 'gunung',
  'bintang', 'rimba', 'pokok', 'angin'
];

interface PassphraseBuilderLabProps {
  onPassphraseCompleted: (assembledPassphrase: string) => void;
}

export const PassphraseBuilderLab: React.FC<PassphraseBuilderLabProps> = ({ onPassphraseCompleted }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  const handleAddWord = (word: string) => {
    if (selectedWords.includes(word) || selectedWords.length >= 5) return;
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
    meterPercentage = 20;
    meterColor = 'bg-[#8A241C]';
  } else if (wordCount === 2) {
    crackTime = 'Kira-kira 3 jam';
    strengthLabel = 'SEDERHANA (Mudah Dicari)';
    meterPercentage = 45;
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#171914]/15 font-mono text-xs">
        <div className="flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-[#171914]" />
          <span className="font-bold uppercase tracking-wider text-[#171914]">
            Makmal Bina Frasa Laluan Sendiri
          </span>
        </div>
        <span className="text-[#575953] bg-[#ECEAE2] px-2 py-0.5 rounded-xs">
          Sasaran: Gabungkan 4 Perkataan Mudah Diingati
        </span>
      </div>

      {/* Assembled Passphrase Display Area */}
      <div className="p-4 bg-[#F5F4EE] border-2 border-[#171914] rounded-sm space-y-3">
        <div className="flex items-center justify-between font-mono text-xs">
          <span className="text-[#7C7E77] uppercase text-[10px] font-bold">
            Frasa Laluan Terbina:
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[#575953] text-[11px]">
              {wordCount} Perkataan • {charCount} Aksara
            </span>
            {wordCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-[#8A241C] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                [Kosongkan]
              </button>
            )}
          </div>
        </div>

        {/* Word Blocks Tray */}
        <div className="min-h-12 flex flex-wrap items-center gap-2 bg-white p-2.5 border border-[#171914]/15 rounded-xs">
          {selectedWords.length === 0 ? (
            <span className="text-xs text-[#82847C] font-mono italic">
              Klik perkataan di bawah untuk mula membina frasa laluan anda...
            </span>
          ) : (
            selectedWords.map((word, idx) => (
              <button
                key={word}
                type="button"
                onClick={() => handleRemoveWord(word)}
                title="Klik untuk buang perkataan ini"
                className="px-3 py-1 bg-[#171914] text-[#D9FA62] font-mono font-bold text-xs rounded-xs flex items-center gap-1.5 cursor-pointer hover:bg-[#8A241C] transition-colors"
              >
                <span>{word}</span>
                <span className="text-[10px] text-white/60">×</span>
              </button>
            ))
          )}
        </div>

        {/* Live Crack-Time Meter */}
        <div className="pt-2 space-y-1.5 font-mono text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-[#7C7E77] font-bold">
              Masa Pemecahan Komputer Penggodam:
            </span>
            <span className="font-bold text-[#171914]">{crackTime}</span>
          </div>

          <div className="h-2 w-full bg-[#E4E1D6] rounded-xs overflow-hidden border border-[#171914]/10">
            <motion.div
              className={`h-full ${meterColor}`}
              animate={{ width: `${meterPercentage}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-[#575953] pt-0.5">
            <span>Status: <strong>{strengthLabel}</strong></span>
            {wordCount >= 4 && (
              <span className="text-[#1E4D2B] font-bold">
                ✓ Lencana Kubu Besi Diperoleh!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Word Tile Bank */}
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
          Peti Perkataan Bahasa Melayu (Pilih 4 perkataan):
        </span>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {WORD_BANK.map(w => {
            const isUsed = selectedWords.includes(w);
            return (
              <button
                key={w}
                type="button"
                disabled={isUsed || selectedWords.length >= 4}
                onClick={() => handleAddWord(w)}
                className={`p-2 rounded-xs font-mono text-xs font-bold transition-all text-center border ${
                  isUsed
                    ? 'bg-[#ECEAE2] text-[#82847C] border-transparent opacity-40 cursor-not-allowed'
                    : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#D9FA62] cursor-pointer shadow-2xs'
                }`}
              >
                +{w}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Button */}
      <div className="pt-2 flex items-center justify-between">
        <span className="font-mono text-xs text-[#7C7E77]">
          {wordCount >= 4
            ? 'Tahniah! Frasa laluan 4 perkataan ini sangat kebal daripada serangan penggodam.'
            : `Sila tambah ${4 - wordCount} lagi perkataan untuk mencapai perlindungan Kubu Besi.`}
        </span>

        <button
          type="button"
          disabled={wordCount < 4}
          onClick={() => onPassphraseCompleted(assembledString)}
          className={`px-6 py-2.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors ${
            wordCount >= 4
              ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
              : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
          }`}
        >
          Sahkan Frasa Laluan Kubu Besi (+10 Mata) →
        </button>
      </div>
    </div>
  );
};
