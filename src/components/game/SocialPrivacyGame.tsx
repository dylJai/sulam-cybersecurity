'use client';

import React, { useState } from 'react';
import { socialPrivacyCases, SocialPrivacyCase } from '@/data/social-privacy-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import {
  UserCheck,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Check,
  Home,
  Award,
  KeyRound,
  Share2,
  Lock,
  Globe,
  Mic
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const SocialPrivacyGame: React.FC = () => {
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Per-case state
  const [selectedLeakIds, setSelectedLeakIds] = useState<string[]>([]);
  const [isLeaksSubmitted, setIsLeaksSubmitted] = useState<boolean>(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isActionSubmitted, setIsActionSubmitted] = useState<boolean>(false);
  const [leakScore, setLeakScore] = useState<number>(0);
  const [showSafeWordTool, setShowSafeWordTool] = useState<boolean>(false);
  const [safeWordTested, setSafeWordTested] = useState<boolean>(false);

  // Cumulative performance
  const [totalLeaksFound, setTotalLeaksFound] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  const currentCase: SocialPrivacyCase = socialPrivacyCases[currentCaseIndex];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-privacy-hawk',
      name: 'Mata Privasi',
      icon: '👁️',
      description: 'Mengesan pendedahan maklumat sensitif pada hantaran awam',
      isUnlocked: totalLeaksFound >= 4
    },
    {
      id: 'b-safe-word',
      name: 'Pakar Kata Rahsia',
      icon: '🔑',
      description: 'Menguji protokol Kata Laluan Rahsia Keluarga menentang AI',
      isUnlocked: safeWordTested
    },
    {
      id: 'b-deepfake-shield',
      name: 'Kalis Klon AI',
      icon: '🛡️',
      description: 'Menyelesaikan cabaran privasi dan suara tiruan AI',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalLeaksFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSafeWordTested(false);
  };

  const resetCaseState = () => {
    setSelectedLeakIds([]);
    setIsLeaksSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setLeakScore(0);
    setShowSafeWordTool(false);
  };

  const handleToggleLeak = (id: string) => {
    if (isLeaksSubmitted) return;
    setSelectedLeakIds(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleTestSafeWord = () => {
    setShowSafeWordTool(true);
    setSafeWordTested(true);
  };

  const handleSubmitLeaks = () => {
    if (isLeaksSubmitted) return;
    setIsLeaksSubmitted(true);

    const vulnerabilities = currentCase.leakItems.filter(l => l.isVulnerability);
    const benign = currentCase.leakItems.filter(l => !l.isVulnerability);

    const correctTicked = selectedLeakIds.filter(id =>
      vulnerabilities.some(v => v.id === id)
    ).length;

    const falseAlarms = selectedLeakIds.filter(id =>
      benign.some(v => v.id === id)
    ).length;

    const correctBenignIgnored = benign.length - falseAlarms;
    const totalCorrect = correctTicked + correctBenignIgnored;
    const points = Math.max(0, Math.min(12, Math.round((totalCorrect / currentCase.leakItems.length) * 12)));

    setLeakScore(points);
    setTotalLeaksFound(prev => prev + correctTicked);
    setTotalScore(prev => prev + points);
  };

  const handleSelectAction = (id: string) => {
    if (isActionSubmitted) return;
    setSelectedActionId(id);
  };

  const handleSubmitAction = () => {
    if (!selectedActionId || isActionSubmitted) return;
    setIsActionSubmitted(true);

    const chosen = currentCase.actions.find(a => a.id === selectedActionId);
    if (chosen?.isSafe) {
      setCorrectActionDecisions(prev => prev + 1);
      setTotalScore(prev => prev + 13); // 2 cases: (12+13)*2 = 50 pts
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex + 1 < socialPrivacyCases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      const finalScore = Math.min(50, Math.round(totalScore));
      saveChallengeResult('social-privacy', finalScore, 50);
      setStage('results');
    }
  };

  /* =========================================================================
     STAGE 1: BRIEFING
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
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  MISI 07
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                Privasi Media Sosial & Pengesan Klon AI
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                &ldquo;Berkongsi foto pas masuk penerbangan (*boarding pass*), jadual percutian rumah kosong, atau gambar anak secara terbuka memudahkan penjenayah mencuri data pasport dan menyasarkan keluarga anda. Kini, teknologi kecerdasan buatan (AI) juga mampu meniru suara ahli keluarga (*voice cloning*) untuk menipu ibu bapa. Pelajari cara mengaudit profil anda dan amalkan Kata Laluan Rahsia Keluarga.&rdquo;
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  3 Garis Panduan Perlindungan Identiti Komuniti:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>1. Tutup Kod Bar & Rumah Kosong</strong>
                    <p className="text-xs mt-0.5">Jangan muat naik tiket kapal terbang atau umumkan rumah tidak berpenghuni.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>2. Kata Rahsia Keluarga</strong>
                    <p className="text-xs mt-0.5">Satu perkataan sulit keluarga untuk mematikan penipuan klon suara AI.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>3. Kunci Tetapan Profil</strong>
                    <p className="text-xs mt-0.5">Tukar tetapan akaun daripada "Awam (Public)" kepada "Rakan Sahaja".</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Alat Interaktif Stesen:
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Share2 className="w-4 h-4 text-[#8A241C]" />
                    <span>Audit Hantaran Media Sosial Awam</span>
                  </div>
                  <p>Kesan pendedahan kod bar tiket dan maklumat sensitif keluarga yang dipaparkan kepada umum.</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <KeyRound className="w-4 h-4 text-[#1E4D2B]" />
                    <span>Simulator Protokol Kata Rahsia Keluarga</span>
                  </div>
                  <p>Ketahui bagaimana soalan rahsia keluarga menyekat panggilan klon suara AI sekelip mata.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Mulakan Audit Privasi & Pengesan AI</span>
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
     STAGE 3: RESULTS
     ========================================================================= */
  if (stage === 'results') {
    return (
      <div className="w-full space-y-6">
        <BadgesDrawer badges={badges} />

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  LAPORAN MISI 07 SELESAI
                </span>
                <span className="text-[#7C7E77]">PRIVASI & KLON SUARA AI</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  Identiti Keluarga Terpelihara!
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  Pasukan anda berjaya mengenal pasti bahaya perkongsian berlebihan (*oversharing*), melindungi keselamatan rumah, dan menguasai teknik menangkis klon suara AI.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Senario Disiasat</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">2 / 2 Kes</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Kebocoran Dikesan</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{totalLeaksFound} Kebocoran</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Keputusan Selamat</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{correctActionDecisions} / 2</span>
                </div>
                <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/20 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#123E23] block font-bold">Jumlah Mata</span>
                  <span className="font-mono text-2xl font-black text-[#123E23] mt-1 block">
                    {Math.min(50, Math.round(totalScore))} <span className="text-xs font-normal text-[#123E23]/70">/ 50</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Prinsip Privasi Komuniti Digital:
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Kongsi Selepas Pulang:</strong> Muat naik gambar percutian hanya selepas anda dan keluarga selamat tiba di rumah semula.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Amalkan Kata Laluan Keluarga:</strong> Cipta satu perkataan sulit keluarga (contoh: nama kuih kegemaran) untuk mengesahkan sebarang panggilan kecemasan.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Lindungi Wajah & Suara Kanak-kanak:</strong> Elakkan memuat naik video kanak-kanak berdurasi panjang dengan suara jelas secara awam.</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulang Siasatan</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <Home className="w-4 h-4" />
                  <span>Kembali Ke Menu Utama</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 2: INVESTIGATION (SPLIT SCREEN)
     ========================================================================= */
  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);
  const progressPercent = Math.round(((currentCaseIndex + 1) / socialPrivacyCases.length) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Bar */}
      <div className="bg-white border-2 border-[#171914] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171914]/15 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-[#7C7E77] hover:text-[#171914] font-bold transition-colors">
              ← [MENU UTAMA]
            </Link>
            <span className="text-[#171914]/20">|</span>
            <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
              KES 0{currentCaseIndex + 1} / 0{socialPrivacyCases.length}
            </span>
            <span className="font-bold text-[#171914] text-xs sm:text-sm">
              {currentCase.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleStart}
              title="Mulakan Semula Dari Kes 1"
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
              <span className="hidden sm:inline">Lencana</span> ({badges.filter(b => b.isUnlocked).length}/{badges.length})
            </button>

            <div className="font-bold text-[#171914] bg-white px-3 py-1.5 border border-[#171914]/20 rounded-xs min-h-[36px] flex items-center">
              MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20 ml-1">{Math.round(totalScore)} / 50</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3 font-mono text-xs text-[#7C7E77]">
          <span>Kemajuan Misi:</span>
          <div className="flex-1 h-2 bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
            <div
              className="h-full bg-[#171914] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="font-bold text-[#171914]">{progressPercent}%</span>
        </div>
      </div>

      {showBadges && <BadgesDrawer badges={badges} />}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Social Media Post or Audio Note Simulation (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#171914]" />
                  <span>1. Teliti Hantaran / Mesej Suara</span>
                </span>
                <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-bold uppercase text-[11px]">
                  {currentCase.category}
                </span>
              </div>

              {/* Profile Card Header */}
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/20 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#171914] text-[#D9FA62] flex items-center justify-center font-mono font-bold text-xs">
                    FB
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#171914] block">{currentCase.profileOwner}</span>
                    <span className="text-[11px] text-[#7C7E77] font-mono flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      <span>Status Privasi: {currentCase.postContent.privacySetting}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Post Text & Image Description */}
              <div className="p-4 bg-white border-2 border-[#171914]/20 rounded-sm space-y-3 font-sans text-xs sm:text-sm text-[#171914] leading-relaxed">
                <p className="whitespace-pre-line">{currentCase.postContent.text}</p>

                <div className="p-3 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C] font-mono text-xs space-y-1">
                  <span className="font-bold block uppercase text-[10px]">Pemerhatian Visual Foto Hantaran:</span>
                  <p>{currentCase.postContent.imageCaption}</p>
                </div>
              </div>
            </div>

            {/* Family Safe Word Tool Action */}
            <div className="pt-2">
              <div className="p-3 bg-[#171914] text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs text-[#D9FA62] font-bold block flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" />
                    <span>Alat Pertahanan: Protokol Kata Rahsia Keluarga (*Family Safe Word*)</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    Ketahui cara menguji pemanggil klon AI dengan perkataan rahsia keluarga.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestSafeWord}
                  className="px-4 py-2.5 bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] font-mono font-bold text-xs uppercase rounded-xs cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>Uji Kata Rahsia AI</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Safe Word Tool Explanation if clicked */}
              {showSafeWordTool && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-[#E7F3EB] border-2 border-[#1E4D2B] rounded-sm space-y-2 text-[#123E23] font-mono text-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#1E4D2B]/30 font-bold">
                    <span className="flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-[#1E4D2B]" />
                      <span>BAGAIMANA KATA RAHSIA MENUMPASKAN AI:</span>
                    </span>
                    <span className="bg-[#1E4D2B] text-white px-2 py-0.5 rounded-xs text-[10px]">
                      PERISAI KEBAL
                    </span>
                  </div>
                  <p>
                    Klon suara AI boleh meniru nada percakapan 100% tepat, tetapi AI <strong>TIDAK TAHU</strong> kata laluan rahsia yang hanya anda dan anak anda tetapkan di rumah (cth: &ldquo;Onde-Onde&rdquo;).
                  </p>
                  <p className="text-[11px] text-[#575953]">
                    Bila pemanggil cemas gagal menjawab kata laluan rahsia, anda pasti ia adalah penipuan klon AI!
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Privacy Leak Checklist & Decisions (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#171914]" />
                  <span>2. Analisis Kebocoran & Tindakan</span>
                </span>
                <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] ${
                  isLeaksSubmitted ? 'bg-[#E7F3EB] text-[#123E23]' : 'bg-[#D9FA62] text-[#171914]'
                }`}>
                  {!isLeaksSubmitted ? 'LANGKAH 1: KESAN KEBOCORAN' : 'LANGKAH 2: BERTINDAK'}
                </span>
              </div>
            </div>

            {/* Step 1: Detect Leaks or Step 2: Choose Action */}
            <div className="space-y-4 flex-1">
              {!isLeaksSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      Langkah 1: Tandakan Pendedahan Berbahaya
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      Berdasarkan hantaran di sebelah kiri, tandakan <strong>maklumat yang MEMBAHAYAKAN KESELAMATAN sahaja</strong>:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.leakItems.map((leak) => {
                      const isMarked = selectedLeakIds.includes(leak.id);

                      return (
                        <button
                          key={leak.id}
                          type="button"
                          onClick={() => handleToggleLeak(leak.id)}
                          className={`w-full p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] ${
                            isMarked
                              ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                              : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="font-mono text-xs sm:text-sm leading-snug">
                            {leak.label}
                          </span>
                          <span className={`shrink-0 font-mono text-xs font-bold px-2 py-1 rounded-xs border ${
                            isMarked ? 'bg-[#D9FA62] text-[#171914] border-[#D9FA62]' : 'bg-[#ECEAE2] text-[#575953]'
                          }`}>
                            {isMarked ? '✓ DITANDAKAN' : '+ TANDAKAN'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Review breakdown */}
                  <div className="p-4 bg-[#FAF9F5] border-2 border-[#171914]/15 rounded-sm space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10">
                      <span className="font-bold text-[#171914]">Hasil Audit Privasi:</span>
                      <span className="font-bold bg-[#D9FA62] px-2 py-0.5 rounded-xs text-[#171914]">
                        +{leakScore} / 12 Mata
                      </span>
                    </div>
                    {currentCase.leakItems.map(l => {
                      const isTicked = selectedLeakIds.includes(l.id);
                      if (isTicked && l.isVulnerability) {
                        return (
                          <div key={l.id} className="p-2 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-[#123E23]">
                            <strong>✓ Tepat Dikesan:</strong> {l.label}
                            <p className="text-[11px] text-[#575953] mt-0.5">{l.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !l.isVulnerability) {
                        return (
                          <div key={l.id} className="p-2 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C]">
                            <strong>✕ Tersilap Tanda:</strong> {l.label} (Ini ungkapan umum, bukan data sensitif)
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      Langkah 2: Apakah Tindakan Paling Selamat?
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1">
                      Pilih keputusan tindakan terbaik untuk melindungi keselamatan keluarga:
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.actions.map(act => {
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
                          <span className="font-bold text-sm block">{act.title}</span>
                          <span className="text-xs text-[#575953] mt-0.5 block">{act.description}</span>
                          {isSelected && !isActionSubmitted && (
                            <span className="mt-2 font-mono text-xs font-bold text-[#171914] bg-[#D9FA62] px-2 py-0.5 rounded-xs self-start">
                              PILIHAN ANDA ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Outcome feedback */}
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
                            {activeAction.isSafe ? 'Tindakan Tepat! (+13 Mata)' : 'Amaran Risiko'}
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

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#171914]/15">
              {!isLeaksSubmitted ? (
                <button
                  type="button"
                  disabled={selectedLeakIds.length === 0}
                  onClick={handleSubmitLeaks}
                  className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    selectedLeakIds.length > 0
                      ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                      : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                  }`}
                >
                  <span>Sahkan Kebocoran Dikesan & Ke Langkah 2 →</span>
                </button>
              ) : !isActionSubmitted ? (
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
                  <span>Sahkan Keputusan Tindakan</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCase}
                  className="w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>
                    {currentCaseIndex + 1 === socialPrivacyCases.length
                      ? 'Lihat Laporan Misi 07 Selesai'
                      : `Senario Seterusnya (Kes 0${currentCaseIndex + 2})`}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
