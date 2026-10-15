'use client';

import React, { useState } from 'react';
import { investigationCases } from '@/data/investigation-cases';
import { LinkScannerModal } from '@/components/game/LinkScannerModal';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import {
  ArrowRight,
  RotateCcw,
  Home,
  Check,
  Search,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Paperclip,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface LinkScanData {
  url: string;
  protocol: 'http' | 'https';
  domain: string;
  country: string;
  riskScore: number;
  verdict: string;
  redFlags: string[];
}

export const InvestigationGame: React.FC = () => {
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Per-case interactive state
  const [selectedClueIds, setSelectedClueIds] = useState<string[]>([]);
  const [isFindingsSubmitted, setIsFindingsSubmitted] = useState<boolean>(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isActionSubmitted, setIsActionSubmitted] = useState<boolean>(false);
  const [caseClueScore, setCaseClueScore] = useState<number>(0);

  // Link Scanner Modal state
  const [activeScanData, setActiveScanData] = useState<LinkScanData | null>(null);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  // Cumulative game performance
  const [totalCluesFound, setTotalCluesFound] = useState<number>(0);
  const [totalPossibleClues, setTotalPossibleClues] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [scannerUsed, setScannerUsed] = useState<boolean>(false);

  const currentCase = investigationCases[currentCaseIndex];

  // Dynamic Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-eagle',
      name: 'Mata Helang',
      icon: '🦅',
      description: 'Mengesan lebih 8 petunjuk penipuan',
      isUnlocked: totalCluesFound >= 8
    },
    {
      id: 'b-xray',
      name: 'Pakar X-Ray',
      icon: '🔬',
      description: 'Menggunakan pengimbas pautan diagnostik',
      isUnlocked: scannerUsed
    },
    {
      id: 'b-shield',
      name: 'Penyekat Penipuan',
      icon: '🛑',
      description: 'Membuat 4 atau lebih keputusan selamat',
      isUnlocked: correctActionDecisions >= 4
    },
    {
      id: 'b-hero',
      name: 'Wira Penyiasat',
      icon: '🛡️',
      description: 'Menyelesaikan semua 5 kes siasatan',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStartMission = () => {
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalCluesFound(0);
    setTotalPossibleClues(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setScannerUsed(false);
  };

  const resetCaseState = () => {
    setSelectedClueIds([]);
    setIsFindingsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setCaseClueScore(0);
  };

  const handleToggleClue = (clueId: string) => {
    if (isFindingsSubmitted) return;
    setSelectedClueIds(prev =>
      prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId]
    );
  };

  const handleOpenScanner = (url: string) => {
    setScannerUsed(true);
    const isPos = url.includes('pos');
    const isTenaga = url.includes('tenaga');

    setActiveScanData({
      url,
      protocol: url.startsWith('https') ? 'https' : 'http',
      domain: isPos ? 'pos-redeliver-pay.cc' : isTenaga ? 'tenaga-quickpay.xyz' : 'ewallet-claim-2025.com',
      country: isPos ? 'Kepulauan Cocos (.cc)' : isTenaga ? 'Pelayan Luar Pesisir (.xyz)' : 'Pelayan Tidak Diketahui',
      riskScore: 98,
      verdict: 'Laman web palsu yang direka khas untuk mencuri kad debit & maklumat perbankan internet mangsa.',
      redFlags: [
        'Domain tidak sepadan dengan agensi atau syarikat rasmi di Malaysia',
        'Penyulitan SSL tidak sah atau menggunakan sambungan HTTP tidak selamat',
        'Laman web baru didaftarkan kurang daripada 14 hari yang lalu'
      ]
    });
  };

  const handleSubmitFindings = () => {
    if (isFindingsSubmitted) return;
    setIsFindingsSubmitted(true);

    const totalCluesInCase = currentCase.clues.length;
    const suspiciousClues = currentCase.clues.filter(c => c.isSuspicious);
    const benignClues = currentCase.clues.filter(c => !c.isSuspicious);

    // Number of real threats spotted
    const correctSuspiciousFound = selectedClueIds.filter(id =>
      suspiciousClues.some(c => c.id === id)
    ).length;

    // Number of harmless text mistakenly marked
    const falseAlarmsMarked = selectedClueIds.filter(id =>
      benignClues.some(c => c.id === id)
    ).length;

    // Number of harmless text correctly ignored
    const correctBenignIgnored = benignClues.length - falseAlarmsMarked;

    // Total correct decisions
    const totalCorrectDecisions = correctSuspiciousFound + correctBenignIgnored;

    // Up to 5 points for clue investigation
    const cluePoints = Math.max(0, Math.min(5, Math.round((totalCorrectDecisions / totalCluesInCase) * 5)));

    setCaseClueScore(cluePoints);
    setTotalCluesFound(prev => prev + correctSuspiciousFound);
    setTotalPossibleClues(prev => prev + suspiciousClues.length);
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
      const finalScore = Math.min(50, totalScore);
      saveChallengeResult('phishing', finalScore, 50);
      setStage('results');
    }
  };

  // Check if case contains a link for scanner
  const linkClue = currentCase?.clues.find(
    c => c.targetText.startsWith('http') || c.targetText.includes('.xyz') || c.targetText.includes('.cc')
  );

  /* =========================================================================
     STAGE 1: MISSION BRIEFING (SPLIT VIEW)
     ========================================================================= */
  if (stage === 'briefing') {
    return (
      <div className="w-full space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[#7C7E77] hover:text-[#171914] transition-colors"
          >
            ← [KEMBALI KE MENU UTAMA]
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left side: Context & Scenario */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  MISI 01
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                Penyiasatan Mesej Phishing
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                Mesej mencurigakan mula membanjiri peti masuk telefon dan emel komuniti kita. Tugas pasukan anda adalah menyiasat bukti pada mesej, mengesan tanda bahaya, dan memutuskan tindakan paling selamat.
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  Panduan Menjalankan Misi:
                </span>
                <div className="space-y-1.5 text-[#575953]">
                  <div><strong>1. Lihat Sebelah Kiri:</strong> Mesej atau SMS yang disiasat akan sentiasa dipaparkan.</div>
                  <div><strong>2. Jawab di Sebelah Kanan:</strong> Tandakan petunjuk meragukan dan pilih tindakan selamat.</div>
                  <div><strong>3. Bekerjasama dalam Pasukan:</strong> Bincang bersama sebelum menekan butang sahkan!</div>
                </div>
              </div>
            </div>

            {/* Right side: Tools & Start CTA */}
            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Alat Siasatan Stesen:
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Globe className="w-4 h-4 text-[#171914]" />
                    <span>Pengimbas Pautan X-Ray</span>
                  </div>
                  <p>Boleh digunakan untuk memeriksa sijil keselamatan dan rekod pendaftaran laman web palsu.</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Award className="w-4 h-4 text-[#171914]" />
                    <span>Lencana Siasatan Pasukan</span>
                  </div>
                  <p>Kumpul 4 lencana khas termasuk Mata Helang & Penyekat Penipuan sepanjang siasatan.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartMission}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Mulakan Misi Siasatan Pasukan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 6: MISSION RESULTS (SPLIT VIEW)
     ========================================================================= */
  if (stage === 'results') {
    return (
      <div className="w-full space-y-6">
        <BadgesDrawer badges={badges} />

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Summary & Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  LAPORAN SIASATAN SELESAI
                </span>
                <span className="text-[#7C7E77]">MISI 01 / PHISHING</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  Siasatan Berjaya Dilengkapkan!
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  Pasukan anda telah selesai menyiasat kesemua 5 senario mesej mencurigakan, menggunakan alat diagnostik X-Ray, dan berjaya melindungi maklumat peribadi.
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Kes Disiasat</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">5 / 5</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Petunjuk Ditemui</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">
                    {totalCluesFound} <span className="text-xs font-normal text-[#82847C]">/ {totalPossibleClues}</span>
                  </span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Keputusan Selamat</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{correctActionDecisions} / 5</span>
                </div>
                <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/20 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#123E23] block font-bold">Jumlah Mata</span>
                  <span className="font-mono text-2xl font-black text-[#123E23] mt-1 block">
                    {totalScore} <span className="text-xs font-normal text-[#123E23]/70">/ 50</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Key Lessons & Navigation Actions */}
            <div className="lg:col-span-6 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Prinsip Pertahanan Komuniti:
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Jangan tekan pautan bayaran caj kecil atau penukaran jadual melalui SMS rawak.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Bank di Malaysia tidak lagi menghantar pautan pengesahan TAC atau kata laluan melalui SMS.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>Jangan sesekali pasang fail aplikasi (.apk) daripada emel tuntutan wang tunai atau hadiah.</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartMission}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Siasat Semula</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Menu Utama</span>
                </Link>

                <Link
                  href="/challenge/passwords"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <span>Misi 02: Kata Laluan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 2: INTERACTIVE INVESTIGATION (FULL PAGE SPLIT VIEW)
     ========================================================================= */
  const validCluesFoundInCurrentCase = selectedClueIds.filter(id =>
    currentCase.clues.some(c => c.id === id && c.isSuspicious)
  ).length;

  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);

  return (
    <div className="w-full space-y-4">
      {/* Top Full-Width Navigation & Status Bar */}
      <div className="bg-white border-2 border-[#171914] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171914]/15 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="text-[#7C7E77] hover:text-[#171914] font-bold transition-colors"
            >
              ← [MENU UTAMA]
            </Link>
            <span className="text-[#171914]/20">|</span>
            <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
              KES 0{currentCaseIndex + 1} / 0{investigationCases.length}
            </span>
            <span className="font-bold text-[#171914] text-xs sm:text-sm">
              {currentCase.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleStartMission}
              title="Mulakan Semula Misi Siasatan Dari Kes 1"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF0E6] border border-[#8A241C]/30 text-[#8A241C] hover:text-[#8A241C] rounded-xs cursor-pointer font-mono font-bold text-xs transition-colors min-h-[36px] shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Set Semula</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBadges(!showBadges)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4EE] hover:bg-[#ECEAE2] border border-[#171914]/20 rounded-xs cursor-pointer font-mono font-bold text-xs text-[#171914] min-h-[36px]"
            >
              <Award className="w-3.5 h-3.5 text-[#171914]" />
              <span>Lencana ({badges.filter(b => b.isUnlocked).length}/{badges.length})</span>
            </button>

            <div className="font-bold text-[#171914] bg-white px-3 py-1.5 border border-[#171914]/20 rounded-xs min-h-[36px] flex items-center">
              MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20 ml-1">{totalScore} / 50</span>
            </div>
          </div>
        </div>

        {/* Progress track */}
        <div className="pt-3 flex items-center gap-3 font-mono text-xs text-[#7C7E77]">
          <span>Kemajuan:</span>
          <div className="flex-1 h-2 bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
            <div
              className="h-full bg-[#171914] transition-all duration-300"
              style={{ width: `${((currentCaseIndex + 1) / investigationCases.length) * 100}%` }}
            />
          </div>
          <span className="font-bold text-[#171914]">
            {Math.round(((currentCaseIndex + 1) / investigationCases.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Badges Drawer if toggled */}
      {showBadges && (
        <div className="pt-1">
          <BadgesDrawer badges={badges} />
        </div>
      )}

      {/* Main Two-Column Split Screen (Laptop Native) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ===================================================================
            LEFT COLUMN: THE QUESTION & EVIDENCE TO INVESTIGATE (Cols 1-7)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            {/* Header of Evidence Card */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Search className="w-4 h-4 text-[#171914]" />
                  <span>1. Teliti Bahan Bukti (Mesej)</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-[#ECEAE2] px-2 py-0.5 rounded-xs font-bold uppercase text-[11px] text-[#575953]">
                    {currentCase.format === 'email' ? 'Peti Masuk Emel' : 'SMS Telefon'}
                  </span>
                  {currentCase.urgencyBadge && (
                    <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-bold uppercase text-[11px]">
                      {currentCase.urgencyBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Scenario Context */}
              <p className="text-xs sm:text-sm text-[#575953] leading-relaxed mb-4">
                <strong>Senario:</strong> {currentCase.scenarioContext}
              </p>

              {/* Prominent Link X-Ray Scanner Action if available */}
              {linkClue && (
                <div className="mb-4 p-3 bg-[#171914] text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#D9FA62] shrink-0" />
                    <span className="font-mono text-xs text-white">
                      Pautan Dikesan: <code className="text-[#D9FA62] font-bold">{linkClue.targetText}</code>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenScanner(linkClue.targetText)}
                    className="px-4 py-2 bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] font-mono font-bold text-xs uppercase rounded-xs cursor-pointer min-h-[38px] flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Imbas Pautan X-Ray</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Realistic Message Simulation Window */}
              {currentCase.format === 'email' ? (
                /* EMAIL INTERFACE */
                <div className="rounded-sm border-2 border-[#171914]/25 bg-white overflow-hidden shadow-xs">
                  {/* Email Chrome Header */}
                  <div className="bg-[#ECEAE2] px-4 py-2.5 border-b border-[#171914]/15 flex items-center justify-between font-mono text-xs text-[#575953]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#171914]/30" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#171914]/30" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#171914]/30" />
                      <span className="ml-2 font-bold text-[#171914] uppercase text-[11px]">
                        Peti Masuk Emel Rasmi
                      </span>
                    </div>
                    <span className="text-[11px] text-[#7C7E77]">{currentCase.receivedTime}</span>
                  </div>

                  {/* Email Headers */}
                  <div className="p-4 bg-[#FAF9F5] border-b border-[#171914]/10 space-y-1.5 text-xs sm:text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className="font-mono font-bold text-[#7C7E77] text-xs uppercase w-20 shrink-0">Daripada:</span>
                      <span className="font-bold text-[#171914]">{currentCase.sender}</span>
                      {currentCase.senderAddress && (
                        <code className="text-xs bg-white px-2 py-0.5 border border-[#171914]/15 font-mono text-[#8A241C] font-bold rounded-xs">
                          &lt;{currentCase.senderAddress}&gt;
                        </code>
                      )}
                    </div>
                    {currentCase.subject && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-mono font-bold text-[#7C7E77] text-xs uppercase w-20 shrink-0">Perkara:</span>
                        <span className="font-bold text-[#171914]">{currentCase.subject}</span>
                      </div>
                    )}
                  </div>

                  {/* Email Body */}
                  <div className="p-5 text-sm sm:text-base text-[#171914] leading-relaxed whitespace-pre-line space-y-4 bg-white">
                    <p>{currentCase.body}</p>

                    {/* Email Attachment if present */}
                    {currentCase.attachmentName && (
                      <div className="mt-4 p-3.5 rounded-xs border-2 border-[#8A241C]/40 bg-[#FAF0E6] flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xs bg-[#FCE8E6] text-[#8A241C] flex items-center justify-center shrink-0">
                            <Paperclip className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-mono font-bold text-[#8A241C]">{currentCase.attachmentName}</div>
                            <div className="text-xs text-[#575953]">Lampiran Aplikasi Berbahaya (.apk)</div>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono font-bold uppercase text-[#8A241C] bg-white px-2 py-1 rounded-xs border border-[#8A241C]/30">
                          AMARAN MALWARE
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* SMS PHONE INTERFACE */
                <div className="max-w-md mx-auto rounded-xl border-2 border-[#171914] bg-[#0F141C] text-white p-4 sm:p-5 shadow-md space-y-4">
                  {/* Phone Status bar */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
                    <span>10:42 AM</span>
                    <div className="flex items-center gap-1.5">
                      <span>5G</span>
                      <span>92% 🔋</span>
                    </div>
                  </div>

                  {/* SMS Header */}
                  <div className="text-center pb-2 border-b border-slate-800">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-[#D9FA62] mx-auto flex items-center justify-center font-bold font-mono text-sm mb-1">
                      SMS
                    </div>
                    <div className="text-sm font-bold text-white font-mono">{currentCase.sender}</div>
                    <div className="text-[11px] text-slate-400 font-mono">Mesej Teks Rawak</div>
                  </div>

                  {/* SMS Bubble */}
                  <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 text-sm sm:text-base text-slate-100 leading-relaxed shadow-xs space-y-2">
                    <p className="whitespace-pre-line">{currentCase.body}</p>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-mono">{currentCase.receivedTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Left Footer Reminder */}
            <div className="pt-3 border-t border-[#171914]/15 font-mono text-xs text-[#7C7E77] flex items-center justify-between">
              <span>Bandingkan mesej di atas dengan soalan di sebelah kanan →</span>
              <span className="font-bold text-[#171914]">Petunjuk: {currentCase.clues.length} jumlah</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: QUESTIONS, CLUES & DECISIONS (Cols 8-12)
            =================================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            {/* Header of Action Panel */}
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#171914]" />
                  <span>2. Jawab & Buat Keputusan</span>
                </span>
                <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] ${
                  isFindingsSubmitted
                    ? 'bg-[#E7F3EB] text-[#123E23] border border-[#1E4D2B]/30'
                    : 'bg-[#D9FA62] text-[#171914] border border-[#171914]/20'
                }`}>
                  {!isFindingsSubmitted ? 'LANGKAH 1: KESAN PETUNJUK' : 'LANGKAH 2: TINDAKAN'}
                </span>
              </div>
            </div>

            {/* Content Area: Step 1 or Step 2 */}
            <div className="space-y-4 flex-1">
              {!isFindingsSubmitted ? (
                /* -------------------------------------------------------------
                   STEP 1: SELECT SUSPICIOUS CLUES
                   ------------------------------------------------------------- */
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      Langkah 1: Tandakan HANYA Petunjuk Bahaya
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      Berdasarkan mesej di sebelah kiri, tandakan <strong>bahagian yang mencurigakan sahaja</strong>. <br className="hidden sm:inline" />
                      <span className="text-[#8A241C] font-semibold">Awas: Sesetengah pilihan di bawah adalah maklumat biasa yang TIDAK PERLU ditandakan!</span>
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.clues.map((clue) => {
                      const isMarked = selectedClueIds.includes(clue.id);

                      return (
                        <button
                          key={clue.id}
                          type="button"
                          onClick={() => handleToggleClue(clue.id)}
                          className={`w-full p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[54px] ${
                            isMarked
                              ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                              : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="font-mono text-xs sm:text-sm block">
                              &ldquo;{clue.targetText}&rdquo;
                            </span>
                          </div>
                          <span className={`shrink-0 font-mono text-xs font-bold px-2.5 py-1 rounded-xs border ${
                            isMarked ? 'bg-[#D9FA62] text-[#171914] border-[#D9FA62]' : 'bg-[#ECEAE2] text-[#575953] border-[#171914]/15'
                          }`}>
                            {isMarked ? '✓ DITANDAKAN' : '+ TANDAKAN'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* -------------------------------------------------------------
                   STEP 2: ACTION DECISION & IMMEDIATE CONSEQUENCES
                   ------------------------------------------------------------- */
                <div className="space-y-4">
                  {/* Detailed Clues Review Breakdown Box */}
                  <div className="p-4 bg-[#FAF9F5] border-2 border-[#171914]/15 rounded-sm space-y-3">
                    <div className="flex items-center justify-between font-mono text-xs pb-2 border-b border-[#171914]/10">
                      <span className="font-bold text-[#171914] flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#1E4D2B]" />
                        <span>Hasil Semakan Petunjuk Pasukan:</span>
                      </span>
                      <span className="font-bold bg-[#D9FA62] px-2.5 py-0.5 rounded-xs text-[#171914] border border-[#171914]/20">
                        +{caseClueScore} / 5 Mata
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {currentCase.clues.map((clue) => {
                        const isTicked = selectedClueIds.includes(clue.id);
                        const isSuspicious = clue.isSuspicious;

                        if (isTicked && isSuspicious) {
                          return (
                            <div key={clue.id} className="p-2.5 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-[#123E23]">
                              <div className="font-bold flex items-center gap-1.5">
                                <span>✓ Tepat Dikesan:</span>
                                <code className="bg-white/80 px-1 rounded">&ldquo;{clue.targetText}&rdquo;</code>
                              </div>
                              <p className="text-[11px] text-[#575953] mt-1 leading-relaxed">{clue.explanation}</p>
                            </div>
                          );
                        }

                        if (isTicked && !isSuspicious) {
                          return (
                            <div key={clue.id} className="p-2.5 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C]">
                              <div className="font-bold flex items-center gap-1.5">
                                <span>✕ Tersilap Tanda:</span>
                                <code className="bg-white/80 px-1 rounded">&ldquo;{clue.targetText}&rdquo;</code>
                              </div>
                              <p className="text-[11px] text-[#575953] mt-1 leading-relaxed">{clue.explanation}</p>
                            </div>
                          );
                        }

                        if (!isTicked && isSuspicious) {
                          return (
                            <div key={clue.id} className="p-2.5 bg-[#FAF0E6] border border-[#8A241C]/20 rounded-xs text-[#8A241C]">
                              <div className="font-bold flex items-center gap-1.5">
                                <span>⚠ Terlepas Pandang:</span>
                                <code className="bg-white/80 px-1 rounded">&ldquo;{clue.targetText}&rdquo;</code>
                              </div>
                              <p className="text-[11px] text-[#575953] mt-1 leading-relaxed">{clue.explanation}</p>
                            </div>
                          );
                        }

                        // Unticked and not suspicious -> Great discernment!
                        return (
                          <div key={clue.id} className="p-2 bg-white border border-[#171914]/10 rounded-xs text-[#575953]">
                            <div className="font-bold text-[#1E4D2B] flex items-center gap-1.5">
                              <span>✓ Tepat Dibiarkan:</span>
                              <code className="text-[#171914] bg-[#FAF9F5] px-1 rounded">&ldquo;{clue.targetText}&rdquo;</code>
                              <span className="text-[10px] text-[#7C7E77] font-normal">(Maklumat biasa, bukan ancaman)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      Langkah 2: Apakah Tindakan Paling Selamat?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      Pilih satu keputusan terbaik untuk melindungi maklumat dan wang anda:
                    </p>
                  </div>

                  {/* 3 Action Buttons */}
                  <div className="space-y-2.5">
                    {currentCase.actions.map((act) => {
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
                          onClick={() => handleSelectAction(act.id)}
                          className={`w-full p-4 rounded-sm border-2 text-left transition-colors cursor-pointer flex flex-col justify-between min-h-[58px] ${btnStyles}`}
                        >
                          <div className="space-y-1">
                            <span className="font-bold text-sm sm:text-base block">{act.title}</span>
                            <span className="text-xs text-[#575953] leading-relaxed block">{act.description}</span>
                          </div>
                          {isSelected && !isActionSubmitted && (
                            <span className="mt-2 font-mono text-xs font-bold text-[#171914] bg-[#D9FA62] px-2 py-0.5 rounded-xs self-start border border-[#171914]/20">
                              PILIHAN ANDA ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Immediate Consequence Outcome Banner */}
                  {isActionSubmitted && activeAction && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-sm border-l-4 ${
                        activeAction.isSafe
                          ? 'border-l-[#1E4D2B] bg-[#E7F3EB] border border-[#1E4D2B]/30 text-[#123E23]'
                          : 'border-l-[#8A241C] bg-[#FAF0E6] border border-[#8A241C]/30 text-[#78271C]'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {activeAction.isSafe ? (
                          <CheckCircle2 className="w-5 h-5 text-[#1E4D2B] shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-[#8A241C] shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-1">
                          <span className="font-mono text-xs uppercase font-bold tracking-wider block">
                            {activeAction.isSafe ? 'Tindakan Tepat! (+5 Mata)' : 'Amaran Risiko Tindakan'}
                          </span>
                          <p className="text-xs sm:text-sm leading-relaxed text-[#171914]">
                            {activeAction.consequence}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Primary Action CTA */}
            <div className="pt-4 border-t border-[#171914]/15">
              {!isFindingsSubmitted ? (
                <div className="flex flex-col gap-2">
                  <div className="font-mono text-xs text-[#7C7E77]">
                    {selectedClueIds.length === 0
                      ? 'Sila tandakan sekurang-kurangnya satu petunjuk bahaya.'
                      : `${selectedClueIds.length} petunjuk ditandakan.`}
                  </div>
                  <button
                    type="button"
                    disabled={selectedClueIds.length === 0}
                    onClick={handleSubmitFindings}
                    className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      selectedClueIds.length > 0
                        ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                        : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                    }`}
                  >
                    <span>Semak Petunjuk & Ke Langkah 2 →</span>
                  </button>
                </div>
              ) : !isActionSubmitted ? (
                <div className="flex flex-col gap-2">
                  <div className="font-mono text-xs text-[#7C7E77]">
                    Pilih salah satu daripada 3 pilihan tindakan di atas.
                  </div>
                  <button
                    type="button"
                    disabled={!selectedActionId}
                    onClick={handleSubmitAction}
                    className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                      selectedActionId
                        ? 'bg-[#171914] text-[#D9FA62] hover:bg-[#2A2D25] border-2 border-[#171914] cursor-pointer shadow-xs'
                        : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                    }`}
                  >
                    <span>Sahkan Pilihan Tindakan</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCase}
                  className="w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>
                    {currentCaseIndex + 1 === investigationCases.length
                      ? 'Lihat Laporan Misi Selesai'
                      : `Siasatan Seterusnya (Kes 0${currentCaseIndex + 2})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Link Scanner Modal */}
      <LinkScannerModal
        scanData={activeScanData}
        onClose={() => setActiveScanData(null)}
      />
    </div>
  );
};
