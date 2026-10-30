'use client';

import React, { useState } from 'react';
import { getInvestmentScamCases, InvestmentScamCase, getRealWorldInvestmentStories, RealWorldInvestmentStory } from '@/data/investment-scam-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import {
  TrendingUp,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
  Home,
  Award,
  BookOpen,
  X,
  MessageCircle
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';

export const InvestmentScamGame: React.FC = () => {
  const { language, t } = useLanguage();
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Per-case state
  const [selectedFlagIds, setSelectedFlagIds] = useState<string[]>([]);
  const [isFlagsSubmitted, setIsFlagsSubmitted] = useState<boolean>(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isActionSubmitted, setIsActionSubmitted] = useState<boolean>(false);
  const [flagScore, setFlagScore] = useState<number>(0);
  const [showScAlert, setShowScAlert] = useState<boolean>(false);
  const [scAlertChecked, setScAlertChecked] = useState<boolean>(false);
  const [showRealStoryModal, setShowRealStoryModal] = useState<boolean>(false);

  // Cumulative performance
  const [totalFlagsFound, setTotalFlagsFound] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  React.useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
    };
  }, [currentCaseIndex, stage]);

  const cases = getInvestmentScamCases(language);
  const currentCase: InvestmentScamCase = cases[currentCaseIndex] || cases[0];
  const isEn = language === 'en';

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-sc-regulator',
      name: isEn ? 'SC Alert Analyst' : 'Penganalisis SC Alert',
      icon: '🏛️',
      description: isEn ? 'Checked entities against SC Malaysia Investor Alert List' : 'Menyemak status lesen syarikat di Senarai Peringatan Pelabur SC',
      isUnlocked: scAlertChecked
    },
    {
      id: 'b-ponzi-buster',
      name: isEn ? 'Ponzi Buster' : 'Penumpas Skim Ponzi',
      icon: '📉',
      description: isEn ? 'Spotted unreal 500% ROI & withdrawal fee extortion traps' : 'Membongkar janji untung 500% dan perangkap wang pengeluaran',
      isUnlocked: totalFlagsFound >= 6
    },
    {
      id: 'b-telegram-guard',
      name: isEn ? 'Telegram Shield' : 'Perisai Kumpulan Telegram',
      icon: '🛡️',
      description: isEn ? 'Refused to transfer money into unverified personal mule accounts' : 'Menolak pindahan wang ke akaun peribadi keldai sindiket',
      isUnlocked: correctActionDecisions >= 2
    },
    {
      id: 'b-investment-master',
      name: isEn ? 'Smart Investor' : 'Pelabur Bijak Komuniti',
      icon: '⭐',
      description: isEn ? 'Completed all 3 investment scam investigation cases' : 'Menyelesaikan semua 3 kes siasatan skim pelaburan palsu',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalFlagsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setScAlertChecked(false);
  };

  const resetCaseState = () => {
    setSelectedFlagIds([]);
    setIsFlagsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setFlagScore(0);
    setShowScAlert(false);
  };

  const handleToggleFlag = (flagId: string) => {
    if (isFlagsSubmitted) return;
    playPopSound();
    setSelectedFlagIds(prev =>
      prev.includes(flagId) ? prev.filter(id => id !== flagId) : [...prev, flagId]
    );
  };

  const handleCheckScAlert = () => {
    playSuccessChime();
    setShowScAlert(true);
    setScAlertChecked(true);
  };

  const handleSubmitFlags = () => {
    if (isFlagsSubmitted) return;
    setIsFlagsSubmitted(true);

    let score = 0;
    let correctlyIdentified = 0;

    currentCase.redFlags.forEach(f => {
      const isSelected = selectedFlagIds.includes(f.id);
      if (f.isRedFlag && isSelected) {
        score += 4;
        correctlyIdentified += 1;
      } else if (!f.isRedFlag && isSelected) {
        score = Math.max(0, score - 2);
      }
    });

    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

    const finalScore = Math.min(12, score);
    setFlagScore(finalScore);
    setTotalFlagsFound(prev => prev + correctlyIdentified);
    setTotalScore(prev => prev + finalScore);
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
      setTotalScore(prev => prev + 4.6);
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
      const finalScore = Math.min(50, Math.round(totalScore));
      saveChallengeResult('investment-scam', finalScore, 50);
      triggerCelebration();
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
                  {isEn ? 'MISSION 05' : 'MISI 05'}
                </span>
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {isEn ? '⏱️ 5-7 Mins • 50 Points' : '⏱️ 5-7 Minit • 50 Mata'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {t('m5.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {isEn
                  ? 'Syndicates add victims into Telegram groups promising 500% profits in 24 hours. Learn how to spot fake profit screenshots, inspect the Securities Commission (SC) Investor Alert List, and avoid the withdrawal fee extortion trap.'
                  : 'Sindiket memasukkan orang ramai ke dalam kumpulan Telegram yang menjanjikan keuntungan 500% dalam 24 jam. Ketahui cara mengesan tangkap layar keuntungan palsu, menyemak Senarai Peringatan Pelabur SC Malaysia, dan mengelak perangkap caj pengeluaran.'}
              </p>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                  {isEn ? '📋 3 Core Steps in This Mission:' : '📋 3 Langkah Mudah Membongkar Pelaburan Palsu:'}
                </span>
                <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      1
                    </span>
                    <span>
                      <strong>{isEn ? 'Inspect Unrealistic ROI:' : 'Teliti Janji Keuntungan Tidak Masuk Akal:'}</strong>{' '}
                      {isEn ? 'If an investment promises guaranteed high returns with zero risk, it is 100% a scam!' : 'Jika pelaburan menjanjikan pulangan ribuan ringgit tanpa sebarang risiko kerugian, ia pasti 100% penipuan!'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      2
                    </span>
                    <span>
                      <strong>{isEn ? 'Check Securities Commission (SC) Alert List:' : 'Semak Senarai Amaran SC Malaysia:'}</strong>{' '}
                      {isEn ? 'Unlicensed companies operate illegally and cannot hold public investment funds.' : 'Syarikat yang tidak berlesen beroperasi secara haram dan dilarang memegang wang pelaburan awam.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      3
                    </span>
                    <span>
                      <strong>{isEn ? 'Never Pay "Withdrawal Fees":' : 'Jangan Bayar "Wang Proses Pengeluaran":'}</strong>{' '}
                      {isEn ? 'Legitimate investments deduct fees automatically from profits, never demanding extra deposits.' : 'Pelaburan sah menolak caj terus daripada untung, bukannya meminta anda memasukkan duit simpanan tambahan.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tools & Start CTA */}
            <div className="lg:col-span-5 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5">
              <span className="text-sm font-extrabold text-blue-900 block pb-2 border-b border-blue-200/60">
                {isEn ? 'Special Station Tools:' : 'Alat Siasatan Stesen:'}
              </span>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'SC Malaysia Investor Alert Tool' : 'Alat Semakan Amaran Pelabur SC'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn ? 'Verify if the scheme is officially blacklisted by the Securities Commission.' : 'Periksa sama ada skim ini tersenarai dalam senarai amaran hitam Suruhanjaya Sekuriti.'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'Real Verified Victim Reports' : 'Kes Sebenar Mangsa di Malaysia'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn ? 'Read real police reports of victims who lost life savings to fake Telegram gold and forex schemes.' : 'Ketahui kisah benar mangsa yang terpedaya dengan skim pelaburan emas dan kripto palsu di Telegram.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Start Investment Scam Mission' : 'Mulakan Misi Pelaburan Palsu'}</span>
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
     STAGE 3: RESULTS
     ========================================================================= */
  if (stage === 'results') {
    return (
      <div className="w-full space-y-6">
        <BadgesDrawer badges={badges} />

        <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  {isEn ? 'MISSION 05 REPORT COMPLETE' : 'LAPORAN MISI 05 SELESAI'}
                </span>
                <span className="text-slate-500 font-bold">{isEn ? 'INVESTMENT FRAUD DEFENSE' : 'PERISAI PELABURAN PALSU'}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isEn ? '🎉 Investment Scams Busted!' : '🎉 Skim Pelaburan Palsu Berjaya Ditumpaskan!'}
                </h2>
                <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                  {isEn
                    ? 'Your team successfully identified unrealistic ROI traps, used the SC Investor Alert List, and rejected extortionate withdrawal fee demands.'
                    : 'Pasukan anda berjaya mengesan jerat keuntungan palsu, menggunakan Senarai Peringatan Pelabur SC, dan menolak bayaran caj pengeluaran penipu.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.scenariosTested')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">3 / 3</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{isEn ? 'Red Flags Spotted' : 'Tanda Bahaya Dikesan'}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{totalFlagsFound}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.safeDecisions')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{correctActionDecisions} / 3</span>
                </div>
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                  <span className="text-xs uppercase text-emerald-800 block font-bold">{t('results.totalScore')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-900 mt-1 block">
                    {Math.min(50, Math.round(totalScore))} <span className="text-sm font-normal text-emerald-700">/ 50 Mata</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-7 space-y-6">
              <span className="text-sm font-extrabold uppercase tracking-wider text-slate-900 block pb-2 border-b border-slate-200">
                {isEn ? 'Securities Commission (SC) Advice:' : 'Nasihat Suruhanjaya Sekuriti (SC):'}
              </span>

              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'No Guaranteed 500% ROI:' : 'Tiada Pelaburan Untung 500% Tanpa Risiko:'}</strong> {isEn ? 'Every genuine investment carries market risk. High guaranteed return promises are always fraudulent.' : 'Setiap pelaburan sah mempunyai risiko pasaran. Janji pulangan berganda tanpa risiko rugi adalah tipu helah 100%.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'Never Transfer to Personal Bank Accounts:' : 'Jangan Pindah Wang ke Akaun Individu:'}</strong> {isEn ? 'Licensed brokers and unit trusts never ask for deposits into individual "agent" accounts.' : 'Syarikat pelaburan berlesen tidak pernah meminta anda mendepositkan wang ke akaun bank peribadi individu.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'Refuse "Tax" or "Processing" Fees:' : 'Tolak Tuntutan Duit Tambahan untuk Keluarkan Untung:'}</strong> {isEn ? 'If they demand you pay thousands to release your funds, you are being extorted.' : 'Jika mereka meminta anda memasukkan ribuan ringgit lagi kononnya untuk kos pengeluaran, itu adalah pemerasan berterusan.'}</span>
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
                  href="/challenge/social-privacy"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-center"
                >
                  <span>{isEn ? 'Mission 06: Social Privacy →' : 'Misi 06: Privasi & Klon AI →'}</span>
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
  const progressPercent = Math.round(((currentCaseIndex + 1) / cases.length) * 100);

  return (
    <div className="w-full space-y-5">
      {/* Top Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs sm:text-sm">
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Link href="/" className="text-slate-600 hover:text-blue-600 font-bold transition-colors">
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
              ⭐ {t('game.score')} <span className="ml-1 text-emerald-800">{Math.round(totalScore)} / 50</span>
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

      {showBadges && <BadgesDrawer badges={badges} />}

      {/* Real Case Modal */}
      <AnimatePresence>
        {showRealStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="bg-red-100 text-red-800 font-bold text-xs px-3 py-1 rounded-full border border-red-200">
                    {isEn ? 'VERIFIED MALAYSIAN CASE' : 'KES SEBENAR DI MALAYSIA'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Suruhanjaya Sekuriti Malaysia (SC)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  className="p-1.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentCase.realCaseExample?.headline || getRealWorldInvestmentStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mt-2">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-red-700 font-extrabold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    {isEn ? 'Loss Amount:' : 'Jumlah Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-sm leading-relaxed text-slate-800">
                <strong className="block text-slate-900 font-bold">
                  {isEn ? 'Syndicate Modus Operandi:' : 'Modus Operandi Sindiket:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-sm text-red-950">
                <strong className="block font-bold">
                  {isEn ? 'Withdrawal Fee Extortion Trap:' : 'Perangkap Wang Pengeluaran:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-sm text-emerald-950">
                <strong className="block font-bold">
                  {isEn ? '💡 Securities Commission (SC) Advice:' : '💡 Nasihat Pakar Suruhanjaya Sekuriti (SC):'}
                </strong>
                <p>{currentCase.realCaseExample?.preventionTip}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  className="px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-sm min-h-[46px]"
                >
                  {t('game.closeModal')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Telegram Group Simulation & ROI Promise */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-red-600" />
                  <span>{isEn ? '1. Inspect Scheme & Chat Group' : '1. Teliti Skim & Perbualan Kumpulan'}</span>
                </span>
                <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {currentCase.schemeName}
                </span>
              </div>

              {/* Lure Context Box */}
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 block">
                  {isEn ? 'Promised Return (ROI):' : 'Janji Keuntungan (ROI):'}
                </span>
                <div className="font-black text-lg sm:text-xl text-red-700">
                  {currentCase.promisedRoi}
                </div>
                <div className="text-xs sm:text-sm text-slate-600">
                  {isEn ? 'Initial Deposit: ' : 'Syarat Modal: '}{currentCase.depositRequired}
                </div>
              </div>

              {/* Simulated Telegram Group Feed */}
              <div className="rounded-2xl border-2 border-slate-800 bg-slate-950 text-white p-4 sm:p-5 space-y-3.5 shadow-lg">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-extrabold text-white text-sm">{currentCase.schemeName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <VoiceOverButton
                      audioSrc={isEn ? `/audio/voice-over/invest-scam-${currentCaseIndex + 1}-en.m4a` : `/audio/voice-over/invest-scam-${currentCaseIndex + 1}-ms.m4a`}
                      text={currentCase.chatTranscript[0]?.text || currentCase.schemeName}
                      label={isEn ? 'Listen to Pitch' : 'Dengar Pitch Sindiket'}
                      variant="badge"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRealStoryModal(true)}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-lg text-amber-300 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t('game.realStoryBtn')}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {currentCase.chatTranscript.map((msg, i) => (
                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className={`font-bold ${msg.isBot ? 'text-amber-400' : 'text-blue-400'}`}>
                          {msg.sender}
                        </span>
                        {msg.isBot && (
                          <span className="text-[10px] text-slate-400">
                            {isEn ? '[Suspected Bot/Syndicate]' : '[Disyaki Bot / Sindiket]'}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-100 leading-relaxed text-xs sm:text-sm">
                        {msg.text}
                      </p>
                    </div>
                  ))}

                  {/* Animated typing indicator */}
                  <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-xl text-xs text-amber-300/80">
                    <span className="font-semibold">{isEn ? 'Admin is typing' : 'Admin sedang menaip'}</span>
                    <div className="flex items-center gap-1">
                      <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                      />
                      <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                      />
                      <motion.span
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                        className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SC Alert List Tool Action */}
            <div className="pt-2">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm text-amber-400 font-bold block flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>{isEn ? 'SC Malaysia Investor Alert List' : 'Senarai Peringatan Pelabur SC Malaysia'}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    {isEn ? 'Check if scheme ' : 'Semak sama ada '}<code className="text-amber-300 font-bold">{currentCase.schemeName}</code>{isEn ? ' is licensed or blacklisted.' : ' berlesen atau disenarai hitam.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCheckScAlert}
                  className="px-4 py-2 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs rounded-xl cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>{isEn ? 'Check in SC Alert List' : 'Semak di SC Alert List'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SC Alert Result Box if clicked */}
              {showScAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-red-50 border border-red-300 rounded-2xl space-y-2 text-red-950 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-red-200 font-bold">
                    <span className="flex items-center gap-1.5 text-red-800">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>{isEn ? 'SC INVESTOR ALERT LIST RESULT:' : 'HASIL SEMAKAN SC INVESTOR ALERT LIST:'}</span>
                    </span>
                    <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                      {isEn ? 'WARNING: UNLICENSED' : 'AMARAN: TIDAK BERLESEN'}
                    </span>
                  </div>
                  <p>
                    {isEn ? 'Entity: ' : 'Entiti: '}<strong>{currentCase.scAlertListRecord.entityName}</strong>
                  </p>
                  <p className="text-xs text-slate-700">
                    {currentCase.scAlertListRecord.reason}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Red Flags Checklist & Decisions */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '2. Red Flags Analysis & Actions' : '2. Analisis Tanda Amaran & Tindakan'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  isFlagsSubmitted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {!isFlagsSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Step 1 or Step 2 */}
            <div className="space-y-4 flex-1">
              {!isFlagsSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {isEn ? 'Step 1: Mark Investment Scam Red Flags' : 'Langkah 1: Tandakan Ciri-Ciri Skim Penipuan'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {isEn
                        ? 'Based on the scheme on the left, mark only investment red flags:'
                        : 'Berdasarkan skim di sebelah kiri, tandakan ciri-ciri penipuan pelaburan / tanda bahaya sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentCase.redFlags.map((flag) => {
                      const isMarked = selectedFlagIds.includes(flag.id);

                      return (
                        <button
                          key={flag.id}
                          type="button"
                          onClick={() => handleToggleFlag(flag.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[56px] shadow-2xs ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm sm:text-base leading-snug">
                            {flag.flagText}
                          </span>
                          <span className={`shrink-0 text-xs font-extrabold px-3 py-1 rounded-full border transition-colors ${
                            isMarked ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}>
                            {isMarked ? t('game.marked') : t('game.mark')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Review breakdown */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 font-bold text-slate-900">
                      <span>{isEn ? 'Scheme Analysis Result:' : 'Hasil Analisis Skim:'}</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-xs">
                        +{flagScore} / 12 {t('game.pts')}
                      </span>
                    </div>
                    {currentCase.redFlags.map(f => {
                      const isTicked = selectedFlagIds.includes(f.id);
                      if (isTicked && f.isRedFlag) {
                        return (
                          <div key={f.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                            <strong>✓ {isEn ? 'Accurately Spotted: ' : 'Tepat Dikesan: '}</strong> {f.flagText}
                            <p className="text-xs text-slate-700 mt-0.5">{f.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !f.isRedFlag) {
                        return (
                          <div key={f.id} className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950">
                            <strong>✕ {isEn ? 'False Alarm: ' : 'Tersilap Tanda: '}</strong> {f.flagText}
                            <p className="text-xs text-slate-700 mt-0.5">{f.explanation}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {t('game.step2HeaderFriendly')}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1">
                      {t('game.step2Sub')}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.actions.map(act => {
                      const isSelected = selectedActionId === act.id;

                      return (
                        <button
                          key={act.id}
                          type="button"
                          disabled={isActionSubmitted}
                          onClick={() => handleSelectAction(act.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all min-h-[60px] shadow-2xs ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          } ${isActionSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1">
                              <span className="font-extrabold text-sm sm:text-base block">{act.title}</span>
                              <span className="text-xs sm:text-sm text-slate-600 leading-relaxed block">{act.description}</span>
                            </div>
                            <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Outcome feedback */}
                  {isActionSubmitted && activeAction && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
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
                          {activeAction.isSafe ? (isEn ? 'Safe Action! (+4.6 Pts)' : 'Tindakan Tepat! (+4.6 Mata)') : (isEn ? 'Risk Warning' : 'Amaran Risiko')}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed">
                        {activeAction.consequence}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100">
              {!isFlagsSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitFlags}
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
    </div>
  );
};
