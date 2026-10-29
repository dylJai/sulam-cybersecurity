'use client';

import React, { useState } from 'react';
import { getAccountWorkshopData, upgradedPassphrases } from '@/data/account-workshop-data';
import { PassphraseBuilderLab } from '@/components/game/PassphraseBuilderLab';
import { TwoFactorPhoneSimulator } from '@/components/game/TwoFactorPhoneSimulator';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, triggerCelebration } from '@/lib/sound';
import {
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
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const AccountWorkshopGame: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

  const { initialAccounts, securityChecklist } = getAccountWorkshopData(language);

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
    2: 0,
    3: 0,
    4: 0,
    5: 0
  });

  const totalScore = Object.values(stageScores).reduce((a, b) => a + b, 0);

  // Dynamic Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-domino',
      name: isEn ? 'Domino Stopper' : 'Penyekat Domino',
      icon: '🔗',
      description: isEn ? 'Set a unique password for each account' : 'Menetapkan kata laluan unik bagi setiap akaun',
      isUnlocked: dominoStep === 'breached-contained'
    },
    {
      id: 'b-fortress',
      name: isEn ? 'Iron Fortress' : 'Kubu Besi',
      icon: '🧱',
      description: isEn ? 'Built an unbreakable 4-word passphrase' : 'Membina frasa laluan 4 perkataan yang kebal',
      isUnlocked: !!customPassphrase
    },
    {
      id: 'b-two-factor',
      name: isEn ? '2FA Defender' : 'Perisai 2FA',
      icon: '📲',
      description: isEn ? 'Blocked unauthorized hacker login with 2FA' : 'Menolak cubaan pencerobohan penggodam dengan 2FA',
      isUnlocked: phone2FASimulated
    },
    {
      id: 'b-champion',
      name: isEn ? 'CyberSafe Guardian' : 'Penjaga Akaun Komuniti',
      icon: '🛡️',
      description: isEn ? 'Completed the entire Account Defense Workshop' : 'Menyelesaikan bengkel pertahanan akaun penuh',
      isUnlocked: stage === 6
    }
  ];

  const handleStart = () => {
    playPopSound();
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

  const handlePassphraseBuilt = (phrase: string) => {
    setCustomPassphrase(phrase);
    setLabSubmitted(true);
    setStageScores(prev => ({ ...prev, 3: 10 }));
  };

  const handleProceedToDomino = () => {
    setStage(4);
  };

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

  const handle2FASuccess = () => {
    setPhone2FASimulated(true);
    if (!checkedMeasures.includes('sec-2fa')) {
      setCheckedMeasures(prev => [...prev, 'sec-2fa']);
    }
    setStageScores(prev => ({ ...prev, 5: 15 }));
  };

  const handleToggleMeasure = (id: string) => {
    setCheckedMeasures(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const handleCompleteWorkshop = () => {
    triggerCelebration();
    const finalScore = Math.min(50, totalScore);
    saveChallengeResult('passwords', finalScore, 50);
    setStage(6);
  };

  /* =========================================================================
     STAGE 1: BRIEFING
     ========================================================================= */
  if (stage === 1) {
    return (
      <div className="w-full space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors py-1"
          >
            ← {t('nav.backToMenuFriendly')}
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs">
                  {isEn ? 'MISSION 02' : 'MISI 02'}
                </span>
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {isEn ? '⏱️ 6-8 Mins • 50 Points' : '⏱️ 6-8 Minit • 50 Mata'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {t('m2.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {isEn ? (
                  <>
                    A resident (Pak Ali) reuses the exact same password <code className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-lg border border-red-200">Kampung123!</code> across his email, social media, and online banking. Your mission is to audit his vulnerabilities, forge an unbreakable passphrase, and stop the domino breach effect.
                  </>
                ) : (
                  <>
                    Seorang penduduk (Pak Ali) menggunakan satu kata laluan yang sama iaitu <code className="bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-lg border border-red-200">Kampung123!</code> untuk emel, Facebook, dan akaun membeli-belahnya. Tugas anda adalah mengaudit kelemahan akaun beliau, membina kata laluan kebal, dan menyekat pencerobohan siber berjangkit.
                  </>
                )}
              </p>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                  {isEn ? '📋 4 Fun Workshop Phases:' : '📋 4 Fasa Menarik Dalam Misi Ini:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900">{isEn ? '1. Account Audit' : '1. Audit Akaun'}</strong>
                    <p className="text-xs text-slate-600">{isEn ? 'Examine flaws in Pak Ali’s 3 accounts.' : 'Siasat kelemahan 3 akaun digital Pak Ali.'}</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900">{isEn ? '2. Passphrase Lab' : '2. Makmal Kata Laluan'}</strong>
                    <p className="text-xs text-slate-600">{isEn ? 'Build an unbreakable 4-word passphrase.' : 'Bina frasa laluan 4 perkataan yang kebal.'}</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900">{isEn ? '3. Domino Effect' : '3. Sekatan Domino'}</strong>
                    <p className="text-xs text-slate-600">{isEn ? 'Witness how unique passwords block credential stuffing.' : 'Saksikan bagaimana kata laluan unik menyekat pencerobohan.'}</p>
                  </div>
                  <div className="p-3.5 bg-white border border-slate-200/80 rounded-xl space-y-1">
                    <strong className="text-slate-900">{isEn ? '4. 2FA Simulator' : '4. Simulator 2FA'}</strong>
                    <p className="text-xs text-slate-600">{isEn ? 'Block unauthorized sign-in attempts on mobile.' : 'Tolak cubaan pencerobohan pada skrin telefon pintar.'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Tools & Start Button */}
            <div className="lg:col-span-5 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5">
              <span className="text-sm font-extrabold text-blue-900 block pb-2 border-b border-blue-200/60">
                {isEn ? 'Interactive Tools Available:' : 'Alat Interaktif Disediakan:'}
              </span>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <KeyRound className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'Tactile Passphrase Lab' : 'Makmal Cantuman Frasa'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Combine everyday words and watch the crack time skyrocket to 55,000+ years!'
                      : 'Gabungkan perkataan harian mudah dan saksikan masa pemecahan melonjak ke 55,000+ tahun!'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'Smartphone 2FA Simulator' : 'Simulator 2FA Telefon'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Experience real push notification alerts and block intruders right from your phone.'
                      : 'Alami situasi sebenar menerima amaran log masuk dan sekat penggodam dari telefon anda.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Start Password Workshop' : 'Mulakan Bengkel Kata Laluan'}</span>
                  <ArrowRight className="w-5 h-5" />
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
    2: {
      title: isEn ? 'PHASE 01 / 04' : 'FASA 01 / 04',
      subtitle: isEn ? 'Audit Security of Pak Ali’s 3 Accounts' : 'Audit Keselamatan 3 Akaun Pak Ali'
    },
    3: {
      title: isEn ? 'PHASE 02 / 04' : 'FASA 02 / 04',
      subtitle: isEn ? 'Iron Fortress Passphrase Builder' : 'Makmal Kata Laluan Kubu Besi'
    },
    4: {
      title: isEn ? 'PHASE 03 / 04' : 'FASA 03 / 04',
      subtitle: isEn ? 'Domino Breach Chain Simulation' : 'Simulasi Pencerobohan Berjangkit (Domino)'
    },
    5: {
      title: isEn ? 'PHASE 04 / 04' : 'FASA 04 / 04',
      subtitle: isEn ? 'Smartphone 2FA Simulator & Checklist' : 'Simulator 2FA Telefon & Senarai Perisai'
    }
  };

  const progressPercent = stage === 2 ? 25 : stage === 3 ? 50 : stage === 4 ? 75 : 100;

  const renderTopBar = (currentStageNum: number) => (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs sm:text-sm">
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <Link href="/" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">
            ← {t('nav.backToMenuFriendly')}
          </Link>
          <span className="text-slate-300">|</span>
          <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs">
            {stageTitles[currentStageNum].title}
          </span>
          <span className="font-extrabold text-slate-900 text-sm sm:text-base">
            {stageTitles[currentStageNum].subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleStart}
            title={t('game.resetFromStart')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 text-slate-600 hover:text-red-700 rounded-xl cursor-pointer font-bold text-xs transition-colors min-h-[38px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('game.resetFromStart')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowBadges(!showBadges)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-xl cursor-pointer font-bold text-xs text-amber-900 min-h-[38px]"
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{t('game.badges')} ({badges.filter(b => b.isUnlocked).length}/{badges.length})</span>
          </button>

          <div className="font-extrabold text-slate-900 bg-emerald-50 px-3.5 py-1.5 border border-emerald-200 rounded-xl min-h-[38px] flex items-center text-xs sm:text-sm">
            ⭐ {t('game.score')} <span className="ml-1 text-emerald-800">{totalScore} / 50</span>
          </div>
        </div>
      </div>

      {/* Progress track */}
      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
        <span>{t('game.missionProgress')}</span>
        <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className="font-bold text-slate-800">{progressPercent}%</span>
      </div>
    </div>
  );

  /* =========================================================================
     STAGE 2: INSPECT THE ACCOUNTS
     ========================================================================= */
  if (stage === 2) {
    const activeAcc = initialAccounts.find(a => a.id === activeAccountId) || initialAccounts[0];
    const allAudited = inspectedAccountIds.length === initialAccounts.length;

    return (
      <div className="w-full space-y-5">
        {renderTopBar(2)}

        {showBadges && <BadgesDrawer badges={badges} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: 3 Accounts to Click & Selected Account Report */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900">
                  {isEn ? '1. Tap & Audit Each of Pak Ali’s 3 Accounts' : '1. Tekan & Audit Ketiga-tiga Akaun Pak Ali'}
                </span>
                <span className="font-extrabold bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs">
                  {inspectedAccountIds.length} / 3 {isEn ? 'Audited' : 'Diaudit'}
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
                      className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[120px] shadow-2xs ${
                        isActive
                          ? 'border-blue-600 bg-blue-50/70 shadow-xs ring-2 ring-blue-600/30'
                          : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {acc.serviceType === 'email' && <Mail className="w-5 h-5 text-blue-600" />}
                          {acc.serviceType === 'social' && <Share2 className="w-5 h-5 text-indigo-600" />}
                          {acc.serviceType === 'shopping' && <ShoppingCart className="w-5 h-5 text-amber-600" />}

                          <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                            isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {isChecked ? '✓ Diaudit' : 'Tekan Sini'}
                          </span>
                        </div>

                        <div>
                          <span className="font-bold text-sm sm:text-base text-slate-900 block truncate">{acc.name}</span>
                          <span className="text-xs text-slate-500 block truncate">{acc.identifier}</span>
                        </div>
                      </div>

                      <div className="mt-2 text-xs bg-white p-2 rounded-xl border border-slate-200">
                        <span className="text-slate-500 block text-[11px] font-medium">{isEn ? 'Password:' : 'Kata Laluan:'}</span>
                        <span className="font-bold text-red-700">&ldquo;{acc.currentPassword}&rdquo;</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detailed Inspection Dossier for the active account */}
              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200 text-xs sm:text-sm">
                  <span className="font-extrabold text-slate-900">{isEn ? 'Audit Findings:' : 'Hasil Audit:'} {activeAcc.name}</span>
                  <span className="text-red-700 font-bold bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full text-xs">
                    {isEn ? 'DANGER: REUSED PASSWORD' : 'BAHAYA: KATA LALUAN DIULANG'}
                  </span>
                </div>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeAcc.statusNotes}
                </p>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-slate-500">
              {isEn
                ? 'Tip: Make sure to tap and review all 3 accounts above before continuing.'
                : 'Pesanan: Sila pastikan anda menekan ketiga-tiga akaun di atas sebelum melangkah ke Fasa 2.'}
            </div>
          </div>

          {/* RIGHT COLUMN: Threat Analysis & Mission Action */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900">
                  {isEn ? '2. Security Risk Analysis' : '2. Analisis Risiko Keselamatan'}
                </span>
              </div>

              {/* Warning Alert Box */}
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-red-950">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  <span>{isEn ? 'KEY AUDIT DISCOVERY:' : 'PENEMUAN UTAMA AUDIT:'}</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {isEn ? (
                    <>
                      All 3 of Pak Ali&apos;s digital accounts share the exact same password: <code className="bg-white px-2 py-0.5 rounded border border-red-200 font-bold text-red-700">Kampung123!</code>.
                    </>
                  ) : (
                    <>
                      Ketiga-tiga akaun digital Pak Ali menggunakan kata laluan yang sama iaitu <code className="bg-white px-2 py-0.5 rounded border border-red-200 font-bold text-red-700">Kampung123!</code>.
                    </>
                  )}
                </p>
                <p className="text-xs sm:text-sm leading-relaxed text-red-900">
                  {isEn
                    ? 'If hackers breach even one shopping website, they hold the master key to all of Pak Ali’s email and banking accounts simultaneously!'
                    : 'Jika penjenayah siber berjaya memecahkan satu laman membeli-belah kecil, mereka secara automatik dapat menceroboh semua emel dan akaun perbankan Pak Ali!'}
                </p>
              </div>

              {/* Checklist */}
              <div className="space-y-2 text-xs sm:text-sm">
                <span className="text-slate-500 font-bold uppercase tracking-wider block">
                  {isEn ? 'Audit Progress:' : 'Status Semakan:'}
                </span>
                <div className="space-y-1.5 text-slate-900">
                  {initialAccounts.map(acc => {
                    const done = inspectedAccountIds.includes(acc.id);
                    return (
                      <div key={acc.id} className="flex items-center gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          done ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                        }`}>
                          {done ? '✓' : ''}
                        </span>
                        <span className="font-bold">{acc.name}</span>
                        <span className="ml-auto text-xs text-slate-500 font-medium">
                          {done ? (isEn ? 'Audited' : 'Selesai') : (isEn ? 'Pending' : 'Belum diaudit')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Action Button */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                disabled={!allAudited}
                onClick={handleCompleteAudit}
                className={`w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  allAudited
                    ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer shadow-md hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isEn ? 'Audit Done: Go to Passphrase Lab (+10 Pts) →' : 'Selesai Audit: Ke Makmal Kata Laluan (+10 Mata) →'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 3: PASSWORD LAB & TACTILE PASSPHRASE BUILDER
     ========================================================================= */
  if (stage === 3) {
    return (
      <div className="w-full space-y-5">
        {renderTopBar(3)}

        {showBadges && <BadgesDrawer badges={badges} />}

        <PassphraseBuilderLab
          onPassphraseCompleted={handlePassphraseBuilt}
          onReset={() => {
            setCustomPassphrase(null);
            setLabSubmitted(false);
            setStageScores(prev => ({ ...prev, 3: 0 }));
          }}
        />

        {labSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 sm:p-6 bg-emerald-50 border border-emerald-200 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
          >
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold text-emerald-800 block">
                {isEn ? '✓ Iron Fortress Passphrase Verified (+10 Points)' : '✓ Kata Laluan Kubu Besi Berjaya Disahkan (+10 Mata)'}
              </span>
              <p className="text-sm sm:text-base text-emerald-950 font-medium">
                {isEn ? 'Your Passphrase:' : 'Frasa anda:'} <strong className="bg-white px-2 py-0.5 rounded-lg border border-emerald-200 text-emerald-900">&ldquo;{customPassphrase}&rdquo;</strong> {isEn ? 'is ready to protect Pak Ali’s digital accounts.' : 'kini bersedia untuk melindungi akaun Pak Ali.'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleProceedToDomino}
              className="px-8 py-4 min-h-[52px] rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-lg shrink-0 transition-all"
            >
              <span>{isEn ? 'Test Domino Breach (Phase 03) →' : 'Uji Kesan Domino (Fasa 03) →'}</span>
            </button>
          </motion.div>
        )}
      </div>
    );
  }

  /* =========================================================================
     STAGE 4: DOMINO BREACH SIMULATION
     ========================================================================= */
  if (stage === 4) {
    return (
      <div className="w-full space-y-5">
        {renderTopBar(4)}

        {showBadges && <BadgesDrawer badges={badges} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* LEFT COLUMN: 3 Network Nodes Simulation */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '1. 3-Account Network Domino Simulation' : '1. Simulasi Kesan Domino 3 Akaun'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  dominoStep === 'breached-contained'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : dominoStep === 'breached-all'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {
                    dominoStep === 'breached-contained'
                      ? (isEn ? 'BREACH CONTAINED ✓' : 'KEBOCORAN DISEKAT ✓')
                      : dominoStep === 'breached-all'
                      ? (isEn ? 'ALL ACCOUNTS HIJACKED! ⚠' : 'SEMUA AKAUN DICEROBOH! ⚠')
                      : dominoStep === 'upgraded'
                      ? (isEn ? 'UNIQUE PASSWORDS ASSIGNED' : 'KATA LALUAN UNIK DITETAPKAN')
                      : (isEn ? 'READY FOR TEST' : 'SEDIA UNTUK UJIAN')
                  }
                </span>
              </div>

              {/* 3 Interactive Visual Nodes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Node 1: PasarOnline */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[150px] ${
                  dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                    ? 'border-red-300 bg-red-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                      <span>1. PasarOnline</span>
                      <ShoppingCart className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <span>{isEn ? 'Password:' : 'Kata Laluan:'}</span>
                      <code className="block bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? upgradedPassphrases['acc-shopping']
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-bold text-red-700">
                    {dominoStep === 'breached-all' || dominoStep === 'breached-contained'
                      ? (isEn ? 'DATABASE BREACHED!' : 'PANGKALAN DATA BOCOR!')
                      : (isEn ? 'Initial Breach Point' : 'Punca Pencerobohan')}
                  </div>
                </div>

                {/* Node 2: Social Media */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[150px] ${
                  dominoStep === 'breached-all'
                    ? 'border-red-300 bg-red-50/70'
                    : dominoStep === 'breached-contained'
                    ? 'border-emerald-300 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                      <span>2. {isEn ? 'Social Media' : 'Media Sosial'}</span>
                      <Share2 className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <span>{isEn ? 'Password:' : 'Kata Laluan:'}</span>
                      <code className="block bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? upgradedPassphrases['acc-social']
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-bold">
                    {dominoStep === 'breached-all' && <span className="text-red-700">{isEn ? 'HACKER ENTERED!' : 'PENGGODAM MASUK!'}</span>}
                    {dominoStep === 'breached-contained' && <span className="text-emerald-700">{isEn ? 'SAFE! UNIQUE PASSWORD ✓' : 'SELAMAT! KATA LALUAN BERBEZA ✓'}</span>}
                    {dominoStep === 'initial' && <span className="text-slate-500">{isEn ? 'Reusing Password' : 'Guna Kata Laluan Sama'}</span>}
                    {dominoStep === 'upgraded' && <span className="text-slate-800">{isEn ? 'Upgraded Password' : 'Kata Laluan Baharu'}</span>}
                  </div>
                </div>

                {/* Node 3: Email */}
                <div className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between min-h-[150px] ${
                  dominoStep === 'breached-all'
                    ? 'border-red-300 bg-red-50/70'
                    : dominoStep === 'breached-contained'
                    ? 'border-emerald-300 bg-emerald-50/70'
                    : 'border-slate-200 bg-slate-50'
                }`}>
                  <div>
                    <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-2">
                      <span>3. {isEn ? 'Email & Banking' : 'Emel & Bank'}</span>
                      <Mail className="w-4 h-4 text-slate-700" />
                    </div>
                    <div className="text-xs text-slate-600 space-y-1">
                      <span>{isEn ? 'Password:' : 'Kata Laluan:'}</span>
                      <code className="block bg-white p-1.5 rounded-lg border border-slate-200 font-bold text-slate-900 truncate">
                        {dominoStep === 'upgraded' || dominoStep === 'breached-contained'
                          ? (customPassphrase || upgradedPassphrases['acc-email'])
                          : 'Kampung123!'}
                      </code>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 text-xs font-bold">
                    {dominoStep === 'breached-all' && <span className="text-red-700">{isEn ? 'EMAIL & BANK COMPROMISED!' : 'EMEL & BANK DITAWAN!'}</span>}
                    {dominoStep === 'breached-contained' && <span className="text-emerald-700">{isEn ? 'SAFE! UNIQUE PASSWORD ✓' : 'SELAMAT! KATA LALUAN BERBEZA ✓'}</span>}
                    {dominoStep === 'initial' && <span className="text-slate-500">{isEn ? 'Reusing Password' : 'Guna Kata Laluan Sama'}</span>}
                    {dominoStep === 'upgraded' && <span className="text-slate-800">{isEn ? 'Upgraded Password' : 'Kata Laluan Baharu'}</span>}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-600 leading-relaxed">
              💡 <strong>{isEn ? 'The Domino Effect:' : 'Kesan Domino:'}</strong>{' '}
              {isEn
                ? 'When someone reuses the same password everywhere, a minor website leak exposes confidential banking and email instantly.'
                : 'Apabila seseorang mengulang kata laluan yang sama, kebocoran satu laman membeli-belah kecil membolehkan penipu siber merampas emel dan akaun bank mangsa.'}
            </div>
          </div>

          {/* RIGHT COLUMN: Crisis Control Actions */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900">
                  {isEn ? '2. Incident Control & Action' : '2. Kawalan & Tindakan Pasukan'}
                </span>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-sm text-slate-700 leading-relaxed">
                <span className="font-extrabold text-slate-900 block">
                  {isEn ? 'Team Action Instructions:' : 'Arahan Tindakan Pasukan:'}
                </span>
                {dominoStep === 'initial' && (
                  <p className="text-red-700 font-semibold">
                    {isEn
                      ? 'Press button 1 below to simulate what happens when hackers breach PasarOnline’s database.'
                      : 'Tekan butang 1 di bawah untuk melihat apa yang berlaku apabila penggodam mencuri data PasarOnline.'}
                  </p>
                )}
                {dominoStep === 'breached-all' && (
                  <p className="text-red-700 font-semibold">
                    {isEn
                      ? 'Danger! Hackers entered every account. Press button 2 to assign unique passwords.'
                      : 'Bahaya! Penggodam berjaya masuk ke semua akaun. Tekan butang 2 untuk berikan kata laluan unik bagi setiap akaun.'}
                  </p>
                )}
                {dominoStep === 'upgraded' && (
                  <p className="text-emerald-800 font-semibold">
                    {isEn
                      ? 'Unique passwords assigned! Press button 3 to test if the breach is stopped.'
                      : 'Kata laluan unik telah ditetapkan! Tekan butang 3 untuk menguji sama ada pencerobohan berjaya disekat.'}
                  </p>
                )}
                {dominoStep === 'breached-contained' && (
                  <p className="text-emerald-800 font-semibold">
                    {isEn
                      ? 'Congratulations! The domino effect was neutralized. Pak Ali’s email and banking are safe.'
                      : 'Tahniah! Kesan domino berjaya disekat. Emel dan perbankan Pak Ali kini selamat kerana menggunakan kata laluan berbeza.'}
                  </p>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              {dominoStep === 'initial' && (
                <button
                  type="button"
                  onClick={handleTestDominoBreach}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-sm sm:text-base text-white bg-red-600 hover:bg-red-700 transition-all cursor-pointer shadow-md hover:shadow-lg text-center"
                >
                  {isEn ? '1. Simulate PasarOnline Breach →' : '1. Uji Kebocoran PasarOnline →'}
                </button>
              )}

              {dominoStep === 'breached-all' && (
                <button
                  type="button"
                  onClick={handleApplyUniquePassphrases}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-sm sm:text-base text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg text-center"
                >
                  {isEn ? '2. Assign Unique Passwords to Each Account →' : '2. Berikan Kata Laluan Unik Setiap Akaun →'}
                </button>
              )}

              {dominoStep === 'upgraded' && (
                <button
                  type="button"
                  onClick={handleRetestBreach}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-sm sm:text-base text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-md hover:shadow-lg text-center"
                >
                  {isEn ? '3. Retest Breach (Verify Blockade) →' : '3. Uji Semula (Sahkan Sekatan Berjaya) →'}
                </button>
              )}

              {dominoStep === 'breached-contained' && (
                <button
                  type="button"
                  onClick={handleProceedToChecklist}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Go to Phase 04: 2FA Simulator (+15 Pts) →' : 'Ke Fasa 04: Simulator 2FA (+15 Mata) →'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 5: 2FA SIMULATOR & CHECKLIST
     ========================================================================= */
  if (stage === 5) {
    const defenseScore = Math.min(100, (phone2FASimulated ? 40 : 20) + checkedMeasures.length * 15);

    return (
      <div className="w-full space-y-5">
        {renderTopBar(5)}

        {showBadges && <BadgesDrawer badges={badges} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-6 flex flex-col space-y-4">
            <TwoFactorPhoneSimulator onSuccess={handle2FASuccess} />
          </div>

          <div className="lg:col-span-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900">
                  {isEn ? '2. Account Security Checklist' : '2. Senarai Semak Perlindungan Akaun'}
                </span>
              </div>

              {/* Defense Level Meter */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700">
                    {isEn ? 'Pak Ali’s Account Shield Rating:' : 'Tahap Kekebalan Akaun Pak Ali:'}
                  </span>
                  <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-0.5 rounded-full border border-blue-200">
                    {defenseScore}% {defenseScore >= 90 ? (isEn ? '(FORTIFIED)' : '(KEBAL & KUKUH)') : (isEn ? '(STRENGTHENING)' : '(SEDANG DIKUKUHKAN)')}
                  </span>
                </div>
                <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full transition-all duration-300"
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
                      className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-start gap-3.5 min-h-[60px] shadow-2xs ${
                        isChecked
                          ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
                          : 'bg-white border-slate-200 hover:border-blue-300 text-slate-800'
                      }`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {isChecked ? (
                          <CheckSquare className="w-5 h-5 text-emerald-600" />
                        ) : (
                          <Square className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <span className="font-bold text-sm sm:text-base block">{item.title}</span>
                        <span className="text-xs sm:text-sm text-slate-600 leading-relaxed block mt-0.5">{item.shortDescription}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Complete Workshop CTA */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                type="button"
                disabled={!phone2FASimulated}
                onClick={handleCompleteWorkshop}
                className={`w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${
                  phone2FASimulated
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer shadow-md hover:shadow-lg'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>{isEn ? 'Complete Workshop & View Report (+15 Points) →' : 'Lengkapkan Bengkel & Lihat Keputusan (+15 Mata) →'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 6: MISSION RESULTS
     ========================================================================= */
  return (
    <div className="w-full space-y-6">
      <BadgesDrawer badges={badges} />

      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
              <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {isEn ? 'WORKSHOP REPORT COMPLETE' : 'LAPORAN BENGKEL SELESAI'}
              </span>
              <span className="text-slate-500 font-bold">MISI 02 / KATA LALUAN</span>
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {isEn ? '🎉 Accounts Fortified Successfully!' : '🎉 Semua Akaun Berjaya Dikukuhkan!'}
              </h2>
              <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                {isEn
                  ? 'Your team successfully audited vulnerabilities, built a 4-word iron passphrase, and stopped the credential stuffing domino effect.'
                  : 'Pasukan anda telah berjaya membaiki kelemahan kata laluan, membina frasa laluan Kubu Besi, dan menyekat pencerobohan siber berjangkit.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-4">
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-xs uppercase text-slate-500 block font-bold">
                  {isEn ? 'Passphrase Strength' : 'Kekuatan Kata Laluan'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 mt-1 block">55,000+ Tahun</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-xs uppercase text-slate-500 block font-bold">
                  {isEn ? '2FA Block Test' : 'Ujian Sekatan 2FA'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">Berjaya ✓</span>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                <span className="text-xs uppercase text-slate-500 block font-bold">
                  {isEn ? 'Domino Breach' : 'Kesan Domino'}
                </span>
                <span className="text-xl sm:text-2xl font-black text-emerald-700 mt-1 block">Disekat ✓</span>
              </div>
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs uppercase text-emerald-800 block font-bold">
                  {t('results.totalScore')}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">
                  {totalScore} <span className="text-sm font-normal text-emerald-700">/ 50 Mata</span>
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
            <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 block pb-2 border-b border-slate-200">
              {isEn ? '3 Key Account Protection Rules:' : '3 Prinsip Penting Kata Laluan:'}
            </span>

            <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </span>
                <span>
                  {isEn
                    ? 'Always use unique passphrases for email and banking accounts so a minor leak never affects your life savings.'
                    : 'Sentiasa gunakan kata laluan berbeza untuk emel dan akaun bank supaya kebocoran laman lain tidak menjejaskan duit simpanan.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </span>
                <span>
                  {isEn
                    ? 'Passphrases combining 4 common words (e.g. kucing-hujan-pisang-pantai) are easy to recall but impossible for computers to brute-force crack.'
                    : 'Frasa laluan 4 perkataan mudah (contoh: kucing-hujan-pisang-pantai) senang diingati tetapi mustahil dipecahkan penggodam.'}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </span>
                <span>
                  {isEn
                    ? 'Activate Two-Factor Authentication (2FA) wherever available as an impenetrable second safety lock.'
                    : 'Aktifkan Pengesahan 2 Faktor (2FA) di telefon pintar sebagai kunci pendua yang menyekat penceroboh.'}
                </span>
              </li>
            </ul>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleStart}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t('game.retry')}</span>
              </button>

              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>{t('game.mainMenu')}</span>
              </Link>

              <Link
                href="/challenge/call-scam"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-center"
              >
                <span>{isEn ? 'Mission 03: Call Scams →' : 'Misi 03: Scam Panggilan →'}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
