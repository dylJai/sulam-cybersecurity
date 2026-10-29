'use client';

import React, { useState } from 'react';
import { SpotCluesQuestion } from '@/types/challenge';
import { Check, HelpCircle, ExternalLink } from 'lucide-react';
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
      {/* Activity Guide Header */}
      <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-bold text-blue-900">
          🔍 Aktiviti Siasatan: Klik Zon Bertanda (1–4)
        </span>
        <span className="text-blue-800 bg-white px-3 py-1 rounded-full border border-blue-200 self-start sm:self-auto font-semibold">
          Zon Diteliti: {inspectedClues.size} / {question.clues.length}
        </span>
      </div>

      {/* Mock Document / Email with Annotated Hotspots */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Email Header */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800">
          <span>Emel Tuntutan Bil Elektrik</span>
          <span className="text-slate-500 font-normal">{question.receivedTime}</span>
        </div>

        {/* Sender Area (Zone 1) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="text-xs sm:text-sm">
            <span className="uppercase text-slate-500 text-[11px] font-semibold block">Nama Pengirim</span>
            <span className="font-bold text-slate-900">{question.sender}</span>
          </div>
          {/* Zone 1 Hotspot Button */}
          <button
            type="button"
            onClick={() => handleClueClick('clue-sender')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border active:scale-[0.985] ${
              activeClueId === 'clue-sender'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-blue-400'
            }`}
          >
            <span className="font-bold">[Zon 1]</span>
            <span className="underline">{question.senderEmail}</span>
            {inspectedClues.has('clue-sender') && <Check className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Subject & Urgency Threat (Zone 2) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
          <div>
            <span className="uppercase text-slate-500 text-[11px] font-semibold block">Perkara</span>
            <span className="font-bold text-sm sm:text-base text-slate-900">{question.subject}</span>
          </div>
          {/* Zone 2 Hotspot Button */}
          <button
            type="button"
            onClick={() => handleClueClick('clue-urgency')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm transition-all cursor-pointer border active:scale-[0.985] ${
              activeClueId === 'clue-urgency'
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-slate-100 text-slate-800 border-slate-200 hover:border-blue-400'
            }`}
          >
            <span className="font-bold">[Zon 2]</span>
            <span>Ugutan Masa: 2 Jam</span>
            {inspectedClues.has('clue-urgency') && <Check className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>

        {/* Body Content with Link (Zone 3) and Sensitive Request (Zone 4) */}
        <div className="p-5 sm:p-6 text-sm sm:text-base text-slate-800 space-y-4 leading-relaxed">
          <p>
            Pelanggan yang dihormati, akaun anda mempunyai tunggakan tertunggak sebanyak RM84.20. Tindakan pemotongan bekalan elektrik serta-merta akan dilaksanakan dalam tempoh <strong>2 Jam</strong> melainkan pembayaran disahkan sekarang.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Zone 3: Fake Payment Link */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-link')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.985] ${
                activeClueId === 'clue-link'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm">
                <span className="font-bold">[Zon 3] Pautan Bayaran</span>
                {inspectedClues.has('clue-link') && <Check className="w-4 h-4" />}
              </div>
              <div className="text-xs sm:text-sm flex items-center gap-1.5 font-mono">
                <span className="underline">http://tenaga-quickpay.xyz/bill</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* Zone 4: Sensitive Data Demand */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-sensitive')}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer active:scale-[0.985] ${
                activeClueId === 'clue-sensitive'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                  : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5 text-xs sm:text-sm">
                <span className="font-bold">[Zon 4] Permintaan Sulit</span>
                {inspectedClues.has('clue-sensitive') && <Check className="w-4 h-4" />}
              </div>
              <p className="text-xs sm:text-sm">
                &ldquo;Masukkan Kata Laluan Bank & TAC untuk semakan status&rdquo;
              </p>
            </button>
          </div>
        </div>
      </div>

      {/* Clue Detail Drawer */}
      {activeClue && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          key={activeClue.id}
          className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 shadow-xs"
        >
          <div className="text-sm font-bold text-amber-950 mb-1">
            💡 Penjelasan Zon: {activeClue.label}
          </div>
          <p className="text-sm sm:text-base text-amber-900 leading-relaxed">
            {activeClue.explanation}
          </p>
        </motion.div>
      )}

      {/* Decision Question and Options */}
      <div className="pt-2">
        <h4 className="text-base sm:text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <span>{question.questionText}</span>
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
