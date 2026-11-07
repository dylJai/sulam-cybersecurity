'use client';

import React, { useState, useEffect } from 'react';
import { getInvestigationCases } from '@/data/investigation-cases';
import { LinkScannerModal, LinkScanData } from '@/components/game/LinkScannerModal';
import { BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import {
  ArrowRight,
  Check,
  Search,
  ShieldCheck,
  AlertTriangle,
  Globe,
  Paperclip,
  CheckCircle2,
  Mail,
  MessageSquare
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
   1. Courier Reschedule SMS (Smishing & fake fee)
   2. Urgent Bank Suspension SMS (Panic & fake verify portal)
   4. Utility Cutoff Email (Fake .xyz domain & TAC extortion)
   ========================================================================= */
const SELECTED_CASE_IDS = [1, 2, 4];

export const InvestigationGame: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

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

  // Cumulative game performance
  const [totalCluesFound, setTotalCluesFound] = useState<number>(0);
  const [totalPossibleClues, setTotalPossibleClues] = useState<number>(0);
  const [correctActionDecisions, setCorrectActionDecisions] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [scannerUsed, setScannerUsed] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      voiceOverManager.stopAll();
    };
  }, [currentCaseIndex, stage]);

  // Load and filter to the 3 selected cases
  const allCases = getInvestigationCases(language);
  const cases = allCases.filter(c => SELECTED_CASE_IDS.includes(c.id));
  const currentCase = cases[currentCaseIndex] || cases[0];

  // Dynamic Badges awarded upon completion
  const badges: BadgeItem[] = [
    {
      id: 'b-eagle',
      name: isEn ? 'Eagle Eye' : 'Mata Helang',
      icon: '🦅',
      description: isEn ? 'Spotted 6 or more phishing indicators' : 'Mengesan 6 atau lebih petunjuk penipuan',
      isUnlocked: totalCluesFound >= 6
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
      description: isEn ? 'Made safe decisions across cases' : 'Membuat keputusan selamat merentasi kes',
      isUnlocked: correctActionDecisions >= 2
    },
    {
      id: 'b-hero',
      name: isEn ? 'Investigation Hero' : 'Wira Penyiasat',
      icon: '🛡️',
      description: isEn ? 'Completed Station 01 challenge' : 'Menyelesaikan cabaran Stesen 01',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStartMission = () => {
    playPopSound();
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

  const handleResetForNextGroup = () => {
    playPopSound();
    voiceOverManager.stopAll();
    setStage('briefing');
    setCurrentCaseIndex(0);
    resetCaseState();
    setTotalCluesFound(0);
    setTotalPossibleClues(0);
    setCorrectActionDecisions(0);
    setTotalScore(0);
    setScannerUsed(false);
    setActiveScanData(null);
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
        scoreForThisStep += 2.5; // 4 clues * 2.5 = 10 pts max per case
        foundCorrectCount += 1;
      } else if (!clue.isSuspicious && isSelected) {
        scoreForThisStep = Math.max(0, scoreForThisStep - 1);
      }
    });

    const roundedScore = Math.min(10, Math.round(scoreForThisStep));
    if (foundCorrectCount > 0) {
      playSuccessChime();
    } else {
      playWarningTone();
    }

    setCaseClueScore(roundedScore);
    setTotalCluesFound(prev => prev + foundCorrectCount);
    setTotalScore(prev => prev + roundedScore);
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
    const finalScore = Math.min(50, totalScore);
    saveChallengeResult('phishing', finalScore, 50);
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

  const linkClue = currentCase?.clues.find(
    c => c.targetText.startsWith('http') || c.targetText.includes('.xyz') || c.targetText.includes('.cc')
  );

  /* =========================================================================
     STAGE 1: MISSION BRIEFING (StationBriefing)
     ========================================================================= */
  if (stage === 'briefing') {
    return (
      <StationBriefing
        stationNumber="01"
        stationName={isEn ? 'Phishing Investigation' : 'Siasatan Phishing'}
        title={isEn ? 'Phishing Defense & Message Inspection' : 'Pertahanan Phishing & Siasatan Mesej'}
        description={
          isEn
            ? 'Your team has 3 suspicious message cases to inspect, detect disguised red flags, and make safe decisions to protect personal data.'
            : 'Kumpulan anda mempunyai 3 kes mesej mencurigakan untuk disiasat, mengesan helah penipuan, dan memilih tindakan paling selamat.'
        }
        voiceOverText={
          isEn
            ? 'Phishing Defense & Message Inspection. Your team has 3 suspicious message cases: Parcel Delivery SMS, Urgent Bank Suspension Alert, and Utility Cutoff Email. Detect disguised red flags and make safe decisions.'
            : 'Pertahanan Phishing dan Siasatan Mesej. Kumpulan anda mempunyai 3 kes mesej mencurigakan: SMS Penjadualan Bungkusan Pos, Amaran Penyekatan Akaun Bank, dan Emel Pemotongan Bekalan Elektrik. Kesan tanda bahaya dan buat keputusan selamat.'
        }
        privacyNotice={{
          title: isEn ? '⚠️ Operational Rule: Inspect Links, Never Click Blindly!' : '⚠️ Peraturan Operasi: Periksa Pautan, Jangan Tekan Buta Tuli!',
          description: isEn
            ? 'This workshop station simulates real phishing messages in a 100% safe sandbox. Use the diagnostic X-Ray scanner to analyze threats without danger.'
            : 'Stesen latihan ini mensimulasikan mesej penipuan sebenar dalam persekitaran selamat. Gunakan alat pengimbas X-Ray untuk memeriksa pautan berbahaya.'
        }}
        steps={[
          {
            title: isEn ? 'Inspect Evidence' : 'Teliti Bukti Mesej',
            description: isEn
              ? 'Read the simulated SMS or email and locate the sender address, urgent deadlines, and links.'
              : 'Baca contoh SMS atau emel dengan tenang, semak nama penghantar, desakan masa, dan pautan.'
          },
          {
            title: isEn ? 'Mark Red Flags' : 'Tandakan Tanda Bahaya',
            description: isEn
              ? 'Click ONLY the suspicious parts. Normal introductory phrases do NOT need marking.'
              : 'Klik HANYA bahagian yang meragukan. Ayat pengenalan biasa tidak perlu ditandakan.'
          },
          {
            title: isEn ? 'Decide Safe Action' : 'Pilih Tindakan Selamat',
            description: isEn
              ? 'Choose the safest countermeasure to protect your accounts, money, and identity.'
              : 'Pilih satu tindakan paling selamat untuk mengelakkan wang atau data anda dirampas.'
          }
        ]}
        onStart={handleStartMission}
        startLabel={isEn ? 'Start Mission →' : 'Mula Misi →'}
      />
    );
  }

  /* =========================================================================
     STAGE 3: MISSION RESULTS (StationResults & BadgesDrawer)
     ========================================================================= */
  if (stage === 'results') {
    const finalScore = Math.min(50, totalScore);
    const rating: 'Gold' | 'Silver' | 'Bronze' =
      finalScore >= 40 ? 'Gold' : finalScore >= 25 ? 'Silver' : 'Bronze';

    const ratingTitle =
      rating === 'Gold'
        ? isEn
          ? 'Gold Detective Rank (Master Investigator)'
          : 'Peringkat Detektif Emas (Pakar Penyiasat)'
        : rating === 'Silver'
        ? isEn
          ? 'Silver Inspector Rank (Solid Vigilance)'
          : 'Peringkat Pemeriksa Perak (Kukuh)'
        : isEn
        ? 'Bronze Trainee Rank (Keep Practicing)'
        : 'Peringkat Pelatih Gangsa (Perlu Latihan Lanjut)';

    return (
      <StationResults
        stationNumber="01"
        rating={rating}
        ratingTitle={ratingTitle}
        ratingDescription={
          isEn
            ? 'Great job completing all investigation cases and identifying key scam warning signs.'
            : 'Tahniah kerana berjaya menyiasat semua kes dan mengenalpasti tanda-tanda amaran penipuan.'
        }
        badges={badges}
        homeTips={[
          {
            title: isEn ? 'Inspect Sender & Domain' : 'Semak Domain & Penghantar',
            description: isEn
              ? 'Never click links asking for small fee payments or delivery rescheduling sent from random mobile numbers (+6011) or cheap domains (.xyz / .cc).'
              : 'Jangan sesekali tekan pautan bayaran caj kecil atau kurier melalui SMS nombor rawak peribadi (+6011) atau domain murah (.xyz / .cc).'
          },
          {
            title: isEn ? 'Banks Never Send TAC Links' : 'Bank Tidak Menghantar Pautan TAC',
            description: isEn
              ? 'Banks in Malaysia never send SMS links asking you to verify your account or input TAC codes. Type the verified bank website address yourself.'
              : 'Pihak bank di Malaysia tidak lagi menghantar pautan pengesahan akaun atau kod TAC melalui SMS. Taip alamat rasmi bank sendiri.'
          },
          {
            title: isEn ? 'Verify via Official Channels' : 'Sahkan Melalui Saluran Rasmi',
            description: isEn
              ? 'If an email threatens immediate electricity cutoff or utility suspension, verify independently in the provider official app or customer portal.'
              : 'Jika emel mengugut pemotongan elektrik dalam beberapa jam, semak secara bebas melalui aplikasi rasmi utiliti atau portal pelanggan sah.'
          }
        ]}
        onReset={handleResetForNextGroup}
      />
    );
  }

  /* =========================================================================
     STAGE 2: INTERACTIVE INVESTIGATION (SPLIT SCREEN)
     ========================================================================= */
  const activeAction = currentCase.actions.find(a => a.id === selectedActionId);

  // Distinct Golden Takeaway per Case
  const caseTakeaways = [
    {
      number: 1,
      text: isEn
        ? 'Real delivery companies never send urgent fee payment links from random mobile numbers (+6011). Always verify parcels inside the official courier app.'
        : 'Syarikat kurier rasmi tidak pernah menghantar pautan caj bayaran segera dari nombor prabayar peribadi (+6011). Sentiasa semak bungkusan melalui aplikasi rasmi.'
    },
    {
      number: 2,
      text: isEn
        ? 'Banks NEVER send SMS links asking you to "verify your account" or enter TAC codes. Log in only by typing the bank official URL yourself.'
        : 'Pihak bank TIDAK PERNAH menghantar pautan SMS meminta anda mengesahkan akaun atau memasukkan nombor TAC. Taip alamat rasmi bank sendiri di pelayar.'
    },
    {
      number: 3,
      text: isEn
        ? 'Check the sender domain extension (.xyz vs .com.my). Legitimate utilities never threaten 2-hour disconnection via email to extort bank logins.'
        : 'Periksa sambungan domain emel (.xyz vs .com.my). Agensi utiliti rasmi tidak memotong bekalan elektrik dalam 2 jam melalui emel untuk memeras kata laluan bank.'
    }
  ];

  const currentTakeaway = caseTakeaways[currentCaseIndex] || caseTakeaways[0];

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2 space-y-6">
      {/* Station Top Bar with Step Progress */}
      <StationTopBar
        stationNumber="01"
        stationName={isEn ? 'Phishing Investigation' : 'Siasatan Phishing'}
        stepLabel={
          isEn
            ? `Case ${currentCaseIndex + 1} of 3: ${currentCase.title}`
            : `Kes ${currentCaseIndex + 1} daripada 3: ${currentCase.title}`
        }
        stepIndex={currentCaseIndex + 1}
        stepTotal={3}
        onReset={handleResetForNextGroup}
      />

      {/* Main Two-Column Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* ===================================================================
            LEFT COLUMN: EVIDENCE TO INVESTIGATE (Cols 1-7)
            =================================================================== */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b-2 border-slate-100">
                <span className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-600" />
                  <span>{isEn ? '1. Inspect Evidence (Message)' : '1. Teliti Bahan Bukti (Mesej)'}</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-bold text-xs">
                    {currentCase.format === 'email'
                      ? isEn ? '✉️ Email' : '✉️ Emel'
                      : isEn ? '💬 Phone SMS' : '💬 SMS Telefon'}
                  </span>
                  {currentCase.urgencyBadge && (
                    <span className="bg-rose-50 text-rose-700 border border-rose-300 px-3 py-1 rounded-full font-bold text-xs">
                      {currentCase.urgencyBadge}
                    </span>
                  )}
                </div>
              </div>

              {/* Scenario Context */}
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-2xl text-base text-slate-800 leading-relaxed font-medium">
                <strong className="text-blue-950 font-black">{isEn ? 'Situation:' : 'Situasi:'}</strong>{' '}
                {currentCase.scenarioContext}
              </div>

              {/* Prominent Link X-Ray Scanner Action */}
              {linkClue && (
                <div className="p-4 sm:p-5 bg-slate-950 text-white rounded-3xl border-2 border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-amber-400 shrink-0" />
                    <div className="space-y-0.5">
                      <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                        {isEn ? 'Suspicious Link Detected:' : 'Pautan Mencurigakan Dikesan:'}
                      </span>
                      <code className="text-sm sm:text-base text-amber-300 font-black font-mono block break-all">
                        {linkClue.targetText}
                      </code>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleOpenScanner(linkClue.targetText)}
                    className="px-5 py-3 bg-amber-400 text-slate-950 hover:bg-amber-300 font-black text-sm rounded-2xl cursor-pointer min-h-[52px] flex items-center justify-center gap-2 shrink-0 transition-all active:scale-95 shadow-md"
                  >
                    <span>{isEn ? 'Scan with X-Ray' : 'Imbas Pautan X-Ray'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Realistic Message Simulation */}
              {currentCase.format === 'email' ? (
                /* EMAIL INTERFACE */
                <div className="rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-xs">
                  <div className="bg-slate-100 px-5 py-3.5 border-b-2 border-slate-200 flex items-center justify-between text-sm text-slate-600">
                    <div className="flex items-center gap-2.5">
                      <Mail className="w-5 h-5 text-slate-600" />
                      <span className="font-bold text-slate-900">
                        {isEn ? 'Official Inbox Simulator' : 'Peti Masuk Emel'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <VoiceOverButton
                        text={`${currentCase.subject ? currentCase.subject + '. ' : ''}${currentCase.body}`}
                        variant="badge"
                        label={isEn ? 'Listen' : 'Dengar'}
                      />
                      <span className="text-slate-500 font-medium">{currentCase.receivedTime}</span>
                    </div>
                  </div>

                  <div className="p-5 bg-slate-50 border-b-2 border-slate-100 space-y-2.5 text-sm sm:text-base">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="font-black text-slate-500 w-20 shrink-0">
                        {isEn ? 'From:' : 'Daripada:'}
                      </span>
                      <strong className="text-slate-900">{currentCase.sender}</strong>
                      {currentCase.senderAddress && (
                        <code className="text-sm bg-rose-50 text-rose-700 px-2.5 py-0.5 border border-rose-300 font-mono rounded-lg">
                          &lt;{currentCase.senderAddress}&gt;
                        </code>
                      )}
                    </div>
                    {currentCase.subject && (
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="font-black text-slate-500 w-20 shrink-0">
                          {isEn ? 'Subject:' : 'Perkara:'}
                        </span>
                        <strong className="text-slate-900">{currentCase.subject}</strong>
                      </div>
                    )}
                  </div>

                  <div className="p-6 text-base text-slate-900 leading-relaxed whitespace-pre-line space-y-4 bg-white font-medium">
                    <p>{currentCase.body}</p>

                    {currentCase.attachmentName && (
                      <div className="mt-4 p-4 rounded-2xl border-2 border-rose-300 bg-rose-50 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center shrink-0">
                            <Paperclip className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-base font-black text-rose-950">{currentCase.attachmentName}</div>
                            <div className="text-sm text-slate-700 font-medium">
                              {isEn ? 'Dangerous App Package (.apk)' : 'Lampiran Fail Luar (.apk)'}
                            </div>
                          </div>
                        </div>
                        <span className="text-xs font-black uppercase text-rose-800 bg-white px-3 py-1 rounded-full border border-rose-300">
                          {isEn ? 'MALWARE RISK' : 'BERISIKO TINGGI'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* REALISTIC SMS PHONE INTERFACE */
                <div className="max-w-md mx-auto rounded-3xl border-4 border-slate-800 bg-slate-950 text-white p-5 sm:p-6 shadow-xl space-y-4 font-sans">
                  <div className="flex items-center justify-between text-sm text-slate-400 px-1 font-mono">
                    <span>10:42 AM</span>
                    <div className="flex items-center gap-2">
                      <VoiceOverButton
                        text={currentCase.body}
                        variant="badge"
                        label={isEn ? 'Listen' : 'Dengar'}
                      />
                      <span>5G 92% 🔋</span>
                    </div>
                  </div>

                  <div className="text-center pb-3 border-b border-slate-800">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center font-bold text-lg mb-2 shadow-md">
                      <MessageSquare className="w-7 h-7" />
                    </div>
                    <strong className="text-lg text-white block">{currentCase.sender}</strong>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">
                      {isEn ? 'Incoming SMS Message' : 'Mesej SMS Masuk'}
                    </span>
                  </div>

                  <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl p-5 text-base text-slate-100 leading-relaxed shadow-sm space-y-3 font-medium">
                    <p className="whitespace-pre-line">{currentCase.body}</p>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-mono">{currentCase.receivedTime}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t-2 border-slate-100 text-sm text-slate-500 flex items-center justify-between font-medium">
              <span>{isEn ? 'Now answer the question on the right →' : 'Seterusnya, jawab soalan di sebelah kanan →'}</span>
              <span className="font-black text-slate-800">
                {isEn ? `${currentCase.clues.length} clues to review` : `${currentCase.clues.length} petunjuk disiasat`}
              </span>
            </div>
          </div>
        </div>

        {/* ===================================================================
            RIGHT COLUMN: QUESTIONS, CLUES & DECISIONS (Cols 8-12)
            =================================================================== */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-8 shadow-sm flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100 text-sm">
                <span className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-600" />
                  <span>{isEn ? '2. Answer & Action' : '2. Jawab & Buat Keputusan'}</span>
                </span>
                <span
                  className={`px-3 py-1 rounded-full font-black text-xs uppercase tracking-wider ${
                    isFindingsSubmitted
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}
                >
                  {!isFindingsSubmitted
                    ? isEn ? 'Step 1 of 2: Clues' : 'Langkah 1/2: Petunjuk'
                    : isEn ? 'Step 2 of 2: Action' : 'Langkah 2/2: Tindakan'}
                </span>
              </div>

              {/* Content Area: Step 1 or Step 2 */}
              <div className="space-y-4">
                {!isFindingsSubmitted ? (
                  /* STEP 1: CLUES SELECTION */
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight">
                        {isEn ? 'Step 1: Mark ONLY Suspicious Red Flags' : 'Langkah 1: Tandakan HANYA Tanda-tanda Bahaya'}
                      </h3>
                      <p className="text-base text-slate-600 mt-1 leading-relaxed font-medium">
                        {isEn
                          ? 'Based on the message on the left, mark the phrases that look dangerous. Normal phrases do NOT need marking!'
                          : 'Berdasarkan mesej di sebelah kiri, tandakan bahagian yang meragukan. Ayat pengenalan biasa TIDAK perlu ditandakan!'}
                      </p>
                    </div>

                    <div className="space-y-3">
                      {currentCase.clues.map(clue => {
                        const isMarked = selectedClueIds.includes(clue.id);

                        return (
                          <button
                            key={clue.id}
                            type="button"
                            onClick={() => handleToggleClue(clue.id)}
                            className={`w-full p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 min-h-[56px] shadow-2xs active:scale-95 ${
                              isMarked
                                ? 'bg-blue-50 border-blue-600 text-blue-950 font-black shadow-xs'
                                : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50 font-medium'
                            }`}
                          >
                            <div className="min-w-0 pr-2">
                              <span className="text-base block">
                                &ldquo;{clue.targetText}&rdquo;
                              </span>
                            </div>
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
                ) : (
                  /* STEP 2: ACTION DECISION */
                  <div className="space-y-5">
                    {/* Clues Review Breakdown Box */}
                    <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 text-sm font-black text-slate-900">
                        <span className="flex items-center gap-2 text-emerald-800">
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>{isEn ? 'Review of Clues:' : 'Hasil Semakan Tanda Bahaya:'}</span>
                        </span>
                        <span className="bg-emerald-100 text-emerald-900 px-3 py-0.5 rounded-full text-xs font-black">
                          {isEn ? 'Reviewed' : 'Selesai Disemak'}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {currentCase.clues.map(c => {
                          const isMarked = selectedClueIds.includes(c.id);
                          const isCorrectSelection =
                            (c.isSuspicious && isMarked) || (!c.isSuspicious && !isMarked);

                          return (
                            <div
                              key={c.id}
                              className={`p-3.5 rounded-xl border-2 text-sm leading-relaxed ${
                                isCorrectSelection
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
                                  : 'bg-rose-50 border-rose-300 text-rose-950 font-medium'
                              }`}
                            >
                              <div className="flex items-center justify-between font-black mb-1">
                                <span>&ldquo;{c.targetText}&rdquo;</span>
                                <span>
                                  {isCorrectSelection
                                    ? isEn ? '✓ Correct' : '✓ Tepat'
                                    : isEn ? '⚠ Review Needed' : '⚠ Perlu Diperbaiki'}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-slate-700">{c.explanation}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step 2 Decision */}
                    <div className="space-y-3 pt-1">
                      <div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                          {isEn ? 'Step 2: Choose Safe Action' : 'Langkah 2: Pilih Tindakan Selamat'}
                        </h3>
                        <p className="text-base text-slate-600 mt-1 font-medium">
                          {isEn
                            ? 'What should you do next to protect your accounts and identity?'
                            : 'Apakah tindakan terbaik yang wajar diambil untuk melindungi akaun anda?'}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {currentCase.actions.map(action => {
                          const isChosen = selectedActionId === action.id;

                          return (
                            <button
                              key={action.id}
                              type="button"
                              disabled={isActionSubmitted}
                              onClick={() => handleSelectAction(action.id)}
                              className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left transition-all min-h-[64px] shadow-2xs ${
                                isChosen
                                  ? 'bg-blue-50 border-blue-600 text-blue-950 shadow-xs'
                                  : 'bg-white text-slate-800 border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                              } ${isActionSubmitted ? 'cursor-default' : 'cursor-pointer active:scale-95'}`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="space-y-1">
                                  <strong className="text-base font-black block leading-snug">
                                    {action.title}
                                  </strong>
                                  <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                    {action.description}
                                  </p>
                                </div>
                                <span
                                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                                    isChosen
                                      ? 'border-blue-600 bg-blue-600 text-white'
                                      : 'border-slate-300'
                                  }`}
                                >
                                  {isChosen && <Check className="w-4 h-4 stroke-[3]" />}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Feedback if action submitted */}
                      {isActionSubmitted && activeAction && (
                        <motion.div
                          initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`p-5 rounded-2xl border-2 space-y-2 ${
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
                      {isActionSubmitted && (
                        <div className="pt-2">
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
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action CTA */}
            <div className="pt-4 border-t-2 border-slate-100">
              {!isFindingsSubmitted ? (
                <PrimaryButton
                  onClick={handleSubmitFindings}
                  icon={<ArrowRight className="w-5 h-5" />}
                  className="w-full"
                >
                  {isEn ? 'Submit Clues & Proceed to Action →' : 'Hantar Petunjuk & Pilih Tindakan →'}
                </PrimaryButton>
              ) : !isActionSubmitted ? (
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
              ) : (
                <PrimaryButton
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

      {/* Link Scanner Modal */}
      <LinkScannerModal
        scanData={activeScanData}
        onClose={() => setActiveScanData(null)}
      />
    </div>
  );
};
