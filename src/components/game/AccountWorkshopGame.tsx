'use client';

import React, { useState } from 'react';
import { initialAccounts, passwordLabOptions, upgradedPassphrases, securityChecklist } from '@/data/account-workshop-data';
import { FictionalAccount } from '@/types/game';
import { PassphraseBuilderLab } from '@/components/game/PassphraseBuilderLab';
import { TwoFactorPhoneSimulator } from '@/components/game/TwoFactorPhoneSimulator';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  KeyRound,
  AlertTriangle,
  Check,
  ArrowRight,
  RotateCcw,
  Home,
  Mail,
  ShoppingCart,
  Share2,
  CheckSquare,
  Square,
  Award,
  Smartphone,
  Lock,
  Layers
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const AccountWorkshopGame: React.FC = () => {
  // Workshop Stages: 1. Briefing, 2. Inspect Accounts, 3. Password Lab, 4. Domino Breach, 5. 2FA Simulator & Checklist, 6. Results
  const [stage, setStage] = useState<number>(1);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  // Stage 2 state: Accounts inspected
  const [inspectedAccountIds, setInspectedAccountIds] = useState<string[]>(['acc-email']);
  const [activeAccountId, setActiveAccountId] = useState<string>('acc-email');

  // Stage 3 state: Password lab & custom passphrase
  const [customPassphrase, setCustomPassphrase] = useState<string | null>(null);
  const [labSubmitted, setLabSubmitted] = useState<boolean>(false);

  // Stage 4 state: Domino breach simulation
  const [dominoStep, setDominoStep] = useState<'initial' | 'breached-all' | 'upgraded' | 'breached-contained'>('initial');

  // Stage 5 state: 2FA Simulator & Security checklist
  const [phone2FASimulated, setPhone2FASimulated] = useState<boolean>(false);
  const [checkedMeasures, setCheckedMeasures] = useState<string[]>(['sec-unique']);

  // Scoring
  const [stageScores, setStageScores] = useState<Record<number, number>>({
    2: 0, // 10 pts for account audit
    3: 0, // 10 pts for password lab & builder
    4: 0, // 15 pts for domino breach fix
    5: 0  // 15 pts for 2FA simulator & checklist
  });

  const totalScore = Object.values(stageScores).reduce((a, b) => a + b, 0);

  // Dynamic Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-domino',
      name: 'Penyekat Domino',
      icon: '🔗',
      description: 'Menetapkan kata laluan unik bagi setiap akaun',
      isUnlocked: dominoStep === 'breached-contained'
    },
    {
      id: 'b-fortress',
      name: 'Kubu Besi',
      icon: '🧱',
      description: 'Membina frasa laluan 4 perkataan yang kebal',
      isUnlocked: !!customPassphrase
    },
    {
      id: 'b-2fa',
      name: 'Perisai 2FA',
      icon: '🛑',
      description: 'Menolak pencerobohan pada telefon pintar 2FA',
      isUnlocked: phone2FASimulated
    },
    {
      id: 'b-fortified',
      name: 'Pertahanan Kebal',
      icon: '🛡️',
      description: 'Mencapai skor perlindungan akaun 90% ke atas',
      isUnlocked: stage === 6
    }
  ];

  const handleStart = () => {
    setStage(2);
    setInspectedAccountIds(['acc-email']);
    setActiveAccountId('acc-email');
    setCustomPassphrase(null);
    setLabSubmitted(false);
    setDominoStep('initial');
    setPhone2FASimulated(false);
    setCheckedMeasures(['sec-unique']);
    setStageScores({ 2: 0, 3: 0, 4: 0, 5: 0 });
  };

  /* --- Handler: Stage 2 Inspect Account --- */
  const handleInspectAccount = (accId: string) => {
    setActiveAccountId(accId);
    if (!inspectedAccountIds.includes(accId)) {
      setInspectedAccountIds(prev => [...prev, accId]);
    }
  };

  const handleCompleteAudit = () => {
    setStageScores(prev => ({ ...prev, 2: 10 }));
    setStage(3);
  };

  /* --- Handler: Stage 3 Password Lab --- */
  const handlePassphraseBuilt = (assembled: string) => {
    setCustomPassphrase(assembled);
    setLabSubmitted(true);
    setStageScores(prev => ({ ...prev, 3: 10 }));
  };

  const handleProceedToDomino = () => {
    setStage(4);
  };

  /* --- Handler: Stage 4 Domino Breach --- */
  const handleTestDominoBreach = () => {
    setDominoStep('breached-all');
  };

  const handleApplyUniquePassphrases = () => {
    setDominoStep('upgraded');
  };

  const handleRetestBreach = () => {
    setDominoStep('breached-contained');
    setStageScores(prev => ({ ...prev, 4: 15 }));
  };

  const handleProceedToChecklist = () => {
    setStage(5);
  };

  /* --- Handler: Stage 5 2FA Simulator & Checklist --- */
  const handle2FASuccess = () => {
    setPhone2FASimulated(true);
    if (!checkedMeasures.includes('sec-2fa')) {
      setCheckedMeasures(prev => [...prev, 'sec-2fa']);
    }
  };

  const handleToggleMeasure = (id: string) => {
    setCheckedMeasures(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCompleteWorkshop = () => {
    const points = checkedMeasures.length >= 4 && phone2FASimulated ? 15 : 10;
    setStageScores(prev => ({ ...prev, 5: points }));
    const finalScore = Math.min(50, totalScore + points);
    saveChallengeResult('passwords', finalScore, 50);
    setStage(6);
  };

  /* =========================================================================
     STAGE 1: MISSION BRIEFING (SPLIT VIEW)
     ========================================================================= */
  if (stage === 1) {
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
            {/* Left Column: Context & Narrative */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  MISI 02
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                Bengkel Pertahanan Akaun & Kata Laluan
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                &ldquo;Seorang pengguna (Pak Ali) menggunakan satu kata laluan yang sama iaitu <code className="bg-[#FAF0E6] px-2 py-0.5 border border-[#8A241C]/30 text-[#8A241C] font-bold font-mono">Kampung123!</code> untuk ketiga-tiga akaun utamanya. Tugas pasukan anda adalah mengaudit kelemahan akaun beliau, membina frasa laluan Kubu Besi, dan menyekat pencerobohan siber berjangkit.&rdquo;
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  Susunan Fasa Bengkel:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>Fasa 01: Audit Akaun</strong>
                    <p className="text-xs mt-0.5">Siasat kelemahan 3 akaun digital Pak Ali.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>Fasa 02: Makmal Frasa</strong>
                    <p className="text-xs mt-0.5">Bina frasa laluan 4 perkataan kebal.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>Fasa 03: Sekatan Domino</strong>
                    <p className="text-xs mt-0.5">Saksikan bagaimana kata laluan unik menyekat serangan.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>Fasa 04: Simulator 2FA</strong>
                    <p className="text-xs mt-0.5">Tolak cubaan pencerobohan pada telefon pintar.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Tools & Start Button */}
            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Alat Interaktif Stesen:
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <KeyRound className="w-4 h-4 text-[#171914]" />
                    <span>Makmal Cantuman Frasa Laluan</span>
                  </div>
                  <p>Gabungkan blok perkataan Melayu dan saksikan meter masa pemecahan melonjak ke ribuan tahun!</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Smartphone className="w-4 h-4 text-[#171914]" />
                    <span>Simulator 2FA Telefon Pintar</span>
                  </div>
                  <p>Alami situasi sebenar menerima notifikasi cubaan menceroboh dan sekat penyerang serta-merta.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Mulakan Bengkel Pertahanan Akaun</span>
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
     TOP REUSABLE BAR FOR STAGES 2 - 5
     ========================================================================= */
  const stageTitles: Record<number, { title: string; subtitle: string }> = {
    2: { title: 'FASA 01 / 04', subtitle: 'Audit Keselamatan 3 Akaun Pak Ali' },
    3: { title: 'FASA 02 / 04', subtitle: 'Makmal Frasa Laluan Kubu Besi' },
    4: { title: 'FASA 03 / 04', subtitle: 'Simulasi Pencerobohan Data Berjangkit (Domino)' },
    5: { title: 'FASA 04 / 04', subtitle: 'Simulator 2FA Telefon & Senarai Perisai' }
  };

  const progressPercent = stage === 2 ? 25 : stage === 3 ? 50 : stage === 4 ? 75 : 100;

  const renderTopBar = (currentStageNum: number) => (
    <div className="bg-white border-2 border-[#171914] rounded-sm p-4 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171914]/15 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-[#7C7E77] hover:text-[#171914] font-bold transition-colors">
            ← [MENU UTAMA]
          </Link>
          <span className="text-[#171914]/20">|</span>
          <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
            {stageTitles[currentStageNum].title}
          </span>
          <span className="font-bold text-[#171914] text-xs sm:text-sm">
            {stageTitles[currentStageNum].subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleStart}
            title="Mulakan Semula Bengkel Dari Awal"
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
  );

  /* =========================================================================
     STAGE 2: INSPECT THE ACCOUNTS (FULL SPLIT VIEW)
     ========================================================================= */
  if (stage === 2) {
    const activeAcc = initialAccounts.find(a => a.id === activeAccountId) || initialAccounts[0];
    const allAudited = inspectedAccountIds.length === initialAccounts.length;

    return (
      <div className="w-full space-y-4">
        {renderTopBar(2)}

        {showBadges && <BadgesDrawer badges={badges} />}

        {/* 2-Column Split: Left = Account Cards & Detailed Dossier; Right = Threat Analysis & Next Step */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: 3 Accounts to Click & Selected Account Report (Col 1-7) */}
          <div className="lg:col-span-7 rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914]">
                  1. Pilih & Audit 3 Akaun Pak Ali
                </span>
                <span className="font-bold bg-[#ECEAE2] px-2 py-0.5 rounded-xs text-[#171914]">
                  {inspectedAccountIds.length} / 3 Diaudit
                </span>
              </div>

              {/* 3 Clickable Account Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {initialAccounts.map((acc) => {
                  const isActive = activeAccountId === acc.id;
                  const isChecked = inspectedAccountIds.includes(acc.id);

                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleInspectAccount(acc.id)}
                      className={`p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[105px] ${
                        isActive
                          ? 'border-[#171914] bg-[#F5F4EE] shadow-xs ring-1 ring-[#171914]'
                          : 'border-[#171914]/20 bg-white hover:border-[#171914]/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {acc.serviceType === 'email' && <Mail className="w-4 h-4 text-[#171914]" />}
                          {acc.serviceType === 'social' && <Share2 className="w-4 h-4 text-[#171914]" />}
                          {acc.serviceType === 'shopping' && <ShoppingCart className="w-4 h-4 text-[#171914]" />}

                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs border ${
                            isChecked ? 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30' : 'bg-[#ECEAE2] text-[#82847C]'
                          }`}>
                            {isChecked ? 'DIAUDIT ✓' : 'KLIK AUDIT'}
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-sm text-[#171914] block truncate">{acc.name}</span>
                          <span className="font-mono text-xs text-[#7C7E77] block truncate">{acc.identifier}</span>
                        </div>
                      </div>

                      <div className="mt-2 font-mono text-xs bg-white p-1.5 border border-[#171914]/10 rounded-xs">
                        <span className="text-[10px] text-[#7C7E77] block">Kata Laluan Semasa:</span>
                        <span className="font-bold text-[#8A241C]">&ldquo;{acc.currentPassword}&rdquo;</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Inspection Dossier for the active account */}
              <div className="p-4 sm:p-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10 font-mono text-xs">
                  <span className="font-bold text-[#171914]">Hasil Audit: {activeAcc.name}</span>
                  <span className="text-[#8A241C] font-bold bg-[#FAF0E6] px-2 py-0.5 rounded-xs border border-[#8A241C]/20">
                    RISIKO TINGGI: KATA LALUAN DIULANG
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
                  {activeAcc.statusNotes}
                </p>
              </div>
            </div>

            <div className="pt-2 font-mono text-xs text-[#7C7E77]">
              Sila pastikan anda mengklik dan meneliti ketiga-tiga akaun di atas sebelum melangkah ke Fasa 2.
            </div>
          </div>

          {/* RIGHT COLUMN: Threat Analysis & Mission Action (Col 8-12) */}
          <div className="lg:col-span-5 rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914]">
                  2. Laporan & Tindakan Keselamatan
                </span>
              </div>

              {/* Warning Alert Box */}
              <div className="p-4 bg-[#FAF0E6] border-2 border-[#8A241C]/30 rounded-sm space-y-2 text-[#78271C]">
                <div className="flex items-center gap-2 font-bold font-mono text-xs">
                  <AlertTriangle className="w-4 h-4 text-[#8A241C]" />
                  <span>PENEMUAN UTAMA AUDIT:</span>
                </div>
                <p className="text-xs sm:text-sm leading-relaxed">
                  Ketiga-tiga akaun digital Pak Ali menggunakan kata laluan yang sama iaitu <code className="bg-white px-1.5 py-0.5 border border-[#8A241C]/30 font-bold font-mono">Kampung123!</code>.
                </p>
                <p className="text-xs sm:text-sm leading-relaxed font-medium">
                  Ini bermaksud, jika penggodam berjaya memecahkan salah satu portal, mereka akan memegang kunci kepada <strong>semua akaun Pak Ali</strong> serentak!
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-[#7C7E77] uppercase font-bold block">Status Pemeriksaan Akaun:</span>
                <div className="space-y-1.5 text-[#171914]">
                  {initialAccounts.map(acc => {
                    const done = inspectedAccountIds.includes(acc.id);
                    return (
                      <div key={acc.id} className="flex items-center gap-2 p-2 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                        <span className={`w-4 h-4 rounded-xs flex items-center justify-center text-xs font-bold ${
                          done ? 'bg-[#1E4D2B] text-white' : 'bg-[#ECEAE2] text-[#82847C]'
                        }`}>
                          {done ? '✓' : ''}
                        </span>
                        <span className="font-bold">{acc.name}</span>
                        <span className="ml-auto text-xs text-[#7C7E77]">{done ? 'Selesai' : 'Belum diaudit'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-[#171914]/15 space-y-2">
              <div className="font-mono text-xs text-[#7C7E77]">
                {allAudited
                  ? 'Audit selesai! Pasukan anda sedia melangkah ke Makmal Kata Laluan.'
                  : `Audit baki ${initialAccounts.length - inspectedAccountIds.length} akaun lagi di sebelah kiri.`}
              </div>

              <button
                type="button"
                disabled={!allAudited}
                onClick={handleCompleteAudit}
                className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  allAudited
                    ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                    : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                }`}
              >
                <span>Selesai Audit & Ke Makmal Kata Laluan (+10 Mata)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 3: PASSWORD LAB & TACTILE PASSPHRASE BUILDER (SPLIT VIEW)
     ========================================================================= */
  if (stage === 3) {
    return (
      <div className="w-full space-y-4">
        {renderTopBar(3)}

        {showBadges && <BadgesDrawer badges={badges} />}

        {/* Passphrase Builder Lab with internal split layout */}
        <PassphraseBuilderLab
          onPassphraseCompleted={handlePassphraseBuilt}
          onReset={() => {
            setCustomPassphrase(null);
            setLabSubmitted(false);
            setStageScores(prev => ({ ...prev, 3: 0 }));
          }}
        />

        {/* Transition to next stage when completed */}
        {labSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 bg-[#E7F3EB] border-2 border-[#1E4D2B] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
          >
            <div className="space-y-1">
              <span className="font-mono text-xs uppercase font-bold text-[#123E23] block">
                ✓ Frasa Laluan Kubu Besi Berjaya Disahkan (+10 Mata)
              </span>
              <p className="text-sm font-mono text-[#123E23]">
                Frasa anda: <strong>&ldquo;{customPassphrase}&rdquo;</strong> kini bersedia untuk melindungi akaun Pak Ali.
              </p>
            </div>
            <button
              type="button"
              onClick={handleProceedToDomino}
              className="px-8 py-4 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer flex items-center justify-center gap-2 shadow-xs shrink-0"
            >
              <span>Uji Kesan Domino (Fasa 03)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  /* =========================================================================
     STAGE 4: STOP THE ACCOUNT DOMINO EFFECT (FULL SPLIT VIEW)
     ========================================================================= */
  if (stage === 4) {
    return (
      <div className="w-full space-y-4">
        {renderTopBar(4)}

        {showBadges && <BadgesDrawer badges={badges} />}

        {/* 2-Column Split: Left = Account Network Nodes; Right = Incident Command & Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: 3 Network Nodes Simulation (Col 1-7) */}
          <div className="lg:col-span-7 rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914] flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#171914]" />
                  <span>1. Simulasi Rangkaian 3 Akaun</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-xs font-bold text-[11px] border ${
                  dominoStep === 'breached-contained'
                    ? 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30'
                    : dominoStep === 'breached-all'
                    ? 'bg-[#FAF0E6] text-[#78271C] border-[#8A241C]/30'
                    : 'bg-[#ECEAE2] text-[#171914] border-[#171914]/20'
                }`}>
                  STATUS: {
                    dominoStep === 'breached-contained'
                      ? 'KEBOCORAN DISEKAT ✓'
                      : dominoStep === 'breached-all'
                      ? 'SEMUA AKAUN DICEROBOH! ⚠'
                      : dominoStep === 'upgraded'
                      ? 'KATA LALUAN UNIK DITETAPKAN'
                      : 'SEDIA UNTUK UJIAN'
                  }
                </span>
              </div>

              {/* 3 Interactive Visual Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Node 1: PasarOnline */}
                <div className={`p-4 rounded-sm border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                  dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                    ? 'border-[#8A241C] bg-[#FAF0E6]'
                    : 'border-[#171914]/25 bg-[#FAF9F5]'
                }`}>
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="font-bold">01. PasarOnline</span>
                      <ShoppingCart className="w-4 h-4 text-[#8A241C]" />
                    </div>
                    <div className="text-xs font-mono text-[#575953] space-y-1">
                      <span>Kata Laluan:</span>
                      <code className="block bg-white p-1 border font-bold text-[#171914] truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? upgradedPassphrases['acc-shopping']
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold text-[#8A241C]">
                    {dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                      ? 'PANGKALAN DATA BOCOR!'
                      : 'Punca Pencerobohan'}
                  </div>
                </div>

                {/* Node 2: Social Media */}
                <div className={`p-4 rounded-sm border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                  dominoStep === 'breached-all'
                    ? 'border-[#8A241C] bg-[#FAF0E6]'
                    : dominoStep === 'breached-contained'
                    ? 'border-[#1E4D2B] bg-[#E7F3EB]'
                    : 'border-[#171914]/25 bg-[#FAF9F5]'
                }`}>
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="font-bold">02. Media Sosial</span>
                      <Share2 className="w-4 h-4 text-[#171914]" />
                    </div>
                    <div className="text-xs font-mono text-[#575953] space-y-1">
                      <span>Kata Laluan:</span>
                      <code className="block bg-white p-1 border font-bold text-[#171914] truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? upgradedPassphrases['acc-social']
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold">
                    {dominoStep === 'breached-all' && <span className="text-[#8A241C]">PENGGODAM MASUK!</span>}
                    {dominoStep === 'breached-contained' && <span className="text-[#123E23]">SELAMAT! KATA LALUAN BERBEZA ✓</span>}
                    {dominoStep === 'initial' && <span className="text-[#7C7E77]">Guna Kata Laluan Sama</span>}
                    {dominoStep === 'upgraded' && <span className="text-[#171914]">Kata Laluan Baharu</span>}
                  </div>
                </div>

                {/* Node 3: Email */}
                <div className={`p-4 rounded-sm border-2 transition-all flex flex-col justify-between min-h-[140px] ${
                  dominoStep === 'breached-all'
                    ? 'border-[#8A241C] bg-[#FAF0E6]'
                    : dominoStep === 'breached-contained'
                    ? 'border-[#1E4D2B] bg-[#E7F3EB]'
                    : 'border-[#171914]/25 bg-[#FAF9F5]'
                }`}>
                  <div>
                    <div className="flex items-center justify-between font-mono text-xs mb-2">
                      <span className="font-bold">03. Emel & Bank</span>
                      <Mail className="w-4 h-4 text-[#171914]" />
                    </div>
                    <div className="text-xs font-mono text-[#575953] space-y-1">
                      <span>Kata Laluan:</span>
                      <code className="block bg-white p-1 border font-bold text-[#171914] truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? (customPassphrase || upgradedPassphrases['acc-email'])
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t font-mono text-[10px] font-bold">
                    {dominoStep === 'breached-all' && <span className="text-[#8A241C]">EMEL & BANK DITAWAN!</span>}
                    {dominoStep === 'breached-contained' && <span className="text-[#123E23]">SELAMAT! KATA LALUAN BERBEZA ✓</span>}
                    {dominoStep === 'initial' && <span className="text-[#7C7E77]">Guna Kata Laluan Sama</span>}
                    {dominoStep === 'upgraded' && <span className="text-[#171914]">Kata Laluan Baharu</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-[#FAF9F5] border border-[#171914]/15 rounded-xs text-xs text-[#575953] font-mono leading-relaxed">
              💡 <strong>Kesan Domino:</strong> Apabila pengguna mengulang kata laluan yang sama, kebocoran satu laman web kecil membolehkan penjenayah mengakses emel peribadi dan perbankan mangsa.
            </div>
          </div>

          {/* RIGHT COLUMN: Crisis Control & Sequential Action Buttons (Col 8-12) */}
          <div className="lg:col-span-5 rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914]">
                  2. Pusat Kawalan Krisis Siber
                </span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953] leading-relaxed">
                <p>
                  Saksikan bagaimana penjenayah siber menggunakan kaedah <em>&ldquo;Credential Stuffing&rdquo;</em> untuk menyerang mangsa yang mengulang kata laluan.
                </p>

                <div className="p-3.5 bg-[#FAF9F5] border border-[#171914]/15 rounded-xs space-y-2">
                  <span className="font-mono text-xs font-bold uppercase text-[#171914] block">
                    Arahan Tindakan Pasukan:
                  </span>
                  {dominoStep === 'initial' && (
                    <p className="text-[#8A241C] font-semibold">
                      Tekan butang di bawah untuk melihat apa yang berlaku apabila penggodam mencuri pangkalan data PasarOnline.
                    </p>
                  )}
                  {dominoStep === 'breached-all' && (
                    <p className="text-[#8A241C] font-semibold">
                      Bahaya! Penggodam berjaya masuk ke semua akaun. Tekan butang di bawah untuk memberikan kata laluan unik bagi setiap akaun.
                    </p>
                  )}
                  {dominoStep === 'upgraded' && (
                    <p className="text-[#123E23] font-semibold">
                      Kata laluan unik telah ditetapkan! Tekan butang di bawah untuk menguji semula sama ada pencerobohan berjaya disekat.
                    </p>
                  )}
                  {dominoStep === 'breached-contained' && (
                    <p className="text-[#123E23] font-semibold">
                      Tahniah! Kesan domino berjaya disekat. Emel dan media sosial Pak Ali kini selamat kerana menggunakan kata laluan berbeza.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#171914]/15 space-y-2">
              {dominoStep === 'initial' && (
                <button
                  type="button"
                  onClick={handleTestDominoBreach}
                  className="w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#F5F4EE] bg-[#8A241C] hover:bg-[#6E1C15] border-2 border-[#6E1C15] transition-colors cursor-pointer shadow-xs text-center"
                >
                  1. Uji Kebocoran PasarOnline (Lihat Kesan Domino)
                </button>
              )}

              {dominoStep === 'breached-all' && (
                <button
                  type="button"
                  onClick={handleApplyUniquePassphrases}
                  className="w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs text-center"
                >
                  2. Selesaikan: Berikan Kata Laluan Unik Setiap Akaun →
                </button>
              )}

              {dominoStep === 'upgraded' && (
                <button
                  type="button"
                  onClick={handleRetestBreach}
                  className="w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer shadow-xs text-center"
                >
                  3. Uji Semula Kebocoran (Sahkan Sekatan Pencerobohan)
                </button>
              )}

              {dominoStep === 'breached-contained' && (
                <button
                  type="button"
                  onClick={handleProceedToChecklist}
                  className="w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Teruskan ke Fasa 04: Simulator 2FA & Perisai (+15 Mata)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 5: SIMULATED 2FA PHONE PROMPT & CHECKLIST (FULL SPLIT VIEW)
     ========================================================================= */
  if (stage === 5) {
    const defenseScore = Math.min(100, (phone2FASimulated ? 40 : 20) + checkedMeasures.length * 15);

    return (
      <div className="w-full space-y-4">
        {renderTopBar(5)}

        {showBadges && <BadgesDrawer badges={badges} />}

        {/* 2-Column Split: Left = Phone 2FA Simulator; Right = Security Checklist & Finish Button */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: The Phone Screen Simulator (Col 1-6) */}
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <TwoFactorPhoneSimulator onSuccess={handle2FASuccess} />
          </div>

          {/* RIGHT COLUMN: Defense Checklist & Complete CTA (Col 7-12) */}
          <div className="lg:col-span-6 rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914]">
                  2. Senarai Semak Perisai Akaun
                </span>
              </div>

              {/* Defense Level Meter */}
              <div className="p-4 bg-[#FAF9F5] border-2 border-[#171914]/15 rounded-sm space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#171914]">Tahap Kekebalan Akaun Pak Ali:</span>
                  <span className="font-bold bg-[#D9FA62] px-2.5 py-0.5 border border-[#171914]/20 text-[#171914]">
                    {defenseScore}% {defenseScore >= 90 ? '(KEBAL & KUKUH)' : '(SEDANG DIKUKUHKAN)'}
                  </span>
                </div>
                <div className="h-3 w-full bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
                  <div
                    className="h-full bg-[#171914] transition-all duration-300"
                    style={{ width: `${defenseScore}%` }}
                  />
                </div>
              </div>

              {/* Checklist buttons */}
              <div className="space-y-2.5">
                {securityChecklist.map((item) => {
                  const isChecked = checkedMeasures.includes(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleToggleMeasure(item.id)}
                      className={`w-full p-3.5 sm:p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 min-h-[58px] ${
                        isChecked
                          ? 'bg-[#E7F3EB] border-[#1E4D2B] text-[#123E23]'
                          : 'bg-white border-[#171914]/20 hover:border-[#171914] text-[#171914]'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-[#1E4D2B]" />
                        ) : (
                          <Square className="w-5 h-5 text-[#82847C]" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-xs sm:text-sm block">{item.title}</span>
                        <span className="text-xs text-[#575953] leading-relaxed block mt-0.5">{item.shortDescription}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Workshop CTA */}
            <div className="pt-4 border-t border-[#171914]/15 space-y-2">
              <div className="font-mono text-xs text-[#7C7E77]">
                {phone2FASimulated
                  ? 'Tahniah! Ujian simulator 2FA berjaya ditolak.'
                  : 'Sila tolak cubaan menceroboh pada skrin telefon di sebelah kiri.'}
              </div>

              <button
                type="button"
                disabled={!phone2FASimulated}
                onClick={handleCompleteWorkshop}
                className={`w-full py-4 px-6 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  phone2FASimulated
                    ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                    : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                }`}
              >
                <span>Lengkapkan Bengkel & Lihat Keputusan (+15 Mata)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 6: MISSION RESULTS (SPLIT VIEW)
     ========================================================================= */
  return (
    <div className="w-full space-y-6">
      <BadgesDrawer badges={badges} />

      <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Summary & Stats */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
              <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                LAPORAN BENGKEL SELESAI
              </span>
              <span className="text-[#7C7E77]">MISI 02 / KATA LALUAN</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                Akaun Berjaya Diperkukuh!
              </h2>
              <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                Pasukan anda berjaya mengaudit kelemahan akaun Pak Ali, membina frasa laluan Kubu Besi (&ldquo;{customPassphrase || 'kucing-suka-makan-ikan'}&rdquo;), menyekat pencerobohan data berjangkit, dan menolak pencerobohan pada telefon pintar 2FA.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Akaun Diaudit</span>
                <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">3 / 3</span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Frasa Terbina</span>
                <span className="font-mono text-xl sm:text-2xl font-black text-[#171914] mt-1 block truncate">
                  Kubu Besi 🛡️
                </span>
              </div>
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Ujian 2FA</span>
                <span className="font-mono text-2xl font-black text-[#1E4D2B] mt-1 block">Disekat ✓</span>
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
              Prinsip Penting Kata Laluan Komuniti:
            </span>

            <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Jangan ulang kata laluan yang sama merentasi emel, media sosial, dan portal beli-belah.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Gunakan frasa laluan 4 perkataan kerana ia mudah diingati manusia tetapi mustahil dipecahkan penggodam.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </span>
                <span>Sentiasa aktifkan Pengesahan 2 Faktor (2FA) untuk menghalang akses walaupun kata laluan anda bocor.</span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Ulang Bengkel</span>
              </button>

              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Menu Utama</span>
              </Link>

              <Link
                href="/challenge/phishing"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
              >
                <span>Misi 01: Phishing</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
