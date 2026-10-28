'use client';

import React, { useState } from 'react';
import { getInvestmentScamCases, InvestmentScamCase, getRealWorldInvestmentStories } from '@/data/investment-scam-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
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
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

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

  const cases = getInvestmentScamCases(language);
  const currentCase: InvestmentScamCase = cases[currentCaseIndex] || cases[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-sc-auditor',
      name: language === 'en' ? 'SC Alert Auditor' : 'Penyiasat SC Alert',
      icon: '🔎',
      description: language === 'en' ? 'Checked entity on SC Malaysia Investor Alert List' : 'Menyemak entiti di Senarai Peringatan Pelabur SC Malaysia',
      isUnlocked: scAlertChecked
    },
    {
      id: 'b-ponzi-buster',
      name: language === 'en' ? 'Ponzi Buster' : 'Pembongkar Skim Ponzi',
      icon: '🛡️',
      description: language === 'en' ? 'Spotted unrealistic returns and zero risk claims' : 'Mengenal pasti janji keuntungan luar biasa dan ketiadaan risiko',
      isUnlocked: totalFlagsFound >= 4
    },
    {
      id: 'b-invest-hero',
      name: language === 'en' ? 'Savings Shield Master' : 'Pakar Pertahanan Simpanan',
      icon: '💼',
      description: language === 'en' ? 'Completed investment fraud challenge' : 'Menyelesaikan cabaran skim penipuan pelaburan',
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

  const handleToggleFlag = (id: string) => {
    if (isFlagsSubmitted) return;
    setSelectedFlagIds(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  const handleCheckScAlert = () => {
    setShowScAlert(true);
    setScAlertChecked(true);
  };

  const handleSubmitFlags = () => {
    if (isFlagsSubmitted) return;
    setIsFlagsSubmitted(true);

    const redFlags = currentCase.redFlags.filter(f => f.isRedFlag);
    const benign = currentCase.redFlags.filter(f => !f.isRedFlag);

    const correctFlagsTicked = selectedFlagIds.filter(id =>
      redFlags.some(f => f.id === id)
    ).length;

    const falseAlarms = selectedFlagIds.filter(id =>
      benign.some(f => f.id === id)
    ).length;

    const correctBenignIgnored = benign.length - falseAlarms;
    const totalCorrect = correctFlagsTicked + correctBenignIgnored;
    const points = Math.max(0, Math.min(12, Math.round((totalCorrect / currentCase.redFlags.length) * 12)));

    setFlagScore(points);
    setTotalFlagsFound(prev => prev + correctFlagsTicked);
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
    if (currentCaseIndex + 1 < cases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      const finalScore = Math.min(50, Math.round(totalScore));
      saveChallengeResult('investment-scam', finalScore, 50);
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
            {t('game.backToMain')}
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  {language === 'en' ? 'MISSION 05' : 'MISI 05'}
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  {language === 'en' ? 'TIME: 5-7 MINS • MAX: 50 POINTS' : 'MASA: 5-7 MINIT • MAKSIMUM: 50 MATA'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                {t('m5.title')}
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                {language === 'en'
                  ? '“Quick-rich syndicates frequently add unsuspecting victims into Telegram groups without consent, promising thousands in profits within hours using fake bank receipts. Learn how to verify entities on the Securities Commission (SC) Malaysia Alert List and protect your family savings.”'
                  : '“Sindiket skim cepat kaya sering memasukkan orang ramai ke dalam kumpulan Telegram tanpa kebenaran, menjanjikan keuntungan ribuan ringgit dalam beberapa jam, dan memaparkan resit bank palsu. Belajar menyemak Senarai Peringatan Pelabur Suruhanjaya Sekuriti (SC) dan selamatkan wang simpanan keluarga anda.”'}
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  {language === 'en' ? '3 Red Flags of Illegal Investment Scams:' : '3 Tanda Utama Skim Pelaburan Haram:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '1. Unrealistic Profit' : '1. Untung Terlalu Tinggi'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'Promises of hundreds of percent return in hours is 100% fake.' : 'Janji pulangan ratusan peratus dalam beberapa jam adalah 100% tipu.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '2. Individual Account' : '2. Pindahan Akaun Individu'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'Legitimate firms never ask you to transfer funds to personal bank accounts.' : 'Syarikat pelaburan sah tidak pernah meminta duit dimasukkan ke akaun peribadi.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '3. Withdrawal Fees' : '3. Minta Yuran Pengeluaran'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'If you are asked to pay extra money to release profits, it is a trap.' : 'Jika diminta bayar duit lagi untuk ambil untung, itu adalah jerat penipu.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                {language === 'en' ? 'Station Interactive Tools:' : 'Alat Interaktif Stesen:'}
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <TrendingUp className="w-4 h-4 text-[#8A241C]" />
                    <span>{language === 'en' ? 'Telegram Group & Crypto Bot Simulator' : 'Simulasi Grup Telegram & Bot Kripto'}</span>
                  </div>
                  <p>{language === 'en' ? 'Unmask fake banking receipts and automated bot accounts luring victims.' : 'Bongkar testimoni resit bank palsu dan akaun bot yang mengumpan mangsa.'}</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Search className="w-4 h-4 text-[#171914]" />
                    <span>{language === 'en' ? 'SC Malaysia Alert List Checker' : 'Penyemak Senarai Amaran SC Malaysia'}</span>
                  </div>
                  <p>{language === 'en' ? 'Check whether entities hold a valid capital market license or are blacklisted.' : 'Periksa sama ada syarikat mempunyai lesen pasaran modal yang sah atau tersenarai hitam.'}</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <BookOpen className="w-4 h-4 text-[#1E4D2B]" />
                    <span>{language === 'en' ? 'Real Malaysian Case Studies' : 'Contoh Kes Sebenar di Malaysia'}</span>
                  </div>
                  <p>{language === 'en' ? 'Read how local victims lost millions of ringgit in Telegram investment schemes.' : 'Baca bagaimana ribuan mangsa di Malaysia kehilangan jutaan ringgit dalam skim Telegram.'}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{language === 'en' ? 'Start Investment Scam Audit' : 'Mulakan Siasatan Skim Pelaburan'}</span>
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
                  {language === 'en' ? 'MISSION 05 REPORT COMPLETE' : 'LAPORAN MISI 05 SELESAI'}
                </span>
                <span className="text-[#7C7E77]">{language === 'en' ? 'ILLEGAL INVESTMENT SCAMS' : 'SKIM PELABURAN HARAM'}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  {language === 'en' ? 'Family Savings Protected!' : 'Simpanan Keluarga Selamat!'}
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  {language === 'en'
                    ? 'Your team successfully exposed absurd promises, identified fake testimonials, and mastered SC Malaysia Investor Alert List checks.'
                    : 'Pasukan anda berjaya membongkar janji manis tidak masuk akal, mengenal pasti testimoni palsu, dan menguasai semakan di portal Suruhanjaya Sekuriti Malaysia.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.scenariosTested')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">2 / 2</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.cluesFound')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{totalFlagsFound}</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.safeDecisions')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{correctActionDecisions} / 2</span>
                </div>
                <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/20 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#123E23] block font-bold">{t('results.totalScore')}</span>
                  <span className="font-mono text-2xl font-black text-[#123E23] mt-1 block">
                    {Math.min(50, Math.round(totalScore))} <span className="text-xs font-normal text-[#123E23]/70">/ 50</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                {language === 'en' ? 'Community Financial Principles:' : 'Prinsip Kewangan Komuniti:'}
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Never Trust Group Receipts:' : 'Jangan Percaya Testimoni Grup:'}</strong> {language === 'en' ? 'Bank receipts and member chatter in Telegram are easily fabricated.' : 'Resit bank dan perbualan ahli di Telegram mudah dicipta menggunakan perisian rekaan slip palsu.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Never Pay Withdrawal Fees:' : 'Jangan Bayar Yuran Pengeluaran:'}</strong> {language === 'en' ? 'If a platform requires you to deposit more money to withdraw earnings, it is 100% a scam.' : 'Jika platform meminta anda mendepositkan wang lagi untuk mengeluarkan keuntungan, ia 100% adalah penipuan.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Check sc.com.my:' : 'Rujuk sc.com.my:'}</strong> {language === 'en' ? 'Always verify entities on the Securities Commission Malaysia Alert List before investing.' : 'Semak Senarai Peringatan Pelabur Suruhanjaya Sekuriti sebelum memasukkan sebarang wang simpanan.'}</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{t('game.retry')}</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>{t('game.mainMenu')}</span>
                </Link>

                <Link
                  href="/challenge/social-privacy"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <span>{language === 'en' ? 'Mission 06: Privacy & AI Clones' : 'Misi 06: Privasi & Klon AI'}</span>
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
     STAGE 2: INVESTIGATION (SPLIT SCREEN)
     ========================================================================= */
  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);
  const progressPercent = Math.round(((currentCaseIndex + 1) / cases.length) * 100);

  return (
    <div className="w-full space-y-4">
      {/* Top Bar */}
      <div className="bg-white border-2 border-[#171914] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171914]/15 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-[#7C7E77] hover:text-[#171914] font-bold transition-colors">
              {t('game.backMenu')}
            </Link>
            <span className="text-[#171914]/20">|</span>
            <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
              {t('game.case')} 0{currentCaseIndex + 1} / 0{cases.length}
            </span>
            <span className="font-bold text-[#171914] text-xs sm:text-sm">
              {currentCase.title}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Real Case Button */}
            <button
              type="button"
              onClick={() => setShowRealStoryModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF9F5] hover:bg-[#ECEAE2] border border-[#171914]/20 rounded-xs cursor-pointer font-mono font-bold text-xs text-[#171914] transition-colors min-h-[36px]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#171914]" />
              <span className="hidden sm:inline">{t('game.realStoryBtn')}</span>
            </button>

            <button
              type="button"
              onClick={handleStart}
              title={t('game.resetFromStart')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF0E6] border border-[#8A241C]/30 text-[#8A241C] hover:text-[#8A241C] rounded-xs cursor-pointer font-mono font-bold text-xs transition-colors min-h-[36px] shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t('game.resetFromStart')}</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBadges(!showBadges)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4EE] hover:bg-[#ECEAE2] border border-[#171914]/20 rounded-xs cursor-pointer font-mono font-bold text-xs text-[#171914] min-h-[36px]"
            >
              <Award className="w-3.5 h-3.5 text-[#171914]" />
              <span className="hidden sm:inline">{t('game.badges')}</span> ({badges.filter(b => b.isUnlocked).length}/{badges.length})
            </button>

            <div className="font-bold text-[#171914] bg-white px-3 py-1.5 border border-[#171914]/20 rounded-xs min-h-[36px] flex items-center">
              {t('game.score')} <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20 ml-1">{Math.round(totalScore)} / 50</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3 font-mono text-xs text-[#7C7E77]">
          <span>{t('game.missionProgress')}</span>
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

      {/* Real Case Modal */}
      <AnimatePresence>
        {showRealStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-[#171914] rounded-sm max-w-2xl w-full p-6 sm:p-7 shadow-xl text-[#171914] space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15">
                <div className="flex items-center gap-2">
                  <span className="bg-[#8A241C] text-white font-mono text-xs font-bold px-2.5 py-1 rounded-xs">
                    {language === 'en' ? 'REAL CASE IN MALAYSIA' : 'KES SEBENAR DI MALAYSIA'}
                  </span>
                  <span className="text-xs font-mono text-[#7C7E77]">
                    Suruhanjaya Sekuriti Malaysia (SC)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  className="p-1 hover:bg-[#ECEAE2] rounded-xs text-[#575953] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#171914] tracking-tight">
                  {currentCase.realCaseExample?.headline || getRealWorldInvestmentStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#7C7E77] mt-1">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-[#8A241C] font-bold">
                    {language === 'en' ? 'Loss Amount:' : 'Jumlah Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF9F5] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm leading-relaxed text-[#171914]">
                <strong className="block text-[#171914] font-bold">
                  {language === 'en' ? 'Syndicate Modus Operandi:' : 'Modus Operandi Sindiket:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-sm space-y-2 text-xs sm:text-sm text-[#78271C]">
                <strong className="block font-bold">
                  {language === 'en' ? 'Withdrawal Fee Trap:' : 'Helah & Perangkap Pengeluaran:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-sm space-y-1 text-xs sm:text-sm text-[#123E23]">
                <strong className="block font-bold">
                  {language === 'en' ? '💡 Securities Commission (SC) Advice:' : '💡 Nasihat Pakar Suruhanjaya Sekuriti (SC):'}
                </strong>
                <p>{currentCase.realCaseExample?.preventionTip}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  className="px-6 py-2.5 bg-[#171914] text-[#D9FA62] hover:bg-[#2A2D25] font-mono font-bold text-xs uppercase rounded-sm cursor-pointer"
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
        {/* LEFT COLUMN: Telegram Group Simulation & ROI Promise (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#8A241C]" />
                  <span>{language === 'en' ? '1. Inspect Scheme & Chat Group' : '1. Teliti Skim & Perbualan Kumpulan'}</span>
                </span>
                <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-bold uppercase text-[11px]">
                  {currentCase.schemeName}
                </span>
              </div>

              {/* Lure Context Box */}
              <div className="p-3.5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm space-y-1">
                <span className="font-mono text-[10px] uppercase text-[#7C7E77] font-bold block">
                  {language === 'en' ? 'Promised Return (ROI):' : 'Janji Keuntungan (ROI):'}
                </span>
                <div className="font-mono font-bold text-sm sm:text-base text-[#8A241C]">
                  {currentCase.promisedRoi}
                </div>
                <div className="text-xs text-[#575953] font-mono">
                  {language === 'en' ? 'Initial Deposit: ' : 'Syarat Modal: '}{currentCase.depositRequired}
                </div>
              </div>

              {/* Simulated Telegram Group Feed */}
              <div className="rounded-sm border-2 border-[#171914]/25 bg-[#0F141C] text-white p-4 space-y-3 shadow-md font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-bold text-white">{currentCase.schemeName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowRealStoryModal(true)}
                    className="text-[11px] uppercase bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-xs text-[#D9FA62] flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>{t('game.realStoryBtn')}</span>
                  </button>
                </div>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {currentCase.chatTranscript.map((msg, i) => (
                    <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className={`font-bold ${msg.isBot ? 'text-amber-400' : 'text-[#D9FA62]'}`}>
                          {msg.sender}
                        </span>
                        {msg.isBot && (
                          <span className="text-[10px] text-slate-500 uppercase">
                            {language === 'en' ? '[Bot Account Suspected]' : '[Akaun Disyaki Bot]'}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-100 leading-relaxed font-sans text-xs sm:text-sm">
                        {msg.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SC Alert List Tool Action */}
            <div className="pt-2">
              <div className="p-3 bg-[#171914] text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs text-[#D9FA62] font-bold block flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>{language === 'en' ? 'Investigation Tool: SC Malaysia Investor Alert List' : 'Alat Siasatan: Senarai Peringatan Pelabur SC Malaysia'}</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {language === 'en' ? 'Check whether entity ' : 'Semak sama ada entiti '}<code className="text-[#D9FA62]">{currentCase.schemeName}</code>{language === 'en' ? ' is licensed or blacklisted.' : ' berlesen atau tersenarai hitam.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCheckScAlert}
                  className="px-4 py-2.5 bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] font-mono font-bold text-xs uppercase rounded-xs cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{language === 'en' ? 'Check in SC Alert List' : 'Semak di SC Alert List'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SC Alert Result Box if clicked */}
              {showScAlert && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-[#FAF0E6] border-2 border-[#8A241C] rounded-sm space-y-2 text-[#78271C] font-mono text-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#8A241C]/30 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#8A241C]" />
                      <span>{language === 'en' ? 'SC INVESTOR ALERT LIST RESULT:' : 'HASIL SEMAKAN SC INVESTOR ALERT LIST:'}</span>
                    </span>
                    <span className="bg-[#8A241C] text-white px-2 py-0.5 rounded-xs text-[10px]">
                      {language === 'en' ? 'WARNING: UNLICENSED' : 'AMARAN: TIDAK BERLESEN'}
                    </span>
                  </div>
                  <p>
                    {language === 'en' ? 'Entity: ' : 'Entiti: '}<strong>{currentCase.scAlertListRecord.entityName}</strong>
                  </p>
                  <p className="text-[11px] text-[#575953]">
                    {currentCase.scAlertListRecord.reason}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Red Flags Checklist & Decisions (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#171914]" />
                  <span>{language === 'en' ? '2. Red Flags Analysis & Actions' : '2. Analisis Tanda Amaran & Tindakan'}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] ${
                  isFlagsSubmitted ? 'bg-[#E7F3EB] text-[#123E23]' : 'bg-[#D9FA62] text-[#171914]'
                }`}>
                  {!isFlagsSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Step 1: Detect Red Flags or Step 2: Choose Action */}
            <div className="space-y-4 flex-1">
              {!isFlagsSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      {t('game.step1Header')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      {language === 'en'
                        ? 'Based on the scheme on the left, mark only investment red flags:'
                        : 'Berdasarkan skim di sebelah kiri, tandakan ciri-ciri penipuan pelaburan / tanda bahaya sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.redFlags.map((flag) => {
                      const isMarked = selectedFlagIds.includes(flag.id);

                      return (
                        <button
                          key={flag.id}
                          type="button"
                          onClick={() => handleToggleFlag(flag.id)}
                          className={`w-full p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] ${
                            isMarked
                              ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                              : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="font-mono text-xs sm:text-sm leading-snug">
                            {flag.flagText}
                          </span>
                          <span className={`shrink-0 font-mono text-xs font-bold px-2 py-1 rounded-xs border ${
                            isMarked ? 'bg-[#D9FA62] text-[#171914] border-[#D9FA62]' : 'bg-[#ECEAE2] text-[#575953]'
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
                  <div className="p-4 bg-[#FAF9F5] border-2 border-[#171914]/15 rounded-sm space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10">
                      <span className="font-bold text-[#171914]">{language === 'en' ? 'Scheme Analysis Result:' : 'Hasil Analisis Skim:'}</span>
                      <span className="font-bold bg-[#D9FA62] px-2 py-0.5 rounded-xs text-[#171914]">
                        +{flagScore} / 12 {t('game.pts')}
                      </span>
                    </div>
                    {currentCase.redFlags.map(f => {
                      const isTicked = selectedFlagIds.includes(f.id);
                      if (isTicked && f.isRedFlag) {
                        return (
                          <div key={f.id} className="p-2 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-[#123E23]">
                            <strong>✓ {language === 'en' ? 'Accurately Spotted: ' : 'Tepat Dikesan: '}</strong> {f.flagText}
                            <p className="text-[11px] text-[#575953] mt-0.5">{f.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !f.isRedFlag) {
                        return (
                          <div key={f.id} className="p-2 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C]">
                            <strong>✕ {language === 'en' ? 'False Alarm: ' : 'Tersilap Tanda: '}</strong> {f.flagText}
                            <p className="text-[11px] text-[#575953] mt-0.5">{f.explanation}</p>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      {t('game.step2Header')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1">
                      {t('game.step2Sub')}
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
                              {t('game.yourChoice')}
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
                            {activeAction.isSafe ? (language === 'en' ? 'Safe Action! (+13 Pts)' : 'Tindakan Tepat! (+13 Mata)') : (language === 'en' ? 'Risk Warning' : 'Amaran Risiko')}
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
              {!isFlagsSubmitted ? (
                <button
                  type="button"
                  disabled={selectedFlagIds.length === 0}
                  onClick={handleSubmitFlags}
                  className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    selectedFlagIds.length > 0
                      ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                      : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                  }`}
                >
                  <span>{t('game.submitStep1')}</span>
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
                  <span>{t('game.submitStep2')}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNextCase}
                  className="w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>
                    {currentCaseIndex + 1 === cases.length
                      ? t('game.viewFinalReport')
                      : `${t('game.nextScenario')} (${t('game.case')} 0${currentCaseIndex + 2})`}
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

