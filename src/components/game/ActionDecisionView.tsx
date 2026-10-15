'use client';

import React from 'react';
import { InvestigationAction } from '@/types/game';
import { ShieldCheck, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ActionDecisionViewProps {
  actions: InvestigationAction[];
  selectedActionId: string | null;
  onSelectAction: (actionId: string) => void;
  isActionSubmitted: boolean;
  onSubmitAction: () => void;
  onNextCase: () => void;
  isLastCase: boolean;
}

export const ActionDecisionView: React.FC<ActionDecisionViewProps> = ({
  actions,
  selectedActionId,
  onSelectAction,
  isActionSubmitted,
  onSubmitAction,
  onNextCase,
  isLastCase
}) => {
  const activeAction = actions.find(a => a.id === selectedActionId);

  return (
    <div className="space-y-6 pt-4 border-t-2 border-[#171914]">
      {/* Title */}
      <div>
        <div className="font-mono text-xs uppercase tracking-wider text-[#7C7E77] mb-1">
          Langkah 2: Buat Keputusan Bertindak
        </div>
        <h3 className="text-lg sm:text-xl font-extrabold text-[#171914] tracking-tight">
          Apakah tindakan paling selamat untuk anda dan pasukan lakukan sekarang?
        </h3>
      </div>

      {/* Action Options List */}
      <div className="space-y-2.5">
        {actions.map((act) => {
          const isSelected = selectedActionId === act.id;
          let btnStyles = 'bg-white border-[#171914]/20 hover:border-[#171914] text-[#171914]';

          if (isSelected) {
            btnStyles = 'bg-[#F5F4EE] border-2 border-[#171914] shadow-xs';
          }

          if (isActionSubmitted) {
            if (act.isSafe) {
              btnStyles = 'bg-[#E7F3EB] border-2 border-[#1E4D2B] text-[#123E23]';
            } else if (isSelected && !act.isSafe) {
              btnStyles = 'bg-[#FAF0E6] border-2 border-[#8A241C] text-[#78271C]';
            } else {
              btnStyles = 'bg-[#ECEAE2]/40 border-[#171914]/10 text-[#82847C]';
            }
          }

          return (
            <button
              key={act.id}
              type="button"
              disabled={isActionSubmitted}
              onClick={() => onSelectAction(act.id)}
              className={`w-full p-4 rounded-sm border text-left transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${btnStyles}`}
            >
              <div className="space-y-0.5">
                <span className="font-bold text-sm block">{act.title}</span>
                <span className="text-xs text-[#575953] leading-relaxed block">{act.description}</span>
              </div>
              <div className="shrink-0 font-mono text-xs">
                {isSelected && !isActionSubmitted && (
                  <span className="bg-[#171914] text-[#D9FA62] px-2 py-0.5 rounded-xs font-bold">
                    PILIHAN ANDA
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Outcome Banner After Decision Submission */}
      {isActionSubmitted && activeAction && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-sm border-l-4 ${
            activeAction.isSafe
              ? 'border-l-[#1E4D2B] bg-[#E7F3EB] border border-[#1E4D2B]/30 text-[#123E23]'
              : 'border-l-[#8A241C] bg-[#FAF0E6] border border-[#8A241C]/30 text-[#78271C]'
          }`}
        >
          <div className="flex items-start gap-3">
            {activeAction.isSafe ? (
              <ShieldCheck className="w-5 h-5 text-[#1E4D2B] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#8A241C] shrink-0 mt-0.5" />
            )}
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase font-bold tracking-wider block">
                {activeAction.isSafe ? 'Kesan Tindakan Selamat (+5 Mata)' : 'Amaran Risiko Tindakan'}
              </span>
              <p className="text-xs sm:text-sm leading-relaxed text-[#171914]">
                {activeAction.consequence}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Footer Buttons */}
      <div className="pt-2 flex items-center justify-between">
        <span className="font-mono text-xs text-[#7C7E77]">
          {!isActionSubmitted
            ? 'Bincang bersama pasukan dan sahkan keputusan anda.'
            : 'Fahami akibat keputusan sebelum beralih ke senario seterusnya.'}
        </span>

        {!isActionSubmitted ? (
          <button
            type="button"
            disabled={!selectedActionId}
            onClick={onSubmitAction}
            className={`px-6 py-2.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider transition-colors ${
              selectedActionId
                ? 'bg-[#171914] text-[#D9FA62] hover:bg-[#2A2D25] border border-[#171914] cursor-pointer'
                : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
            }`}
          >
            Sahkan Tindakan
          </button>
        ) : (
          <button
            type="button"
            onClick={onNextCase}
            className="px-6 py-2.5 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <span>{isLastCase ? 'Lihat Laporan Misi' : 'Siasatan Seterusnya'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
