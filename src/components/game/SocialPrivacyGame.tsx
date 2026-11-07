'use client';

import React, { useState, useEffect, useRef } from 'react';
import { getSocialPrivacyCases, SocialPrivacyCase } from '@/data/social-privacy-data';
import { BadgeItem } from '@/components/game/BadgesDrawer';
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
  Globe,
  Plane,
  Key,
  GraduationCap,
  Volume2,
  Play,
  Square,
  CreditCard,
  Lock
} from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';
import {
  StationTopBar,
  StationBriefing,
  StationResults,
  TakeawayCard,
  InfoBanner,
  PrimaryButton
} from '@/components/game/station';

/* =========================================================================
   3 MOST INSTRUCTIVE CASES FOR 7-MINUTE SPRINT
   1. soc-01: Vacation Facebook Post (Boarding pass barcode, house keys, child school badge)
   2. soc-02: WhatsApp AI Voice Clone Note (Emergency hospital cash request & Family Safe Word)
   3. soc-03: Instagram Selfie with MyKad & JPJ Driving License (12-digit IC, home address, signature)
   ========================================================================= */
const SELECTED_CASE_IDS = ['soc-01', 'soc-02', 'soc-03'];

export const SocialPrivacyGame: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Stepper state: Question 1 (leaks) vs Question 2 (action decision)
  const [questionStep, setQuestionStep] = useState<1 | 2>(1);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

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

  // Cumulative performance
  const [totalLeaksFound, setTotalLeaksFound] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

  // DOM Refs for accessibility and keyboard focus handoff
  const questionPanelRef = useRef<HTMLDivElement>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
      setIsVoiceNotePlaying(false);
    };
  }, [currentCaseIndex, stage]);

  // Auto-focus first interactive element when swapping question steps
  useEffect(() => {
    if (stage !== 'investigating') return;

    const timeout = setTimeout(() => {
      if (firstInteractiveRef.current) {
        firstInteractiveRef.current.focus({ preventScroll: window.innerWidth >= 1024 });
      }
    }, 60);

    // Fallback on mobile: smoothly scroll right question panel into view
    if (typeof window !== 'undefined' && window.innerWidth < 1024 && questionPanelRef.current) {
      questionPanelRef.current.scrollIntoView({
        behavior: shouldReduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }

    return () => clearTimeout(timeout);
  }, [questionStep, isLeaksSubmitted, isActionSubmitted, currentCaseIndex, stage, shouldReduceMotion]);

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

  // Filter to the 3 selected cases
  const allCases = getSocialPrivacyCases(language);
  const cases = allCases.filter(c => SELECTED_CASE_IDS.includes(c.id));
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
      isUnlocked: totalLeaksFound >= 5
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
        ? 'Completed Station 06 social privacy and AI voice defense'
        : 'Menyelesaikan cabaran Stesen 06 privasi dan suara tiruan AI',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    playPopSound();
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalLeaksFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSafeWordTested(false);
  };

  const resetCaseState = () => {
    setQuestionStep(1);
    setSelectedLeakIds([]);
    setIsLeaksSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setLeakScore(0);
    setShowSafeWordTool(false);
    setActivePhotoTab('img-boarding-pass');
    setIsVoiceNotePlaying(false);
    setHoveredActionId(null);
  };

  const handleResetForNextGroup = () => {
    playPopSound();
    voiceOverManager.stopAll();
    setIsVoiceNotePlaying(false);
    setStage('briefing');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalLeaksFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSafeWordTested(false);
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

    const realVulnerabilities = currentCase.leakItems.filter(item => item.isVulnerability);
    const harmlessItems = currentCase.leakItems.filter(item => !item.isVulnerability);
    const pointsPerItem = Math.floor(10 / Math.max(1, realVulnerabilities.length));
    const remainder = 10 - (pointsPerItem * realVulnerabilities.length);

    let score = 0;
    let correctlyIdentified = 0;

    realVulnerabilities.forEach((item, idx) => {
      if (selectedLeakIds.includes(item.id)) {
        score += pointsPerItem + (idx === 0 ? remainder : 0);
        correctlyIdentified += 1;
      }
    });

    harmlessItems.forEach(item => {
      if (selectedLeakIds.includes(item.id)) {
        score = Math.max(0, score - 3);
      }
    });

    const finalScore = Math.min(10, Math.max(0, score));
    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

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
      // Case 1 & 2 award 7 pts; Case 3 awards 6 pts (Total actions = 20 pts)
      const actionAward = currentCaseIndex < 2 ? 7 : 6;
      setTotalScore(prev => prev + actionAward);
    } else {
      playWarningTone();
    }
  };

  const finalizeResults = () => {
    voiceOverManager.stopAll();
    setIsVoiceNotePlaying(false);
    const finalScore = Math.min(50, Math.round(totalScore));
    saveChallengeResult('social-privacy', finalScore, 50);
    triggerCelebration();
    setStage('results');
  };

  const handleNextCase = () => {
    playPopSound();
    if (currentCaseIndex + 1 < cases.length) {
      setCurrentCaseIndex(prev => prev + 1);
      resetCaseState();
    } else {
      finalizeResults();
    }
  };

  /* =========================================================================
     STAGE 1: BRIEFING (StationBriefing)
     ========================================================================= */
  if (stage === 'briefing') {
    return (
      <StationBriefing
        stationNumber="06"
        stationName={isEn ? 'Social Privacy' : 'Privasi Media Sosial'}
        title={isEn ? 'Social Privacy & AI Deepfake Voice Defense' : 'Pertahanan Privasi Media Sosial & Klon AI'}
        description={
          isEn
            ? 'Your team of 5 will audit 3 sensitive social media posts, spot oversharing vulnerabilities that invite burglaries, neutralize AI voice clones, and practice the Family Secret Safe Word.'
            : 'Kumpulan anda akan mengaudit 3 hantaran media sosial, mengesan kebocoran maklumat yang mengundang bahaya pecah rumah, menangkis klon suara AI, dan mengamalkan Kata Rahsia Keluarga.'
        }
        voiceOverText={
          isEn
            ? 'Social Privacy and AI Deepfake Voice Defense. Your team will audit 3 sensitive scenarios: vacation boarding pass barcode leaks, AI voice clones pretending to be a distressed child, and unredacted MyKad identity cards. Establish your Family Secret Safe Word and protect your household.'
            : 'Pertahanan Privasi Media Sosial dan Klon AI. Kumpulan anda akan mengaudit 3 hantaran sensitif: kod bar tiket penerbangan dan kunci rumah, klon suara AI anak meminta wang cemas, dan foto kad pengenalan MyKad terbuka. Tetapkan Kata Rahsia Keluarga dan lindungi keselamatan rumah anda.'
        }
        privacyNotice={{
          title: isEn ? '⚠️ Core Rule: Privacy Protects Physical Safety!' : '⚠️ Peraturan Emas: Privasi Digital Melindungi Keselamatan Fizikal!',
          description: isEn
            ? 'Photos uploaded online are never truly private. Barcodes on boarding passes contain unencrypted passport data, and 3 seconds of audio from a public TikTok video is enough for AI to clone your child’s voice.'
            : 'Gambar yang dimuat naik ke media sosial tidak pernah benar-benar peribadi. Kod bar tiket kapal terbang mengandungi data pasport tanpa enkripsi, dan 3 saat audio daripada video TikTok sudah mencukupi untuk AI meniru suara anak anda.'
        }}
        steps={[
          {
            title: isEn ? 'Audit Boarding Pass Barcodes' : 'Audit Kod Bar Tiket Penerbangan',
            description: isEn
              ? 'Recognize how boarding pass barcodes leak passenger passport numbers, flight schedules, and announce empty homes.'
              : 'Ketahui bagaimana kod bar tiket mendedahkan nombor pasport dan jadual rumah tidak berpenghuni.'
          },
          {
            title: isEn ? 'Neutralize AI Voice Clones' : 'Tumpaskan Klon Suara AI',
            description: isEn
              ? 'Detect synthesized distress calls generated from short public videos and refuse unverified transfers.'
              : 'Kesan panggilan cemas tiruan yang dijana daripada video TikTok dan tolak pindahan wang ke akaun keldai.'
          },
          {
            title: isEn ? 'Deploy Family Secret Safe Word' : 'Gunakan Kata Rahsia Keluarga',
            description: isEn
              ? 'Establish one secret family codeword known only to immediate family to instantly defeat AI impersonators.'
              : 'Cipta satu perkataan sulit keluarga (contoh: nama kuih kegemaran) untuk mengesahkan sebarang panggilan kecemasan.'
          }
        ]}
        onStart={handleStart}
        startLabel={isEn ? 'Start Mission →' : 'Mula Misi →'}
      />
    );
  }

  /* =========================================================================
     STAGE 3: RESULTS (StationResults & BadgesDrawer)
     ========================================================================= */
  if (stage === 'results') {
    const finalScore = Math.min(50, Math.round(totalScore));
    const rating: 'Gold' | 'Silver' | 'Bronze' =
      finalScore >= 40 ? 'Gold' : finalScore >= 25 ? 'Silver' : 'Bronze';

    const ratingTitle =
      rating === 'Gold'
        ? isEn
          ? 'Gold Shield Rank (Privacy Champion)'
          : 'Peringkat Perisai Emas (Juara Privasi Digital)'
        : rating === 'Silver'
        ? isEn
          ? 'Silver Defender Rank (Vigilant Citizen)'
          : 'Peringkat Pembela Perak (Waspada & Prihatin)'
        : isEn
        ? 'Bronze Recruit Rank (Needs Hardening)'
        : 'Peringkat Pelatih Gangsa (Perlu Diperkukuh)';

    return (
      <StationResults
        stationNumber="06"
        rating={rating}
        ratingTitle={ratingTitle}
        ratingDescription={
          isEn
            ? 'Great job completing all social privacy audits and establishing your family safe word.'
            : 'Tahniah kerana berjaya mengaudit hantaran media sosial dan menetapkan kata rahsia keluarga.'
        }
        badges={badges}
        homeTips={[
          {
            title: isEn ? 'Practice Post-Trip Sharing' : 'Amalkan "Post-Trip Sharing"',
            description: isEn
              ? 'Only upload holiday photos, travel itineraries, or check-ins after you and your family have safely returned home to keep your vacant house safe.'
              : 'Hanya muat naik gambar percutian, tiket penerbangan, atau lokasi pelancongan selepas anda dan keluarga telah selamat pulang ke rumah semula untuk mengelak risiko pecah rumah.'
          },
          {
            title: isEn ? 'Establish a Family Secret Safe Word' : 'Cipta Kata Laluan Rahsia Keluarga',
            description: isEn
              ? 'Agree on one private keyword with your family that is never posted online. If anyone calls claiming an emergency and asks for funds, ask for the safe word first.'
              : 'Pilih satu perkataan rahsia bersama pasangan dan anak-anak yang tidak pernah ditulis di internet. Jika sesiapa mendakwa dalam kecemasan dan meminta wang, minta kata rahsia tersebut terlebih dahulu.'
          },
          {
            title: isEn ? 'Protect Children’s Voices & School Badges' : 'Lindungi Suara & Identiti Anak',
            description: isEn
              ? 'Avoid posting long, clear audio of children speaking on public social accounts. Blur school badges and name tags on uniforms to prevent targeted impersonation and kidnapping scams.'
              : 'Elakkan memuat naik video kanak-kanak bercakap dengan jelas secara berdurasi panjang di akaun awam. Tutup lencana sekolah dan tanda nama anak pada pakaian seragam untuk mencegah penipuan penculikan.'
          }
        ]}
        onReset={handleResetForNextGroup}
      />
    );
  }

  /* =========================================================================
     STAGE 2: INVESTIGATION (SPLIT SCREEN VIEWPORT-FITTING)
     ========================================================================= */
  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);

  // Tailored Golden Takeaways for Each of the 3 Selected Cases
  const caseTakeaways = [
    {
      number: 1,
      text: isEn
        ? 'Never post photos of boarding passes or house keys online. Barcodes contain unencrypted passport details, and broadcasting that your home is vacant invites burglaries. Always practice post-trip sharing once you are safely back home.'
        : 'Jangan sesekali memuat naik gambar pas masuk penerbangan (Boarding Pass) atau kunci rumah. Kod bar mengandungi maklumat pasport sulit, dan mengumumkan rumah kosong menjemput perompak pecah rumah. Amalkan berkongsi foto percutian hanya selepas selamat pulang ke rumah.'
    },
    {
      number: 2,
      text: isEn
        ? 'Modern AI needs only 3 seconds of audio from a public TikTok video to synthesize realistic voice clones. Establish a private "Family Secret Safe Word" (e.g. favorite dessert) to instantly verify any urgent calls requesting money.'
        : 'Teknologi AI moden hanya memerlukan 3 saat audio daripada video TikTok untuk meniru suara ahli keluarga. Tetapkan "Kata Laluan Rahsia Keluarga" (contoh: nama kuih kegemaran) untuk mengesahkan sebarang panggilan kecemasan meminta wang.'
    },
    {
      number: 3,
      text: isEn
        ? 'Your 12-digit MyKad number and signature are high-value official identity assets. Never post photos of your ID cards or driver\'s licenses online, as syndicates harvest them to register untraceable SIM cards and apply for illegal loans.'
        : 'Nombor MyKad 12-digit dan tandatangan adalah data identiti rasmi paling kritikal di Malaysia. Jangan tayang kad pengenalan di media sosial kerana ia boleh disalahgunakan oleh sindiket untuk mendaftar kad SIM gelap atau pinjaman wang haram.'
    }
  ];

  const currentTakeaway = caseTakeaways[currentCaseIndex] || caseTakeaways[0];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2 space-y-4">
      {/* Station Top Bar with Timer and Progress */}
      <StationTopBar
        stationNumber="06"
        stationName={isEn ? 'Social Privacy' : 'Privasi Media Sosial'}
        stepLabel={
          isEn
            ? `Case ${currentCaseIndex + 1} of 3: ${currentCase.title}`
            : `Kes ${currentCaseIndex + 1} daripada 3: ${currentCase.title}`
        }
        stepIndex={currentCaseIndex + 1}
        stepTotal={3}
        onReset={handleResetForNextGroup}
        icon={<UserCheck className="w-6 h-6" />}
      />

      {/* Main 2-Column Split - Viewport fitting on laptop (1366x768+) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-210px)] lg:min-h-[520px]">
        {/* ===================================================================
            LEFT COLUMN: SOCIAL POST & EVIDENCE (Cols 1-7, Internal Scroll Only)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 border-b-2 border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <span className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>{isEn ? '1. Inspect Social Post & Evidence' : '1. Teliti Hantaran & Bahan Bukti'}</span>
            </span>
            <span className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider">
              {currentCase.category}
            </span>
          </div>

          {/* Body (Scrollable inside, never overflows page) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            {/* Safety Advisory Banner */}
            <InfoBanner
              variant="amber"
              title={isEn ? 'Personal Data Protection Rule' : 'Prinsip Perlindungan Data Peribadi'}
              description={
                isEn
                  ? 'Never post boarding passes, house keys, or MyKad photos online. Always verify emergency distress calls using your Family Secret Safe Word.'
                  : 'Jangan sesekali memuat naik tiket penerbangan, kunci rumah, atau MyKad ke media sosial. Sentiasa sahkan panggilan kecemasan menggunakan Kata Rahsia Keluarga.'
              }
            />

            {/* Profile Card Header */}
            <div className="p-3.5 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
                  f
                </div>
                <div>
                  <span className="font-black text-sm sm:text-base text-slate-900 block leading-tight">{currentCase.profileOwner}</span>
                  <span className="text-xs sm:text-sm text-slate-600 flex items-center gap-1.5 font-bold mt-0.5">
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>{isEn ? 'Privacy:' : 'Privasi:'} <strong className="text-slate-800">{currentCase.postContent.privacySetting}</strong></span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <VoiceOverButton
                  text={currentCase.postContent.text}
                  label={isEn ? 'Listen' : 'Dengar'}
                  variant="badge"
                />
                <span className="text-xs text-slate-600 bg-white px-2.5 py-1 border border-slate-300 rounded-full font-bold shadow-2xs">
                  {isEn ? '2h ago' : '2j lepas'}
                </span>
              </div>
            </div>

            {/* Post Text */}
            <div className="p-4 bg-white border-2 border-slate-200 rounded-2xl text-sm sm:text-base text-slate-800 leading-relaxed shadow-sm font-medium">
              <p className="whitespace-pre-line">{currentCase.postContent.text}</p>
            </div>

            {/* CASE 1: RICH VISUAL EXAMPLE PICTURES */}
            {currentCase.id === 'soc-01' && currentCase.postContent.exampleImages && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    <span>📸</span>
                    <span>{isEn ? 'Photos Uploaded By Salmah:' : 'Gambar Yang Dimuat Naik:'}</span>
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {isEn ? 'Click each photo to inspect' : 'Klik foto untuk teliti'}
                  </span>
                </div>

                {/* Photo Tabs */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('img-boarding-pass')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] active:scale-95 ${
                      activePhotoTab === 'img-boarding-pass'
                        ? 'bg-blue-50 text-blue-950 border-blue-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Plane className="w-4 h-4 text-blue-600" />
                    <span className="text-xs text-center font-bold leading-tight">
                      {isEn ? '1. Flight Ticket' : '1. Tiket Kapal'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('img-keys')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] active:scale-95 ${
                      activePhotoTab === 'img-keys'
                        ? 'bg-blue-50 text-blue-950 border-blue-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <Key className="w-4 h-4 text-amber-600" />
                    <span className="text-xs text-center font-bold leading-tight">
                      {isEn ? '2. House Keys' : '2. Kunci Rumah'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActivePhotoTab('img-badge')}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer flex flex-col items-center gap-1 min-h-[64px] active:scale-95 ${
                      activePhotoTab === 'img-badge'
                        ? 'bg-blue-50 text-blue-950 border-blue-600 font-black shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs text-center font-bold leading-tight">
                      {isEn ? '3. School Badge' : '3. Lencana Anak'}
                    </span>
                  </button>
                </div>

                {/* ACTIVE PHOTO PREVIEW CARD */}
                <div className="rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm bg-white">
                  {activePhotoTab === 'img-boarding-pass' && (
                    <div className="p-4 space-y-3 bg-slate-50/70">
                      <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
                        <span className="font-black text-xs sm:text-sm uppercase text-slate-900">
                          {isEn ? 'FLIGHT BOARDING PASS' : 'PAS MASUK PENERBANGAN'}
                        </span>
                        <span className="bg-rose-50 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full font-black text-[11px]">
                          {isEn ? '⚠️ BARCODE HAZARD' : '⚠️ AMARAN KOD BAR'}
                        </span>
                      </div>

                      <div className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3 text-xs sm:text-sm shadow-sm font-medium">
                        <div className="flex items-center justify-between border-b-2 border-dashed border-slate-200 pb-2">
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase block font-bold">{isEn ? 'PASSENGER:' : 'PENUMPANG:'}</span>
                            <strong className="text-sm sm:text-base text-slate-900 font-black">SALMAH / AHMAD MRS</strong>
                          </div>
                          <div className="text-right">
                            <span className="text-[11px] text-slate-500 uppercase block font-bold">{isEn ? 'FLIGHT:' : 'PENERBANGAN:'}</span>
                            <strong className="text-sm sm:text-base text-slate-900 font-black">MH 002</strong>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-0.5">
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase block font-bold">{isEn ? 'FROM:' : 'DARI:'}</span>
                            <strong className="text-xs sm:text-sm text-slate-900 font-black">KUL (KLIA)</strong>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase block font-bold">{isEn ? 'TO:' : 'KE:'}</span>
                            <strong className="text-xs sm:text-sm text-slate-900 font-black">LHR (London)</strong>
                          </div>
                          <div>
                            <span className="text-[11px] text-slate-500 uppercase block font-bold">{isEn ? 'SEAT:' : 'TEMPAT:'}</span>
                            <strong className="text-xs sm:text-sm text-slate-900 font-black">14A</strong>
                          </div>
                        </div>

                        {/* Barcode Graphic */}
                        <div className="pt-2 border-t-2 border-slate-200 space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600 font-bold">{isEn ? 'PNR:' : 'KOD:'} <strong className="text-slate-900">K7X9LQ</strong></span>
                            <span className="font-black text-rose-600 uppercase">{isEn ? 'SCAN HAZARD!' : 'BAHAYA IMBASAN!'}</span>
                          </div>
                          <div className="h-10 bg-slate-100 border border-slate-300 rounded-lg p-1.5 flex items-center justify-center gap-1">
                            {[3,1,4,2,1,3,2,4,1,2,3,1,4,2,1,3,2,1,4,3,2,1,3,1,4,2,3,1,2,4,1,3,2,1,4].map((w, idx) => (
                              <div
                                key={idx}
                                className="h-full bg-slate-900 rounded-xs"
                                style={{ width: `${w * 1.8}px` }}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-rose-800 block text-center bg-rose-50 p-2 border border-rose-300 rounded-lg leading-normal">
                            {isEn
                              ? '⚠️ Scanning this barcode retrieves your passport number and home departure itinerary!'
                              : '⚠️ Mengimbas kod bar ini mendedahkan nombor pasport dan tarikh rumah anda kosong!'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {activePhotoTab === 'img-keys' && (
                    <div className="p-4 space-y-3 bg-slate-50/70">
                      <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
                        <span className="font-black text-xs sm:text-sm uppercase text-slate-900">
                          {isEn ? 'HOUSE KEYS & ADDRESS TAG' : 'FOTO KUNCI RUMAH & TAG ALAMAT'}
                        </span>
                        <span className="bg-rose-50 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full font-black text-[11px]">
                          {isEn ? '⚠️ VACANT HOUSE' : '⚠️ RUMAH KOSONG'}
                        </span>
                      </div>

                      <div className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-sm shrink-0">
                            🔑
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-500 uppercase block font-bold">
                              {isEn ? 'Keychain Tag Reads:' : 'Tag Kunci Tertera:'}
                            </span>
                            <strong className="text-sm sm:text-base text-rose-700 font-black block">
                              &ldquo;No. 12, Jalan Melati 4, Taman Melati&rdquo;
                            </strong>
                            <span className="text-xs text-slate-600 block font-medium">
                              {isEn ? 'Status: House left vacant for 14 full days.' : 'Status: Rumah tidak berpenghuni selama 14 hari.'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-lg text-rose-950 text-xs sm:text-sm leading-relaxed font-medium">
                          <strong className="font-black">{isEn ? 'Safety Risk:' : 'Bahaya Keselamatan:'}</strong>{' '}
                          {isEn
                            ? 'Announcing your vacant home address publicly invites burglaries while you are away.'
                            : 'Mengumumkan alamat rumah kosong secara awam menjemput penjenayah pecah rumah!'}
                        </div>
                      </div>
                    </div>
                  )}

                  {activePhotoTab === 'img-badge' && (
                    <div className="p-4 space-y-3 bg-slate-50/70">
                      <div className="flex items-center justify-between pb-1.5 border-b-2 border-slate-200">
                        <span className="font-black text-xs sm:text-sm uppercase text-slate-900">
                          {isEn ? 'CHILD IN SCHOOL UNIFORM' : 'FOTO ANAK BERPAKAIAN SERAGAM'}
                        </span>
                        <span className="bg-rose-50 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full font-black text-[11px]">
                          {isEn ? '⚠️ SCHOOL BADGE' : '⚠️ LENCANA SEKOLAH'}
                        </span>
                      </div>

                      <div className="p-4 bg-white border-2 border-slate-200 rounded-xl space-y-3 shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-2xl shadow-sm shrink-0">
                            🎒
                          </div>
                          <div className="space-y-0.5">
                            <span className="text-xs text-slate-500 uppercase block font-bold">
                              {isEn ? 'Badge & Nametag Reads:' : 'Lencana Tertera:'}
                            </span>
                            <strong className="text-sm sm:text-base text-slate-900 font-black block">
                              SK TAMAN MELATI • FARHAN ({isEn ? 'YEAR 4' : 'TAHUN 4'})
                            </strong>
                            <span className="text-xs text-slate-600 block font-medium">
                              {isEn ? 'Shows the exact school location your child attends daily.' : 'Mendedahkan sekolah tempat anak hadir setiap hari.'}
                            </span>
                          </div>
                        </div>

                        <div className="p-3 bg-rose-50 border-2 border-rose-300 rounded-lg text-rose-950 text-xs sm:text-sm leading-relaxed font-medium">
                          <strong className="font-black">{isEn ? 'Child Safety Risk:' : 'Bahaya Keselamatan Anak:'}</strong>{' '}
                          {isEn
                            ? 'Enables scammers to stage fake kidnapping calls by citing your child’s school name accurately.'
                            : 'Memudahkan penipu membuat panggilan penculikan palsu dengan menyebut nama sekolah anak.'}
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
                <span className="text-sm sm:text-base font-black text-slate-900 block">
                  {isEn ? 'WhatsApp Voice Memo Simulation (AI Clone):' : 'Simulasi Mesej Suara WhatsApp (Klon AI):'}
                </span>

                <div className="p-4 bg-slate-950 text-white rounded-2xl border-2 border-slate-800 space-y-3 shadow-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs sm:text-sm text-slate-400">
                    <span className="flex items-center gap-2 text-emerald-400 font-black text-sm">
                      <Volume2 className="w-4 h-4" />
                      <span>{isEn ? 'Voice Note (Farhan)' : 'Nota Suara (Farhan)'}</span>
                    </span>
                    <span className="font-mono text-emerald-300 font-black text-xs sm:text-sm">
                      {isVoiceNotePlaying ? `${voiceNoteCurrentTime} / ${voiceNoteDuration}` : voiceNoteDuration}
                    </span>
                  </div>

                  {/* WhatsApp Voice Note Bubble */}
                  <div className="p-3.5 bg-slate-900 border-2 border-slate-800 rounded-xl flex items-center gap-3">
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
                        <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                      )}
                    </button>

                    {/* Sound Wave Animation Visualizer */}
                    <div className="flex-1 flex items-center gap-1 h-6">
                      {[4,8,14,10,18,12,6,16,22,18,8,12,20,15,10,24,18,14,8,16,12,6,14,18,10,6,12,8].map((h, i) => (
                        <motion.div
                          key={i}
                          animate={isVoiceNotePlaying && !shouldReduceMotion ? { height: [4, h, 6, Math.max(4, h * 0.7), 4] } : { height: h }}
                          transition={isVoiceNotePlaying && !shouldReduceMotion ? { repeat: Infinity, duration: 0.7 + (i % 5) * 0.12, ease: 'easeInOut' } : undefined}
                          className={`w-1 rounded-full transition-colors ${
                            isVoiceNotePlaying
                              ? 'bg-emerald-400'
                              : i < 18
                              ? 'bg-emerald-500'
                              : 'bg-slate-600'
                          }`}
                          style={{ height: `${h * 0.8}px` }}
                        />
                      ))}
                    </div>

                    <div className="w-8 h-8 rounded-full bg-slate-800 text-sm flex items-center justify-center font-bold text-slate-300 shrink-0">
                      👦
                    </div>
                  </div>

                  {/* AI Deepfake Detection Spectrum Card */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-400 font-black">
                        {isEn ? '🔬 Voice Spectrum Analysis:' : '🔬 Analisis Spektrum Suara:'}
                      </span>
                      <span className="text-rose-400 font-black bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-800 text-xs">
                        {isEn ? '95% AI SYNTHESIS' : '95% SUARA KLON AI'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-medium">
                      {isEn
                        ? 'Caller’s voice was generated using AI based on a 5-second public TikTok video clip of your child.'
                        : 'Suara pemanggil dijana menggunakan AI berasaskan rakaman video TikTok anak anda selama 5 saat.'}
                    </p>
                  </div>
                </div>

                {/* Safe Word Tool Action */}
                <div className="space-y-2">
                  <div className="p-4 bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border-2 border-slate-800">
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-sm sm:text-base text-amber-400 font-black flex items-center gap-2">
                        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>{isEn ? 'Family Secret Safe Word Test' : 'Ujian Kata Laluan Rahsia Keluarga'}</span>
                      </span>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        {isEn ? 'Ask caller the pre-agreed family safe word to verify identity.' : 'Minta pemanggil menyebut perkataan sulit keluarga untuk mematikan klon AI.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleTestSafeWord}
                      className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer min-h-[44px] flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-sm"
                    >
                      <Lock className="w-4 h-4" />
                      <span>{isEn ? 'Test Safe Word' : 'Uji Kata Rahsia'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  {showSafeWordTool && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-1.5 text-emerald-950 text-xs sm:text-sm shadow-sm"
                    >
                      <div className="flex items-center justify-between pb-1 border-b-2 border-emerald-200 font-black">
                        <span className="flex items-center gap-2 text-emerald-800 text-xs sm:text-sm">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{isEn ? 'SAFE WORD CHALLENGE RESULT:' : 'HASIL UJIAN KATA RAHSIA KELUARGA:'}</span>
                        </span>
                        <span className="bg-emerald-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
                          {isEn ? 'SCAMMER BLOCKED' : 'PENIPU GAGAL'}
                        </span>
                      </div>
                      <p className="font-bold text-slate-900 leading-relaxed text-xs sm:text-sm">
                        {isEn
                          ? 'When asked for the family safe word ("Karipap-Rangup"), the caller panicked, stuttered, and abruptly hung up!'
                          : 'Apabila diminta menyebut kata rahsia keluarga ("Karipap-Rangup"), pemanggil panik, gagap, dan terus memutuskan panggilan!'}
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* CASE 3: VISUAL MYKAD & JPJ DRIVING LICENSE CARD */}
            {currentCase.id === 'soc-03' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="font-black text-slate-900 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>{isEn ? 'Uploaded Identity Document Analysis:' : 'Analisis Dokumen Pengenalan Dimuat Naik:'}</span>
                  </span>
                  <span className="bg-rose-50 text-rose-700 border border-rose-300 px-2.5 py-0.5 rounded-full font-black text-xs uppercase tracking-wider">
                    {isEn ? '⚠️ High ID Hazard' : '⚠️ Risiko Identiti Tinggi'}
                  </span>
                </div>

                <div className="p-4 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-2xl border-2 border-slate-700 shadow-xl space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-5 bg-blue-600 rounded flex items-center justify-center font-black text-[10px] text-white">
                        🇲🇾
                      </div>
                      <div>
                        <span className="text-[10px] font-black tracking-wider text-slate-300 block uppercase">
                          MALAYSIA • JPJ
                        </span>
                        <span className="text-xs font-black text-amber-400">
                          LESEN MEMANDU KOMPETEN (CDL)
                        </span>
                      </div>
                    </div>
                    <span className="text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40 px-2.5 py-0.5 rounded-full font-black">
                      {isEn ? 'UNREDACTED' : 'TANPA SENSOR'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div className="p-3 bg-rose-950/40 border-2 border-rose-500/50 rounded-xl space-y-1">
                      <span className="text-[11px] text-rose-300 font-black uppercase tracking-wider block">
                        ⚠️ NO. MYKAD:
                      </span>
                      <strong className="text-sm font-mono text-white tracking-widest block bg-black/50 px-2.5 py-1 rounded-lg border border-rose-500/40">
                        040512-10-5843
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-900 border border-slate-700 rounded-xl space-y-1">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                        NAMA PEMEGANG:
                      </span>
                      <strong className="text-sm text-white font-black block">
                        AMIRUL BIN ZULKIFLI
                      </strong>
                    </div>

                    <div className="p-3 bg-rose-950/40 border-2 border-rose-500/50 rounded-xl space-y-0.5 sm:col-span-2">
                      <span className="text-[11px] text-rose-300 font-black uppercase tracking-wider block">
                        ⚠️ ALAMAT KEDIAMAN KELUARGA:
                      </span>
                      <strong className="text-xs sm:text-sm text-white block bg-black/50 px-2.5 py-1 rounded-lg border border-rose-500/40 font-bold">
                        NO 45, JALAN ANGGERIK 3, SEKSYEN 7, 40000 SHAH ALAM, SELANGOR
                      </strong>
                    </div>

                    <div className="p-3 bg-rose-950/40 border-2 border-rose-500/50 rounded-xl space-y-1 sm:col-span-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-rose-300 font-black uppercase">
                          ⚠️ TANDATANGAN PEMILIK:
                        </span>
                        <span className="text-amber-400 font-mono">
                          {isEn ? 'Easily Forged' : 'Mudah Dijiplak'}
                        </span>
                      </div>
                      <div className="bg-white/10 p-2 rounded-lg border border-dashed border-rose-400/50 flex items-center justify-center">
                        <span className="font-serif italic text-base text-emerald-300 tracking-wider">
                          Amirul_Zulkifli
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 text-xs leading-relaxed font-medium">
                    💡 {isEn
                      ? 'Syndicates harvest public MyKad photos to register unauthorized telco SIM cards and apply for illegal loans.'
                      : 'PDRM melaporkan sindiket menggunakan foto MyKad awam untuk mendaftar kad SIM gelap dan pinjaman haram.'}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Evidence Footer helper info */}
          <div className="p-3 border-t-2 border-slate-100 text-xs sm:text-sm text-slate-500 flex items-center justify-between font-medium shrink-0 bg-slate-50/50">
            <span>{isEn ? 'Keep social evidence in view while answering →' : 'Rujuk bukti semasa menjawab di kanan →'}</span>
            <span className="font-black text-slate-700">
              {isEn ? `${currentCase.leakItems.length} vulnerability items` : `${currentCase.leakItems.length} bahagian disemak`}
            </span>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: ACTIVE QUESTION (Cols 8-12, Sticky Footer)
            =================================================================== */}
        <div
          ref={questionPanelRef}
          className="lg:col-span-5 flex flex-col h-full rounded-3xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden"
        >
          {/* Stepper Header */}
          <div className="p-4 pb-3 border-b-2 border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <span className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span>
                {questionStep === 1
                  ? isEn ? 'Question 1 of 2' : 'Soalan 1 daripada 2'
                  : isEn ? 'Question 2 of 2' : 'Soalan 2 daripada 2'}
              </span>
            </span>
            <span
              className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                questionStep === 1
                  ? isLeaksSubmitted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                  : isActionSubmitted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {questionStep === 1
                ? isLeaksSubmitted
                  ? isEn ? 'Audit Findings' : 'Hasil Audit'
                  : isEn ? 'Check Leaks' : 'Semak Kebocoran'
                : isActionSubmitted
                ? isEn ? 'Result & Takeaway' : 'Keputusan & Prinsip'
                : isEn ? 'Choose Safe Action' : 'Pilih Tindakan'}
            </span>
          </div>

          {/* Question Body (Scrollable, padded) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            <motion.div
              key={`${currentCaseIndex}-${questionStep}-${isLeaksSubmitted ? 'reviewed' : 'select'}-${isActionSubmitted ? 'done' : 'action'}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* =============================================================
                  STEP 1: MARK DANGEROUS PRIVACY LEAKS (or review)
                  ============================================================= */}
              {questionStep === 1 && !isLeaksSubmitted && (
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {isEn ? 'Step 1: Mark Dangerous Privacy Leaks' : 'Langkah 1: Tandakan Kebocoran Maklumat Bahaya'}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed font-medium">
                      {isEn
                        ? 'Based on the evidence on the left, mark only the dangerous vulnerabilities:'
                        : 'Berdasarkan bukti di sebelah kiri, tandakan bahagian yang mendedahkan maklumat bahaya:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.leakItems.map((item, idx) => {
                      const isMarked = selectedLeakIds.includes(item.id);

                      return (
                        <button
                          key={item.id}
                          ref={idx === 0 ? firstInteractiveRef : undefined}
                          type="button"
                          onClick={() => handleToggleLeak(item.id)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 min-h-[52px] shadow-2xs active:scale-95 ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-black leading-snug pr-2">
                            {item.label}
                          </span>
                          <span
                            className={`shrink-0 text-xs font-black uppercase px-3 py-1 rounded-full border transition-colors ${
                              isMarked
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {isMarked ? (isEn ? '✓ Marked' : '✓ Ditanda') : (isEn ? 'Mark' : 'Tanda')}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 1 Compact Review after submission */}
              {questionStep === 1 && isLeaksSubmitted && (
                <div className="space-y-3.5">
                  <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-sm font-black text-slate-900">
                      <span className="flex items-center gap-2 text-emerald-800">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        <span>{isEn ? 'Question 1 Review:' : 'Hasil Semakan Soalan 1:'}</span>
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full text-xs font-black">
                        {isEn ? 'Reviewed' : 'Selesai Disemak'}
                      </span>
                    </div>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {currentCase.leakItems.map(item => {
                        const isTicked = selectedLeakIds.includes(item.id);
                        if (isTicked && item.isVulnerability) {
                          return (
                            <div key={item.id} className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✓ {isEn ? 'Vulnerability Spotted:' : 'Kebocoran Dikesan:'} {item.label}</strong>
                              <p className="text-xs text-slate-700 mt-1">{item.explanation}</p>
                            </div>
                          );
                        }
                        if (isTicked && !item.isVulnerability) {
                          return (
                            <div key={item.id} className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✕ {isEn ? 'False Alarm (Harmless Text):' : 'Tersilap Tanda (Teks Biasa):'} {item.label}</strong>
                              <p className="text-xs text-slate-700 mt-1">{item.explanation}</p>
                            </div>
                          );
                        }
                        if (!isTicked && item.isVulnerability) {
                          return (
                            <div key={item.id} className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">⚠ {isEn ? 'Missed Vulnerability:' : 'Kebocoran Terlepas:'} {item.label}</strong>
                              <p className="text-xs text-slate-700 mt-1">{item.explanation}</p>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-2xl text-xs sm:text-sm text-blue-950 font-medium flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>
                      {isEn
                        ? 'Great! Click the button below to continue to Question 2 (Safe Action).'
                        : 'Bagus! Klik butang di bawah untuk meneruskan ke Soalan 2 (Tindakan Selamat).'}
                    </span>
                  </div>
                </div>
              )}

              {/* =============================================================
                  STEP 2: CHOOSE SAFE ACTION (or outcome review)
                  ============================================================= */}
              {questionStep === 2 && !isActionSubmitted && (
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {isEn ? 'Step 2: Choose Safe Action' : 'Langkah 2: Pilih Tindakan Selamat'}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 font-medium leading-relaxed">
                      {isEn
                        ? 'Select the safest protective action your team should take right now:'
                        : 'Pilih tindakan perlindungan terbaik yang perlu diambil oleh pasukan anda:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.actions.map((act, idx) => {
                      const isSelected = selectedActionId === act.id;
                      const isHovered = hoveredActionId === act.id;
                      const showDetails = isSelected || isHovered;

                      return (
                        <button
                          key={act.id}
                          ref={idx === 0 ? firstInteractiveRef : undefined}
                          type="button"
                          disabled={isActionSubmitted}
                          onClick={() => handleSelectAction(act.id)}
                          onMouseEnter={() => setHoveredActionId(act.id)}
                          onMouseLeave={() => setHoveredActionId(null)}
                          onFocus={() => setHoveredActionId(act.id)}
                          onBlur={() => setHoveredActionId(null)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all min-h-[52px] shadow-2xs ${
                            isSelected
                              ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          } ${isActionSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-1 min-w-0 flex-1">
                              <strong className="text-base font-black block leading-snug">
                                {act.title}
                              </strong>
                              {showDetails && (
                                <p className="text-sm text-slate-600 font-medium leading-relaxed pt-0.5">
                                  {act.description}
                                </p>
                              )}
                            </div>
                            <span
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                                isSelected
                                  ? 'border-blue-600 bg-blue-600 text-white'
                                  : 'border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2 Outcome & Golden Takeaway */}
              {questionStep === 2 && isActionSubmitted && (
                <div className="space-y-4">
                  {activeAction && (
                    <motion.div
                      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-2xl border-2 space-y-1.5 ${
                        activeAction.isSafe
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                          : 'bg-rose-50 border-rose-400 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center gap-2 font-black text-base">
                        {activeAction.isSafe ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                        <span>
                          {activeAction.isSafe
                            ? (isEn ? 'Safe Action!' : 'Tindakan Tepat!')
                            : (isEn ? 'Critical Privacy & Security Risk!' : 'Amaran Risiko Privasi & Keselamatan!')}
                        </span>
                      </div>
                      <p className="text-sm sm:text-base font-medium leading-relaxed">
                        {activeAction.consequence}
                      </p>
                    </motion.div>
                  )}

                  {/* Golden Takeaway Card displayed after action decision */}
                  <TakeawayCard
                    takeawayNumber={currentTakeaway.number}
                    title={
                      isEn
                        ? `Golden Takeaway #${currentTakeaway.number}:`
                        : `Prinsip Emas #${currentTakeaway.number}:`
                    }
                    text={currentTakeaway.text}
                    variant="emerald"
                  />
                </div>
              )}
            </motion.div>
          </div>

          {/* Sticky Action Footer (Always Pinned, Only One Primary Button) */}
          <div className="p-4 border-t-2 border-slate-100 bg-white shrink-0">
            {questionStep === 1 && !isLeaksSubmitted && (
              <PrimaryButton
                onClick={handleSubmitLeaks}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {isEn ? 'Submit Leaks & Check Results →' : 'Hantar Kebocoran & Semak Hasil →'}
              </PrimaryButton>
            )}

            {questionStep === 1 && isLeaksSubmitted && (
              <PrimaryButton
                ref={firstInteractiveRef}
                onClick={() => {
                  playPopSound();
                  setQuestionStep(2);
                }}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {isEn ? 'Continue to Question 2 →' : 'Teruskan ke Soalan 2 →'}
              </PrimaryButton>
            )}

            {questionStep === 2 && !isActionSubmitted && (
              <PrimaryButton
                disabled={!selectedActionId}
                onClick={handleSubmitAction}
                icon={<Check className="w-5 h-5" />}
                className={`w-full ${
                  selectedActionId
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isEn ? 'Confirm Safe Action' : 'Sahkan Tindakan Selamat'}
              </PrimaryButton>
            )}

            {questionStep === 2 && isActionSubmitted && (
              <PrimaryButton
                ref={firstInteractiveRef}
                onClick={handleNextCase}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {currentCaseIndex + 1 < cases.length
                  ? isEn
                    ? `Proceed to Case ${currentCaseIndex + 2} of 3 →`
                    : `Seterusnya: Kes ${currentCaseIndex + 2} daripada 3 →`
                  : isEn
                  ? 'View Final Station Assessment →'
                  : 'Lihat Penilaian Akhir Stesen →'}
              </PrimaryButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
