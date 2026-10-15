'use client';

import React, { useState } from 'react';
import { SpotCluesQuestion } from '@/types/challenge';
import { AlertCircle, CheckCircle2, Search, HelpCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface SpotTheCluesProps {
  question: SpotCluesQuestion;
  selectedOptionId: string | null;
  onSelectOption: (id: string) => void;
  isSubmitted: boolean;
}

export const SpotTheCluesQuestionView: React.FC<SpotTheCluesProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  isSubmitted
}) => {
  const [activeClueId, setActiveClueId] = useState<string | null>(question.clues[0]?.id || null);
  const [inspectedClues, setInspectedClues] = useState<Set<string>>(new Set([question.clues[0]?.id]));

  const handleClueClick = (clueId: string) => {
    setActiveClueId(clueId);
    setInspectedClues(prev => new Set([...prev, clueId]));
  };

  const activeClue = question.clues.find(c => c.id === activeClueId);

  return (
    <div className="space-y-6">
      {/* Interactive Helper Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/60 flex items-start gap-3">
        <Search className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-cyan-200">
            Aktiviti Interaktif: Terokai Petunjuk Bahaya
          </p>
          <p className="text-slate-300 text-xs mt-0.5">
            Klik pada setiap zon petunjuk bernombor (1-4) di dalam emel di bawah untuk menyiasat helah penipu.
            <span className="font-bold text-cyan-300 ml-1">
              Petunjuk Diterokai: {inspectedClues.size} / {question.clues.length}
            </span>
          </p>
        </div>
      </div>

      {/* Mock Email with Interactive Highlight Zones */}
      <div className="rounded-2xl border-2 border-slate-700 bg-slate-900/90 overflow-hidden shadow-2xl">
        {/* Email Header */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Emel Amaran Bil Elektrik (Siasat Zon Bertanda)
          </span>
          <span className="text-[11px] text-slate-400">{question.receivedTime}</span>
        </div>

        {/* Sender Area (Zone 1) */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="text-xs space-y-1">
              <span className="text-slate-400 mr-2 font-medium">Pengirim:</span>
              <span className="font-bold text-slate-200">{question.sender}</span>
            </div>
            {/* Clue 1 Button */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-sender')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer border ${
                activeClueId === 'clue-sender'
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-900/30'
                  : 'bg-slate-950 border-slate-700 text-cyan-300 hover:border-cyan-500'
              }`}
            >
              <span className="font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                Zon 1
              </span>
              <span>{question.senderEmail}</span>
              {inspectedClues.has('clue-sender') && (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              )}
            </button>
          </div>
        </div>

        {/* Subject & Urgency Threat (Zone 2) */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Perkara:</span>
            <span className="text-sm font-bold text-rose-300">{question.subject}</span>
          </div>
          {/* Clue 2 Button */}
          <button
            type="button"
            onClick={() => handleClueClick('clue-urgency')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
              activeClueId === 'clue-urgency'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-md shadow-rose-900/30'
                : 'bg-slate-950 border-slate-700 text-amber-300 hover:border-amber-500'
            }`}
          >
            <span className="font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Zon 2
            </span>
            <span>Ugutan Potong 2 Jam</span>
            {inspectedClues.has('clue-urgency') && (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
          </button>
        </div>

        {/* Body Content with Link (Zone 3) and Sensitive Request (Zone 4) */}
        <div className="p-5 text-sm text-slate-200 space-y-4">
          <p>
            Pelanggan yang dihormati, akaun anda mempunyai tunggakan tertunggak sebanyak RM84.20. Tindakan pemotongan bekalan elektrik serta-merta akan dilaksanakan dalam tempoh <strong>2 Jam</strong> melainkan pembayaran disahkan sekarang.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Clue 3: Fake Payment Link */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-link')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeClueId === 'clue-link'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-400">Zon 3: Pautan Bayaran</span>
                {inspectedClues.has('clue-link') && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <div className="text-xs font-mono text-cyan-300 underline flex items-center gap-1">
                <span>http://tenaga-quickpay.xyz/bill</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </button>

            {/* Clue 4: Sensitive Data Demand */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-sensitive')}
              className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                activeClueId === 'clue-sensitive'
                  ? 'bg-rose-950/70 border-rose-500 text-rose-200 ring-2 ring-rose-500/30'
                  : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-rose-400">Zon 4: Permintaan Rahsia</span>
                {inspectedClues.has('clue-sensitive') && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                )}
              </div>
              <p className="text-xs text-slate-300">
                &ldquo;Masukkan Kata Laluan Bank & TAC untuk semakan status&rdquo;
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Clue Detail Drawer */}
      {activeClue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeClue.id}
          className="p-4 rounded-xl bg-slate-900 border-2 border-cyan-500/50 shadow-lg text-slate-200"
        >
          <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold text-sm">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>Penerangan Petunjuk: {activeClue.label}</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {activeClue.explanation}
          </p>
        </motion.div>
      )}

      {/* Decision Question and Options */}
      <div className="pt-2">
        <h4 className="text-base font-bold text-slate-100 mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>{question.questionText}</span>
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
