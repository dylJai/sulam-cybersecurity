'use client';

import React from 'react';
import { InvestigationCase, InvestigationClue } from '@/types/game';
import { AlertTriangle, Check, Paperclip, Search, Eye, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

interface InvestigateMessageViewProps {
  currentCase: InvestigationCase;
  selectedClueIds: string[];
  onToggleClue: (clueId: string) => void;
  isFindingsSubmitted: boolean;
  onSubmitFindings: () => void;
  onOpenScanner?: (url: string) => void;
}

export const InvestigateMessageView: React.FC<InvestigateMessageViewProps> = ({
  currentCase,
  selectedClueIds,
  onToggleClue,
  isFindingsSubmitted,
  onSubmitFindings,
  onOpenScanner
}) => {
  const isSelected = (id: string) => selectedClueIds.includes(id);

  // Find scanable link if available
  const linkClue = currentCase.clues.find(c => c.targetText.startsWith('http') || c.targetText.includes('.xyz') || c.targetText.includes('.cc'));

  return (
    <div className="space-y-6">
      {/* Investigation Instructions Banner */}
      <div className="p-3.5 bg-[#ECEAE2] border border-[#171914]/15 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-[#171914]" />
          <span className="font-bold text-[#171914] uppercase tracking-wider">
            Langkah 1: Klik Petunjuk Bahaya (Gunakan Pen Penanda)
          </span>
        </div>
        <div className="flex items-center gap-3">
          {linkClue && onOpenScanner && (
            <button
              type="button"
              onClick={() => onOpenScanner(linkClue.targetText)}
              className="px-2 py-0.5 bg-[#171914] text-[#D9FA62] rounded-xs font-mono font-bold text-[10px] uppercase flex items-center gap-1 hover:bg-[#2A2D25] cursor-pointer"
            >
              <Globe className="w-3 h-3" />
              <span>Imbas Pautan X-Ray</span>
            </button>
          )}
          <span className="text-[#575953] bg-white px-2 py-0.5 rounded-xs border border-[#171914]/10">
            Ditandakan: <strong>{selectedClueIds.length}</strong>
          </span>
        </div>
      </div>

      {/* Realistic Message Inspection Window */}
      {currentCase.format === 'email' ? (
        <div className="rounded-sm border border-[#171914]/20 bg-white shadow-xs overflow-hidden">
          {/* Email Window Header */}
          <div className="bg-[#ECEAE2] px-4 py-2.5 border-b border-[#171914]/15 flex items-center justify-between font-mono text-xs text-[#575953]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#171914]/30" />
              <span className="font-semibold text-[#171914] uppercase tracking-wider text-[11px]">
                Peti Masuk Emel (Klik teks petunjuk untuk menandakan amaran)
              </span>
            </div>
            {currentCase.urgencyBadge && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2 py-0.5 rounded-xs border border-[#8A241C]/20">
                <AlertTriangle className="w-3 h-3" />
                {currentCase.urgencyBadge}
              </span>
            )}
          </div>

          {/* Email Metadata */}
          <div className="p-4 border-b border-[#171914]/10 bg-[#FAF9F5] space-y-2 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-mono uppercase text-[#7C7E77] text-[10px] w-20 shrink-0">Daripada:</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-[#171914]">{currentCase.sender}</span>
                {currentCase.senderAddress && (
                  <button
                    type="button"
                    disabled={isFindingsSubmitted}
                    onClick={() => {
                      const clue = currentCase.clues.find(c => c.targetText.includes('@') || c.id.includes('domain') || c.id.includes('sender'));
                      if (clue) onToggleClue(clue.id);
                    }}
                    className={`font-mono px-2 py-0.5 border rounded-xs transition-colors cursor-pointer text-[11px] ${
                      isSelected(currentCase.clues.find(c => c.targetText.includes('@') || c.id.includes('domain') || c.id.includes('sender'))?.id || '')
                        ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                        : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                    }`}
                  >
                    &lt;{currentCase.senderAddress}&gt;
                    {isSelected(currentCase.clues.find(c => c.targetText.includes('@') || c.id.includes('domain') || c.id.includes('sender'))?.id || '') && (
                      <span className="ml-1 text-[10px] font-bold">[DITANDAKAN]</span>
                    )}
                  </button>
                )}
              </div>
            </div>

            {currentCase.subject && (
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                <span className="font-mono uppercase text-[#7C7E77] text-[10px] w-20 shrink-0">Perkara:</span>
                <span className="font-bold text-[#171914] text-sm">{currentCase.subject}</span>
              </div>
            )}
          </div>

          {/* Email Body & Clickable Clues */}
          <div className="p-5 sm:p-6 text-sm text-[#171914] leading-relaxed bg-white space-y-4">
            <p className="whitespace-pre-line leading-relaxed">{currentCase.body}</p>

            {/* Clickable Clue Badges in message */}
            <div className="pt-3 border-t border-[#171914]/10 space-y-2">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#7C7E77] block">
                Petunjuk Mesej — Klik terus pada teks untuk menandakan amaran siasatan:
              </span>
              <div className="flex flex-wrap gap-2">
                {currentCase.clues.map((clue: InvestigationClue) => {
                  const marked = isSelected(clue.id);
                  return (
                    <button
                      key={clue.id}
                      type="button"
                      disabled={isFindingsSubmitted}
                      onClick={() => onToggleClue(clue.id)}
                      className={`px-3 py-1.5 rounded-sm font-mono text-xs border text-left transition-colors cursor-pointer flex items-center gap-2 ${
                        marked
                          ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                          : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                      }`}
                    >
                      <span className="font-bold">
                        {marked ? '✓ [DITANDAKAN]' : '○ [TANDAKAN]'}
                      </span>
                      <span>&ldquo;{clue.targetText}&rdquo;</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Attachment preview if present */}
            {currentCase.attachmentName && (
              <div className="mt-4 p-3 rounded-sm border border-[#8A241C]/30 bg-[#FDF5F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xs bg-[#FCE8E6] text-[#8A241C] flex items-center justify-center shrink-0">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono font-bold text-[#8A241C]">{currentCase.attachmentName}</div>
                    <div className="text-[11px] text-[#575953]">Lampiran Pemasangan Android Berbahaya</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={isFindingsSubmitted}
                    onClick={() => {
                      const clue = currentCase.clues.find(c => c.targetText.includes('.apk'));
                      if (clue) onToggleClue(clue.id);
                    }}
                    className="text-[10px] font-mono font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2.5 py-1 rounded-xs border border-[#8A241C]/30 hover:bg-[#8A241C] hover:text-white transition-colors cursor-pointer"
                  >
                    {isSelected(currentCase.clues.find(c => c.targetText.includes('.apk'))?.id || '')
                      ? '✓ LAMPIRAN DITANDAKAN'
                      : 'KLIK TANDAKAN LAMPIRAN'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Realistic SMS Layout */
        <div className="w-full max-w-lg mx-auto rounded-sm border border-[#171914]/20 bg-white p-4 shadow-xs">
          <div className="pb-3 mb-3 border-b border-[#171914]/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-mono uppercase text-[10px] text-[#7C7E77] block">Pengirim SMS</span>
              <span className="font-bold text-[#171914]">{currentCase.sender}</span>
            </div>
            {currentCase.urgencyBadge && (
              <span className="text-[10px] font-mono font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2 py-0.5 rounded-xs border border-[#8A241C]/20">
                {currentCase.urgencyBadge}
              </span>
            )}
          </div>

          {/* SMS Chat Bubble */}
          <div className="bg-[#ECEAE2] border border-[#171914]/10 rounded-sm p-4 text-sm text-[#171914] leading-relaxed space-y-3">
            <p className="whitespace-pre-line">{currentCase.body}</p>
            <div className="text-right">
              <span className="font-mono text-[10px] text-[#7C7E77]">{currentCase.receivedTime}</span>
            </div>

            {/* Clickable Clue Badges for SMS */}
            <div className="pt-2 border-t border-[#171914]/10 space-y-1.5">
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">
                Tandakan Petunjuk Meragukan:
              </span>
              <div className="flex flex-col gap-1.5">
                {currentCase.clues.map((clue: InvestigationClue) => {
                  const marked = isSelected(clue.id);
                  return (
                    <button
                      key={clue.id}
                      type="button"
                      disabled={isFindingsSubmitted}
                      onClick={() => onToggleClue(clue.id)}
                      className={`p-2 rounded-xs font-mono text-xs border text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                        marked
                          ? 'bg-[#171914] text-[#D9FA62] border-[#171914]'
                          : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                      }`}
                    >
                      <span className="truncate">&ldquo;{clue.targetText}&rdquo;</span>
                      <span className="shrink-0 font-bold text-[10px]">
                        {marked ? '✓ DITANDAKAN' : '+ TANDAKAN'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Findings Check Button */}
      {!isFindingsSubmitted && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <span className="text-xs text-[#575953] font-mono">
            {selectedClueIds.length === 0
              ? 'Tandakan sekurang-kurangnya satu petunjuk sebelum menyemak hasil.'
              : `${selectedClueIds.length} petunjuk ditandakan. Teruskan untuk menyemak hasil siasatan.`}
          </span>
          <button
            type="button"
            onClick={onSubmitFindings}
            className="px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs"
          >
            Semak Hasil Siasatan →
          </button>
        </div>
      )}

      {/* Review of Findings Panel (After Submission) */}
      {isFindingsSubmitted && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-sm border border-[#171914]/20 bg-white p-5 space-y-4 shadow-xs"
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#171914]" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914]">
                Hasil Siasatan Pasukan Anda
              </h4>
            </div>
            <span className="font-mono text-xs bg-[#ECEAE2] px-2 py-0.5 rounded-xs text-[#171914]">
              {selectedClueIds.length} / {currentCase.clues.length} Petunjuk Ditemui
            </span>
          </div>

          <div className="space-y-3">
            {currentCase.clues.map((clue) => {
              const wasSelected = isSelected(clue.id);
              return (
                <div
                  key={clue.id}
                  className={`p-3 rounded-xs border text-xs leading-relaxed space-y-1 ${
                    wasSelected
                      ? 'bg-[#E7F3EB] border-[#1E4D2B]/30 text-[#123E23]'
                      : 'bg-[#FAF0E6] border-[#8A241C]/30 text-[#78271C]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono font-bold">
                    <span>
                      {wasSelected ? '✓ Berjaya Dikesan:' : '⚠ Terlepas Pandang:'} {clue.label}
                    </span>
                    <span className="text-[10px] bg-white/70 px-1.5 py-0.2 rounded-xs">
                      &ldquo;{clue.targetText}&rdquo;
                    </span>
                  </div>
                  <p className="text-[#575953]">{clue.explanation}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
};
