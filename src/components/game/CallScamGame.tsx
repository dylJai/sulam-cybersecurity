'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  getCallScamCases,
  CallScamCase,
  getRealWorldCallScamStories
} from '@/data/call-scam-data';
import { BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import {
  PhoneCall,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
  Volume2,
  Clock,
  BookOpen,
  X
} from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';
import { voiceOverManager } from '@/lib/voice-over';
import {
  StationTopBar,
  StationBriefing,
  StationResults,
  TakeawayCard,
  PrimaryButton
} from '@/components/game/station';

/* =========================================================================
   3 MOST INSTRUCTIVE CASES FOR 7-MINUTE SPRINT
   1. Court Warrant & Bukit Aman Police Impersonation (Macau Scam Asset Audit)
   2. LHDN Tax Audit & Immediate Travel Blacklist Threat
   5. Pos Laju Parcel with Fake Contraband transferred directly to Police
   ========================================================================= */
const SELECTED_CASE_IDS = ['call-01', 'call-02', 'call-05'];

export const CallScamGame: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Stepper state: Question 1 (tactics) vs Question 2 (action decision)
  const [questionStep, setQuestionStep] = useState<1 | 2>(1);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

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

  // DOM Refs for accessibility and keyboard focus handoff
  const questionPanelRef = useRef<HTMLDivElement>(null);
  const firstInteractiveRef = useRef<HTMLButtonElement>(null);
  const realStoryCloseRef = useRef<HTMLButtonElement | null>(null);
  const realStoryTriggerRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
    };
  }, [currentCaseIndex, stage]);

  // Modal accessibility: Escape key and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showRealStoryModal) {
        setShowRealStoryModal(false);
      }
    };

    if (showRealStoryModal) {
      window.addEventListener('keydown', handleKeyDown);
      setTimeout(() => {
        realStoryCloseRef.current?.focus();
      }, 50);
    } else {
      realStoryTriggerRef.current?.focus();
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showRealStoryModal]);

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
  }, [questionStep, isTacticsSubmitted, isActionSubmitted, currentCaseIndex, stage, shouldReduceMotion]);

  // Load and filter to the 3 selected cases
  const allCases = getCallScamCases(language);
  const cases = allCases.filter(c => SELECTED_CASE_IDS.includes(c.id));
  const currentCase: CallScamCase = cases[currentCaseIndex] || cases[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-mule-checker',
      name: isEn ? 'SemakMule Expert' : 'Pakar SemakMule',
      icon: '🔍',
      description: isEn
        ? 'Checked caller number against police fraud database'
        : 'Menyemak nombor scammer di pangkalan data polis SemakMule PDRM',
      isUnlocked: semakMuleSearched
    },
    {
      id: 'b-psych-shield',
      name: isEn ? 'Immune to Threat' : 'Kalis Ugutan Polis Palsu',
      icon: '🛡️',
      description: isEn
        ? 'Spotted panic coercion and fake arrest tactics'
        : 'Mengesan taktik panik dan ugutan tangkapan palsu',
      isUnlocked: totalTacticsFound >= 5
    },
    {
      id: 'b-nsrc-ready',
      name: isEn ? 'NSRC 997 Hero' : 'Wira NSRC 997',
      icon: '📞',
      description: isEn
        ? 'Knows how to respond in 1-hour golden window'
        : 'Hafal talian kecemasan 997 dalam tempoh 1 jam',
      isUnlocked: correctActionDecisions >= 2
    },
    {
      id: 'b-call-crusher',
      name: isEn ? 'Call Scam Buster' : 'Penangkis Panggilan Palsu',
      icon: '🛑',
      description: isEn
        ? 'Completed Station 03 phone scam challenge'
        : 'Menyelesaikan cabaran Stesen 03 panggilan palsu',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    playPopSound();
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalTacticsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSemakMuleSearched(false);
  };

  const resetCaseState = () => {
    setQuestionStep(1);
    setSelectedTacticIds([]);
    setIsTacticsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setTacticsScore(0);
    setShowSemakMule(false);
    setHoveredActionId(null);
  };

  const handleResetForNextGroup = () => {
    playPopSound();
    voiceOverManager.stopAll();
    setStage('briefing');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalTacticsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setSemakMuleSearched(false);
    setShowRealStoryModal(false);
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

    const traps = currentCase.tactics.filter(t => t.isTrap);
    const trapCount = Math.max(1, traps.length);
    const ptsPerTrap = 10 / trapCount; // 10 pts max for tactics per case

    let score = 0;
    let correctlyIdentified = 0;

    currentCase.tactics.forEach(t => {
      const isSelected = selectedTacticIds.includes(t.id);
      if (t.isTrap && isSelected) {
        score += ptsPerTrap;
        correctlyIdentified += 1;
      } else if (!t.isTrap && isSelected) {
        score = Math.max(0, score - 1.5);
      }
    });

    const finalTacticScore = Math.min(10, Math.round(score));
    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

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
      // Case 1 & 2 award 7 pts; Case 3 awards 6 pts (Total actions = 20 pts)
      const actionAward = currentCaseIndex < 2 ? 7 : 6;
      setTotalScore(prev => prev + actionAward);
    } else {
      playWarningTone();
    }
  };

  const finalizeResults = () => {
    const finalScore = Math.min(50, Math.round(totalScore));
    saveChallengeResult('call-scam', finalScore, 50);
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
        stationNumber="03"
        stationName={isEn ? 'Fake Police Call' : 'Panggilan Polis Palsu'}
        title={isEn ? 'Fake Authority & Macau Call Scam Defense' : 'Pertahanan Panggilan Polis Palsu & Macau Scam'}
        description={
          isEn
            ? 'Your team of 5 will analyze 3 high-pressure scam phone calls, spot coercion psychological traps, test the caller on SemakMule, and memorize the 997 hotline.'
            : 'Kumpulan anda akan menganalisis 3 panggilan kecemasan palsu, mengesan taktik ugutan panik, menyemak nombor di portal SemakMule PDRM, dan menghafal talian 997.'
        }
        voiceOverText={
          isEn
            ? 'Fake Authority and Macau Call Scam Defense. Your team will analyze 3 high-pressure phone calls: Court Arrest Warrant, Tax Department Travel Ban, and Courier Contraband call forwarding. Spot panic coercion, verify on SemakMule, and memorize the 997 hotline.'
            : 'Pertahanan Panggilan Polis Palsu dan Macau Scam. Kumpulan anda akan menyiasat 3 panggilan kecemasan palsu: Waran Tangkap Mahkamah Bukit Aman, Tunggakan Cukai LHDN, dan Panggilan Bungkusan Pos Laju. Kesan ugutan panik, semak di SemakMule, dan hafal talian 997.'
        }
        privacyNotice={{
          title: isEn ? '⚠️ Core Police Rule: PDRM Never Demands Money Over the Phone!' : '⚠️ Peraturan Emas Polis: PDRM Tidak Menuntut Wang Melalui Telefon!',
          description: isEn
            ? 'Official police officers, court magistrates, and government bodies NEVER threaten immediate arrest by phone or ask you to transfer funds to "safe temporary audit accounts".'
            : 'Pegawai polis, majistret mahkamah, dan agensi kerajaan TIDAK PERNAH mengugut tangkapan segera melalui telefon atau meminta anda memindahkan wang ke "akaun audit sementara".'
        }}
        steps={[
          {
            title: isEn ? 'Listen to Caller Transcript' : 'Dengar & Teliti Transkrip',
            description: isEn
              ? 'Analyze how syndicates use urgency, fear of handcuffs, and isolation to rush victims.'
              : 'Perhatikan bagaimana sindiket menggunakan ketakutan digari dan larangan bercakap untuk menekan mangsa.'
          },
          {
            title: isEn ? 'Check PDRM SemakMule' : 'Semak Portal SemakMule PDRM',
            description: isEn
              ? 'Run the caller phone number against official police commercial fraud records.'
              : 'Imbas nombor telefon pemanggil terus dalam pangkalan data laporan jenayah komersial polis.'
          },
          {
            title: isEn ? 'Memorize 997 Hotline' : 'Hafal Talian Kecemasan 997',
            description: isEn
              ? 'Call the National Scam Response Centre (NSRC 997) within 1 hour if anyone mistakenly sent money.'
              : 'Dail talian 997 (NSRC) dalam tempoh 1 jam untuk menyekat transaksi sekiranya tersilap memindahkan wang.'
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
          ? 'Gold Shield Rank (Call Scam Buster)'
          : 'Peringkat Perisai Emas (Penangkis Panggilan Palsu)'
        : rating === 'Silver'
        ? isEn
          ? 'Silver Defender Rank (Alert Citizen)'
          : 'Peringkat Pembela Perak (Waspada & Berwaspada)'
        : isEn
        ? 'Bronze Recruit Rank (Needs Hardening)'
        : 'Peringkat Pelatih Gangsa (Perlu Diperkukuh)';

    return (
      <StationResults
        stationNumber="03"
        rating={rating}
        ratingTitle={ratingTitle}
        ratingDescription={
          isEn
            ? 'Great job completing all call scam cases and identifying scammer psychological traps.'
            : 'Tahniah kerana berjaya menyiasat semua panggilan dan mengesan taktik ugutan pemanggil.'
        }
        badges={badges}
        homeTips={[
          {
            title: isEn ? 'Memorize 997 (NSRC Hotline)' : 'Hafal Talian 997 (NSRC)',
            description: isEn
              ? 'If you or a family member transferred money to a scammer, call 997 within the 1-hour golden window so Bank Negara can freeze the mule account.'
              : 'Jika anda atau ahli keluarga tersilap memindahkan wang kepada scammer, segera dail 997 dalam masa 1 jam agar akaun keldai dapat dibekukan.'
          },
          {
            title: isEn ? 'Check SemakMule Before Paying' : 'Semak Portal SemakMule Sebelum Berurusan',
            description: isEn
              ? 'Always enter unknown telephone numbers or bank account numbers into the PDRM SemakMule portal (semakmule.rmp.gov.my) to view active crime reports.'
              : 'Sentiasa masukkan nombor telefon atau akaun bank pemanggil yang mencurigakan di portal SemakMule PDRM untuk melihat laporan polis.'
          },
          {
            title: isEn ? 'Hang Up Immediately' : 'Bertenang & Letak Telefon Serta-merta',
            description: isEn
              ? 'Never argue or engage with phone scammers threatening arrest. Real police and courts never settle warrants or bail over the phone.'
              : 'Jangan berbalah dengan pemanggil yang mengugut waran tangkap. Polis dan mahkamah tidak pernah menguruskan wang jaminan melalui panggilan telefon.'
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
        ? 'Police and court officers NEVER demand money transfers over the phone or threaten immediate arrest within 2 hours. Real authorities issue formal physical notices.'
        : 'Polis dan mahkamah TIDAK PERNAH menuntut pemindahan wang melalui telefon atau mengugut tangkapan segera dalam 2 jam. Tindakan rasmi sentiasa melalui surat fizikal.'
    },
    {
      number: 2,
      text: isEn
        ? 'LHDN never demands payments into personal third-party accounts to cancel immigration travel bans. Official tax settlements are paid only to the government treasury.'
        : 'LHDN tidak pernah meminta bayaran ke akaun persendirian individu untuk membatalkan sekatan imigresen. Sebarang bayaran cukai rasmi hanya ke akaun Perbendaharaan Kerajaan.'
    },
    {
      number: 3,
      text: isEn
        ? 'Courier companies cannot forward phone calls directly into police station investigation rooms. Hang up and call 997 immediately if you were tricked into sending funds.'
        : 'Syarikat kurier tidak boleh memindahkan panggilan terus ke bilik siasatan balai polis. Segera letak telefon dan hubungi talian 997 jika terlanjur memindahkan wang.'
    }
  ];

  const currentTakeaway = caseTakeaways[currentCaseIndex] || caseTakeaways[0];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2 space-y-4">
      {/* Station Top Bar with Timer and Progress */}
      <StationTopBar
        stationNumber="03"
        stationName={isEn ? 'Fake Police Call' : 'Panggilan Polis Palsu'}
        stepLabel={
          isEn
            ? `Case ${currentCaseIndex + 1} of 3: ${currentCase.title}`
            : `Kes ${currentCaseIndex + 1} daripada 3: ${currentCase.title}`
        }
        stepIndex={currentCaseIndex + 1}
        stepTotal={3}
        onReset={handleResetForNextGroup}
        icon={<PhoneCall className="w-6 h-6" />}
      />

      {/* Real Case Verified Story Modal (Accessible Dialog) */}
      <AnimatePresence>
        {showRealStoryModal && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="real-story-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
          >
            <motion.div
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
              className="bg-white border-2 border-slate-300 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="bg-rose-100 text-rose-800 font-black text-xs px-3 py-1 rounded-full border border-rose-300 uppercase tracking-wider">
                    {isEn ? 'VERIFIED POLICE CASE IN MALAYSIA' : 'KES SEBENAR POLIS DI MALAYSIA'}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    Jabatan Siasatan Jenayah Komersil (JSJK PDRM)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  aria-label={isEn ? 'Close case story (Esc)' : 'Tutup kisah kes (Esc)'}
                  title={isEn ? 'Close (Esc)' : 'Tutup (Esc)'}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 cursor-pointer transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div>
                <h3 id="real-story-modal-title" className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {currentCase.realCaseExample?.headline || getRealWorldCallScamStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2 font-medium">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-rose-700 font-black bg-rose-50 px-3 py-0.5 rounded-full border border-rose-300">
                    {isEn ? 'Financial Loss:' : 'Jumlah Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-base leading-relaxed text-slate-800 font-medium">
                <strong className="block text-slate-900 font-black">
                  {isEn ? 'Incident Breakdown:' : 'Kronologi Kejadian:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2 text-base text-rose-950 font-medium">
                <strong className="block font-black">
                  {isEn ? 'How Scammers Coerced the Victim:' : 'Bagaimana Scammer Berjaya Memperdaya Mangsa:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-1 text-base text-emerald-950 font-medium">
                <strong className="block font-black">
                  {isEn ? '💡 Key Community Takeaway:' : '💡 Pengajaran & Tindakan Komuniti:'}
                </strong>
                <p>{currentCase.realCaseExample?.preventionTip}</p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  ref={realStoryCloseRef}
                  type="button"
                  onClick={() => setShowRealStoryModal(false)}
                  className="px-8 py-3.5 bg-slate-900 text-white hover:bg-slate-800 font-black text-base rounded-2xl cursor-pointer transition-all shadow-md min-h-[52px] active:scale-95"
                >
                  {isEn ? 'Close & Return (Esc)' : 'Tutup & Kembali (Esc)'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main 2-Column Split - Viewport fitting on laptop (1366x768+) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:h-[calc(100vh-210px)] lg:min-h-[520px]">
        {/* ===================================================================
            LEFT COLUMN: PHONE CALL EVIDENCE (Cols 1-7, Internal Scroll Only)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 border-b-2 border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <span className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <PhoneCall className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{isEn ? '1. Incoming Call Simulation' : '1. Simulasi Panggilan Masuk'}</span>
            </span>
            <span className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider">
              {isEn ? 'URGENCY: ' : 'TAHAP CEMAS: '}{currentCase.urgencyLevel}
            </span>
          </div>

          {/* Body (Scrollable inside, never overflows page) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            {/* Scenario Context */}
            <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-2xl text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              <strong className="text-blue-950 font-black">{isEn ? 'Situation: ' : 'Situasi: '}</strong>
              {currentCase.scenarioContext}
            </div>

            {/* Simulated Phone UI Box */}
            <div className="rounded-3xl border-4 border-slate-800 bg-slate-950 text-white p-4 sm:p-5 space-y-3.5 shadow-xl font-sans">
              {/* Caller details */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shrink-0 shadow-md ${
                      shouldReduceMotion ? '' : 'animate-pulse'
                    }`}
                  >
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <strong className="text-base sm:text-lg text-white block leading-snug truncate">
                      {currentCase.callerIdentity}
                    </strong>
                    <p className="text-xs sm:text-sm text-slate-400 font-medium truncate">{currentCase.claimedAgency}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-amber-400 font-black text-sm sm:text-base font-mono block">
                    {currentCase.phoneNumber}
                  </span>
                  <span className="text-slate-400 text-xs font-mono flex items-center gap-1 justify-end mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{currentCase.callDuration}</span>
                  </span>
                </div>
              </div>

              {/* Call audio waveform & transcript */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-slate-400 pb-1">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Volume2 className={`w-4 h-4 shrink-0 ${shouldReduceMotion ? '' : 'animate-bounce'}`} />
                    <div className="flex items-center gap-1 h-4 px-1.5 py-0.5 bg-amber-500/20 rounded-md">
                      {[8, 14, 10, 16, 6].map((h, i) => (
                        <motion.span
                          key={i}
                          animate={shouldReduceMotion ? {} : { height: [3, h, 3] }}
                          transition={{ repeat: Infinity, duration: 0.6 + i * 0.15, ease: 'easeInOut' }}
                          className="w-1 bg-amber-400 rounded-full inline-block"
                        />
                      ))}
                    </div>
                    <span>{isEn ? 'Caller Audio:' : 'Audio Pemanggil:'}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <VoiceOverButton
                      text={currentCase.audioSimulatedText}
                      label={isEn ? 'Play Voice' : 'Dengar Suara'}
                      playingLabel={isEn ? 'Stop Call' : 'Hentikan'}
                      variant="pill"
                    />
                    <button
                      ref={realStoryTriggerRef}
                      type="button"
                      onClick={() => {
                        playPopSound();
                        setShowRealStoryModal(true);
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer transition-colors border border-slate-700"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>{t('game.realStoryBtn')}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border-2 border-slate-800 rounded-2xl text-sm sm:text-base text-slate-100 leading-relaxed whitespace-pre-line space-y-2 shadow-inner font-medium">
                  {currentCase.audioSimulatedText}
                </div>
              </div>
            </div>

            {/* Prominent SemakMule Tool Button */}
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 text-white rounded-2xl border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-sm sm:text-base text-amber-400 font-black block flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isEn ? 'PDRM CCID SemakMule Database' : 'Pangkalan Data CCID SemakMule PDRM'}</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {isEn ? 'Check caller ' : 'Semak nombor '}
                    <code className="text-amber-300 font-black font-mono">{currentCase.phoneNumber}</code>
                    {isEn ? ' in police fraud records.' : ' dalam rekod jenayah penipuan polis.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSearchSemakMule}
                  className="px-4 py-2.5 bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-xs sm:text-sm rounded-xl cursor-pointer min-h-[46px] flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-md"
                >
                  <span>{isEn ? 'Scan in SemakMule' : 'Imbas di SemakMule'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* SemakMule Result Box if clicked */}
              {showSemakMule && (
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-1.5 text-rose-950 text-sm sm:text-base"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-rose-200 font-black">
                    <span className="flex items-center gap-2 text-rose-800 text-xs sm:text-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{isEn ? 'PDRM SEMAKMULE SEARCH RESULT:' : 'HASIL CARIAN CCID SEMAKMULE PDRM:'}</span>
                    </span>
                    <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black">
                      {currentCase.semakMuleData.policeStatus}
                    </span>
                  </div>
                  <p className="font-medium text-xs sm:text-sm">
                    {isEn ? 'Number: ' : 'Nombor: '}
                    <strong>{currentCase.semakMuleData.queryNumber}</strong>
                    {isEn ? ' has ' : ' mempunyai '}
                    <strong className="text-rose-700">
                      {currentCase.semakMuleData.reportsCount} {isEn ? 'ACTIVE POLICE REPORTS' : 'LAPORAN POLIS AKTIF'}
                    </strong>!
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {isEn ? 'Category: ' : 'Kategori Kes: '}
                    {currentCase.semakMuleData.lastReportedCategory}.{' '}
                    <strong className="text-rose-800">
                      {isEn ? 'Do NOT transfer any money!' : 'Jangan sesekali pindahkan sebarang wang!'}
                    </strong>
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Evidence Footer helper info */}
          <div className="p-3 border-t-2 border-slate-100 text-xs sm:text-sm text-slate-500 flex items-center justify-between font-medium shrink-0 bg-slate-50/50">
            <span>{isEn ? 'Keep call evidence in view while answering →' : 'Rujuk bukti semasa menjawab di kanan →'}</span>
            <span className="font-black text-slate-700">
              {isEn ? `${currentCase.tactics.length} tactics to review` : `${currentCase.tactics.length} taktik disemak`}
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
                  ? isTacticsSubmitted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                  : isActionSubmitted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {questionStep === 1
                ? isTacticsSubmitted
                  ? isEn ? 'Tactics Review' : 'Hasil Semakan'
                  : isEn ? 'Coercion Tactics' : 'Taktik Ugutan'
                : isActionSubmitted
                ? isEn ? 'Result & Takeaway' : 'Keputusan & Prinsip'
                : isEn ? 'Choose Safe Action' : 'Pilih Tindakan'}
            </span>
          </div>

          {/* Question Body (Scrollable, padded) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            <motion.div
              key={`${currentCaseIndex}-${questionStep}-${isTacticsSubmitted ? 'reviewed' : 'select'}-${isActionSubmitted ? 'done' : 'action'}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* =============================================================
                  STEP 1: MARK COERCION TACTICS (or review)
                  ============================================================= */}
              {questionStep === 1 && !isTacticsSubmitted && (
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {isEn ? 'Step 1: Mark Coercion Threat Tactics' : 'Langkah 1: Tandakan Taktik Ugutan Pemanggil'}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed font-medium">
                      {isEn
                        ? 'Based on the caller transcript on the left, mark only suspicious threat and pressure tactics:'
                        : 'Berdasarkan percakapan pemanggil di sebelah kiri, tandakan ayat ugutan atau helah panik sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.tactics.map((tactic, idx) => {
                      const isMarked = selectedTacticIds.includes(tactic.id);

                      return (
                        <button
                          key={tactic.id}
                          ref={idx === 0 ? firstInteractiveRef : undefined}
                          type="button"
                          onClick={() => handleToggleTactic(tactic.id)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 min-h-[52px] shadow-2xs active:scale-95 ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-black shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50 font-medium'
                          }`}
                        >
                          <span className="text-sm sm:text-base leading-snug pr-2">
                            {tactic.text}
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
              {questionStep === 1 && isTacticsSubmitted && (
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
                      {currentCase.tactics.map(tactic => {
                        const isTicked = selectedTacticIds.includes(tactic.id);
                        if (isTicked && tactic.isTrap) {
                          return (
                            <div key={tactic.id} className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✓ {isEn ? 'Accurately Spotted: ' : 'Tepat Dikesan: '}{tactic.text}</strong>
                              <p className="text-xs text-slate-700 mt-1">{tactic.explanation}</p>
                            </div>
                          );
                        }
                        if (isTicked && !tactic.isTrap) {
                          return (
                            <div key={tactic.id} className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✕ {isEn ? 'False Alarm: ' : 'Tersilap Tanda: '}{tactic.text}</strong>
                              <p className="text-xs text-slate-700 mt-1">{tactic.explanation}</p>
                            </div>
                          );
                        }
                        if (!isTicked && tactic.isTrap) {
                          return (
                            <div key={tactic.id} className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">⚠ {isEn ? 'Missed Trap: ' : 'Taktik Terlepas: '}{tactic.text}</strong>
                              <p className="text-xs text-slate-700 mt-1">{tactic.explanation}</p>
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
                        ? 'What is the safest immediate action you and your team should take?'
                        : 'Apakah tindakan paling selamat untuk anda dan pasukan lakukan sekarang?'}
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
                            ? isEn
                              ? 'EXCELLENT DECISION'
                              : 'KEPUTUSAN PALING TEPAT'
                            : isEn
                            ? 'HIGH RISK ACTION'
                            : 'TINDAKAN BERISIKO TINGGI'}
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
            {questionStep === 1 && !isTacticsSubmitted && (
              <PrimaryButton
                onClick={handleSubmitTactics}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {isEn ? 'Submit Tactics & Check Results →' : 'Hantar Taktik & Semak Hasil →'}
              </PrimaryButton>
            )}

            {questionStep === 1 && isTacticsSubmitted && (
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
