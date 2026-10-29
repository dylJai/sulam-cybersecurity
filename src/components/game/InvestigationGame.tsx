'use client';

import React, { useState } from 'react';
import { getInvestigationCases } from '@/data/investigation-cases';
import { LinkScannerModal, LinkScanData } from '@/components/game/LinkScannerModal';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
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
  Award,
  Sparkles,
  Info,
  Mail,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';

export const InvestigationGame: React.FC = () => {
  const { language, t } = useLanguage();
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

  React.useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
    };
  }, [currentCaseIndex, stage]);

  const cases = getInvestigationCases(language);
  const currentCase = cases[currentCaseIndex] || cases[0];
  const isEn = language === 'en';

  // Dynamic Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-eagle',
      name: isEn ? 'Eagle Eye' : 'Mata Helang',
      icon: '🦅',
      description: isEn ? 'Spotted more than 8 phishing indicators' : 'Mengesan lebih 8 petunjuk penipuan',
      isUnlocked: totalCluesFound >= 8
    },
    {
      id: 'b-xray',
      name: isEn ? 'X-Ray Specialist' : 'Pakar X-Ray',
      icon: '🔬',
      description: isEn ? 'Used diagnostic link scanner' : 'Menggunakan pengimbas pautan diagnostik',
      isUnlocked: scannerUsed
    },
    {
      id: 'b-shield',
      name: isEn ? 'Phish Blocker' : 'Penyekat Penipuan',
      icon: '🛑',
      description: isEn ? 'Made 4 or more safe decisions' : 'Membuat 4 atau lebih keputusan selamat',
      isUnlocked: correctActionDecisions >= 4
    },
    {
      id: 'b-hero',
      name: isEn ? 'Investigation Hero' : 'Wira Penyiasat',
      icon: '🛡️',
      description: isEn ? 'Completed all 5 phishing cases' : 'Menyelesaikan semua 5 kes siasatan',
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
    playPopSound();
    setSelectedClueIds(prev =>
      prev.includes(clueId) ? prev.filter(id => id !== clueId) : [...prev, clueId]
    );
  };

  const handleOpenScanner = (url: string) => {
    playPopSound();
    setScannerUsed(true);
    setActiveScanData({
      url,
      protocol: url.startsWith('https://') ? 'https' : 'http',
      domain: url.replace(/^https?:\/\//, '').split('/')[0],
      country: 'Kuala Lumpur / Offshore Hosting',
      riskScore: 92,
      verdict: isEn
        ? 'MALICIOUS PHISHING DOMAIN: Registered less than 48 hours ago to spoof official agencies.'
        : 'DOMAIN PENIPUAN BERBAHAYA: Baru didaftarkan kurang 48 jam lalu untuk meniru agensi rasmi.',
      redFlags: [
        isEn ? 'Non-standard domain extension (.xyz / .cc)' : 'Sambungan domain ganjil (.xyz / .cc)',
        isEn ? 'Domain mimics official brand name with typo' : 'Meniru nama jenama rasmi dengan sedikit ejaan berbeza',
        isEn ? 'Hidden redirect to credential-stealing login form' : 'Pautan tersembunyi yang mencuri kata laluan'
      ]
    });
  };

  const handleSubmitFindings = () => {
    if (isFindingsSubmitted) return;
    setIsFindingsSubmitted(true);

    const actualClueCount = currentCase.clues.filter(c => c.isSuspicious).length;
    setTotalPossibleClues(prev => prev + actualClueCount);

    let scoreForThisStep = 0;
    let foundCorrectCount = 0;

    currentCase.clues.forEach(clue => {
      const isSelected = selectedClueIds.includes(clue.id);
      if (clue.isSuspicious && isSelected) {
        scoreForThisStep += 2.5;
        foundCorrectCount += 1;
      } else if (!clue.isSuspicious && isSelected) {
        scoreForThisStep = Math.max(0, scoreForThisStep - 1);
      }
    });

    if (foundCorrectCount > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

    setCaseClueScore(Math.round(scoreForThisStep));
    setTotalCluesFound(prev => prev + foundCorrectCount);
    setTotalScore(prev => prev + Math.round(scoreForThisStep));
  };

  const handleSelectAction = (actionId: string) => {
    if (isActionSubmitted) return;
    playPopSound();
    setSelectedActionId(actionId);
  };

  const handleSubmitAction = () => {
    if (!selectedActionId || isActionSubmitted) return;
    setIsActionSubmitted(true);

    const chosenAction = currentCase.actions.find(a => a.id === selectedActionId);
    if (chosenAction?.isSafe) {
      playSuccessChime();
      setCorrectActionDecisions(prev => prev + 1);
      setTotalScore(prev => prev + 5);
    } else {
      playWarningTone();
    }
  };

  const handleNextCase = () => {
    playPopSound();
    if (currentCaseIndex + 1 < cases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      const finalScore = Math.min(50, totalScore);
      saveChallengeResult('phishing', finalScore, 50);
      triggerCelebration();
      setStage('results');
    }
  };

  const linkClue = currentCase?.clues.find(
    c => c.targetText.startsWith('http') || c.targetText.includes('.xyz') || c.targetText.includes('.cc')
  );

  /* =========================================================================
     STAGE 1: MISSION BRIEFING
     ========================================================================= */
  if (stage === 'briefing') {
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
            {/* Left side: Context & Scenario */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs">
                  {isEn ? 'MISSION 01' : 'MISI 01'}
                </span>
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {isEn ? '⏱️ 5-7 Mins • 50 Points' : '⏱️ 5-7 Minit • 50 Mata'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {t('m1.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {isEn
                  ? 'Suspicious messages frequently flood our community SMS inboxes and WhatsApp. Your team’s mission is to inspect the clues, detect red flags, and make the safest response decisions.'
                  : 'Mesej mencurigakan mula membanjiri peti masuk SMS dan WhatsApp komuniti kita. Tugas pasukan anda adalah meneliti bukti pada mesej, mengesan tanda bahaya, dan memilih tindakan paling selamat.'}
              </p>

              <div className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                  {isEn ? '📋 3 Easy Steps in this Mission:' : '📋 3 Panduan Mudah Menjalankan Misi Ini:'}
                </span>
                <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      1
                    </span>
                    <span>
                      <strong>{isEn ? 'Inspect Evidence (Left):' : 'Teliti Bukti di Sebelah Kiri:'}</strong>{' '}
                      {isEn ? 'Read the simulated SMS or email message carefully.' : 'Baca contoh SMS atau emel yang disyaki dengan tenang.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      2
                    </span>
                    <span>
                      <strong>{isEn ? 'Mark Red Flags (Right):' : 'Tandakan Tanda Bahaya di Sebelah Kanan:'}</strong>{' '}
                      {isEn ? 'Click only on the suspicious parts (links, urgency, strange phone numbers).' : 'Klik bahagian yang mencurigakan (pautan pelik, ugutan masa, fail luar).'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      3
                    </span>
                    <span>
                      <strong>{isEn ? 'Decide Safe Action:' : 'Pilih Tindakan Selamat:'}</strong>{' '}
                      {isEn ? 'Select what to do next to protect your money and identity.' : 'Pilih satu keputusan terbaik untuk menyelamatkan simpanan anda.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tools & Start CTA */}
            <div className="lg:col-span-5 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5">
              <span className="text-sm font-extrabold text-blue-900 block pb-2 border-b border-blue-200/60">
                {isEn ? 'Special Station Tools Provided:' : 'Alat Bantuan Khas Stesen Ini:'}
              </span>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Globe className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'Diagnostic X-Ray Link Scanner' : 'Pengimbas Pautan X-Ray'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Inspect threat ratings and fake registration records of suspicious domains.'
                      : 'Boleh digunakan bila-bila masa untuk memeriksa sama ada pautan itu palsu atau berbahaya.'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'Team Investigation Badges' : 'Lencana Kejayaan Pasukan'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Unlock 4 special badges including Eagle Eye & Phish Blocker.'
                      : 'Kumpul 4 lencana khas termasuk Mata Helang & Penyekat Penipuan.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStartMission}
                  className="w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Start Mission 01 Now' : 'Mulakan Misi 01 Sekarang'}</span>
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
     STAGE 3: MISSION RESULTS
     ========================================================================= */
  if (stage === 'results') {
    return (
      <div className="w-full space-y-6">
        <BadgesDrawer badges={badges} />

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Summary & Stats */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isEn ? 'INVESTIGATION REPORT COMPLETE' : 'LAPORAN SIASATAN SELESAI'}
                </span>
                <span className="text-slate-500 font-bold">MISI 01 / SMS & EMEL</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isEn ? '🎉 Mission Completed Successfully!' : '🎉 Siasatan Berjaya Dilengkapkan!'}
                </h2>
                <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                  {isEn
                    ? 'Your team completed investigating all 5 suspicious message scenarios, used the X-Ray scanner, and protected sensitive data.'
                    : 'Pasukan anda telah selesai menyiasat kesemua 5 senario mesej mencurigakan, menggunakan alat diagnostik X-Ray, dan berjaya melindungi data peribadi.'}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">
                    {t('results.scenariosTested')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">5 / 5</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">
                    {t('results.cluesFound')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">
                    {totalCluesFound} <span className="text-sm font-normal text-slate-500">/ {totalPossibleClues}</span>
                  </span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">
                    {t('results.safeDecisions')}
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{correctActionDecisions} / 5</span>
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

            {/* Right: Key Lessons & Navigation Actions */}
            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 block pb-2 border-b border-slate-200">
                {isEn ? '3 Golden Community Defense Rules:' : '3 Pesanan Emas Komuniti:'}
              </span>

              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Never click links asking for small fee payments or parcel delivery rescheduling via random SMS.'
                      : 'Jangan sesekali tekan pautan bayaran caj kecil atau kurier melalui SMS rawak.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Banks in Malaysia never send TAC confirmation links or login prompts via SMS.'
                      : 'Pihak bank di Malaysia tidak lagi menghantar pautan pengesahan TAC atau kata laluan melalui SMS.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    {isEn
                      ? 'Never install application (.apk) files from prize-winning or cash aid grant emails.'
                      : 'Jangan pasang fail aplikasi (.apk) daripada emel bantuan wang tunai atau hadiah percuma.'}
                  </span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStartMission}
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
                  href="/challenge/passwords"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-center"
                >
                  <span>{isEn ? 'Mission 02: Passwords →' : 'Misi 02: Kata Laluan →'}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 2: INTERACTIVE INVESTIGATION (SPLIT SCREEN)
     ========================================================================= */
  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);

  return (
    <div className="w-full space-y-5">
      {/* Top Navigation & Status Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link
              href="/"
              className="text-slate-600 hover:text-blue-600 font-bold transition-colors"
            >
              ← {t('nav.backToMenuFriendly')}
            </Link>
            <span className="text-slate-300">|</span>
            <span className="font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100 text-xs">
              {t('game.case')} 0{currentCaseIndex + 1} / 0{cases.length}
            </span>
            <span className="font-extrabold text-slate-900 text-sm sm:text-base">
              {currentCase.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleStartMission}
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
              <Award className="w-4 h-4 text-amber-600" />
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
              style={{ width: `${((currentCaseIndex + 1) / cases.length) * 100}%` }}
            />
          </div>
          <span className="font-bold text-slate-800">
            {Math.round(((currentCaseIndex + 1) / cases.length) * 100)}%
          </span>
        </div>
      </div>

      {/* Badges Drawer if toggled */}
      {showBadges && (
        <div className="pt-1">
          <BadgesDrawer badges={badges} />
        </div>
      )}

      {/* Main Two-Column Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ===================================================================
            LEFT COLUMN: THE QUESTION & EVIDENCE TO INVESTIGATE (Cols 1-7)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <Search className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '1. Inspect Evidence (Message)' : '1. Teliti Bahan Bukti (Mesej)'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-full font-bold text-xs">
                    {currentCase.format === 'email' ? (isEn ? '✉️ Email' : '✉️ Emel') : (isEn ? '💬 Phone SMS' : '💬 SMS Telefon')}
                  </span>
                  {currentCase.urgencyBadge && (
                    <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                      {currentCase.urgencyBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Scenario Context */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl mb-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-blue-900 font-bold">{isEn ? 'Situation:' : 'Situasi:'}</strong> {currentCase.scenarioContext}
              </div>

              {/* Prominent Link X-Ray Scanner Action if available */}
              {linkClue && (
                <div className="mb-4 p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-amber-400 shrink-0" />
                    <span className="text-xs sm:text-sm text-slate-200 font-medium">
                      {isEn ? 'Link Detected:' : 'Pautan Dikesan:'}{' '}
                      <code className="text-amber-300 font-bold bg-slate-800 px-2 py-0.5 rounded">{linkClue.targetText}</code>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenScanner(linkClue.targetText)}
                    className="px-4 py-2 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs rounded-xl cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>{isEn ? 'Scan with X-Ray' : 'Imbas Pautan X-Ray'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Realistic Message Simulation */}
              {currentCase.format === 'email' ? (
                /* EMAIL INTERFACE */
                <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
                  <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-slate-800">
                        {isEn ? 'Official Inbox Simulator' : 'Peti Masuk Emel'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <VoiceOverButton
                        text={`${currentCase.subject ? currentCase.subject + '. ' : ''}${currentCase.body}`}
                        variant="badge"
                      />
                      <span className="text-slate-500">{currentCase.receivedTime}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50/70 border-b border-slate-100 space-y-2 text-xs sm:text-sm">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-500 w-20 shrink-0">
                        {isEn ? 'From:' : 'Daripada:'}
                      </span>
                      <span className="font-bold text-slate-900">{currentCase.sender}</span>
                      {currentCase.senderAddress && (
                        <code className="text-xs bg-red-50 text-red-700 px-2 py-0.5 border border-red-200 font-mono rounded-lg">
                          &lt;{currentCase.senderAddress}&gt;
                        </code>
                      )}
                    </div>
                    {currentCase.subject && (
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-500 w-20 shrink-0">
                          {isEn ? 'Subject:' : 'Perkara:'}
                        </span>
                        <span className="font-extrabold text-slate-900">{currentCase.subject}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line space-y-4 bg-white">
                    <p>{currentCase.body}</p>

                    {currentCase.attachmentName && (
                      <div className="mt-4 p-4 rounded-xl border border-red-200 bg-red-50/70 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                            <Paperclip className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-sm font-bold text-red-900">{currentCase.attachmentName}</div>
                            <div className="text-xs text-slate-600">
                              {isEn ? 'Dangerous App Package (.apk)' : 'Lampiran Fail Luar (.apk)'}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-red-700 bg-white px-2.5 py-1 rounded-full border border-red-200">
                          {isEn ? 'MALWARE RISK' : 'BERISIKO TINGGI'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* REALISTIC SMS PHONE INTERFACE */
                <div className="max-w-md mx-auto rounded-3xl border-4 border-slate-800 bg-slate-900 text-white p-5 shadow-lg space-y-4 font-sans">
                  <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                    <span>10:42 AM</span>
                    <div className="flex items-center gap-2">
                      <VoiceOverButton
                        text={currentCase.body}
                        variant="badge"
                      />
                      <span>5G</span>
                      <span>92% 🔋</span>
                    </div>
                  </div>

                  <div className="text-center pb-2 border-b border-slate-800">
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-base mb-1 shadow-sm">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <div className="text-base font-bold text-white">{currentCase.sender}</div>
                    <div className="text-xs text-slate-400">
                      {isEn ? 'Incoming SMS Message' : 'Mesej SMS Masuk'}
                    </div>
                  </div>

                  <div className="bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-slate-100 leading-relaxed shadow-xs space-y-2">
                    <p className="whitespace-pre-line">{currentCase.body}</p>
                    <div className="text-right">
                      <span className="text-xs text-slate-400">{currentCase.receivedTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-500 flex items-center justify-between">
              <span>{isEn ? 'Now answer the question on the right →' : 'Seterusnya, jawab soalan di sebelah kanan →'}</span>
              <span className="font-bold text-slate-800">{isEn ? `${currentCase.clues.length} clues to review` : `${currentCase.clues.length} petunjuk disiasat`}</span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: QUESTIONS, CLUES & DECISIONS (Cols 8-12)
            =================================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-1">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '2. Answer & Action' : '2. Jawab & Buat Keputusan'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  isFindingsSubmitted
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {!isFindingsSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Content Area: Step 1 or Step 2 */}
            <div className="space-y-4 flex-1">
              {!isFindingsSubmitted ? (
                /* STEP 1: CLUES SELECTION */
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {isEn ? 'Step 1: Mark ONLY Suspicious Red Flags' : 'Langkah 1: Tandakan HANYA Tanda-tanda Bahaya'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {isEn
                        ? 'Based on the message on the left, mark the phrases that look dangerous. Some options below are completely normal and DO NOT need marking!'
                        : 'Berdasarkan mesej di sebelah kiri, tandakan bahagian yang meragukan. Berhati-hati: pilihan tertentu adalah ayat biasa yang TIDAK perlu ditandakan!'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentCase.clues.map((clue) => {
                      const isMarked = selectedClueIds.includes(clue.id);

                      return (
                        <button
                          key={clue.id}
                          type="button"
                          onClick={() => handleToggleClue(clue.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[56px] shadow-2xs ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className="min-w-0 pr-2">
                            <span className="text-sm sm:text-base block">
                              &ldquo;{clue.targetText}&rdquo;
                            </span>
                          </div>
                          <span className={`shrink-0 text-xs font-extrabold px-3 py-1 rounded-full border transition-colors ${
                            isMarked
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {isMarked ? t('game.marked') : t('game.mark')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* STEP 2: ACTION DECISION */
                <div className="space-y-4">
                  {/* Detailed Clues Review Breakdown Box */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between text-xs sm:text-sm pb-2 border-b border-slate-200 font-bold text-slate-900">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isEn ? 'Review of Clues:' : 'Hasil Semakan Tanda Bahaya:'}</span>
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-xs">
                        +{caseClueScore} Mata
                      </span>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      {currentCase.clues.map(c => {
                        const isMarked = selectedClueIds.includes(c.id);
                        const isCorrectSelection = (c.isSuspicious && isMarked) || (!c.isSuspicious && !isMarked);

                        return (
                          <div
                            key={c.id}
                            className={`p-3 rounded-xl border text-xs sm:text-sm leading-relaxed ${
                              isCorrectSelection
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                                : 'bg-red-50/70 border-red-200 text-red-950'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold mb-1">
                              <span>&ldquo;{c.targetText}&rdquo;</span>
                              <span>{isCorrectSelection ? '✓ Tepat' : '⚠ Perlu Diperbaiki'}</span>
                            </div>
                            <p className="text-xs text-slate-700">{c.explanation}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2 Decision */}
                  <div className="space-y-3 pt-2">
                    <div>
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                        {t('game.step2HeaderFriendly')}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1">
                        {t('game.step2Sub')}
                      </p>
                    </div>

                    <div className="space-y-2.5">
                      {currentCase.actions.map(action => {
                        const isChosen = selectedActionId === action.id;

                        return (
                          <button
                            key={action.id}
                            type="button"
                            disabled={isActionSubmitted}
                            onClick={() => handleSelectAction(action.id)}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[60px] shadow-2xs ${
                              isChosen
                                ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                            } ${isActionSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <span className="font-extrabold text-sm sm:text-base block">
                                  {action.title}
                                </span>
                                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                  {action.description}
                                </p>
                              </div>
                              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                isChosen ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                              }`}>
                                {isChosen && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Feedback if action submitted */}
                    {isActionSubmitted && activeAction && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-2xl border-2 space-y-1.5 ${
                          activeAction.isSafe
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                            : 'bg-red-50 border-red-300 text-red-950'
                        }`}
                      >
                        <div className="flex items-center gap-2 font-black text-sm sm:text-base">
                          {activeAction.isSafe ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                          <span>
                            {activeAction.isSafe
                              ? (isEn ? 'EXCELLENT & SAFE DECISION (+5 PTS)' : 'TAHNIAH! KEPUTUSAN PALING TEPAT (+5 MATA)')
                              : (isEn ? 'HIGH RISK ACTION!' : 'BAHAYA! TINDAKAN BERISIKO TINGGI!')}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">{activeAction.consequence}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Step Actions */}
            <div className="pt-4 border-t border-slate-100">
              {!isFindingsSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitFindings}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>{t('game.submitStep1')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : !isActionSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedActionId}
                  onClick={handleSubmitAction}
                  className={`w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
                    selectedActionId
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer shadow-md hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Check className="w-5 h-5" />
                  <span>{t('game.submitStep2')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCase}
                  className="w-full py-4 px-6 min-h-[52px] rounded-2xl font-bold text-base text-white bg-blue-600 hover:bg-blue-700 transition-all cursor-pointer shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>
                    {currentCaseIndex + 1 < cases.length
                      ? `${t('game.nextScenario')} (${currentCaseIndex + 2}/${cases.length}) →`
                      : t('game.viewFinalReport')}
                  </span>
                  <ArrowRight className="w-5 h-5" />
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
