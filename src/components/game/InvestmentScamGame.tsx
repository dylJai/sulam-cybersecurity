'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  getInvestmentScamCases,
  InvestmentScamCase,
  getRealWorldInvestmentStories
} from '@/data/investment-scam-data';
import { BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import {
  TrendingUp,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Search,
  Check,
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
  InfoBanner,
  PrimaryButton
} from '@/components/game/station';

/* =========================================================================
   3 MOST INSTRUCTIVE CASES FOR 7-MINUTE SPRINT
   1. inv-01: Telegram Shariah Gold Group (Fake religious scheme & forged Maybank receipts)
   2. inv-02: Quantum AI Deepfake Tycoon & Crypto Bot (Withdrawal fee extortion trap)
   3. inv-03: Agro Musang King Ponzi Scheme (35% quarterly dividends & personal account deposit)
   ========================================================================= */
const SELECTED_CASE_IDS = ['inv-01', 'inv-02', 'inv-03'];

export const InvestmentScamGame: React.FC = () => {
  const { language, t } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [currentCaseIndex, setCurrentCaseIndex] = useState<number>(0);

  // Stepper state: Question 1 (flags) vs Question 2 (action decision)
  const [questionStep, setQuestionStep] = useState<1 | 2>(1);
  const [hoveredActionId, setHoveredActionId] = useState<string | null>(null);

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
  }, [questionStep, isFlagsSubmitted, isActionSubmitted, currentCaseIndex, stage, shouldReduceMotion]);

  // Load and filter to the 3 selected cases
  const allCases = getInvestmentScamCases(language);
  const cases = allCases.filter(c => SELECTED_CASE_IDS.includes(c.id));
  const currentCase: InvestmentScamCase = cases[currentCaseIndex] || cases[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-sc-regulator',
      name: isEn ? 'SC Alert Analyst' : 'Penganalisis SC Alert',
      icon: '🏛️',
      description: isEn
        ? 'Checked entities against SC Malaysia Investor Alert List'
        : 'Menyemak status lesen syarikat di Senarai Peringatan Pelabur SC',
      isUnlocked: scAlertChecked
    },
    {
      id: 'b-ponzi-buster',
      name: isEn ? 'Ponzi Buster' : 'Penumpas Skim Ponzi',
      icon: '📉',
      description: isEn
        ? 'Spotted unreal 500% ROI & withdrawal fee extortion traps'
        : 'Membongkar janji untung 500% dan perangkap wang pengeluaran',
      isUnlocked: totalFlagsFound >= 6
    },
    {
      id: 'b-telegram-guard',
      name: isEn ? 'Telegram Shield' : 'Perisai Kumpulan Telegram',
      icon: '🛡️',
      description: isEn
        ? 'Refused to transfer money into unverified personal mule accounts'
        : 'Menolak pindahan wang ke akaun peribadi keldai sindiket',
      isUnlocked: correctActionDecisions >= 2
    },
    {
      id: 'b-investment-master',
      name: isEn ? 'Smart Investor' : 'Pelabur Bijak Komuniti',
      icon: '⭐',
      description: isEn
        ? 'Completed Station 05 investment scam investigation challenge'
        : 'Menyelesaikan cabaran Stesen 05 skim pelaburan palsu',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    playPopSound();
    setStage('investigating');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalFlagsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setScAlertChecked(false);
  };

  const resetCaseState = () => {
    setQuestionStep(1);
    setSelectedFlagIds([]);
    setIsFlagsSubmitted(false);
    setSelectedActionId(null);
    setIsActionSubmitted(false);
    setFlagScore(0);
    setShowScAlert(false);
    setHoveredActionId(null);
  };

  const handleResetForNextGroup = () => {
    playPopSound();
    voiceOverManager.stopAll();
    setStage('briefing');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalFlagsFound(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setScAlertChecked(false);
    setShowRealStoryModal(false);
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

    const realRedFlags = currentCase.redFlags.filter(f => f.isRedFlag);
    const harmlessFlags = currentCase.redFlags.filter(f => !f.isRedFlag);
    const pointsPerFlag = Math.floor(10 / Math.max(1, realRedFlags.length));
    const remainder = 10 - (pointsPerFlag * realRedFlags.length);

    let score = 0;
    let correctlyIdentified = 0;

    realRedFlags.forEach((f, idx) => {
      if (selectedFlagIds.includes(f.id)) {
        score += pointsPerFlag + (idx === 0 ? remainder : 0);
        correctlyIdentified += 1;
      }
    });

    harmlessFlags.forEach(f => {
      if (selectedFlagIds.includes(f.id)) {
        score = Math.max(0, score - 3);
      }
    });

    const finalScore = Math.min(10, Math.max(0, score));
    if (correctlyIdentified > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

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
      // Case 1 & 2 award 7 pts; Case 3 awards 6 pts (Total actions = 20 pts)
      const actionAward = currentCaseIndex < 2 ? 7 : 6;
      setTotalScore(prev => prev + actionAward);
    } else {
      playWarningTone();
    }
  };

  const finalizeResults = () => {
    const finalScore = Math.min(50, Math.round(totalScore));
    saveChallengeResult('investment-scam', finalScore, 50);
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
        stationNumber="05"
        stationName={isEn ? 'Investment Scam' : 'Penipuan Pelaburan'}
        title={isEn ? 'Fake Investment & Ponzi Scheme Defense' : 'Pertahanan Skim Pelaburan Palsu & Ponzi'}
        description={
          isEn
            ? 'Your team of 5 will analyze 3 fraudulent investment schemes, spot impossible ROI promises, verify entities against the Securities Commission (SC) Investor Alert List, and shut down withdrawal fee extortion traps.'
            : 'Kumpulan anda akan menyiasat 3 skim pelaburan palsu, membongkar janji keuntungan melampau, menyemak Senarai Peringatan Pelabur SC Malaysia, dan menolak perangkap bayaran wang pengeluaran.'
        }
        voiceOverText={
          isEn
            ? 'Fake Investment and Ponzi Scheme Defense. Your team will investigate 3 fraudulent investment schemes: Telegram Shariah Gold, Quantum AI celebrity deepfake crypto bot, and Musang King Agro Ponzi. Inspect impossible ROI promises, verify against the SC Investor Alert List, and protect your life savings.'
            : 'Pertahanan Skim Pelaburan Palsu dan Ponzi. Kumpulan anda akan menyiasat 3 skim pelaburan palsu: Emas Syariah Telegram, bot kripto AI video deepfake tokoh, dan skim Ponzi durian Musang King. Bongkar janji untung melampau, semak di Senarai SC, dan pertahankan wang simpanan anda.'
        }
        privacyNotice={{
          title: isEn ? '⚠️ Core Rule: No Genuine Investment Guarantees 500% ROI!' : '⚠️ Peraturan Emas: Tiada Pelaburan Sah Menjamin Untung Ribuan Peratus!',
          description: isEn
            ? 'All legitimate investments carry market volatility. If anyone promises guaranteed returns with zero risk or asks you to deposit money into a personal bank account, it is 100% an illegal scam.'
            : 'Semua pelaburan sebenar mempunyai risiko turun naik pasaran. Jika sesiapa menjanjikan pulangan tetap berlipat kali ganda tanpa risiko atau meminta anda memasukkan duit ke akaun bank individu, ia pasti 100% penipuan.'
        }}
        steps={[
          {
            title: isEn ? 'Inspect Unrealistic ROI' : 'Teliti Janji Untung Melampau',
            description: isEn
              ? 'Spot red flags where syndicates claim RM500 turns into RM12,500 within hours with zero risk.'
              : 'Kesan tanda bahaya apabila sindiket menjanjikan modal RM500 menjadi RM12,500 dalam beberapa jam tanpa risiko.'
          },
          {
            title: isEn ? 'Check SC Alert List' : 'Semak Senarai Amaran SC',
            description: isEn
              ? 'Verify if the scheme is officially blacklisted by the Securities Commission Malaysia.'
              : 'Periksa sama ada entiti tersenarai dalam pangkalan data amaran Suruhanjaya Sekuriti Malaysia.'
          },
          {
            title: isEn ? 'Never Pay "Withdrawal Fees"' : 'Tolak Yuran Pengeluaran',
            description: isEn
              ? 'Legitimate brokers deduct transaction fees from profit balance, never demanding extra upfront deposits.'
              : 'Pelaburan sah menolak caj terus daripada baki keuntungan, tidak pernah menuntut bayaran modal tambahan.'
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
          ? 'Gold Shield Rank (Master Fraud Buster)'
          : 'Peringkat Perisai Emas (Penumpas Skim Ponzi)'
        : rating === 'Silver'
        ? isEn
          ? 'Silver Defender Rank (Alert Investor)'
          : 'Peringkat Pembela Perak (Pelabur Waspada)'
        : isEn
        ? 'Bronze Recruit Rank (Needs Hardening)'
        : 'Peringkat Pelatih Gangsa (Perlu Diperkukuh)';

    return (
      <StationResults
        stationNumber="05"
        rating={rating}
        ratingTitle={ratingTitle}
        ratingDescription={
          isEn
            ? 'Great job completing all investment scam cases and learning to verify suspicious schemes.'
            : 'Tahniah kerana berjaya menyiasat semua skim pelaburan dan menyemak entiti yang mencurigakan.'
        }
        badges={badges}
        homeTips={[
          {
            title: isEn ? 'Check the SC Malaysia Investor Alert List' : 'Semak Senarai Peringatan Pelabur SC Malaysia',
            description: isEn
              ? 'Before investing a single cent, search the official Securities Commission Malaysia portal (sc.com.my) to verify that the entity holds a valid Capital Markets Services License.'
              : 'Sebelum melabur walau satu sen, layari portal rasmi Suruhanjaya Sekuriti Malaysia (sc.com.my) untuk memastikan syarikat dan individu tersebut memegang lesen sah.'
          },
          {
            title: isEn ? 'Never Pay Additional "Withdrawal Fees"' : 'Jangan Bayar "Wang Proses Pengeluaran"',
            description: isEn
              ? 'If you are asked to pay additional money to "unlock" your investment returns, STOP paying immediately. Paying extra fees will never release your funds—it only deepens your loss.'
              : 'Jika anda melabur dan diminta membayar ribuan ringgit lagi untuk "buka kunci pengeluaran", HENTIKAN bayaran serta-merta. Membayar wang tambahan tidak akan memulangkan modal anda.'
          },
          {
            title: isEn ? 'Beware of Celebrity Deepfakes on Social Media' : 'Waspada Video Deepfake Tokoh di Media Sosial',
            description: isEn
              ? 'Never trust social media videos showing corporate tycoons or ministers promoting crypto trading bots. Fraudsters synthesize deepfake face and voice clones without authorization.'
              : 'Jangan percaya video Facebook atau TikTok yang memaparkan tokoh perniagaan terkenal mempromosikan bot kripto. Penjenayah menggunakan AI untuk mengklon wajah dan suara tokoh tanpa izin.'
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
        ? 'No legitimate investment yields thousands of percent returns in a few hours. Syndicates frequently exploit religious labels and fake bank receipts to lure victims. Never join or invest through unsolicited Telegram groups.'
        : 'Tiada pelaburan sah di dunia yang menjana keuntungan ribuan peratus dalam beberapa jam. Sindiket sering menggunakan istilah agama dan resit bank palsu untuk memancing mangsa. Jangan sesekali melabur melalui jemputan kumpulan Telegram.'
    },
    {
      number: 2,
      text: isEn
        ? 'Legitimate investment platforms deduct withdrawal fees directly from accumulated profits—they never demand additional deposits. If an entity asks you to pay "taxes" or "AML fees" to release your money, it is an extortion trap.'
        : 'Platform pelaburan sah menolak caj pengeluaran terus daripada baki keuntungan, tidak pernah menuntut bayaran modal tambahan. Jika mereka meminta anda membayar "cukai" atau "yuran AML" untuk mengeluarkan duit, ia adalah perangkap pemerasan berterusan.'
    },
    {
      number: 3,
      text: isEn
        ? 'Licensed investment firms never instruct you to deposit investment funds into personal individual bank accounts (mule accounts). Always verify entities on the Securities Commission Malaysia Investor Alert List.'
        : 'Syarikat pelaburan berlesen tidak pernah meminta anda mendepositkan wang modal ke nombor akaun bank peribadi individu (akaun keldai). Sentiasa semak pendaftaran syarikat di Senarai Peringatan Pelabur SC Malaysia.'
    }
  ];

  const currentTakeaway = caseTakeaways[currentCaseIndex] || caseTakeaways[0];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2 space-y-4">
      {/* Station Top Bar with Timer and Progress */}
      <StationTopBar
        stationNumber="05"
        stationName={isEn ? 'Investment Scam' : 'Penipuan Pelaburan'}
        stepLabel={
          isEn
            ? `Case ${currentCaseIndex + 1} of 3: ${currentCase.title}`
            : `Kes ${currentCaseIndex + 1} daripada 3: ${currentCase.title}`
        }
        stepIndex={currentCaseIndex + 1}
        stepTotal={3}
        onReset={handleResetForNextGroup}
        icon={<TrendingUp className="w-6 h-6" />}
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
                    {isEn ? 'VERIFIED MALAYSIAN CASE' : 'KES SEBENAR DI MALAYSIA'}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    Suruhanjaya Sekuriti Malaysia (SC)
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
                  {currentCase.realCaseExample?.headline || getRealWorldInvestmentStories(language)[0].headline}
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mt-2 font-medium">
                  <span>📍 {currentCase.realCaseExample?.location}</span>
                  <span>•</span>
                  <span className="text-rose-700 font-black bg-rose-50 px-3 py-0.5 rounded-full border border-rose-300">
                    {isEn ? 'Total Losses:' : 'Jumlah Kerugian:'} {currentCase.realCaseExample?.lossAmount}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-2 text-base leading-relaxed text-slate-800 font-medium">
                <strong className="block text-slate-900 font-black">
                  {isEn ? 'Syndicate Modus Operandi:' : 'Modus Operandi Sindiket:'}
                </strong>
                <p>{currentCase.realCaseExample?.storySnippet}</p>
              </div>

              <div className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2 text-base text-rose-950 font-medium">
                <strong className="block font-black">
                  {isEn ? 'Withdrawal Fee Extortion Trap:' : 'Perangkap Wang Pengeluaran:'}
                </strong>
                <p>{currentCase.realCaseExample?.howScamWorked}</p>
              </div>

              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-1 text-base text-emerald-950 font-medium">
                <strong className="block font-black">
                  {isEn ? '💡 Securities Commission (SC) Advice:' : '💡 Nasihat Pakar Suruhanjaya Sekuriti (SC):'}
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
            LEFT COLUMN: INVESTMENT EVIDENCE (Cols 1-7, Internal Scroll Only)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col h-full rounded-3xl border-2 border-slate-200 bg-white shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-4 pb-3 border-b-2 border-slate-100 flex items-center justify-between shrink-0 bg-white">
            <span className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{isEn ? '1. Inspect Scheme & Chat Group' : '1. Teliti Skim & Perbualan Kumpulan'}</span>
            </span>
            <span className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider">
              {currentCase.schemeName}
            </span>
          </div>

          {/* Body (Scrollable inside, never overflows page) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            {/* Promised Return (ROI) Box */}
            <div className="p-3.5 bg-amber-50/80 border-2 border-amber-200 rounded-2xl space-y-1.5 shadow-2xs">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 block">
                {isEn ? 'Promised Return (ROI):' : 'Janji Keuntungan (ROI):'}
              </span>
              <div className="font-black text-lg sm:text-xl text-rose-700">
                {currentCase.promisedRoi}
              </div>
              <div className="text-xs sm:text-sm text-slate-700 font-medium">
                <strong className="text-slate-900">{isEn ? 'Initial Deposit: ' : 'Syarat Modal: '}</strong>
                {currentCase.depositRequired}
              </div>
            </div>

            {/* Regulatory Advice Banner */}
            <InfoBanner
              variant="amber"
              title={isEn ? 'Securities Commission (SC) Rule of Thumb' : 'Prinsip Asas Suruhanjaya Sekuriti (SC)'}
              description={
                isEn
                  ? 'High returns with zero risk do not exist. Real investment profits depend on market movement. Never transfer money into personal individual accounts.'
                  : 'Pulangan tinggi tanpa risiko tidak wujud dalam dunia kewangan. Keuntungan sebenar tertakluk kepada pasaran. Jangan pindahkan duit ke akaun bank individu.'
              }
            />

            {/* Simulated Telegram Group Feed */}
            <div className="rounded-2xl border-2 border-slate-800 bg-slate-950 text-white p-4 space-y-3 shadow-xl font-sans">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-800 text-xs sm:text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="font-black text-white text-sm sm:text-base truncate">{currentCase.schemeName}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <VoiceOverButton
                    audioSrc={isEn ? `/audio/voice-over/invest-scam-${currentCaseIndex + 1}-en.m4a` : `/audio/voice-over/invest-scam-${currentCaseIndex + 1}-ms.m4a`}
                    text={currentCase.chatTranscript[0]?.text || currentCase.schemeName}
                    label={isEn ? 'Pitch' : 'Dengar'}
                    variant="badge"
                  />
                  <button
                    ref={realStoryTriggerRef}
                    type="button"
                    onClick={() => setShowRealStoryModal(true)}
                    className="text-xs bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-xl text-amber-300 font-black flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs border border-slate-700"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isEn ? 'SC Case' : 'Kisah Polis'}</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {currentCase.chatTranscript.map((msg, i) => (
                  <div key={i} className="p-3 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={`font-black ${msg.isBot ? 'text-amber-400' : 'text-blue-400'}`}>
                        {msg.sender}
                      </span>
                      {msg.isBot && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                          {isEn ? '[Suspected Bot]' : '[Disyaki Bot]'}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-100 leading-relaxed text-xs sm:text-sm font-medium">
                      {msg.text}
                    </p>
                  </div>
                ))}

                {/* Animated typing indicator */}
                <div className="flex items-center gap-2 p-2 bg-slate-900/60 rounded-lg text-xs text-amber-300/90 font-medium">
                  <span className="font-bold">{isEn ? 'Admin is typing' : 'Admin sedang menaip'}</span>
                  <div className="flex items-center gap-1">
                    <motion.span
                      animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                    />
                    <motion.span
                      animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                    />
                    <motion.span
                      animate={shouldReduceMotion ? undefined : { y: [0, -3, 0] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                      className="w-1.5 h-1.5 bg-amber-400 rounded-full inline-block"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SC Alert List Tool Action */}
            <div className="space-y-3">
              <div className="p-4 bg-slate-950 text-white rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border-2 border-slate-800">
                <div className="space-y-0.5 min-w-0">
                  <span className="text-sm sm:text-base text-amber-400 font-black flex items-center gap-2">
                    <Search className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{isEn ? 'SC Malaysia Investor Alert List' : 'Senarai Peringatan Pelabur SC Malaysia'}</span>
                  </span>
                  <p className="text-xs sm:text-sm text-slate-300 font-medium">
                    {isEn ? 'Check whether ' : 'Semak sama ada '}<code className="text-amber-300 font-black font-mono">{currentCase.schemeName}</code>{isEn ? ' is licensed or blacklisted.' : ' berlesen atau disenarai hitam.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCheckScAlert}
                  className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm rounded-xl cursor-pointer min-h-[46px] flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  <span>{isEn ? 'Check in SC Alert' : 'Semak di Senarai SC'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* SC Alert Result Box if clicked */}
              {showScAlert && (
                <motion.div
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-1.5 text-rose-950 text-xs sm:text-sm shadow-sm"
                >
                  <div className="flex items-center justify-between pb-1.5 border-b-2 border-rose-200 font-black">
                    <span className="flex items-center gap-2 text-rose-800 text-sm">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{isEn ? 'SC INVESTOR ALERT LIST RESULT:' : 'HASIL SEMAKAN SC INVESTOR ALERT LIST:'}</span>
                    </span>
                    <span className="bg-rose-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase">
                      {isEn ? 'WARNING: UNLICENSED' : 'AMARAN: TIDAK BERLESEN'}
                    </span>
                  </div>
                  <p className="font-bold text-slate-900">
                    {isEn ? 'Blacklisted Entity: ' : 'Entiti Dikesan: '}<strong>{currentCase.scAlertListRecord.entityName}</strong>
                  </p>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    {currentCase.scAlertListRecord.reason}
                  </p>
                </motion.div>
              )}
            </div>
          </div>

          {/* Evidence Footer helper info */}
          <div className="p-3 border-t-2 border-slate-100 text-xs sm:text-sm text-slate-500 flex items-center justify-between font-medium shrink-0 bg-slate-50/50">
            <span>{isEn ? 'Keep investment evidence in view while answering →' : 'Rujuk bukti semasa menjawab di kanan →'}</span>
            <span className="font-black text-slate-700">
              {isEn ? `${currentCase.redFlags.length} red flags to review` : `${currentCase.redFlags.length} ciri disemak`}
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
                  ? isFlagsSubmitted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : 'bg-blue-100 text-blue-800 border border-blue-300'
                  : isActionSubmitted
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              {questionStep === 1
                ? isFlagsSubmitted
                  ? isEn ? 'Scheme Review' : 'Hasil Semakan'
                  : isEn ? 'Check Red Flags' : 'Tanda Bahaya'
                : isActionSubmitted
                ? isEn ? 'Result & Takeaway' : 'Keputusan & Prinsip'
                : isEn ? 'Choose Safe Action' : 'Pilih Tindakan'}
            </span>
          </div>

          {/* Question Body (Scrollable, padded) */}
          <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 overscroll-contain">
            <motion.div
              key={`${currentCaseIndex}-${questionStep}-${isFlagsSubmitted ? 'reviewed' : 'select'}-${isActionSubmitted ? 'done' : 'action'}`}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="space-y-4"
            >
              {/* =============================================================
                  STEP 1: MARK INVESTMENT SCAM RED FLAGS (or review)
                  ============================================================= */}
              {questionStep === 1 && !isFlagsSubmitted && (
                <div className="space-y-3.5">
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                      {isEn ? 'Step 1: Mark Investment Scam Red Flags' : 'Langkah 1: Tandakan Ciri-Ciri Skim Penipuan'}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-600 mt-1 leading-relaxed font-medium">
                      {isEn
                        ? 'Based on the scheme on the left, mark only investment scam red flags and suspicious promises:'
                        : 'Berdasarkan skim di sebelah kiri, tandakan ciri-ciri penipuan pelaburan / tanda bahaya sahaja:'}
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {currentCase.redFlags.map((flag, idx) => {
                      const isMarked = selectedFlagIds.includes(flag.id);

                      return (
                        <button
                          key={flag.id}
                          ref={idx === 0 ? firstInteractiveRef : undefined}
                          type="button"
                          onClick={() => handleToggleFlag(flag.id)}
                          className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 min-h-[52px] shadow-2xs active:scale-95 ${
                            isMarked
                              ? 'bg-blue-50 border-blue-600 text-blue-950 font-bold shadow-xs'
                              : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-sm sm:text-base font-black leading-snug pr-2">
                            {flag.flagText}
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
              {questionStep === 1 && isFlagsSubmitted && (
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
                      {currentCase.redFlags.map(f => {
                        const isTicked = selectedFlagIds.includes(f.id);
                        if (isTicked && f.isRedFlag) {
                          return (
                            <div key={f.id} className="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-emerald-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✓ {isEn ? 'Accurately Spotted:' : 'Tepat Dikesan:'} {f.flagText}</strong>
                              <p className="text-xs text-slate-700 mt-1">{f.explanation}</p>
                            </div>
                          );
                        }
                        if (isTicked && !f.isRedFlag) {
                          return (
                            <div key={f.id} className="p-3 bg-rose-50 border-2 border-rose-300 rounded-xl text-rose-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">✕ {isEn ? 'False Alarm (Harmless Attribute):' : 'Tersilap Tanda (Bukan Ciri Penipu):'} {f.flagText}</strong>
                              <p className="text-xs text-slate-700 mt-1">{f.explanation}</p>
                            </div>
                          );
                        }
                        if (!isTicked && f.isRedFlag) {
                          return (
                            <div key={f.id} className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-amber-950 font-medium text-sm leading-relaxed">
                              <strong className="block font-black text-xs sm:text-sm">⚠ {isEn ? 'Missed Red Flag:' : 'Tanda Bahaya Terlepas:'} {f.flagText}</strong>
                              <p className="text-xs text-slate-700 mt-1">{f.explanation}</p>
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
                            : (isEn ? 'Critical Investment Scam Risk!' : 'Amaran Risiko Skim Pelaburan!')}
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
            {questionStep === 1 && !isFlagsSubmitted && (
              <PrimaryButton
                onClick={handleSubmitFlags}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full"
              >
                {isEn ? 'Submit Red Flags & Check Results →' : 'Hantar Tanda Bahaya & Semak Hasil →'}
              </PrimaryButton>
            )}

            {questionStep === 1 && isFlagsSubmitted && (
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
