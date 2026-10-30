'use client';

import React, { useState } from 'react';
import { getCallScamCases, CallScamCase, getRealWorldCallScamStories, RealWorldScamStory } from '@/data/call-scam-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
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
  X,
  PhoneOff
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';

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

  React.useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
    };
  }, [currentCaseIndex, stage]);

  const cases = getCallScamCases(language);
  const currentCase: CallScamCase = cases[currentCaseIndex] || cases[0];
  const isEn = language === 'en';

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-mule-checker',
      name: isEn ? 'SemakMule Expert' : 'Pakar SemakMule',
      icon: '🔍',
      description: isEn ? 'Checked phone number against police database' : 'Menyemak nombor scammer di pangkalan data polis SemakMule PDRM',
      isUnlocked: semakMuleSearched
    },
    {
      id: 'b-psych-shield',
      name: isEn ? 'Immune to Threat' : 'Kalis Ugutan Polis Palsu',
      icon: '🛡️',
      description: isEn ? 'Spotted panic and arrest coercion tactics' : 'Mengesan taktik panik dan ugutan tangkapan penipu',
      isUnlocked: totalTacticsFound >= 6
    },
    {
      id: 'b-nsrc-ready',
      name: isEn ? 'NSRC 997 Hero' : 'Wira NSRC 997',
      icon: '📞',
      description: isEn ? 'Knows how to respond in 1-hour golden window' : 'Hafal talian kecemasan 997 dalam tempoh 1 jam',
      isUnlocked: correctActionDecisions >= 3
    },
    {
      id: 'b-call-crusher',
      name: isEn ? 'Call Scam Buster' : 'Penangkis Panggilan Palsu',
      icon: '🛑',
      description: isEn ? 'Completed all 4 call scam cases' : 'Menyelesaikan kesemua 4 kes panggilan scam',
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

  const handleToggleTactic = (tacticId: string) => {
    if (isTacticsSubmitted) return;
    playPopSound();
    setSelectedTacticIds(prev =>
      prev.includes(tacticId) ? prev.filter(id => id !== tacticId) : [...prev, tacticId]
    );
  };

  const handleSearchSemakMule = () => {
    playSuccessChime();
    setShowSemakMule(true);
    setSemakMuleSearched(true);
  };

  const handleSubmitTactics = () => {
    if (isTacticsSubmitted) return;
    setIsTacticsSubmitted(true);

    let score = 0;
    let correctlyIdentified = 0;

    currentCase.tactics.forEach(t => {
      const isSelected = selectedTacticIds.includes(t.id);
      if (t.isTrap && isSelected) {
        score += 2;
        correctlyIdentified += 1;
      } else if (!t.isTrap && isSelected) {
        score = Math.max(0, score - 1);
      }
    });

    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

    const finalTacticScore = Math.min(6, score);
    setTacticsScore(finalTacticScore);
    setTotalTacticsFound(prev => prev + correctlyIdentified);
    setTotalScore(prev => prev + finalTacticScore);
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
      setTotalScore(prev => prev + 6.5);
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
      saveChallengeResult('call-scam', finalScore, 50);
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
                  {isEn ? 'MISSION 03' : 'MISI 03'}
                </span>
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {isEn ? '⏱️ 5-7 Mins • 50 Points' : '⏱️ 5-7 Minit • 50 Mata'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {t('m3.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {isEn
                  ? 'Syndicates pose as police officers, tax auditors (LHDN), and court judges to terrify citizens with false arrest warrants. Learn how to stay calm, check numbers in police database SemakMule, and memorize the 997 hotline.'
                  : 'Sindiket menyamar sebagai pegawai polis, LHDN, dan pegawai mahkamah untuk menakut-nakutkan orang ramai kononnya waran tangkap telah dikeluarkan. Ketahui cara bertenang, menyemak nombor di portal SemakMule PDRM, dan menghafal talian kecemasan 997.'}
              </p>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                  {isEn ? '📋 3 Core Steps in This Mission:' : '📋 3 Langkah Mudah Menangkis Panggilan Tipu:'}
                </span>
                <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      1
                    </span>
                    <span>
                      <strong>{isEn ? 'Listen to Caller Transcript:' : 'Dengar & Baca Percakapan:'}</strong>{' '}
                      {isEn ? 'Examine how scammers use panic and urgency to rush you.' : 'Perhatikan bagaimana scammer mendesak anda supaya panik.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      2
                    </span>
                    <span>
                      <strong>{isEn ? 'Check SemakMule PDRM:' : 'Semak Portal SemakMule PDRM:'}</strong>{' '}
                      {isEn ? 'Use the official police tool to check if the caller number has fraud reports.' : 'Gunakan alat semakan polis untuk memeriksa rekod jenayah nombor telefon.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      3
                    </span>
                    <span>
                      <strong>{isEn ? 'Remember 997 Hotline:' : 'Hafal Talian 997:'}</strong>{' '}
                      {isEn ? 'Call NSRC within 1 hour if anyone accidentally transferred money.' : 'Dail 997 dalam tempoh 1 jam jika tersilap memindahkan wang.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tools & Start CTA */}
            <div className="lg:col-span-5 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5">
              <span className="text-sm font-extrabold text-blue-900 block pb-2 border-b border-blue-200/60">
                {isEn ? 'Community Investigation Tools:' : 'Alat Bantuan Stesen:'}
              </span>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Search className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'PDRM SemakMule Scanner' : 'Alat SemakMule Polis PDRM'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn ? 'Directly check fraudulent caller telephone numbers in police records.' : 'Semak terus nombor pemanggil dalam rekod laporan polis.'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'Real Malaysian Scam Cases' : 'Kisah Sebenar Mangsa di Malaysia'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn ? 'Read real verified police news stories from Selangor, Perak, and Sabah.' : 'Baca laporan berita polis sebenar mangsa scam panggilan dari seluruh negara.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Start Phone Scam Mission' : 'Mulakan Misi Panggilan Tipu'}</span>
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
                  {isEn ? 'MISSION 03 REPORT COMPLETE' : 'LAPORAN MISI 03 SELESAI'}
                </span>
                <span className="text-slate-500 font-bold">{isEn ? 'PHONE SCAM & NSRC' : 'PANGGILAN PENIPUAN & NSRC'}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isEn ? '🎉 Fake Calls Successfully Repelled!' : '🎉 Panggilan Penipu Berjaya Ditangkis!'}
                </h2>
                <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                  {isEn
                    ? 'Your team successfully identified panic coercion tactics, rejected sending money to mule accounts, and is prepared to use the 997 hotline.'
                    : 'Pasukan anda berjaya mengesan helah ugutan ketakutan, menolak bayaran ke akaun keldai, dan bersedia menggunakan talian kecemasan 997.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.scenariosTested')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">4 / 4</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.cluesFound')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{totalTacticsFound}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.safeDecisions')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{correctActionDecisions} / 4</span>
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
                {isEn ? 'Community Emergency Defense Guide:' : 'Panduan Pantas Kecemasan Komuniti:'}
              </span>

              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'Memorize 997 (NSRC):' : 'Hafal Talian 997 (NSRC):'}</strong> {isEn ? 'Call the National Scam Response Centre within 1 hour if you accidentally sent funds to a scammer.' : 'Hubungi Pusat Respons Scam Kebangsaan dalam tempoh 1 jam sekiranya tersilap memindahkan wang.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'Check SemakMule:' : 'Semak di SemakMule:'}</strong> {isEn ? 'Enter bank accounts or caller numbers into the PDRM CCID portal before dealing.' : 'Masukkan nombor akaun bank atau telefon di portal CCID SemakMule PDRM sebelum membuat sebarang urusan.'}</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span><strong>{isEn ? 'Hang Up Immediately:' : 'Jangan Panik & Letak Telefon:'}</strong> {isEn ? 'Calls threatening immediate court arrest or tax jail are 100% fraudulent.' : 'Panggilan ugutan tangkapan segera mahkamah/LHDN 100% adalah penipuan.'}</span>
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
                  href="/challenge/apk-malware"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-center"
                >
                  <span>{isEn ? 'Mission 04: APK Malware →' : 'Misi 04: Bahaya APK →'}</span>
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

      {/* Badges Drawer if toggled */}
      {showBadges && (
        <div className="pt-1">
          <BadgesDrawer badges={badges} />
        </div>
      )}

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
                    {isEn ? 'VERIFIED POLICE CASE IN MALAYSIA' : 'KES SEBENAR POLIS DI MALAYSIA'}
                  </span>
                  <span className="text-xs text-slate-500 font-semibold">
                    Jabatan Siasatan Jenayah Komersil (JSJK PDRM)
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
                  {currentCase.realCaseExample?.headline || getRealWorldCallScamStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-500 mt-2">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-red-700 font-extrabold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
                    {isEn ? 'Financial Loss:' : 'Jumlah Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 text-sm leading-relaxed text-slate-800">
                <strong className="block text-slate-900 font-bold">
                  {isEn ? 'Incident Breakdown:' : 'Kronologi Kejadian:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-2 text-sm text-red-950">
                <strong className="block font-bold">
                  {isEn ? 'How Scammers Coerced the Victim:' : 'Bagaimana Scammer Berjaya Memperdaya Mangsa:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1 text-sm text-emerald-950">
                <strong className="block font-bold">
                  {isEn ? '💡 Key Community Takeaway:' : '💡 Pengajaran & Tindakan Komuniti:'}
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
        {/* LEFT COLUMN: Phone Call Interface & Audio Transcript (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-red-600" />
                  <span>{isEn ? '1. Incoming Call Simulation' : '1. Simulasi Panggilan Masuk'}</span>
                </span>
                <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {isEn ? 'URGENCY: ' : 'TAHAP CEMAS: '}{currentCase.urgencyLevel}
                </span>
              </div>

              {/* Scenario Context */}
              <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl mb-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                <strong className="text-blue-900 font-bold">{isEn ? 'Situation: ' : 'Situasi: '}</strong>{currentCase.scenarioContext}
              </div>

              {/* Simulated Phone UI Box */}
              <div className="rounded-3xl border-4 border-slate-800 bg-slate-950 text-white p-5 space-y-4 shadow-xl font-sans">
                {/* Caller details */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3.5">
                    <div className="w-13 h-13 rounded-2xl bg-red-600 text-white flex items-center justify-center font-bold text-lg animate-pulse shadow-md">
                      <PhoneCall className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base sm:text-lg text-white">{currentCase.callerIdentity}</h4>
                      <p className="text-xs text-slate-400">{currentCase.claimedAgency}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-amber-400 font-bold text-sm block">{currentCase.phoneNumber}</span>
                    <span className="text-slate-400 text-xs flex items-center gap-1 justify-end mt-0.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentCase.callDuration}</span>
                    </span>
                  </div>
                </div>

                {/* Call audio waveform & transcript */}
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 pb-1">
                    <span className="flex items-center gap-2 text-amber-400 font-semibold">
                      <Volume2 className="w-4 h-4 animate-bounce" />
                      <div className="flex items-center gap-0.5 h-4 px-1.5 py-0.5 bg-amber-500/20 rounded">
                        {[8, 14, 10, 16, 6].map((h, i) => (
                          <motion.span
                            key={i}
                            animate={{ height: [4, h, 4] }}
                            transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut' }}
                            className="w-1 bg-amber-400 rounded-full inline-block"
                          />
                        ))}
                      </div>
                      <span>{isEn ? 'Live Call Audio: ' : 'Audio Panggilan Langsung:'}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <VoiceOverButton
                        audioSrc={isEn ? `/audio/voice-over/call-scam-${currentCaseIndex + 1}-en.m4a` : `/audio/voice-over/call-scam-${currentCaseIndex + 1}-ms.m4a`}
                        text={currentCase.audioSimulatedText}
                        label={isEn ? 'Play Caller Voice' : 'Dengar Panggilan Scammer'}
                        playingLabel={isEn ? 'Stop Call' : 'Hentikan Panggilan'}
                        variant="pill"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRealStoryModal(true)}
                        className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-full text-amber-300 font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{t('game.realStoryBtn')}</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line space-y-2 shadow-inner">
                    {currentCase.audioSimulatedText}
                  </div>
                </div>
              </div>
            </div>

            {/* Prominent SemakMule Tool Button */}
            <div className="pt-2">
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5">
                  <span className="text-xs sm:text-sm text-amber-400 font-bold block flex items-center gap-1.5">
                    <Search className="w-4 h-4" />
                    <span>{isEn ? 'Investigation Tool: PDRM CCID SemakMule Database' : 'Alat Siasatan: Pangkalan Data CCID SemakMule PDRM'}</span>
                  </span>
                  <p className="text-xs text-slate-300">
                    {isEn ? 'Check caller number ' : 'Semak nombor telefon '}<code className="text-amber-300 font-bold">{currentCase.phoneNumber}</code>{isEn ? ' in police fraud records.' : ' dalam rekod jenayah penipuan polis.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSearchSemakMule}
                  className="px-4 py-2 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs rounded-xl cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                >
                  <span>{isEn ? 'Scan in SemakMule' : 'Imbas di SemakMule'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* SemakMule Result Box if clicked */}
              {showSemakMule && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-4 bg-red-50 border border-red-300 rounded-2xl space-y-2 text-red-950 text-xs sm:text-sm"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b border-red-200 font-bold">
                    <span className="flex items-center gap-1.5 text-red-800">
                      <ShieldAlert className="w-4 h-4 text-red-600" />
                      <span>{isEn ? 'PDRM SEMAKMULE SEARCH RESULT:' : 'HASIL CARIAN CCID SEMAKMULE PDRM:'}</span>
                    </span>
                    <span className="bg-red-600 text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                      {currentCase.semakMuleData.policeStatus}
                    </span>
                  </div>
                  <p>
                    {isEn ? 'Number: ' : 'Nombor: '}<strong>{currentCase.semakMuleData.queryNumber}</strong>{isEn ? ' has ' : ' mempunyai '}<strong>{currentCase.semakMuleData.reportsCount} {isEn ? 'ACTIVE POLICE REPORTS' : 'LAPORAN POLIS AKTIF'}</strong>!
                  </p>
                  <p className="text-xs text-slate-700">
                    {isEn ? 'Category: ' : 'Kategori Kes: '}{currentCase.semakMuleData.lastReportedCategory}. {isEn ? 'Do NOT transfer any money!' : 'Jangan sesekali pindahkan sebarang wang!'}
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Tactic Checklist & Decisions */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '2. Analysis & Decisions' : '2. Analisis & Keputusan Pasukan'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  isTacticsSubmitted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {!isTacticsSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Step 1 or Step 2 */}
            <div className="space-y-4 flex-1">
              {!isTacticsSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {isEn ? 'Step 1: Mark Suspicious Coercion Tactics' : 'Langkah 1: Tandakan Taktik Ugutan Pemanggil'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {isEn
                        ? 'Based on the caller transcript on the left, mark only suspicious threat tactics:'
                        : 'Berdasarkan percakapan pemanggil di sebelah kiri, tandakan ayat ugutan atau helah penipuan sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentCase.tactics.map((tactic) => {
                      const isMarked = selectedTacticIds.includes(tactic.id);

                      return (
                        <button
                          key={tactic.id}
                          type="button"
                          onClick={() => handleToggleTactic(tactic.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[56px] shadow-2xs ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm sm:text-base leading-snug">
                            {tactic.text}
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
                      <span>{isEn ? 'Tactics Analysis Outcome:' : 'Hasil Semakan Taktik:'}</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-xs">
                        +{tacticsScore} / 6 {t('game.pts')}
                      </span>
                    </div>
                    {currentCase.tactics.map(tactic => {
                      const isTicked = selectedTacticIds.includes(tactic.id);
                      if (isTicked && tactic.isTrap) {
                        return (
                          <div key={tactic.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                            <strong>✓ {isEn ? 'Accurately Spotted: ' : 'Tepat Dikesan: '}</strong> {tactic.text}
                            <p className="text-xs text-slate-700 mt-0.5">{tactic.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !tactic.isTrap) {
                        return (
                          <div key={tactic.id} className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950">
                            <strong>✕ {isEn ? 'False Alarm: ' : 'Tersilap Tanda: '}</strong> {tactic.text}
                            <p className="text-xs text-slate-700 mt-0.5">{tactic.explanation}</p>
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
                          {activeAction.isSafe ? (isEn ? 'Safe Action! (+6.5 Pts)' : 'Tindakan Tepat! (+6.5 Mata)') : (isEn ? 'Risk Warning' : 'Amaran Risiko')}
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
              {!isTacticsSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitTactics}
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
