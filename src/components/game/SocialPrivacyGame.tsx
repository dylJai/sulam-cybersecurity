'use client';

import React, { useState } from 'react';
import { getSocialPrivacyCases, SocialPrivacyCase } from '@/data/social-privacy-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { useLanguage } from '@/context/LanguageContext';
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
  Mic,
  Plane,
  Key,
  GraduationCap,
  Volume2,
  Play
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
    if (currentCaseIndex + 1 < cases.length) {
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
            ← [{t('game.backMenu')}]
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  {isEn ? 'MISSION 06' : 'MISI 06'}
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  {isEn ? 'TIME: 5-7 MINS • MAX: 50 PTS' : 'MASA: 5-7 MINIT • MAKSIMUM: 50 MATA'}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                {isEn ? 'Social Media Privacy & AI Clone Detector' : 'Privasi Media Sosial & Pengesan Klon AI'}
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                {isEn
                  ? '“Posting flight boarding passes, house keys, or kids in school uniforms lets criminals grab passport details and target your empty house. Today, AI technology can also clone your family members’ voice to scam parents. Learn how to audit photos before sharing and establish a Family Safe Word.”'
                  : '“Memuat naik gambar pas masuk penerbangan, kunci rumah, atau anak berseragam sekolah memudahkan penjenayah mencuri maklumat pasport dan menyasarkan rumah anda. Kini, teknologi kecerdasan buatan (AI) juga mampu meniru suara ahli keluarga untuk menipu ibu bapa. Pelajari cara mengaudit foto hantaran dan amalkan Kata Laluan Rahsia Keluarga.”'}
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  {isEn ? '3 Community Privacy Guidelines:' : '3 Garis Panduan Privasi Komuniti:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{isEn ? '1. Hide Barcodes & Addresses' : '1. Tutup Kod Bar & Alamat'}</strong>
                    <p className="text-xs mt-0.5">
                      {isEn
                        ? 'Never post flight tickets or announce that your house is empty.'
                        : 'Jangan muat naik foto tiket kapal terbang atau umumkan rumah tidak berpenghuni.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{isEn ? '2. Family Safe Word' : '2. Kata Rahsia Keluarga'}</strong>
                    <p className="text-xs mt-0.5">
                      {isEn
                        ? 'One secret family code word to shut down emergency AI voice clone calls.'
                        : 'Satu perkataan sulit keluarga untuk mematikan panggilan penipuan klon suara AI.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>{isEn ? '3. Lock Profile Settings' : '3. Kunci Tetapan Profil'}</strong>
                    <p className="text-xs mt-0.5">
                      {isEn
                        ? 'Change Facebook post audience from "Public" to "Friends Only".'
                        : 'Tukar tetapan akaun Facebook daripada “Awam” kepada “Rakan Sahaja”.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                {isEn ? 'Station Interactive Tools:' : 'Alat Interaktif Stesen:'}
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Share2 className="w-4 h-4 text-[#8A241C]" />
                    <span>{isEn ? 'Social Post Photo Audit' : 'Audit Foto Hantaran Media Sosial'}</span>
                  </div>
                  <p>
                    {isEn
                      ? 'Inspect real visual examples of boarding passes, house keys, and school badges.'
                      : 'Lihat contoh gambar pas masuk kapal terbang, kunci rumah, dan lencana sekolah secara visual.'}
                  </p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <KeyRound className="w-4 h-4 text-[#1E4D2B]" />
                    <span>{isEn ? 'Family Safe Word Protocol Simulator' : 'Simulator Protokol Kata Rahsia Keluarga'}</span>
                  </div>
                  <p>
                    {isEn
                      ? 'Experience how a family secret word disarms AI voice cloning instantly.'
                      : 'Ketahui bagaimana perkataan rahsia keluarga menyekat penipuan klon suara AI sekelip mata.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>{isEn ? 'Start Privacy Audit & AI Detector' : 'Mulakan Audit Privasi & Pengesan AI'}</span>
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
                  {isEn ? 'MISSION 06 COMPLETED REPORT' : 'LAPORAN MISI 06 SELESAI'}
                </span>
                <span className="text-[#7C7E77]">
                  {isEn ? 'PRIVACY & AI VOICE CLONES' : 'PRIVASI & KLON SUARA AI'}
                </span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  {isEn ? 'Family Identity Secured!' : 'Identiti Keluarga Terpelihara!'}
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  {isEn
                    ? 'Your team successfully identified oversharing risks, protected physical home safety, and mastered defense tactics against AI voice clones.'
                    : 'Pasukan anda berjaya mengenal pasti bahaya perkongsian gambar berlebihan, melindungi keselamatan rumah, dan menguasai teknik menangkis klon suara AI.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">
                    {isEn ? 'Scenarios Investigated' : 'Senario Disiasat'}
                  </span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">
                    {cases.length} / {cases.length} {isEn ? 'Cases' : 'Kes'}
                  </span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">
                    {isEn ? 'Leaks Detected' : 'Kebocoran Dikesan'}
                  </span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">
                    {totalLeaksFound} {isEn ? 'Leaks' : 'Kebocoran'}
                  </span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">
                    {isEn ? 'Safe Decisions' : 'Keputusan Selamat'}
                  </span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">
                    {correctActionDecisions} / {cases.length}
                  </span>
                </div>
                <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/20 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#123E23] block font-bold">
                    {isEn ? 'Total Score' : 'Jumlah Mata'}
                  </span>
                  <span className="font-mono text-2xl font-black text-[#123E23] mt-1 block">
                    {Math.min(50, Math.round(totalScore))}{' '}
                    <span className="text-xs font-normal text-[#123E23]/70">/ 50</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                {isEn ? 'Digital Community Privacy Principles:' : 'Prinsip Privasi Komuniti Digital:'}
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    <strong>{isEn ? 'Share Photos After Returning:' : 'Kongsi Foto Selepas Pulang:'}</strong>{' '}
                    {isEn
                      ? 'Only upload holiday pictures once you and your family are safely back home.'
                      : 'Muat naik gambar percutian hanya selepas anda dan keluarga selamat tiba di rumah semula.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>
                    <strong>{isEn ? 'Practice Family Safe Word:' : 'Amalkan Kata Laluan Rahsia Keluarga:'}</strong>{' '}
                    {isEn
                      ? 'Create one secret code word (e.g. favorite family dessert) to verify any urgent calls asking for money.'
                      : 'Cipta satu perkataan sulit keluarga (contoh: nama kuih kegemaran) untuk mengesahkan sebarang panggilan kecemasan anak.'}
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
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
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEn ? 'Repeat Investigation' : 'Ulang Siasatan'}</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <Home className="w-4 h-4" />
                  <span>{t('game.backHome')}</span>
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
              ← [{t('game.backMenu')}]
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
            <button
              type="button"
              onClick={handleStart}
              title={isEn ? 'Restart from Case 1' : 'Mulakan Semula Dari Kes 1'}
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
              {t('game.score')}: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20 ml-1">{Math.round(totalScore)} / 50</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3 font-mono text-xs text-[#7C7E77]">
          <span>{t('game.missionProgress')}:</span>
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
        {/* LEFT COLUMN: Facebook Post with Example Pictures OR WhatsApp Voice Note (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-4 h-4 text-[#171914]" />
                  <span>{isEn ? '1. Examine Post & Photo Evidence' : '1. Teliti Hantaran & Foto Contoh'}</span>
                </span>
                <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-bold uppercase text-[11px]">
                  {currentCase.category}
                </span>
              </div>

              {/* Profile Card Header */}
              <div className="p-3 bg-[#FAF9F5] border border-[#171914]/20 rounded-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center font-mono font-bold text-sm">
                    f
                  </div>
                  <div>
                    <span className="font-bold text-sm text-[#171914] block">{currentCase.profileOwner}</span>
                    <span className="text-[11px] text-[#7C7E77] font-mono flex items-center gap-1">
                      <Globe className="w-3 h-3 text-[#1877F2]" />
                      <span>{isEn ? 'Status:' : 'Status:'} {currentCase.postContent.privacySetting}</span>
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-[#7C7E77] bg-white px-2 py-1 border border-[#171914]/15 rounded-xs">
                  {isEn ? '2 HOURS AGO' : '2 JAM LEPAS'}
                </span>
              </div>

              {/* Post Text */}
              <div className="p-4 bg-white border-2 border-[#171914]/20 rounded-sm space-y-3 font-sans text-xs sm:text-sm text-[#171914] leading-relaxed">
                <p className="whitespace-pre-line font-medium">{currentCase.postContent.text}</p>
              </div>

              {/* CASE 1: RICH VISUAL EXAMPLE PICTURES */}
              {currentCase.id === 'soc-01' && currentCase.postContent.exampleImages && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                      <span>{isEn ? '📸 Example Photos Uploaded By Salmah:' : '📸 Gambar Contoh Yang Dimuat Naik Kak Salmah:'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#7C7E77]">
                      {isEn ? 'CLICK TO VIEW PHOTO' : 'KLIK UNTUK LIHAT FOTO'}
                    </span>
                  </div>

                  {/* Photo Tabs */}
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-boarding-pass')}
                      className={`p-2.5 rounded-xs border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activePhotoTab === 'img-boarding-pass'
                          ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                          : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                      }`}
                    >
                      <Plane className="w-4 h-4" />
                      <span className="font-mono text-[11px] text-center leading-tight">
                        {isEn ? 'Photo 1: Flight Ticket' : 'Foto 1: Tiket Kapal'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-keys')}
                      className={`p-2.5 rounded-xs border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activePhotoTab === 'img-keys'
                          ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                          : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                      }`}
                    >
                      <Key className="w-4 h-4" />
                      <span className="font-mono text-[11px] text-center leading-tight">
                        {isEn ? 'Photo 2: House Keys' : 'Foto 2: Kunci Rumah'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePhotoTab('img-badge')}
                      className={`p-2.5 rounded-xs border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 ${
                        activePhotoTab === 'img-badge'
                          ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold shadow-xs'
                          : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-mono text-[11px] text-center leading-tight">
                        {isEn ? 'Photo 3: School Badge' : 'Foto 3: Lencana Anak'}
                      </span>
                    </button>
                  </div>

                  {/* ACTIVE PHOTO PREVIEW CARD */}
                  <div className="rounded-sm border-2 border-[#171914] overflow-hidden shadow-sm bg-white">
                    {activePhotoTab === 'img-boarding-pass' && (
                      <div className="p-4 space-y-3 bg-[#FCFAF5]">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171914]/15">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-[#8A241C]" />
                            <span className="font-mono font-bold text-xs uppercase text-[#171914]">
                              {isEn ? 'FLIGHT BOARDING PASS' : 'PAS MASUK PENERBANGAN / BOARDING PASS'}
                            </span>
                          </div>
                          <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-mono font-bold text-[10px]">
                            {isEn ? '⚠️ BARCODE HAZARD' : '⚠️ AMARAN KOD BAR'}
                          </span>
                        </div>

                        {/* Visual Boarding Pass Card */}
                        <div className="p-4 bg-white border border-[#171914]/20 rounded-xs space-y-3 font-mono text-xs shadow-xs">
                          <div className="flex items-center justify-between border-b border-dashed border-[#171914]/20 pb-2">
                            <div>
                              <span className="text-[10px] text-[#7C7E77] block">{isEn ? 'PASSENGER:' : 'PENUMPANG:'}</span>
                              <strong className="text-sm text-[#171914]">SALMAH / AHMAD MRS</strong>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-[#7C7E77] block">{isEn ? 'FLIGHT:' : 'PENERBANGAN:'}</span>
                              <strong className="text-sm text-[#171914]">MH 002</strong>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 py-1">
                            <div>
                              <span className="text-[10px] text-[#7C7E77] block">{isEn ? 'FROM:' : 'DARI:'}</span>
                              <strong className="text-xs text-[#171914]">KUL (KLIA)</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#7C7E77] block">{isEn ? 'TO:' : 'KE:'}</span>
                              <strong className="text-xs text-[#171914]">LHR (London)</strong>
                            </div>
                            <div>
                              <span className="text-[10px] text-[#7C7E77] block">{isEn ? 'SEAT:' : 'TEMPAT DUDUK:'}</span>
                              <strong className="text-xs text-[#171914]">{isEn ? '14A (Window)' : '14A (Tingkap)'}</strong>
                            </div>
                          </div>

                          {/* Authentic Barcode Graphic Representation */}
                          <div className="pt-2 border-t border-[#171914]/15 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] text-[#7C7E77]">{isEn ? 'BOOKING CODE (PNR):' : 'KOD TEMPAHAN (PNR):'} <strong>K7X9LQ</strong></span>
                              <span className="text-[10px] font-bold text-[#8A241C]">{isEn ? 'SCAN HAZARD!' : 'BAHAYA IMBASAN!'}</span>
                            </div>
                            <div className="h-10 bg-white border border-slate-300 rounded-xs p-1 flex items-center justify-center gap-0.5">
                              {/* SVG-like Barcode Lines */}
                              {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,1,3,2,1,4,3,2,1,3,1,4,2,3,1,2,4,1,3,2,1,4].map((w, idx) => (
                                <div
                                  key={idx}
                                  className="h-full bg-slate-900"
                                  style={{ width: `${w * 2}px` }}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] font-bold text-[#8A241C] block text-center bg-[#FAF0E6] py-1 border border-[#8A241C]/30 rounded-xs">
                              {isEn
                                ? '⚠️ This barcode holds Passport No., Phone No. & booking details that criminals can scan!'
                                : '⚠️ Kod bar ini mengandungi No. Pasport, No. Telefon & data tiket yang boleh dicuri orang asing!'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {activePhotoTab === 'img-keys' && (
                      <div className="p-4 space-y-3 bg-[#FCFAF5]">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171914]/15">
                          <div className="flex items-center gap-2">
                            <Key className="w-4 h-4 text-[#8A241C]" />
                            <span className="font-mono font-bold text-xs uppercase text-[#171914]">
                              {isEn ? 'HOUSE KEYS & ADDRESS TAG' : 'FOTO KUNCI RUMAH & TAG ALAMAT'}
                            </span>
                          </div>
                          <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-mono font-bold text-[10px]">
                            {isEn ? '⚠️ VACANT HOUSE ADDRESS' : '⚠️ ALAMAT RUMAH KOSONG'}
                          </span>
                        </div>

                        {/* Visual House Key Card */}
                        <div className="p-5 bg-white border border-[#171914]/20 rounded-xs space-y-3 font-mono text-xs shadow-xs">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#FAF0E6] border-2 border-[#8A241C] flex items-center justify-center text-2xl shadow-xs">
                              🔑
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#7C7E77] uppercase block font-bold">
                                {isEn ? 'Keychain Tag Reads:' : 'Tag Gantungan Kunci Tertera:'}
                              </span>
                              <strong className="text-sm sm:text-base text-[#8A241C] block">
                                &ldquo;No. 12, Jalan Melati 4, Taman Melati&rdquo;
                              </strong>
                              <span className="text-[11px] text-[#575953] block">
                                {isEn ? 'Status: House left completely vacant for 14 straight days.' : 'Status: Rumah tidak berpenghuni selama 14 hari penuh.'}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C] text-xs">
                            <strong>{isEn ? 'Physical Safety Hazard:' : 'Bahaya Keselamatan Fizikal:'}</strong>{' '}
                            {isEn
                              ? 'Broadcasting your home address and announcing it is empty invites burglaries!'
                              : 'Memberitahu lokasi alamat rumah dan mengumumkan ia kosong secara awam menjemput penjenayah pecah rumah!'}
                          </div>
                        </div>
                      </div>
                    )}

                    {activePhotoTab === 'img-badge' && (
                      <div className="p-4 space-y-3 bg-[#FCFAF5]">
                        <div className="flex items-center justify-between pb-2 border-b border-[#171914]/15">
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-[#8A241C]" />
                            <span className="font-mono font-bold text-xs uppercase text-[#171914]">
                              {isEn ? 'CHILD IN SCHOOL UNIFORM' : 'FOTO ANAK BERPAKAIAN SERAGAM SEKOLAH'}
                            </span>
                          </div>
                          <span className="bg-[#FAF0E6] text-[#8A241C] border border-[#8A241C]/30 px-2 py-0.5 rounded-xs font-mono font-bold text-[10px]">
                            {isEn ? '⚠️ SCHOOL BADGE EXPOSED' : '⚠️ LENCANA SEKOLAH TERDEDAH'}
                          </span>
                        </div>

                        {/* Visual School Uniform Card */}
                        <div className="p-5 bg-white border border-[#171914]/20 rounded-xs space-y-3 font-mono text-xs shadow-xs">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-[#E7F3EB] border-2 border-[#1E4D2B] flex items-center justify-center text-2xl shadow-xs">
                              🎒
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] text-[#7C7E77] uppercase block font-bold">
                                {isEn ? 'Badge & Nametag:' : 'Lencana & Tanda Nama:'}
                              </span>
                              <strong className="text-sm sm:text-base text-[#171914] block">
                                SK TAMAN MELATI • FARHAN ({isEn ? 'YEAR 4' : 'TAHUN 4'})
                              </strong>
                              <span className="text-[11px] text-[#575953] block">
                                {isEn ? 'Shows the exact school location your child attends daily.' : 'Menunjukkan lokasi sekolah anak pergi setiap pagi.'}
                              </span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C] text-xs">
                            <strong>{isEn ? 'Child Safety Hazard:' : 'Bahaya Keselamatan Anak:'}</strong>{' '}
                            {isEn
                              ? 'Enables extortionists to stage fake kidnapping calls by citing your child’s name and school accurately.'
                              : 'Memudahkan sindiket penipuan membuat panggilan penculikan palsu dengan menyebut nama anak dan nama sekolahnya dengan tepat.'}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CASE 2: REALISTIC WHATSAPP AUDIO VOICE MEMO UI */}
              {currentCase.id === 'soc-02' && (
                <div className="space-y-3">
                  <span className="font-mono text-xs font-bold text-[#171914] uppercase tracking-wider block">
                    {isEn ? 'WhatsApp Audio Voice Memo Simulation (AI Clone):' : 'Simulasi Pemain Mesej Suara WhatsApp (Klon AI):'}
                  </span>

                  <div className="p-4 bg-[#0F141C] text-white rounded-sm border-2 border-[#171914] space-y-3 shadow-md">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] font-mono text-slate-400">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Volume2 className="w-4 h-4" />
                        <span>{isEn ? 'WhatsApp Voice Note Received' : 'Mesej Suara WhatsApp Diterima'}</span>
                      </span>
                      <span>0:38 / 0:38</span>
                    </div>

                    {/* WhatsApp Voice Note Bubble */}
                    <div className="p-3 bg-[#1F2C34] border border-[#2A3942] rounded-md flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center shrink-0 cursor-pointer shadow-xs">
                        <Play className="w-5 h-5 fill-slate-900 ml-0.5" />
                      </div>

                      {/* Sound Wave Animation Visualizer */}
                      <div className="flex-1 flex items-center gap-0.5 h-6">
                        {[4,8,14,10,18,12,6,16,22,18,8,12,20,15,10,24,18,14,8,16,12,6,14,18,10,6,12,8].map((h, i) => (
                          <div
                            key={i}
                            className={`w-1 rounded-full ${i < 18 ? 'bg-emerald-400' : 'bg-slate-600'}`}
                            style={{ height: `${h}px` }}
                          />
                        ))}
                      </div>

                      <div className="w-7 h-7 rounded-full bg-slate-700 text-[10px] flex items-center justify-center font-bold text-slate-300">
                        👦
                      </div>
                    </div>

                    {/* AI Deepfake Detection Spectrum Card */}
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xs space-y-1 font-mono text-xs">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-amber-400 font-bold">
                          {isEn ? '🔬 Voice Spectrum Analysis:' : '🔬 Analisis Spektrum Suara:'}
                        </span>
                        <span className="text-[#FA8072] font-bold">
                          {isEn ? '95% AI CLONE' : '95% KLON AI'}
                        </span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">
                        {isEn
                          ? 'Caller’s voice was synthesized using AI based on a 5-second public TikTok video clip of your child.'
                          : 'Suara pemanggil dijana menggunakan teknologi AI berasaskan rakaman video TikTok anak anda selama 5 saat.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Family Safe Word Tool Action */}
            <div className="pt-2">
              <div className="p-3 bg-[#171914] text-white rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs text-[#D9FA62] font-bold block flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4" />
                    <span>
                      {isEn
                        ? 'Defense Tool: Family Safe Word Protocol'
                        : 'Alat Pertahanan: Protokol Kata Rahsia Keluarga (*Family Safe Word*)'}
                    </span>
                  </span>
                  <p className="text-[11px] text-slate-300">
                    {isEn
                      ? 'Learn how to test suspected AI voice callers with a secret family word.'
                      : 'Ketahui cara menguji pemanggil klon AI dengan perkataan rahsia keluarga.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestSafeWord}
                  className="px-4 py-2.5 bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] font-mono font-bold text-xs uppercase rounded-xs cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>{isEn ? 'Test AI Safe Word' : 'Uji Kata Rahsia AI'}</span>
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
                      <span>{isEn ? 'HOW A SECRET SAFE WORD DEFEATS AI:' : 'BAGAIMANA KATA RAHSIA MENUMPASKAN AI:'}</span>
                    </span>
                    <span className="bg-[#1E4D2B] text-white px-2 py-0.5 rounded-xs text-[10px]">
                      {isEn ? 'BULLETPROOF SHIELD' : 'PERISAI KEBAL'}
                    </span>
                  </div>
                  <p>
                    {isEn
                      ? 'AI voice clones can mimic tone and speech 100%, but AI DOES NOT KNOW the private code word set only between you and your child (e.g. “Onde-Onde”).'
                      : 'Klon suara AI boleh meniru nada percakapan 100% tepat, tetapi AI TIDAK TAHU kata laluan rahsia yang hanya anda dan anak anda tetapkan di rumah (cth: “Onde-Onde”).'}
                  </p>
                  <p className="text-[11px] text-[#575953]">
                    {isEn
                      ? 'When a panicked caller fails to provide the safe word, you immediately know it is an AI clone scam!'
                      : 'Bila pemanggil cemas gagal menjawab kata laluan rahsia, anda pasti ia adalah penipuan klon AI!'}
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
                  <span>{isEn ? '2. Leak Analysis & Actions' : '2. Analisis Kebocoran & Tindakan'}</span>
                </span>
                <span className={`px-2 py-0.5 rounded-xs font-bold text-[11px] ${
                  isLeaksSubmitted ? 'bg-[#E7F3EB] text-[#123E23]' : 'bg-[#D9FA62] text-[#171914]'
                }`}>
                  {!isLeaksSubmitted
                    ? (isEn ? 'STEP 1: DETECT LEAKS' : 'LANGKAH 1: KESAN KEBOCORAN')
                    : (isEn ? 'STEP 2: TAKE ACTION' : 'LANGKAH 2: BERTINDAK')}
                </span>
              </div>
            </div>

            {/* Step 1: Detect Leaks or Step 2: Choose Action */}
            <div className="space-y-4 flex-1">
              {!isLeaksSubmitted ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      {isEn ? 'Step 1: Mark Dangerous Exposures' : 'Langkah 1: Tandakan Pendedahan Berbahaya'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1 leading-relaxed">
                      {isEn
                        ? 'Based on the post and photo evidence on the left, check ONLY items that ENDANGER SAFETY:'
                        : 'Berdasarkan hantaran dan foto di sebelah kiri, tandakan maklumat yang MEMBAHAYAKAN KESELAMATAN sahaja:'}
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
                            {isMarked ? (isEn ? '✓ MARKED' : '✓ DITANDAKAN') : (isEn ? '+ MARK' : '+ TANDAKAN')}
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
                      <span className="font-bold text-[#171914]">
                        {isEn ? 'Privacy Audit Outcome:' : 'Hasil Audit Privasi:'}
                      </span>
                      <span className="font-bold bg-[#D9FA62] px-2 py-0.5 rounded-xs text-[#171914]">
                        +{leakScore} / 12 {isEn ? 'Points' : 'Mata'}
                      </span>
                    </div>
                    {currentCase.leakItems.map(l => {
                      const isTicked = selectedLeakIds.includes(l.id);
                      if (isTicked && l.isVulnerability) {
                        return (
                          <div key={l.id} className="p-2 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-[#123E23]">
                            <strong>{isEn ? '✓ Correctly Detected:' : '✓ Tepat Dikesan:'}</strong> {l.label}
                            <p className="text-[11px] text-[#575953] mt-0.5">{l.explanation}</p>
                          </div>
                        );
                      }
                      if (isTicked && !l.isVulnerability) {
                        return (
                          <div key={l.id} className="p-2 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C]">
                            <strong>{isEn ? '✕ False Alarm:' : '✕ Tersilap Tanda:'}</strong> {l.label} {isEn ? '(This is harmless public text, not sensitive data)' : '(Ini ucapan umum, bukan data sensitif)'}
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#171914] tracking-tight">
                      {isEn ? 'Step 2: What is the Safest Course of Action?' : 'Langkah 2: Apakah Tindakan Paling Selamat?'}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#575953] mt-1">
                      {isEn
                        ? 'Select the best action to protect your family safety:'
                        : 'Pilih keputusan tindakan terbaik untuk melindungi keselamatan keluarga:'}
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
                            {activeAction.isSafe
                              ? (isEn ? 'Correct Action! (+13 Points)' : 'Tindakan Tepat! (+13 Mata)')
                              : (isEn ? 'Risk Warning' : 'Amaran Risiko')}
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
                  <span>{isEn ? 'Confirm Detected Leaks & Proceed to Step 2 →' : 'Sahkan Kebocoran Dikesan & Ke Langkah 2 →'}</span>
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
                      ? (isEn ? 'View Mission 06 Completed Report' : 'Lihat Laporan Misi 06 Selesai')
                      : (isEn ? `Next Scenario (Case 0${currentCaseIndex + 2})` : `Senario Seterusnya (Kes 0${currentCaseIndex + 2})`)}
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
