'use client';

import React, { useState } from 'react';
import { investigationCases } from '@/data/investigation-cases';
import { InvestigateMessageView } from '@/components/game/InvestigateMessageView';
import { ActionDecisionView } from '@/components/game/ActionDecisionView';
import { saveChallengeResult } from '@/lib/storage';
import { ArrowRight, RotateCcw, Home, Check, Search, ShieldCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const InvestigationGame: React.FC = () => {
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Per-case interactive state
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [isFindingsSubmitted, setIsFindingsSubmitted] = useState<boolean>(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isActionSubmitted, setIsActionSubmitted] = useState<boolean>(false);

  // Cumulative game performance
  const [totalCluesFound, setTotalCluesFound] = useState<number>(0);
  const [totalPossibleClues, setTotalPossibleClues] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

  const currentCase = investigationCases[currentCaseIndex];

  const handleStartMission = () => {
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalCluesFound(0);
    setTotalPossibleClues(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
  };

  const resetCaseState = () => {
    setSelectedClueIds([]);
    setIsFindingsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
  };

  const handleToggleClue = (clueId: string) => {
    setSelectedClueIds(prev =>
      prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId]
    );
  };

  const handleSubmitFindings = () => {
    if (isFindingsSubmitted) return;
    setIsFindingsSubmitted(true);

    const validCluesFound = selectedClueIds.filter(id =>
      currentCase.clues.some(c => c.id === id && c.isSuspicious)
    ).length;

    // Up to 5 points for clue investigation
    const cluePoints = Math.min(5, Math.round((validCluesFound / currentCase.clues.length) * 5));

    setTotalCluesFound(prev => prev + validCluesFound);
    setTotalPossibleClues(prev => prev + currentCase.clues.length);
    setTotalScore(prev => prev + cluePoints);
  };

  const handleSelectAction = (actionId: string) => {
    if (isActionSubmitted) return;
    setSelectedActionId(actionId);
  };

  const handleSubmitAction = () => {
    if (!selectedActionId || isActionSubmitted) return;
    setIsActionSubmitted(true);

    const chosenAction = currentCase.actions.find(a => a.id === selectedActionId);
    if (chosenAction?.isSafe) {
      setCorrectActionDecisions(prev => prev + 1);
      setTotalScore(prev => prev + 5); // 5 points for safe action
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex + 1 < investigationCases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      // Completed all cases
      const finalScore = Math.min(50, totalScore);
      saveChallengeResult('phishing', finalScore, 50);
      setStage('results');
    }
  };

  /* --- Stage 1: Mission Briefing --- */
  if (stage === 'briefing') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#7C7E77] hover:text-[#171914] transition-colors"
          >
            ← [KEMBALI KE MENU UTAMA]
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="pb-4 border-b border-[#171914]/15">
            <div className="flex items-center justify-between font-mono text-xs mb-2">
              <span className="font-bold text-[#171914] bg-[#D9FA62] px-2 py-0.5 rounded-xs border border-[#171914]/20">
                MISI 01
              </span>
              <span className="text-[#7C7E77]">
                MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#171914] tracking-tight">
              Penyiasatan Mesej Phishing
            </h1>
            <p className="text-sm text-[#575953] mt-2 leading-relaxed">
              &ldquo;Mesej mencurigakan mula membanjiri peti masuk anda. Tugas pasukan anda adalah menyiasat teks mesej, mencari tanda bahaya tersembunyi, dan memutuskan tindakan paling selamat.&rdquo;
            </p>
          </div>

          {/* Mission Objective */}
          <div className="p-4 bg-[#F5F4EE] border border-[#171914]/12 rounded-sm space-y-1">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
              Objektif Siasatan Stesen:
            </span>
            <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
              Anda akan mengendalikan <strong>5 senario mesej realistik</strong> (SMS kurier, amaran bank palsu, emel bantuan wang, bil elektrik, dan WhatsApp menyamar saudara). Klik bahagian mesej yang meragukan, semak hasil siasatan, dan buat keputusan perlindungan yang bijak bersama pasukan.
            </p>
          </div>

          {/* Gameplay Instructions */}
          <div className="space-y-2.5 font-mono text-xs text-[#575953]">
            <span className="font-bold uppercase tracking-wider text-[#171914] block">
              3 Langkah Siasatan Setiap Kes:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">01. Periksa & Tandakan</strong>
                Klik perkataan atau pautan yang anda syak sebagai helah penipu.
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">02. Semak Penemuan</strong>
                Lihat penerangan pakar bagi petunjuk yang ditemui dan yang terlepas.
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <strong className="text-[#171914] block mb-1">03. Ambil Tindakan</strong>
                Pilih respons selamat untuk melindungi diri dan raih mata maksimum.
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleStartMission}
              className="w-full py-3.5 px-6 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Mulakan Misi Siasatan Pasukan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* --- Stage 6: Mission Results --- */
  if (stage === 'results') {
    const accuracy = Math.round((totalScore / 50) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 py-4">
        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#171914]/15 font-mono text-xs">
            <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
              LAPORAN SELESAI
            </span>
            <span className="text-[#7C7E77]">
              MISI 01 / PENYIASATAN PHISHING
            </span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
              Siasatan Berjaya Dilengkapkan!
            </h2>
            <p className="text-xs sm:text-sm text-[#575953] mt-2 leading-relaxed">
              Pasukan anda telah selesai menyiasat kesemua 5 senario mesej mencurigakan dan membuat keputusan kritikal bagi setiap kes.
            </p>
          </div>

          {/* Mission Stats Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 border-y border-[#171914]/10 py-5">
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Kes Disiasat</span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">5 / 5</span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Petunjuk Ditemui</span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">
                {totalCluesFound} <span className="text-xs font-normal text-[#82847C]">/ {totalPossibleClues}</span>
              </span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Tindakan Selamat</span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">
                {correctActionDecisions} / 5
              </span>
            </div>
            <div>
              <span className="font-mono text-[10px] uppercase text-[#7C7E77] block">Jumlah Mata</span>
              <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#171914] mt-1 block">
                {totalScore} <span className="text-xs font-normal text-[#82847C]">/ 50</span>
              </span>
            </div>
          </div>

          {/* Key Lessons Learned */}
          <div className="space-y-3 pt-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block">
              Rumusan Prinsip Pertahanan Phishing:
            </span>
            <ul className="space-y-2 text-xs sm:text-sm text-[#575953]">
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>Jangan sesekali menekan pautan bayaran caj kecil atau penjadualan semula melalui SMS rawak.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>Bank di Malaysia tidak lagi menghantar pautan pengesahan TAC atau kata laluan melalui mesej teks.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>Jangan pasang fail aplikasi (.apk) daripada emel hadiah wang atau tuntutan yang mencurigakan.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-4 h-4 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3" />
                </span>
                <span>Buat panggilan terus ke nombor asal kenalan sebelum memindahkan wang kecemasan yang diminta atas talian.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            onClick={handleStartMission}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Siasat Semula</span>
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Menu Utama</span>
          </Link>

          <Link
            href="/challenge/passwords"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs"
          >
            <span>Misi 02: Pelindung Kata Laluan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  /* --- Stage 2 - 5: Interactive Investigation & Action --- */
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4">
      {/* Top Mission Status Bar */}
      <div className="w-full bg-white border border-[#171914]/15 rounded-sm p-4 shadow-xs">
        <div className="flex items-center justify-between gap-4 mb-2 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#171914] bg-[#ECEAE2] px-2 py-0.5 rounded-xs">
              KES 0{currentCaseIndex + 1} / 0{investigationCases.length}
            </span>
            <span className="text-[#82847C] hidden sm:inline">
              [{Math.round(((currentCaseIndex + 1) / investigationCases.length) * 100)}% Selesai]
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-bold text-[#171914]">
            <span className="text-[#82847C] font-normal uppercase text-[10px] tracking-wider">Mata Terkumpul:</span>
            <span className="bg-[#D9FA62] px-2 py-0.5 rounded-xs border border-[#171914]/20">
              {totalScore} / 50
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="h-2 w-full bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
          <motion.div
            className="h-full bg-[#171914]"
            animate={{ width: `${((currentCaseIndex + 1) / investigationCases.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Case Header */}
      <div className="bg-white border border-[#171914]/20 rounded-sm p-5 sm:p-6 space-y-2">
        <div className="font-mono text-xs text-[#7C7E77] uppercase tracking-wider">
          Misi 01 / Siasatan Mesej Digital
        </div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#171914] tracking-tight">
          {currentCase.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
          {currentCase.scenarioContext}
        </p>
      </div>

      {/* Interactive Message Viewer & Clue Tagging (Stage 2 & 3) */}
      <InvestigateMessageView
        currentCase={currentCase}
        selectedClueIds={selectedClueIds}
        onToggleClue={handleToggleClue}
        isFindingsSubmitted={isFindingsSubmitted}
        onSubmitFindings={handleSubmitFindings}
      />

      {/* Action Decision Phase (Stage 4) - only shown after findings are checked */}
      {isFindingsSubmitted && (
        <ActionDecisionView
          actions={currentCase.actions}
          selectedActionId={selectedActionId}
          onSelectAction={handleSelectAction}
          isActionSubmitted={isActionSubmitted}
          onSubmitAction={handleSubmitAction}
          onNextCase={handleNextCase}
          isLastCase={currentCaseIndex + 1 === investigationCases.length}
        />
      )}
    </div>
  );
};
