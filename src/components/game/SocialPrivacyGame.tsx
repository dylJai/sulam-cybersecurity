'use client';

import React, { useState } from 'react';
import { getSocialPrivacyCases, SocialPrivacyCase } from '@/data/social-privacy-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import { saveChallengeResult } from '@/lib/storage';
import {
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Check,
  RotateCcw,
  Home,
  Award,
  Share2,
  Lock,
  Globe,
  Mic,
  Plane,
  Key,
  GraduationCap,
  Volume2,
  Play,
  Square
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';

export const SocialPrivacyGame: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';

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
  const [activePhotoTab, setActivePhotoTab] = useState<string>('img-boarding-pass');
  const [isVoiceNotePlaying, setIsVoiceNotePlaying] = useState<boolean>(false);
  const [voiceNoteCurrentTime, setVoiceNoteCurrentTime] = useState<string>('0:00');
  const [voiceNoteDuration, setVoiceNoteDuration] = useState<string>('0:18');

  React.useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
      setIsVoiceNotePlaying(false);
    };
  }, [currentCaseIndex]);

  const handleToggleVoiceNote = () => {
    playPopSound();
    if (isVoiceNotePlaying) {
      voiceOverManager.stopAll();
      setIsVoiceNotePlaying(false);
    } else {
      const audioUrl = isEn ? '/audio/voice-over/ai-clone-en.m4a' : '/audio/voice-over/ai-clone-ms.m4a';
      voiceOverManager.play({
        audioSrc: audioUrl,
        text: currentCase.postContent.text,
        lang: language,
        onStart: () => setIsVoiceNotePlaying(true),
        onEnd: () => {
          setIsVoiceNotePlaying(false);
          setVoiceNoteCurrentTime('0:00');
        },
        onError: () => {
          setIsVoiceNotePlaying(false);
          setVoiceNoteCurrentTime('0:00');
        },
        onProgress: (cur, dur) => {
          const curSec = Math.floor(cur);
          setVoiceNoteCurrentTime(`0:${curSec < 10 ? '0' : ''}${curSec}`);
          if (dur) {
            const durSec = Math.floor(dur);
            setVoiceNoteDuration(`0:${durSec < 10 ? '0' : ''}${durSec}`);
          }
        }
      });
    }
  };

  // Cumulative performance
  const [totalLeaksFound, setTotalLeaksFound] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showBadges, setShowBadges] = useState<boolean>(false);

  const cases = getSocialPrivacyCases(language);
  const currentCase: SocialPrivacyCase = cases[currentCaseIndex] || cases[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-privacy-hawk',
      name: isEn ? 'Community Privacy Eye' : 'Mata Privasi Komuniti',
      icon: '👁️',
      description: isEn
        ? 'Detect exposure of sensitive data in public social posts'
        : 'Mengesan pendedahan maklumat sensitif pada foto hantaran awam',
      isUnlocked: totalLeaksFound >= 4
    },
    {
      id: 'b-safe-word',
      name: isEn ? 'Secret Safe Word Specialist' : 'Pakar Kata Rahsia',
      icon: '🔑',
      description: isEn
        ? 'Test the Family Safe Word protocol against AI voice clones'
        : 'Menguji protokol Kata Laluan Rahsia Keluarga menentang AI',
      isUnlocked: safeWordTested
    },
    {
      id: 'b-deepfake-shield',
      name: isEn ? 'AI Deepfake Shield' : 'Kalis Klon AI',
      icon: '🛡️',
      description: isEn
        ? 'Complete the social privacy and AI clone voice challenge'
        : 'Menyelesaikan cabaran privasi dan suara tiruan AI',
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
    setActivePhotoTab('img-boarding-pass');
  };

  const handleToggleLeak = (id: string) => {
    if (isLeaksSubmitted) return;
    playPopSound();
    setSelectedLeakIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleTestSafeWord = () => {
    playSuccessChime();
    setShowSafeWordTool(true);
    setSafeWordTested(true);
  };

  const handleSubmitLeaks = () => {
    if (isLeaksSubmitted) return;
    setIsLeaksSubmitted(true);

    let score = 0;
    let correctlyIdentified = 0;

    currentCase.leakItems.forEach(item => {
      const isSelected = selectedLeakIds.includes(item.id);
      if (item.isVulnerability && isSelected) {
        score += 4;
        correctlyIdentified += 1;
      } else if (!item.isVulnerability && isSelected) {
        score = Math.max(0, score - 2);
      }
    });

    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

    const finalScore = Math.min(12, score);
    setLeakScore(finalScore);
    setTotalLeaksFound(prev => prev + correctlyIdentified);
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
      setTotalScore(prev => prev + 13);
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
      saveChallengeResult('social-privacy', finalScore, 50);
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
                  {isEn ? 'MISSION 06' : 'MISI 06'}
                </span>
                <span className="text-slate-500 font-semibold text-xs sm:text-sm">
                  {isEn ? '⏱️ 5-7 Mins • 50 Points' : '⏱️ 5-7 Minit • 50 Mata'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-snug">
                {t('m6.title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
                {isEn
                  ? 'Oversharing vacation photos, boarding pass barcodes, and children’s school badges on public Facebook accounts puts your home and loved ones at risk. Syndicates also use AI to clone children’s voices from short public videos. Learn how to audit posts and establish a Family Secret Safe Word.'
                  : 'Memuat naik gambar pas masuk penerbangan, kunci rumah, dan lencana sekolah anak di akaun media sosial awam mendedahkan keluarga kepada risiko pecah rumah dan penculikan palsu. Sindiket kini juga menggunakan AI untuk meniru suara anak. Ketahui cara mengaudit hantaran dan menetapkan Kata Laluan Rahsia Keluarga.'}
              </p>

              <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 block">
                  {isEn ? '📋 3 Core Steps in This Mission:' : '📋 3 Langkah Utama Menjaga Privasi & Menangkis Klon AI:'}
                </span>
                <div className="space-y-2 text-sm sm:text-base text-slate-700 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      1
                    </span>
                    <span>
                      <strong>{isEn ? 'Audit Boarding Pass Barcodes:' : 'Audit Kod Bar Tiket Penerbangan:'}</strong>{' '}
                      {isEn ? 'A boarding pass barcode contains passenger passport numbers and flight schedules.' : 'Kod bar tiket kapal terbang mengandungi nombor pasport dan jadual rumah kosong anda.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      2
                    </span>
                    <span>
                      <strong>{isEn ? 'Detect AI Voice Clone Notes:' : 'Kesan Suara Tiruan AI:'}</strong>{' '}
                      {isEn ? 'AI requires only 3 seconds of audio from TikTok to synthesize realistic voices.' : 'Teknologi AI moden hanya memerlukan 3 saat audio TikTok untuk meniru suara anak anda.'}
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-xs">
                      3
                    </span>
                    <span>
                      <strong>{isEn ? 'Adopt Family Secret Safe Word:' : 'Amalkan Kata Rahsia Keluarga:'}</strong>{' '}
                      {isEn ? 'Establish one secret code word known only to your immediate family to neutralize AI scams.' : 'Cipta satu perkataan sulit keluarga (contoh: nama kuih kegemaran) untuk menumpaskan penipu AI.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tools & Start CTA */}
            <div className="lg:col-span-5 bg-blue-50/60 border border-blue-100 rounded-3xl p-6 sm:p-7 space-y-5">
              <span className="text-sm font-extrabold text-blue-900 block pb-2 border-b border-blue-200/60">
                {isEn ? 'Community Defense Protocols:' : 'Protokol Pertahanan Stesen:'}
              </span>

              <div className="space-y-3.5 text-sm text-slate-700">
                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Lock className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'Family Secret Safe Word Protocol' : 'Protokol Kata Rahsia Keluarga'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Establish a private secret keyword to immediately verify any emergency calls requesting money.'
                      : 'Kunci keselamatan rahsia untuk mengesahkan sebarang panggilan kecemasan yang mendakwa anak meminta wang.'}
                  </p>
                </div>

                <div className="p-4 bg-white border border-blue-100 rounded-2xl space-y-1 shadow-2xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>{isEn ? 'AI Deepfake Shield Badges' : 'Lencana Kalis Klon AI'}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">
                    {isEn
                      ? 'Unlock 3 special badges including Community Privacy Eye and AI Deepfake Shield.'
                      : 'Kumpul 3 lencana pencapaian termasuk Mata Privasi dan Kalis Klon AI.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
                >
                  <span>{isEn ? 'Start Social Privacy Mission' : 'Mulakan Misi Privasi & Klon AI'}</span>
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
                  {isEn ? 'MISSION 06 REPORT COMPLETE' : 'LAPORAN MISI 06 SELESAI'}
                </span>
                <span className="text-slate-500 font-bold">{isEn ? 'SOCIAL PRIVACY & AI' : 'PRIVASI & KLON SUARA AI'}</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {isEn ? '🎉 Digital Privacy & AI Shield Ready!' : '🎉 Privasi Keluarga & Perisai AI Sedia!'}
                </h2>
                <p className="text-base text-slate-600 mt-2.5 leading-relaxed">
                  {isEn
                    ? 'Your team successfully identified oversharing dangers, audited boarding pass barcodes, and practiced the Family Secret Safe Word.'
                    : 'Pasukan anda telah selesai mengesan pendedahan maklumat sensitif, mengaudit kod bar tiket, dan mengamalkan protokol Kata Rahsia Keluarga.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3.5 border-y border-slate-100 py-4">
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.scenariosTested')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">2 / 2</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{isEn ? 'Privacy Leaks Found' : 'Kebocoran Dikesan'}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{totalLeaksFound}</span>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-xs uppercase text-slate-500 block font-bold">{t('results.safeDecisions')}</span>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 mt-1 block">{correctActionDecisions} / 2</span>
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
                {isEn ? 'Digital Community Privacy Principles:' : 'Prinsip Privasi Komuniti Digital:'}
              </span>

              <ul className="space-y-3.5 text-sm sm:text-base text-slate-700">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    <strong>{isEn ? 'Share Photos After Returning:' : 'Kongsi Foto Selepas Pulang:'}</strong>{' '}
                    {isEn
                      ? 'Only upload holiday pictures once you and your family are safely back home.'
                      : 'Muat naik gambar percutian hanya selepas anda dan keluarga selamat tiba di rumah semula.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    <strong>{isEn ? 'Practice Family Safe Word:' : 'Amalkan Kata Laluan Rahsia Keluarga:'}</strong>{' '}
                    {isEn
                      ? 'Create one secret code word (e.g. favorite family dessert) to verify any urgent calls asking for money.'
                      : 'Cipta satu perkataan sulit keluarga (contoh: nama kuih kegemaran) untuk mengesahkan sebarang panggilan kecemasan anak.'}
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-4 h-4" />
                  </span>
                  <span>
                    <strong>{isEn ? 'Protect Children’s Voice & Faces:' : 'Lindungi Wajah & Suara Kanak-kanak:'}</strong>{' '}
                    {isEn
                      ? 'Avoid sharing long videos of children speaking clearly in public TikTok or Facebook posts.'
                      : 'Elakkan memuat naik video kanak-kanak berdurasi panjang dengan suara jelas secara terbuka di TikTok atau Facebook.'}
                  </span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEn ? 'Repeat Mission' : 'Ulang Misi'}</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[50px] rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm text-center"
                >
                  <Home className="w-4 h-4" />
                  <span>{isEn ? 'Return to Home Menu' : 'Kembali ke Menu Utama'}</span>
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

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Facebook Post / WhatsApp Voice Note */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '1. Inspect Social Post & Evidence' : '1. Teliti Hantaran & Bahan Bukti'}</span>
                </span>
                <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                  {currentCase.category}
                </span>
              </div>

              {/* Profile Card Header */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    f
                  </div>
                  <div>
                    <span className="font-bold text-sm sm:text-base text-slate-900 block">{currentCase.profileOwner}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Globe className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isEn ? 'Privacy:' : 'Tetapan Privasi:'} <strong className="text-slate-700">{currentCase.postContent.privacySetting}</strong></span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <VoiceOverButton
                    text={currentCase.postContent.text}
                    label={isEn ? 'Listen to Post' : 'Dengar Hantaran'}
                    variant="badge"
                  />
                  <span className="text-xs text-slate-500 bg-white px-2.5 py-1 border border-slate-200 rounded-full font-medium">
                    {isEn ? '2 Hours Ago' : '2 Jam Lepas'}
                  </span>
                </div>
              </div>

              {/* Post Text */}
              <div className="p-4 bg-white border border-slate-200 rounded-2xl text-sm sm:text-base text-slate-800 leading-relaxed shadow-2xs">
                <p className="whitespace-pre-line font-medium">{currentCase.postContent.text}</p>
              </div>

              {/* CASE 1: RICH VISUAL EXAMPLE PICTURES */}
              {currentCase.id === 'soc-01' && currentCase.postContent.exampleImages && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>📸 {isEn ? 'Example Photos Uploaded By Salmah:' : 'Gambar Contoh Yang Dimuat Naik:'}</span>
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {isEn ? 'Click each photo to inspect' : 'Klik foto untuk teliti'}
                    </span>
                  </div>

                  {/* Photo Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-boarding-pass')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] ${
                        activePhotoTab === 'img-boarding-pass'
                          ? 'bg-blue-50 text-blue-900 border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <Plane className="w-4 h-4 text-blue-600" />
                      <span className="text-xs text-center leading-tight">
                        {isEn ? '1. Flight Ticket' : '1. Tiket Kapal'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-keys')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] ${
                        activePhotoTab === 'img-keys'
                          ? 'bg-blue-50 text-blue-900 border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <Key className="w-4 h-4 text-amber-600" />
                      <span className="text-xs text-center leading-tight">
                        {isEn ? '2. House Keys' : '2. Kunci Rumah'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-badge')}
                      className={`p-3 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] ${
                        activePhotoTab === 'img-badge'
                          ? 'bg-blue-50 text-blue-900 border-blue-600 font-bold shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs text-center leading-tight">
                        {isEn ? '3. School Badge' : '3. Lencana Anak'}
                      </span>
                    </button>
                  </div>

                  {/* ACTIVE PHOTO PREVIEW CARD */}
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white">
                    {activePhotoTab === 'img-boarding-pass' && (
                      <div className="p-4 sm:p-5 space-y-3 bg-slate-50/70">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-extrabold text-xs sm:text-sm uppercase text-slate-900">
                            {isEn ? 'FLIGHT BOARDING PASS' : 'PAS MASUK PENERBANGAN / BOARDING PASS'}
                          </span>
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                            {isEn ? '⚠️ BARCODE HAZARD' : '⚠️ AMARAN KOD BAR'}
                          </span>
                        </div>

                        {/* Generated Real Photo Preview */}
                        <div className="rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-900 shadow-sm relative group">
                          <img
                            src="/images/social-privacy/boarding-pass.png"
                            alt="Boarding Pass Leak"
                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                            <span>📷 {isEn ? 'Uploaded Photo: Boarding Pass' : 'Foto Dimuat Naik: Pas Masuk'}</span>
                          </div>
                        </div>

                        {/* Visual Boarding Pass Card */}
                        <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm shadow-2xs">
                          <div className="flex items-center justify-between border-b border-dashed border-slate-200 pb-2">
                            <div>
                              <span className="text-xs text-slate-500 block">{isEn ? 'PASSENGER:' : 'PENUMPANG:'}</span>
                              <strong className="text-sm sm:text-base text-slate-900">SALMAH / AHMAD MRS</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-slate-500 block">{isEn ? 'FLIGHT:' : 'PENERBANGAN:'}</span>
                              <strong className="text-sm sm:text-base text-slate-900">MH 002</strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-1">
                            <div>
                              <span className="text-xs text-slate-500 block">{isEn ? 'FROM:' : 'DARI:'}</span>
                              <strong className="text-xs sm:text-sm text-slate-900">KUL (KLIA)</strong>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">{isEn ? 'TO:' : 'KE:'}</span>
                              <strong className="text-xs sm:text-sm text-slate-900">LHR (London)</strong>
                            </div>
                            <div>
                              <span className="text-xs text-slate-500 block">{isEn ? 'SEAT:' : 'TEMPAT DUDUK:'}</span>
                              <strong className="text-xs sm:text-sm text-slate-900">{isEn ? '14A (Window)' : '14A (Tingkap)'}</strong>
                            </div>
                          </div>

                          {/* Barcode Graphic */}
                          <div className="pt-2 border-t border-slate-200 space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">{isEn ? 'BOOKING CODE (PNR):' : 'KOD TEMPAHAN (PNR):'} <strong>K7X9LQ</strong></span>
                              <span className="font-bold text-red-600">{isEn ? 'SCAN HAZARD!' : 'BAHAYA IMBASAN!'}</span>
                            </div>
                            <div className="h-10 bg-slate-100 border border-slate-300 rounded-lg p-1.5 flex items-center justify-center gap-1">
                              {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,1,3,2,1,4,3,2,1,3,1,4,2,3,1,2,4,1,3,2,1,4].map((w, idx) => (
                                <div
                                  key={idx}
                                  className="h-full bg-slate-900 rounded-xs"
                                  style={{ width: `${w * 2}px` }}
                                />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-red-700 block text-center bg-red-50 p-2 border border-red-200 rounded-xl leading-relaxed">
                              {isEn
                                ? '⚠️ Anyone can scan this barcode to retrieve your passport number and home departure itinerary!'
                                : '⚠️ Sesiapa sahaja di internet boleh mengimbas kod bar ini untuk membaca nombor pasport dan jadual rumah kosong anda!'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePhotoTab === 'img-keys' && (
                      <div className="p-4 sm:p-5 space-y-3 bg-slate-50/70">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-extrabold text-xs sm:text-sm uppercase text-slate-900">
                            {isEn ? 'HOUSE KEYS & ADDRESS TAG' : 'FOTO KUNCI RUMAH & TAG ALAMAT'}
                          </span>
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                            {isEn ? '⚠️ VACANT HOUSE' : '⚠️ ALAMAT RUMAH KOSONG'}
                          </span>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-900 shadow-sm relative group">
                          <img
                            src="/images/social-privacy/house-keys.png"
                            alt="House Keys Leak"
                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                            <span>📷 {isEn ? 'Uploaded Photo: House Keys & Tag' : 'Foto Dimuat Naik: Kunci & Tag Alamat'}</span>
                          </div>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm shadow-2xs">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl shadow-2xs">
                              🔑
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-slate-500 uppercase block font-bold">
                                {isEn ? 'Keychain Tag Reads:' : 'Tag Gantungan Kunci Tertera:'}
                              </span>
                              <strong className="text-sm sm:text-base text-red-700 block">
                                &ldquo;No. 12, Jalan Melati 4, Taman Melati&rdquo;
                              </strong>
                              <span className="text-xs text-slate-600 block">
                                {isEn ? 'Status: House left vacant for 14 days.' : 'Status: Rumah tidak berpenghuni selama 14 hari penuh.'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950 text-xs sm:text-sm leading-relaxed">
                            <strong>{isEn ? 'Physical Safety Risk:' : 'Bahaya Keselamatan Fizikal:'}</strong>{' '}
                            {isEn
                              ? 'Announcing your vacant home address publicly invites burglaries while you are away.'
                              : 'Mengumumkan alamat rumah dan memberitahu ia kosong secara awam menjemput penjenayah pecah rumah!'}
                          </div>
                        </div>
                      </div>
                    )}

                    {activePhotoTab === 'img-badge' && (
                      <div className="p-4 sm:p-5 space-y-3 bg-slate-50/70">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                          <span className="font-extrabold text-xs sm:text-sm uppercase text-slate-900">
                            {isEn ? 'CHILD IN SCHOOL UNIFORM' : 'FOTO ANAK BERPAKAIAN SERAGAM'}
                          </span>
                          <span className="bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                            {isEn ? '⚠️ SCHOOL BADGE' : '⚠️ LENCANA SEKOLAH TERDEDAH'}
                          </span>
                        </div>

                        <div className="rounded-2xl overflow-hidden border border-slate-200 mb-3 bg-slate-900 shadow-sm relative group">
                          <img
                            src="/images/social-privacy/school-badge.png"
                            alt="School Badge Leak"
                            className="w-full h-48 sm:h-56 object-cover group-hover:scale-102 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg border border-white/20 flex items-center gap-1.5">
                            <span>📷 {isEn ? 'Uploaded Photo: School Uniform & Badge' : 'Foto Dimuat Naik: Pakaian Seragam & Lencana'}</span>
                          </div>
                        </div>

                        <div className="p-5 bg-white border border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm shadow-2xs">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-2xs">
                              🎒
                            </div>
                            <div className="space-y-1">
                              <span className="text-xs text-slate-500 uppercase block font-bold">
                                {isEn ? 'Badge & Nametag:' : 'Lencana & Tanda Nama:'}
                              </span>
                              <strong className="text-sm sm:text-base text-slate-900 block">
                                SK TAMAN MELATI • FARHAN ({isEn ? 'YEAR 4' : 'TAHUN 4'})
                              </strong>
                              <span className="text-xs text-slate-600 block">
                                {isEn ? 'Shows the exact school location your child attends daily.' : 'Mendedahkan sekolah tempat anak pergi setiap pagi.'}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950 text-xs sm:text-sm leading-relaxed">
                            <strong>{isEn ? 'Child Safety Risk:' : 'Bahaya Keselamatan Anak:'}</strong>{' '}
                            {isEn
                              ? 'Enables scammers to stage fake kidnapping calls by citing your child’s school name accurately.'
                              : 'Memudahkan penipu membuat panggilan penculikan palsu dengan menyebut nama sekolah anak dengan tepat.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CASE 2: REALISTIC WHATSAPP AUDIO VOICE MEMO UI */}
              {currentCase.id === 'soc-02' && (
                <div className="space-y-4">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                    {isEn ? 'WhatsApp Audio Voice Memo Simulation (AI Clone):' : 'Simulasi Mesej Suara WhatsApp (Klon AI):'}
                  </span>

                  <div className="p-5 bg-slate-950 text-white rounded-3xl border-2 border-slate-800 space-y-4 shadow-xl">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                        <Volume2 className={`w-4 h-4 ${isVoiceNotePlaying ? 'animate-bounce' : ''}`} />
                        <span>{isEn ? 'Voice Note Received (Farhan)' : 'Mesej Suara Diterima (Farhan)'}</span>
                      </span>
                      <span className="font-mono text-emerald-300 font-bold">
                        {isVoiceNotePlaying ? `${voiceNoteCurrentTime} / ${voiceNoteDuration}` : voiceNoteDuration}
                      </span>
                    </div>

                    {/* WhatsApp Voice Note Bubble */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex items-center gap-3.5">
                      <button
                        type="button"
                        onClick={handleToggleVoiceNote}
                        aria-label={isVoiceNotePlaying ? (isEn ? 'Pause voice note' : 'Hentikan nota suara') : (isEn ? 'Play AI voice clone audio' : 'Mainkan audio klon AI')}
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 cursor-pointer shadow-md transition-all active:scale-95 ${
                          isVoiceNotePlaying
                            ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-900/50'
                            : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-950/50'
                        }`}
                      >
                        {isVoiceNotePlaying ? (
                          <Square className="w-5 h-5 fill-white text-white" />
                        ) : (
                          <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                        )}
                      </button>

                      {/* Sound Wave Animation Visualizer */}
                      <div className="flex-1 flex items-center gap-1 h-8">
                        {[4,8,14,10,18,12,6,16,22,18,8,12,20,15,10,24,18,14,8,16,12,6,14,18,10,6,12,8].map((h, i) => (
                          <motion.div
                            key={i}
                            animate={isVoiceNotePlaying ? { height: [4, h, 6, Math.max(4, h * 0.7), 4] } : { height: h }}
                            transition={isVoiceNotePlaying ? { repeat: Infinity, duration: 0.7 + (i % 5) * 0.12, ease: 'easeInOut' } : undefined}
                            className={`w-1 rounded-full transition-colors ${
                              isVoiceNotePlaying
                                ? 'bg-emerald-400'
                                : i < 18
                                ? 'bg-emerald-500'
                                : 'bg-slate-600'
                            }`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">
                          {isVoiceNotePlaying ? voiceNoteCurrentTime : voiceNoteDuration}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-800 text-xs flex items-center justify-center font-bold text-slate-300">
                          👦
                        </div>
                      </div>
                    </div>

                    {/* AI Deepfake Detection Spectrum Card */}
                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-1.5 text-xs sm:text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-amber-400 font-bold">
                          {isEn ? '🔬 Voice Spectrum Analysis:' : '🔬 Analisis Spektrum Suara:'}
                        </span>
                        <span className="text-rose-400 font-extrabold bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800">
                          {isEn ? '95% AI SYNTHESIS' : '95% SUARA KLON AI'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed">
                        {isEn
                          ? 'Caller’s voice was generated using AI based on a 5-second public TikTok video clip of your child.'
                          : 'Suara pemanggil dijana menggunakan teknologi AI berasaskan rakaman video TikTok anak anda selama beberapa saat.'}
                      </p>
                    </div>
                  </div>

                  {/* AI Voice Cloning Attack Flowchart / Infographic */}
                  {currentCase.postContent.aiVoiceIllustrationUrl && (
                    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white p-4 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <span className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                          <span>🤖 {isEn ? 'Anatomy of an AI Voice Clone Scam:' : 'Anatomi Jenayah Klon Suara AI:'}</span>
                        </span>
                        <span className="bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold text-xs">
                          {isEn ? 'Deepfake Education' : 'Pendidikan Deepfake'}
                        </span>
                      </div>

                      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                        <img
                          src={currentCase.postContent.aiVoiceIllustrationUrl}
                          alt={isEn ? 'AI Voice Cloning Scam Infographic' : 'Infografik Penipuan Klon Suara AI'}
                          className="w-full h-auto object-cover max-h-[300px]"
                        />
                      </div>

                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 space-y-1">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>💡 {isEn ? 'How Scammers Do It:' : 'Bagaimana Penjenayah Melakukannya:'}</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          {isEn
                            ? 'Scammers scrape public social media videos (TikTok / Reels / YouTube) for 3-5 seconds of clean voice audio, train a neural voice synthesizer in seconds, and call family members pretending to be in distress.'
                            : 'Penjenayah memuat turun video awam di media sosial (TikTok / Reels / YouTube) untuk mengambil sampel suara 3-5 saat, melatih sistem suara AI dalam beberapa saat, lalu menghubungi ibu bapa kononnya dalam kecemasan.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Safe Word Tool Action (Only for Case 2 AI Voice Clone) */}
            {currentCase.id === 'soc-02' && (
              <div className="pt-2">
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                  <div className="space-y-0.5">
                    <span className="text-xs sm:text-sm text-amber-400 font-bold block flex items-center gap-1.5">
                      <Lock className="w-4 h-4" />
                      <span>{isEn ? 'Protocol: Family Secret Safe Word Test' : 'Protokol: Ujian Kata Laluan Rahsia Keluarga'}</span>
                    </span>
                    <p className="text-xs text-slate-300">
                      {isEn ? 'Ask caller the pre-agreed family safe word to verify identity.' : 'Minta pemanggil menyebut perkataan sulit keluarga untuk mematikan klon AI.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestSafeWord}
                    className="px-4 py-2 bg-amber-400 text-slate-950 hover:bg-amber-300 font-bold text-xs rounded-xl cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0 transition-colors"
                  >
                    <span>{isEn ? 'Test Safe Word' : 'Uji Kata Rahsia'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Safe Word Result Box if clicked */}
                {showSafeWordTool && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 p-4 bg-emerald-50 border border-emerald-300 rounded-2xl space-y-2 text-emerald-950 text-xs sm:text-sm"
                  >
                    <div className="flex items-center justify-between pb-1.5 border-b border-emerald-200 font-bold">
                      <span className="flex items-center gap-1.5 text-emerald-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>{isEn ? 'SAFE WORD CHALLENGE RESULT:' : 'HASIL UJIAN KATA RAHSIA KELUARGA:'}</span>
                      </span>
                      <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-extrabold">
                        {isEn ? 'SCAMMER BLOCKED' : 'PENIPU GAGAL MENJAWAB'}
                      </span>
                    </div>
                    <p className="font-bold">
                      {isEn
                        ? 'When asked for the family safe word ("Karipap-Rangup"), the caller panicked and abruptly hung up!'
                        : 'Apabila diminta menyebut kata rahsia keluarga ("Karipap-Rangup"), pemanggil gagap dan terus memutuskan talian!'}
                    </p>
                    <p className="text-xs text-slate-700">
                      {isEn
                        ? 'AI deepfakes cannot guess private family codes that are never posted online.'
                        : 'Klon AI tidak boleh meneka perkataan peribadi yang tidak pernah dimuat naik ke internet.'}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Leak Checklist & Actions */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-7 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs sm:text-sm">
                <span className="font-extrabold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>{isEn ? '2. Privacy Analysis & Decisions' : '2. Analisis Privasi & Tindakan'}</span>
                </span>
                <span className={`px-3 py-1 rounded-full font-bold text-xs ${
                  isLeaksSubmitted ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-blue-50 text-blue-800 border border-blue-200'
                }`}>
                  {!isLeaksSubmitted ? t('game.step1Badge') : t('game.step2Badge')}
                </span>
              </div>
            </div>

            {/* Step 1 or Step 2 */}
            <div className="space-y-4 flex-1">
              {!isLeaksSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                      {isEn ? 'Step 1: Mark Dangerous Privacy Leaks' : 'Langkah 1: Tandakan Kebocoran Maklumat Bahaya'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {isEn
                        ? 'Based on the evidence on the left, mark only the dangerous vulnerabilities:'
                        : 'Berdasarkan bukti di sebelah kiri, tandakan bahagian yang mendedahkan maklumat bahaya:'}
                    </p>
                  </div>

                  <div className="space-y-3">
                    {currentCase.leakItems.map((item) => {
                      const isMarked = selectedLeakIds.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleLeak(item.id)}
                          className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[56px] shadow-2xs ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm sm:text-base leading-snug">
                            {item.label}
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
                      <span>{isEn ? 'Privacy Audit Findings:' : 'Hasil Audit Privasi:'}</span>
                      <span className="bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full text-xs">
                        +{leakScore} / 12 {t('game.pts')}
                      </span>
                    </div>
                    {currentCase.leakItems.map(item => {
                      const isTicked = selectedLeakIds.includes(item.id);
                      if (isTicked && item.isVulnerability) {
                        return (
                          <div key={item.id} className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-950">
                            <strong>✓ {isEn ? 'Vulnerability Spotted: ' : 'Kebocoran Dikesan: '}</strong> {item.label}
                            <p className="text-xs text-slate-700 mt-0.5">{item.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !item.isVulnerability) {
                        return (
                          <div key={item.id} className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-950">
                            <strong>✕ {isEn ? 'False Alarm: ' : 'Tersilap Tanda: '}</strong> {item.label}
                            <p className="text-xs text-slate-700 mt-0.5">{item.explanation}</p>
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
                          {activeAction.isSafe ? (isEn ? 'Safe Action! (+13 Pts)' : 'Tindakan Tepat! (+13 Mata)') : (isEn ? 'Risk Warning' : 'Amaran Risiko')}
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
              {!isLeaksSubmitted ? (
                <button
                  type="button"
                  onClick={handleSubmitLeaks}
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
