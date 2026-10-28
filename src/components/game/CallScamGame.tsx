'use client';

import React, { useState } from 'react';
import { getCallScamCases, CallScamCase, getRealWorldCallScamStories, RealWorldScamStory } from '@/data/call-scam-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import {
  PhoneCall,
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
  Volume2,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export const CallScamGame: React.FC = () => {
  const { language, t } = useLanguage();
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Per-case state
  const [selectedTacticIds, setSelectedTacticIds] = useState<string[]>([]);
  const [isTacticsSubmitted, setIsTacticsSubmitted] = useState<boolean>(false);
  const [selectedActionId, setSelectedActionId] = useState<string | null>(null);
  const [isActionSubmitted, setIsActionSubmitted] = useState<boolean>(false);
  const [tacticsScore, setTacticsScore] = useState<number>(0);
  const [showSemakMule, setShowSemakMule] = useState<boolean>(false);
  const [semakMuleSearched, setSemakMuleSearched] = useState<boolean>(false);
  const [showRealStoryModal, setShowRealStoryModal] = useState<boolean>(false);

  // Cumulative performance
  const [totalTacticsFound, setTotalTacticsFound] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  const cases = getCallScamCases(language);
  const currentCase: CallScamCase = cases[currentCaseIndex] || cases[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-mule-checker',
      name: language === 'en' ? 'SemakMule Expert' : 'Pakar SemakMule',
      icon: '🔍',
      description: language === 'en' ? 'Checked phone number against police database' : 'Menyemak nombor scammer di pangkalan data polis SemakMule PDRM',
      isUnlocked: semakMuleSearched
    },
    {
      id: 'b-psych-shield',
      name: language === 'en' ? 'Immune to Threat' : 'Kalis Ugutan Polis Palsu',
      icon: '🛡️',
      description: language === 'en' ? 'Spotted panic and arrest coercion tactics' : 'Mengesan taktik panik dan ugutan tangkapan penipu',
      isUnlocked: totalTacticsFound >= 6
    },
    {
      id: 'b-nsrc-ready',
      name: language === 'en' ? 'NSRC 997 Hero' : 'Wira NSRC 997',
      icon: '📞',
      description: language === 'en' ? 'Memorized the national 997 hotline' : 'Menghafal dan mengutamakan talian kecemasan 997',
      isUnlocked: correctActionDecisions >= 3
    },
    {
      id: 'b-call-hero',
      name: language === 'en' ? 'Call Scam Buster' : 'Penangkis Panggilan Penipuan',
      icon: '🛑',
      description: language === 'en' ? 'Completed all 4 call scam scenarios' : 'Menyelesaikan kesemua 4 senario panggilan penipuan',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalTacticsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSemakMuleSearched(false);
  };

  const resetCaseState = () => {
    setSelectedTacticIds([]);
    setIsTacticsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setTacticsScore(0);
    setShowSemakMule(false);
  };

  const handleToggleTactic = (id: string) => {
    if (isTacticsSubmitted) return;
    setSelectedTacticIds(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const handleSearchSemakMule = () => {
    setShowSemakMule(true);
    setSemakMuleSearched(true);
  };

  const handleSubmitTactics = () => {
    if (isTacticsSubmitted) return;
    setIsTacticsSubmitted(true);

    const trapTactics = currentCase.tactics.filter(t => t.isTrap);
    const benignTactics = currentCase.tactics.filter(t => !t.isTrap);

    const correctTrapsTicked = selectedTacticIds.filter(id =>
      trapTactics.some(t => t.id === id)
    ).length;

    const falseAlarms = selectedTacticIds.filter(id =>
      benignTactics.some(t => t.id === id)
    ).length;

    const correctBenignIgnored = benignTactics.length - falseAlarms;
    const totalCorrect = correctTrapsTicked + correctBenignIgnored;
    const points = Math.max(0, Math.min(6, Math.round((totalCorrect / currentCase.tactics.length) * 6)));

    setTacticsScore(points);
    setTotalTacticsFound(prev => prev + correctTrapsTicked);
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
      setTotalScore(prev => prev + 6.5); // total for 4 cases: (6+6.5)*4 = 50 pts
    }
  };

  const handleNextCase = () => {
    if (currentCaseIndex + 1 < cases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      const finalScore = Math.min(50, Math.round(totalScore));
      saveChallengeResult('call-scam', finalScore, 50);
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
                  {language === 'en' ? 'MISSION 03' : 'MISI 03'}
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  {language === 'en' ? 'TIME: 5-7 MINS • MAX: 50 POINTS' : 'MASA: 5-7 MINIT • MAKSIMUM: 50 MATA'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                {t('m3.title')}
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                {language === 'en'
                  ? '“Phone scammers (Macau Scam) impersonate police officers, court officials, or tax authorities to terrify victims with immediate arrest or frozen bank accounts. Your mission is to spot manipulation tactics, use the police SemakMule database, and remember the 997 hotline.”'
                  : '“Penipu telefon (Macau Scam) menyamar sebagai pegawai polis, mahkamah, atau LHDN untuk menakut-nakutkan anda dengan ugutan tangkap atau sekatan bank. Tugas anda adalah mengecam helah mereka, menggunakan portal SemakMule PDRM, dan menghafal talian kecemasan 997.”'}
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  {language === 'en' ? '3 Core Rules to Defeat Fake Call Scams:' : '3 Petua Pantas Elak Ditipu Panggilan Palsu:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '1. Stay Calm' : '1. Bertenang & Fikir'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'Real police and tax agencies never threaten arrest over a phone call.' : 'Polis dan LHDN sebenar tidak pernah mengugut tangkapan melalui panggilan telefon.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '2. Check SemakMule' : '2. Semak di SemakMule'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'Check phone numbers and bank accounts against police records before sending money.' : 'Periksa nombor telefon dan akaun bank pada rekod polis sebelum pindah wang.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{language === 'en' ? '3. Dial NSRC 997' : '3. Dail NSRC 997'}</strong>
                    <p className="text-xs mt-0.5">
                      {language === 'en' ? 'National hotline to freeze scammer mule accounts if you accidentally transferred money.' : 'Talian khas kebangsaan untuk membekukan akaun scammer jika tersilap pindah duit.'}
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
                    <PhoneCall className="w-4 h-4 text-[#8A241C]" />
                    <span>{language === 'en' ? 'Phone UI & Voice Transcript Simulator' : 'Simulasi Skrin Panggilan & Transkrip Suara'}</span>
                  </div>
                  <p>{language === 'en' ? 'Experience the real psychological pressure of calls claiming to be enforcement officers.' : 'Alami tekanan panggilan sebenar daripada pihak yang mendakwa pegawai polis dan LHDN.'}</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Search className="w-4 h-4 text-[#171914]" />
                    <span>{language === 'en' ? 'PDRM SemakMule Crime Record Scanner' : 'Pengimbas Rekod SemakMule PDRM'}</span>
                  </div>
                  <p>{language === 'en' ? 'Search caller phone numbers in real-time police fraud records.' : 'Semak rekod laporan jenayah polis bagi nombor pemanggil dalam masa nyata.'}</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <BookOpen className="w-4 h-4 text-[#1E4D2B]" />
                    <span>{language === 'en' ? 'Real Malaysian Case Studies' : 'Contoh Kes Sebenar di Malaysia'}</span>
                  </div>
                  <p>{language === 'en' ? 'Read real stories of how local victims lost hundreds of thousands of ringgit.' : 'Ketahui kisah nyata bagaimana mangsa di Malaysia kehilangan ratusan ribu ringgit.'}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{language === 'en' ? 'Start Phone Scam Investigation' : 'Mulakan Siasatan Panggilan Penipuan'}</span>
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
                  {language === 'en' ? 'MISSION 03 REPORT COMPLETE' : 'LAPORAN MISI 03 SELESAI'}
                </span>
                <span className="text-[#7C7E77]">{language === 'en' ? 'PHONE SCAM & NSRC' : 'PANGGILAN PENIPUAN & NSRC'}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  {language === 'en' ? 'Investigation Successfully Repelled!' : 'Siasatan Berjaya Ditangkis!'}
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  {language === 'en'
                    ? 'Your team successfully identified panic coercion tactics, rejected sending money to mule accounts, and is prepared to use the 997 hotline.'
                    : 'Pasukan anda berjaya mengesan helah manipulasi ketakutan, menolak bayaran ke akaun keldai, dan bersedia menggunakan talian kecemasan 997.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.scenariosTested')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">4 / 4</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.cluesFound')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{totalTacticsFound}</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">{t('results.safeDecisions')}</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">{correctActionDecisions} / 4</span>
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
                {language === 'en' ? 'Community Quick Emergency Guide:' : 'Panduan Pantas Kecemasan Komuniti:'}
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Memorize 997 (NSRC):' : 'Hafal Talian 997 (NSRC):'}</strong> {language === 'en' ? 'Call the National Scam Response Centre within 1 hour if you accidentally sent funds to a scammer.' : 'Hubungi Pusat Respons Scam Kebangsaan dalam tempoh 1 jam sekiranya tersilap memindahkan wang.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Check SemakMule:' : 'Semak di SemakMule:'}</strong> {language === 'en' ? 'Enter bank accounts or caller numbers into the PDRM CCID portal before dealing.' : 'Masukkan nombor akaun bank atau telefon di portal CCID SemakMule PDRM sebelum membuat sebarang urusan.'}</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>{language === 'en' ? 'Hang Up Immediately:' : 'Jangan Panik & Letak Telefon:'}</strong> {language === 'en' ? 'Calls threatening immediate court arrest or tax jail are 100% fraudulent.' : 'Panggilan ugutan tangkapan segera mahkamah/LHDN 100% adalah penipuan.'}</span>
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
                  href="/challenge/apk-malware"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <span>{language === 'en' ? 'Mission 04: APK Malware' : 'Misi 04: Bahaya APK'}</span>
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
                    PDRM & CCID
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
                  {currentCase.realCaseExample?.headline || getRealWorldCallScamStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[#7C7E77] mt-1">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-[#8A241C] font-bold">
                    {language === 'en' ? 'Financial Loss:' : 'Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-[#FAF9F5] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm leading-relaxed text-[#171914]">
                <strong className="block text-[#171914] font-bold">
                  {language === 'en' ? 'Incident Breakdown:' : 'Kronologi Kejadian:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-sm space-y-2 text-xs sm:text-sm text-[#78271C]">
                <strong className="block font-bold">
                  {language === 'en' ? 'How Scammers Coerced the Victim:' : 'Bagaimana Scammer Berjaya Memperdaya Mangsa:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-sm space-y-1 text-xs sm:text-sm text-[#123E23]">
                <strong className="block font-bold">
                  {language === 'en' ? '💡 Key Community Takeaway:' : '💡 Pengajaran & Tindakan Komuniti:'}
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
        {/* LEFT COLUMN: Phone Call Interface & Audio Transcript (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <PhoneCall className="w-4 h-4 text-[#8A241C]" />
                  <span>{language === 'en' ? '1. Incoming Call Simulation' : '1. Simulasi Panggilan Masuk'}</span>
                </span>
                <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-bold uppercase text-[11px]">
                  {language === 'en' ? 'URGENCY: ' : 'TAHAP CEMAS: '}{currentCase.urgencyLevel}
                </span>
              </div>

              {/* Scenario Context */}
              <p className="text-xs sm:text-sm text-[#575953] leading-relaxed mb-4">
                <strong>{language === 'en' ? 'Situation: ' : 'Situasi: '}</strong>{currentCase.scenarioContext}
              </p>

              {/* Simulated Phone UI Box */}
              <div className="rounded-sm border-2 border-[#171914] bg-[#0F141C] text-white p-5 space-y-4 shadow-md">
                {/* Caller details */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-[#8A241C] text-[#D9FA62] flex items-center justify-center font-mono font-bold text-lg animate-pulse">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-white font-mono">{currentCase.callerIdentity}</h4>
                      <p className="text-xs text-slate-300 font-mono">{currentCase.claimedAgency}</p>
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs">
                    <span className="text-[#D9FA62] font-bold block">{currentCase.phoneNumber}</span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{currentCase.callDuration}</span>
                    </span>
                  </div>
                </div>

                {/* Call audio waveform & transcript */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-mono text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 text-[#D9FA62]">
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <span>{language === 'en' ? 'Caller Transcript: ' : 'Transkrip Percakapan Pemanggil:'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRealStoryModal(true)}
                      className="text-[11px] uppercase bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded-xs text-[#D9FA62] flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <BookOpen className="w-3 h-3" />
                      <span>{t('game.realStoryBtn')}</span>
                    </button>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-700 rounded-sm font-mono text-xs sm:text-sm text-slate-100 leading-relaxed whitespace-pre-line space-y-2">
                    {currentCase.audioSimulatedText}
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent SemakMule Tool Button */}
            <div className="pt-2">
              <div className="p-3 bg-[#171914] text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs text-[#D9FA62] font-bold block flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>{language === 'en' ? 'Investigation Tool: PDRM CCID SemakMule Database' : 'Alat Siasatan: Pangkalan Data CCID SemakMule PDRM'}</span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {language === 'en' ? 'Check phone number ' : 'Semak nombor telefon pemanggil '}<code className="text-[#D9FA62]">{currentCase.phoneNumber}</code>{language === 'en' ? ' in police fraud records.' : ' dalam rekod jenayah polis.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSearchSemakMule}
                  className="px-4 py-2.5 bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] font-mono font-bold text-xs uppercase rounded-xs cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{language === 'en' ? 'Scan in SemakMule' : 'Imbas di SemakMule'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SemakMule Result Box if clicked */}
              {showSemakMule && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-[#FAF0E6] border-2 border-[#8A241C] rounded-sm space-y-2 text-[#78271C] font-mono text-xs"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#8A241C]/30 font-bold">
                    <span className="flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 text-[#8A241C]" />
                      <span>{language === 'en' ? 'PDRM SEMAKMULE SEARCH RESULT:' : 'HASIL CARIAN CCID SEMAKMULE PDRM:'}</span>
                    </span>
                    <span className="bg-[#8A241C] text-white px-2 py-0.5 rounded-xs text-[10px]">
                      {currentCase.semakMuleData.policeStatus}
                    </span>
                  </div>
                  <p>
                    {language === 'en' ? 'Number: ' : 'Nombor: '}<strong>{currentCase.semakMuleData.queryNumber}</strong>{language === 'en' ? ' has ' : ' mempunyai '}<strong>{currentCase.semakMuleData.reportsCount} {language === 'en' ? 'ACTIVE POLICE REPORTS' : 'LAPORAN POLIS'}</strong>!
                  </p>
                  <p className="text-[11px] text-[#575953]">
                    {language === 'en' ? 'Category: ' : 'Kategori: '}{currentCase.semakMuleData.lastReportedCategory}. {language === 'en' ? 'Do NOT transfer any money!' : 'Jangan pindahkan sebarang wang!'}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tactic Checklist & Decisions (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#171914]" />
                  <span>{language === 'en' ? '2. Team Analysis & Decisions' : '2. Analisis & Keputusan Pasukan'}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] ${
                  isTacticsSubmitted ? 'bg-[#E7F3EB] text-[#123E23]' : 'bg-[#D9FA62] text-[#171914]'
                }`}>
                  {!isTacticsSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Step 1: Detect Tactics or Step 2: Choose Action */}
            <div className="space-y-4 flex-1">
              {!isTacticsSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      {t('game.step1Header')}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      {language === 'en'
                        ? 'Based on the caller transcript on the left, mark only suspicious threat tactics:'
                        : 'Berdasarkan percakapan pemanggil di sebelah kiri, tandakan taktik ugutan / helah penipuan sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.tactics.map((tactic) => {
                      const isMarked = selectedTacticIds.includes(tactic.id);

                      return (
                        <button
                          key={tactic.id}
                          type="button"
                          onClick={() => handleToggleTactic(tactic.id)}
                          className={`w-full p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[52px] ${
                            isMarked
                              ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                              : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914] hover:bg-[#FAF9F5]'
                          }`}
                        >
                          <span className="font-mono text-xs sm:text-sm leading-snug">
                            {tactic.text}
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
                      <span className="font-bold text-[#171914]">{language === 'en' ? 'Tactics Analysis Outcome:' : 'Hasil Analisis Taktik:'}</span>
                      <span className="font-bold bg-[#D9FA62] px-2 py-0.5 rounded-xs text-[#171914]">
                        +{tacticsScore} / 6 {t('game.pts')}
                      </span>
                    </div>
                    {currentCase.tactics.map(tactic => {
                      const isTicked = selectedTacticIds.includes(tactic.id);
                      if (isTicked && tactic.isTrap) {
                        return (
                          <div key={tactic.id} className="p-2 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-[#123E23]">
                            <strong>✓ {language === 'en' ? 'Accurately Spotted: ' : 'Tepat Dikesan: '}</strong> {tactic.text}
                            <p className="text-[11px] text-[#575953] mt-0.5">{tactic.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !tactic.isTrap) {
                        return (
                          <div key={tactic.id} className="p-2 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C]">
                            <strong>✕ {language === 'en' ? 'False Alarm: ' : 'Tersilap Tanda: '}</strong> {tactic.text}
                            <p className="text-[11px] text-[#575953] mt-0.5">{tactic.explanation}</p>
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
                            {activeAction.isSafe ? (language === 'en' ? 'Safe Action! (+6.5 Pts)' : 'Tindakan Tepat! (+6.5 Mata)') : (language === 'en' ? 'Risk Warning' : 'Amaran Risiko')}
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
              {!isTacticsSubmitted ? (
                <button
                  type="button"
                  disabled={selectedTacticIds.length === 0}
                  onClick={handleSubmitTactics}
                  className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    selectedTacticIds.length > 0
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


