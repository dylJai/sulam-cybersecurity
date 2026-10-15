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
      <div className="p-3.5 bg-[#ECEAE2] border border-[#171914]/15 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <span className="font-bold text-[#171914] uppercase tracking-wider">
          Aktiviti Siasatan: Klik Zon Bertanda (1–4)
        </span>
        <span className="text-[#575953] bg-white px-2 py-0.5 rounded-xs border border-[#171914]/10 self-start sm:self-auto">
          Zon Diteliti: {inspectedClues.size} / {question.clues.length}
        </span>
      </div>

      {/* Mock Document / Email with Annotated Hotspots */}
      <div className="rounded-sm border border-[#171914]/20 bg-white shadow-xs overflow-hidden">
        {/* Email Header */}
        <div className="bg-[#FAF9F5] px-4 py-2.5 border-b border-[#171914]/12 flex items-center justify-between font-mono text-xs">
          <span className="font-bold text-[#171914]">Emel Tuntutan Bil Elektrik</span>
          <span className="text-[#7C7E77]">{question.receivedTime}</span>
        </div>

        {/* Sender Area (Zone 1) */}
        <div className="p-4 border-b border-[#171914]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
          <div className="text-xs">
            <span className="font-mono uppercase text-[#7C7E77] text-[10px] block">Nama Pengirim</span>
            <span className="font-semibold text-[#171914]">{question.sender}</span>
          </div>
          {/* Zone 1 Hotspot Button */}
          <button
            type="button"
            onClick={() => handleClueClick('clue-sender')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs transition-colors cursor-pointer border ${
              activeClueId === 'clue-sender'
                ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20 hover:border-[#171914]'
            }`}
          >
            <span className="font-bold">[Zon 1]</span>
            <span className="underline">{question.senderEmail}</span>
            {inspectedClues.has('clue-sender') && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Subject & Urgency Threat (Zone 2) */}
        <div className="p-4 border-b border-[#171914]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#FAF9F5]">
          <div>
            <span className="font-mono uppercase text-[#7C7E77] text-[10px] block">Perkara</span>
            <span className="font-bold text-sm text-[#171914]">{question.subject}</span>
          </div>
          {/* Zone 2 Hotspot Button */}
          <button
            type="button"
            onClick={() => handleClueClick('clue-urgency')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-xs transition-colors cursor-pointer border ${
              activeClueId === 'clue-urgency'
                ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20 hover:border-[#171914]'
            }`}
          >
            <span className="font-bold">[Zon 2]</span>
            <span>Ugutan Masa: 2 Jam</span>
            {inspectedClues.has('clue-urgency') && <Check className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Body Content with Link (Zone 3) and Sensitive Request (Zone 4) */}
        <div className="p-5 text-sm text-[#171914] space-y-4 leading-relaxed">
          <p>
            Pelanggan yang dihormati, akaun anda mempunyai tunggakan tertunggak sebanyak RM84.20. Tindakan pemotongan bekalan elektrik serta-merta akan dilaksanakan dalam tempoh <strong>2 Jam</strong> melainkan pembayaran disahkan sekarang.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {/* Zone 3: Fake Payment Link */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-link')}
              className={`p-3.5 rounded-sm border text-left transition-colors cursor-pointer ${
                activeClueId === 'clue-link'
                  ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                  : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20 hover:border-[#171914]'
              }`}
            >
              <div className="flex items-center justify-between mb-1 font-mono text-xs">
                <span className="font-bold">[Zon 3] Pautan Bayaran</span>
                {inspectedClues.has('clue-link') && <Check className="w-3.5 h-3.5" />}
              </div>
              <div className="font-mono text-xs flex items-center gap-1">
                <span className="underline">http://tenaga-quickpay.xyz/bill</span>
                <ExternalLink className="w-3 h-3" />
              </div>
            </button>

            {/* Zone 4: Sensitive Data Demand */}
            <button
              type="button"
              onClick={() => handleClueClick('clue-sensitive')}
              className={`p-3.5 rounded-sm border text-left transition-colors cursor-pointer ${
                activeClueId === 'clue-sensitive'
                  ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                  : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20 hover:border-[#171914]'
              }`}
            >
              <div className="flex items-center justify-between mb-1 font-mono text-xs">
                <span className="font-bold">[Zon 4] Permintaan Sulit</span>
                {inspectedClues.has('clue-sensitive') && <Check className="w-3.5 h-3.5" />}
              </div>
              <p className="text-xs">
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
          className="p-4 rounded-sm bg-white border-l-4 border-l-[#171914] border border-[#171914]/15 shadow-xs"
        >
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] mb-1">
            Penjelasan Zon: {activeClue.label}
          </div>
          <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
            {activeClue.explanation}
          </p>
        </motion.div>
      )}

      {/* Decision Question and Options */}
      <div className="pt-2">
        <h4 className="text-base font-bold text-[#171914] mb-3 flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#7C7E77]" />
          <span>{question.questionText}</span>
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
