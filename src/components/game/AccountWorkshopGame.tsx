'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Lock,
  Unlock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Globe,
  Wallet,
  RefreshCw,
  Zap,
  PhoneCall,
  Check,
  Building2,
  Terminal,
  KeyRound,
  ShieldCheck
} from 'lucide-react';
import { saveChallengeResult } from '@/lib/storage';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import { BadgeItem } from '@/components/game/BadgesDrawer';
import {
  StationTopBar,
  StationBriefing,
  StationResults,
  TakeawayCard,
  InfoBanner,
  PrimaryButton,
  SecondaryButton
} from '@/components/game/station';

/* =========================================================================
   TYPES & INTERFACES
   ========================================================================= */

type GamePhase = 'briefing' | 'phase1' | 'phase2' | 'phase3' | 'results';

interface CrackEstimate {
  timeLabelBm: string;
  timeLabelEn: string;
  strength: 'very-weak' | 'weak' | 'moderate' | 'strong' | 'fortified';
  score: number;
  attemptsPerSecBm: string;
  attemptsPerSecEn: string;
  explanationBm: string;
  explanationEn: string;
}

interface AccountCardState {
  id: string;
  nameBm: string;
  nameEn: string;
  serviceType: 'email' | 'bank' | 'social' | 'ewallet';
  identifier: string;
  currentPassword: string;
  isBreached: boolean;
  isSecured: boolean;
  generatedPassphrase: string;
}

/* =========================================================================
   CLIENT-SIDE PASSWORD ESTIMATOR (ZERO LOGGING / ZERO TRANSMISSION)
   ========================================================================= */

function calculateCrackEstimate(password: string): CrackEstimate {
  if (!password || password.trim().length === 0) {
    return {
      timeLabelBm: '0 saat (Kosong)',
      timeLabelEn: '0 seconds (Empty)',
      strength: 'very-weak',
      score: 0,
      attemptsPerSecBm: '0 cubaan/saat',
      attemptsPerSecEn: '0 guesses/sec',
      explanationBm: 'Sila taip apa-apa kata laluan latihan di atas untuk menguji ketahanannya.',
      explanationEn: 'Type any practice password above to test how long it resists a hacker.'
    };
  }

  const commonWeak = [
    '123456', '12345678', 'password', 'qwerty', '123456789', '12345',
    'kucing123', 'malaysia2024', 'malaysia', 'sayang123', 'merdeka',
    'admin', 'iloveyou', 'bunga123', 'rahsia', 'kampung123', 'kampung',
    'rahasia123', 'selamat123', 'politeknik', '111111', '000000', 'ali123'
  ];

  const lower = password.toLowerCase().trim();
  if (commonWeak.includes(lower)) {
    return {
      timeLabelBm: '0.001 saat (Serta-merta!)',
      timeLabelEn: '0.001 seconds (Instantly!)',
      strength: 'very-weak',
      score: 1,
      attemptsPerSecBm: '1 bilion cubaan/saat (Pecah serta-merta)',
      attemptsPerSecEn: '1 billion guesses/sec (Instant crack)',
      explanationBm: 'AMARAN: Kata laluan ini tersenarai dalam kamus penggodam! Ia dipecahkan dalam masa kurang 1 saat.',
      explanationEn: 'DANGER: Found in common hacker dictionaries! Cracked in less than 1 second.'
    };
  }

  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const varietyCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

  if (length < 6) {
    return {
      timeLabelBm: '0.01 saat (Serta-merta)',
      timeLabelEn: '0.01 seconds (Instantly)',
      strength: 'very-weak',
      score: 1,
      attemptsPerSecBm: '100 juta cubaan/saat',
      attemptsPerSecEn: '100M guesses/sec',
      explanationBm: 'Terlalu pendek! Komputer penggodam boleh mencuba semua kombinasi dalam sesaat.',
      explanationEn: 'Too short! Modern computers cycle through all combinations in a split second.'
    };
  }

  if (length <= 8) {
    if (varietyCount <= 2) {
      return {
        timeLabelBm: '2 minit',
        timeLabelEn: '2 minutes',
        strength: 'weak',
        score: 2,
        attemptsPerSecBm: '50 juta cubaan/saat',
        attemptsPerSecEn: '50M guesses/sec',
        explanationBm: 'Pendek dan mudah diteka oleh serangan perisian bot automatik.',
        explanationEn: 'Short and quickly guessed by automated bot scripts.'
      };
    }
    return {
      timeLabelBm: '5 jam',
      timeLabelEn: '5 hours',
      strength: 'moderate',
      score: 3,
      attemptsPerSecBm: '10 juta cubaan/saat',
      attemptsPerSecEn: '10M guesses/sec',
      explanationBm: 'Simbol membantu, tetapi panjang kata laluan masih terlalu singkat.',
      explanationEn: 'Symbols help slightly, but length is still too short.'
    };
  }

  if (length <= 11) {
    if (varietyCount <= 2) {
      return {
        timeLabelBm: '3 hari',
        timeLabelEn: '3 days',
        strength: 'moderate',
        score: 3,
        attemptsPerSecBm: '5 juta cubaan/saat',
        attemptsPerSecEn: '5M guesses/sec',
        explanationBm: 'Sederhana, namun masih terdedah kepada pelayan komputer berkuasa tinggi.',
        explanationEn: 'Moderate, but vulnerable to modern cloud GPU clusters.'
      };
    }
    return {
      timeLabelBm: '5 tahun',
      timeLabelEn: '5 years',
      strength: 'strong',
      score: 4,
      attemptsPerSecBm: '1 juta cubaan/saat',
      attemptsPerSecEn: '1M guesses/sec',
      explanationBm: 'Kukuh! Menggabungkan kepanjangan huruf dan aksara pelbagai.',
      explanationEn: 'Strong! Combines reasonable length and character diversity.'
    };
  }

  if (length <= 14) {
    return {
      timeLabelBm: '3,000 tahun',
      timeLabelEn: '3,000 years',
      strength: 'fortified',
      score: 5,
      attemptsPerSecBm: '100,000 cubaan/saat',
      attemptsPerSecEn: '100k guesses/sec',
      explanationBm: 'Sangat selamat! Memerlukan beribu tahun untuk dipecahkan komputer.',
      explanationEn: 'Highly secure! Would take supercomputers millennia to crack.'
    };
  }

  return {
    timeLabelBm: '2.5 Juta Tahun (Kubu Kebal!)',
    timeLabelEn: '2.5 Million Years (Fortified!)',
    strength: 'fortified',
    score: 5,
    attemptsPerSecBm: 'Mustahil dipecahkan',
    attemptsPerSecEn: 'Mathematically impossible',
    explanationBm: 'LUAR BIASA! Frasa laluan panjang menewaskan superkomputer penggodam selama jutaan tahun!',
    explanationEn: 'OUTSTANDING! Long passphrases defeat hacker supercomputers for millions of years!'
  };
}

/* =========================================================================
   INITIAL DATA FOR 4 ACCOUNTS IN PHASE 2
   ========================================================================= */

const INITIAL_ACCOUNTS: AccountCardState[] = [
  {
    id: 'acc-email',
    nameBm: 'Emel Utama Peribadi',
    nameEn: 'Primary Personal Email',
    serviceType: 'email',
    identifier: 'ali.desa@email.com',
    currentPassword: 'KucingComel123!',
    isBreached: false,
    isSecured: false,
    generatedPassphrase: 'Kopi-Panas-Pagi-Tenang-24'
  },
  {
    id: 'acc-bank',
    nameBm: 'Perbankan Internet',
    nameEn: 'Online Banking Portal',
    serviceType: 'bank',
    identifier: 'Maybank2u / CIMB Clicks',
    currentPassword: 'KucingComel123!',
    isBreached: false,
    isSecured: false,
    generatedPassphrase: 'Harimau-Lompat-Sungai-99'
  },
  {
    id: 'acc-social',
    nameBm: 'Akaun Media Sosial',
    nameEn: 'Social Media (FB & TikTok)',
    serviceType: 'social',
    identifier: '@Ali_Desa',
    currentPassword: 'KucingComel123!',
    isBreached: false,
    isSecured: false,
    generatedPassphrase: 'Padi-Kuning-Gunung-77'
  },
  {
    id: 'acc-ewallet',
    nameBm: 'E-Dompet Digital',
    nameEn: 'E-Wallet Account (TnG / Boost)',
    serviceType: 'ewallet',
    identifier: '+6012-345-6789',
    currentPassword: 'KucingComel123!',
    isBreached: false,
    isSecured: false,
    generatedPassphrase: 'Kereta-Biru-Laju-55'
  }
];

export const AccountWorkshopGame: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();

  /* =========================================================================
     GLOBAL STATE
     ========================================================================= */
  const [phase, setPhase] = useState<GamePhase>('briefing');

  /* =========================================================================
     PHASE 1 STATE: CRACK RACE
     ========================================================================= */
  const [practicePassword, setPracticePassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hackerGuesses, setHackerGuesses] = useState<string[]>([
    'a1b2c3d4', 'pass1234', 'qwerty99', 'admin2024', 'sayangku'
  ]);

  useEffect(() => {
    if (phase !== 'phase1') return;
    const interval = setInterval(() => {
      const randomPrefixes = ['123', 'abc', 'pwd', 'my', 'kl', 'admin', 'pass', 'bot', 'hack'];
      const randomSuffixes = ['99', '2024', '!', '#', '88', '00', 'xyz', '77'];
      const newGuess =
        randomPrefixes[Math.floor(Math.random() * randomPrefixes.length)] +
        Math.floor(Math.random() * 9999).toString() +
        randomSuffixes[Math.floor(Math.random() * randomSuffixes.length)];

      setHackerGuesses(prev => [newGuess, prev[0], prev[1], prev[2], prev[3]]);
    }, 450);
    return () => clearInterval(interval);
  }, [phase]);

  const crackEstimate = calculateCrackEstimate(practicePassword);

  const handleFillExample = (exampleType: 'weak' | 'strong') => {
    playPopSound();
    if (exampleType === 'weak') {
      setPracticePassword('kucing123');
    } else {
      setPracticePassword('Kopi-Pagi-Sarawak-88');
    }
  };

  /* =========================================================================
     PHASE 2 STATE: DOMINO BREACH
     ========================================================================= */
  const [accounts, setAccounts] = useState<AccountCardState[]>(INITIAL_ACCOUNTS);
  const [isDominoAttacking, setIsDominoAttacking] = useState<boolean>(false);
  const [hasRunFirstBreach, setHasRunFirstBreach] = useState<boolean>(false);
  const [dominoBreachedCount, setDominoBreachedCount] = useState<number>(0);
  const [retestPassed, setRetestPassed] = useState<boolean>(false);

  const triggerDominoBreach = () => {
    playWarningTone();
    setIsDominoAttacking(true);
    setHasRunFirstBreach(true);
    setDominoBreachedCount(0);

    const staggerTimes = [300, 900, 1500, 2100];
    staggerTimes.forEach((delay, idx) => {
      setTimeout(() => {
        setDominoBreachedCount(idx + 1);
        playPopSound();
        setAccounts(prev =>
          prev.map((acc, aIdx) => (aIdx <= idx ? { ...acc, isBreached: true } : acc))
        );
      }, delay);
    });

    setTimeout(() => {
      setIsDominoAttacking(false);
    }, 2600);
  };

  const handleAssignUnique = (accountId: string) => {
    playPopSound();
    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id === accountId) {
          return {
            ...acc,
            currentPassword: acc.generatedPassphrase,
            isBreached: false,
            isSecured: true
          };
        }
        return acc;
      })
    );
  };

  const allAccountsSecured = accounts.every(a => a.isSecured);

  const triggerRetestAttack = () => {
    playPopSound();
    setIsDominoAttacking(true);
    setTimeout(() => {
      setIsDominoAttacking(false);
      setRetestPassed(true);
      playSuccessChime();
    }, 1200);
  };

  /* =========================================================================
     PHASE 3 STATE: LOCK THE VAULT
     ========================================================================= */
  const [enable2FA, setEnable2FA] = useState<boolean>(false);
  const [usePasswordManager, setUsePasswordManager] = useState<boolean>(false);
  const [show2FAStep, setShow2FAStep] = useState<boolean>(false);
  const [enteredOtp, setEnteredOtp] = useState<string>('');
  const [otpVerified, setOtpVerified] = useState<boolean>(false);
  const [otpError, setOtpError] = useState<boolean>(false);

  // Modal accessibility state & refs
  const [showScamCallModal, setShowScamCallModal] = useState<boolean>(false);
  const [scamCallFeedback, setScamCallFeedback] = useState<'safe' | 'unsafe' | null>(null);
  const scamModalCloseRef = useRef<HTMLButtonElement | null>(null);
  const scamRefuseBtnRef = useRef<HTMLButtonElement | null>(null);
  const scamTriggerBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isTestingVault, setIsTestingVault] = useState<boolean>(false);

  // Modal accessibility: Escape key listener and focus management
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showScamCallModal) {
        setShowScamCallModal(false);
      }
    };
    if (showScamCallModal) {
      window.addEventListener('keydown', handleKeyDown);
      // Focus the primary safe action button when modal opens
      setTimeout(() => {
        scamRefuseBtnRef.current?.focus();
      }, 50);
    } else {
      // Return focus to trigger button when modal closes
      scamTriggerBtnRef.current?.focus();
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showScamCallModal]);

  // Focus close button once feedback is revealed
  useEffect(() => {
    if (scamCallFeedback) {
      setTimeout(() => {
        scamModalCloseRef.current?.focus();
      }, 50);
    }
  }, [scamCallFeedback]);

  const handleToggle2FA = () => {
    playPopSound();
    const nextVal = !enable2FA;
    setEnable2FA(nextVal);
    if (nextVal && !otpVerified) {
      setShow2FAStep(true);
    }
  };

  const handleVerifyOtp = (codeToTest?: string) => {
    const code = codeToTest || enteredOtp;
    if (code.replace(/\s+/g, '') === '849201') {
      playSuccessChime();
      setOtpVerified(true);
      setOtpError(false);
    } else {
      playWarningTone();
      setOtpError(true);
    }
  };

  const handleScamAnswer = (shared: boolean) => {
    if (!shared) {
      playSuccessChime();
      setScamCallFeedback('safe');
    } else {
      playWarningTone();
      setScamCallFeedback('unsafe');
    }
  };

  /* =========================================================================
     SCORING & RESULTS FINALIZATION
     ========================================================================= */
  const [finalScore, setFinalScore] = useState<number>(0);
  const [vaultRating, setVaultRating] = useState<'Gold' | 'Silver' | 'Bronze'>('Bronze');
  const [badges, setBadges] = useState<BadgeItem[]>([]);

  const finalizeResults = () => {
    // 1. Phase 1 score (max 15 pts)
    const p1Score = Math.min(15, crackEstimate.score * 3);

    // 2. Phase 2 score (max 15 pts)
    const securedCount = accounts.filter(a => a.isSecured).length;
    const p2Score = Math.round(securedCount * 3.75);

    // 3. Phase 3 score (max 20 pts)
    let p3Score = 0;
    if (enable2FA && otpVerified) p3Score += 10;
    if (usePasswordManager) p3Score += 5;
    if (scamCallFeedback === 'safe') p3Score += 5;

    const totalScore = Math.min(50, p1Score + p2Score + p3Score);
    setFinalScore(totalScore);

    let rating: 'Gold' | 'Silver' | 'Bronze' = 'Bronze';
    if (totalScore >= 40) {
      rating = 'Gold';
    } else if (totalScore >= 25) {
      rating = 'Silver';
    }
    setVaultRating(rating);

    // Unlocked badges
    const earnedBadges: BadgeItem[] = [
      {
        id: 'badge-vault-master',
        name: isEn ? 'Master of the Vault' : 'Penjaga Kubu Kebal',
        description: isEn
          ? 'Completed Module 2: Password Defense & Account Vault challenge!'
          : 'Berjaya menamatkan Cabaran Modul 2: Pertahankan Peti Besi!',
        icon: '🛡️',
        isUnlocked: true
      }
    ];

    if (totalScore >= 45) {
      earnedBadges.push({
        id: 'badge-passphrase-hero',
        name: isEn ? 'Passphrase Hero' : 'Wira Frasa Laluan',
        description: isEn
          ? 'Built impenetrable vault defenses across all phases!'
          : 'Membina pertahanan peti besi yang kebal merentasi semua fasa!',
        icon: '⭐',
        isUnlocked: true
      });
    }

    if (scamCallFeedback === 'safe') {
      earnedBadges.push({
        id: 'badge-anti-scam',
        name: isEn ? 'Anti-Scam Guardian' : 'Pengawal Kebal Scammer',
        description: isEn
          ? 'Strictly refused to disclose 6-digit OTP code over the phone.'
          : 'Tegas menolak berkongsi kod OTP melalui panggilan telefon.',
        icon: '📞',
        isUnlocked: true
      });
    }

    setBadges(earnedBadges);

    // Save to persistent progress
    saveChallengeResult('passwords', totalScore, 50);
    triggerCelebration();
    setPhase('results');
  };

  const handleRunFinalVaultTest = () => {
    setIsTestingVault(true);
    playPopSound();
    setTimeout(() => {
      setIsTestingVault(false);
      finalizeResults();
    }, 1500);
  };

  const handleStartMission = () => {
    playPopSound();
    setPhase('phase1');
  };

  const handleResetForNextGroup = () => {
    playPopSound();
    setPracticePassword('');
    setShowPassword(false);
    setAccounts(INITIAL_ACCOUNTS);
    setIsDominoAttacking(false);
    setHasRunFirstBreach(false);
    setDominoBreachedCount(0);
    setRetestPassed(false);
    setEnable2FA(false);
    setUsePasswordManager(false);
    setShow2FAStep(false);
    setEnteredOtp('');
    setOtpVerified(false);
    setOtpError(false);
    setShowScamCallModal(false);
    setScamCallFeedback(null);
    setIsTestingVault(false);
    setFinalScore(0);
    setVaultRating('Bronze');
    setPhase('briefing');
  };

  /* =========================================================================
     STAGE 0: BRIEFING SCREEN (USING StationBriefing)
     ========================================================================= */
  if (phase === 'briefing') {
    return (
      <StationBriefing
        stationNumber="02"
        stationName={isEn ? 'Vault Defense' : 'Pertahankan Peti Besi'}
        title={isEn ? 'Defend the Digital Vault' : 'Pertahankan Peti Besi Digital'}
        description={
          isEn
            ? 'Your group of 5 will protect personal accounts from simulated hackers across 3 rapid defense phases.'
            : 'Kumpulan anda akan mempertahankan akaun digital daripada serangan penggodam merentasi 3 fasa pantas.'
        }
        voiceOverText={
          isEn
            ? 'Defend the Digital Vault. Your group of 5 will protect personal accounts from simulated hackers across 3 rapid defense phases: Crack Race, Domino Breach, and Lock the Vault.'
            : 'Pertahankan Peti Besi Digital. Kumpulan anda akan mempertahankan akaun digital daripada serangan penggodam merentasi 3 fasa pantas: Perlumbaan Pecah, Serangan Berjangkit, dan Kunci Peti Besi.'
        }
        privacyNotice={{
          title: isEn ? '⚠️ Privacy Rule: Never Type Your Real Password!' : '⚠️ Peraturan Privasi: Jangan Taip Kata Laluan Sebenar!',
          description: isEn
            ? 'This workshop station runs 100% locally on this laptop. Nothing is stored, saved, or transmitted. Always use practice phrases only.'
            : 'Sesi latihan ini beroperasi 100% dalam komputer riba ini tanpa sebarang rakaman. Gunakan kata laluan rekaan sahaja.'
        }}
        steps={[
          {
            title: isEn ? 'Crack Race' : 'Perlumbaan Pecah',
            description: isEn
              ? 'Type practice phrases to see how live supercomputer bots attack weak vs. long words.'
              : 'Taip frasa laluan latihan untuk melihat kelajuan penggodam memecahkan kata laluan.'
          },
          {
            title: isEn ? 'Domino Breach' : 'Serangan Berjangkit',
            description: isEn
              ? 'Watch 4 accounts collapse when using one password, then assign unique passphrases to stop it.'
              : 'Saksikan 4 akaun tumbang akibat satu kata laluan sama, lalu perbaikinya dengan frasa unik.'
          },
          {
            title: isEn ? 'Lock the Vault' : 'Kunci Peti Besi',
            description: isEn
              ? 'Turn on 2FA shields, test a fake 6-digit code, and defeat suspicious phone calls.'
              : 'Aktifkan perisai 2FA, uji kod 6-digit rahsia, dan tangkis panggilan penipuan TAC.'
          }
        ]}
        onStart={handleStartMission}
        startLabel={isEn ? 'Start Mission →' : 'Mula Misi →'}
      />
    );
  }

  /* =========================================================================
     STAGE 4: RESULTS SCREEN (USING StationResults & BadgesDrawer)
     ========================================================================= */
  if (phase === 'results') {
    return (
      <StationResults
        stationNumber="02"
        rating={vaultRating}
        ratingTitle={
          vaultRating === 'Gold'
            ? isEn
              ? 'Gold Vault Fortress (Kebal)'
              : 'Kubu Emas Peti Besi (Kebal)'
            : vaultRating === 'Silver'
            ? isEn
              ? 'Silver Shield (Kukuh)'
              : 'Perisai Perak (Kukuh)'
            : isEn
            ? 'Bronze Vault (Perlu Diperkukuh)'
            : 'Peti Besi Gangsa (Perlu Diperkukuh)'
        }
        ratingDescription={
          isEn
            ? 'Great job completing all vault defense phases and securing your accounts.'
            : 'Tahniah kerana berjaya mempertahankan akaun anda merentasi semua fasa perlindungan.'
        }
        badges={badges}
        homeTips={[
          {
            title: isEn ? 'Use 4-Word Passphrases' : 'Guna Frasa Laluan 4 Perkataan',
            description: isEn
              ? 'Combine 4 random memorable words (e.g. Kopi-Pagi-Sarawak-88). Far easier to remember and nearly impossible for hackers to crack.'
              : 'Gabungkan 4 perkataan rawak yang bermakna. Lebih mudah diingati dan mustahil dipecahkan oleh komputer penggodam.'
          },
          {
            title: isEn ? 'Turn On 2FA Everywhere' : 'Hidupkan 2FA di Semua Akaun',
            description: isEn
              ? 'Enable 2-Step Verification on WhatsApp, Google, and online banking. It shields you even if someone knows your password.'
              : 'Aktifkan pengesahan 2-langkah di WhatsApp, Google, dan perbankan supaya akaun kebal walaupun kata laluan bocor.'
          },
          {
            title: isEn ? 'Never Share OTP Over Phone' : 'Jangan Kongsi OTP Melalui Telefon',
            description: isEn
              ? 'Real banks, government officers, and police NEVER ask for your OTP/TAC codes over phone calls.'
              : 'Jangan sekali-kali membaca kod OTP/TAC kepada pemanggil telefon, tidak kira apa pun gelaran yang mereka gunakan.'
          }
        ]}
        onReset={handleResetForNextGroup}
      />
    );
  }

  /* =========================================================================
     PHASE 1: CRACK RACE
     ========================================================================= */
  const renderPhase1 = () => (
    <div className="space-y-6">
      <InfoBanner
        variant="blue"
        title={isEn ? 'Mission: Test Password Survival Time' : 'Misi: Uji Ketahanan Masa Kata Laluan'}
        description={
          isEn
            ? 'Type a practice password below, or click the quick example buttons to see how fast automated computers guess them!'
            : 'Taip kata laluan latihan di bawah, atau tekan butang contoh segera untuk melihat kepantasan komputer penggodam meneka!'
        }
        icon={<Zap className="w-5 h-5" />}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-3xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="practice-password-input" className="text-base font-black text-slate-900 block">
                {isEn ? 'Enter Practice Password:' : 'Masukkan Kata Laluan Latihan:'}
              </label>
              <span className="text-sm font-bold text-slate-500 font-mono">
                {practicePassword.length} {isEn ? 'Characters' : 'Aksara'}
              </span>
            </div>

            <div className="relative">
              <input
                id="practice-password-input"
                type={showPassword ? 'text' : 'password'}
                value={practicePassword}
                onChange={e => setPracticePassword(e.target.value)}
                placeholder={isEn ? 'e.g. kucing123 or Kopi-Pagi-Sarawak-88' : 'cth: kucing123 atau Kopi-Pagi-Sarawak-88'}
                className="w-full min-h-[56px] px-4 py-3.5 pr-14 rounded-2xl border-2 border-slate-300 focus:border-blue-600 focus:outline-hidden text-lg sm:text-xl font-mono text-slate-900 tracking-wider shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? (isEn ? 'Hide password' : 'Sorok kata laluan') : (isEn ? 'Show password' : 'Papar kata laluan')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <p className="text-sm font-bold text-amber-700">
              * {isEn ? 'Do not enter your real password.' : 'Jangan masukkan kata laluan sebenar anda.'}
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-black text-slate-700 block uppercase tracking-wide">
              {isEn ? 'Try Instant Examples:' : 'Cuba Contoh Segera:'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleFillExample('weak')}
                className="min-h-[52px] p-3 rounded-2xl border-2 border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-950 font-bold text-base flex items-center justify-between transition-all active:scale-95 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-rose-600" />
                  <span>kucing123</span>
                </span>
                <span className="text-sm bg-rose-200 text-rose-900 px-2.5 py-0.5 rounded-full font-black">
                  {isEn ? 'Weak' : 'Lemah'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleFillExample('strong')}
                className="min-h-[52px] p-3 rounded-2xl border-2 border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-950 font-bold text-base flex items-center justify-between transition-all active:scale-95 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm sm:text-base font-mono">Kopi-Pagi-Sarawak-88</span>
                </span>
                <span className="text-sm bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full font-black">
                  {isEn ? 'Strong' : 'Kubu'}
                </span>
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase font-black text-slate-500 tracking-wider">
                {isEn ? 'Simulated Crack Time' : 'Anggaran Masa Pecah Penggodam'}
              </span>
              <span
                className={`text-sm font-black uppercase px-2.5 py-0.5 rounded-full border ${
                  crackEstimate.strength === 'fortified'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : crackEstimate.strength === 'strong'
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : crackEstimate.strength === 'moderate'
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-rose-100 text-rose-800 border-rose-300'
                }`}
              >
                {crackEstimate.strength === 'fortified' && (isEn ? 'Fortified' : 'Kubu Kebal')}
                {crackEstimate.strength === 'strong' && (isEn ? 'Strong' : 'Kukuh')}
                {crackEstimate.strength === 'moderate' && (isEn ? 'Moderate' : 'Sederhana')}
                {crackEstimate.strength === 'weak' && (isEn ? 'Weak' : 'Lemah')}
                {crackEstimate.strength === 'very-weak' && (isEn ? 'Critical Risk' : 'Sangat Lemah')}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <strong
                className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                  crackEstimate.strength === 'fortified'
                    ? 'text-emerald-700'
                    : crackEstimate.strength === 'strong'
                    ? 'text-blue-700'
                    : crackEstimate.strength === 'moderate'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {isEn ? crackEstimate.timeLabelEn : crackEstimate.timeLabelBm}
              </strong>
            </div>

            <p className="text-base text-slate-700 font-medium leading-relaxed">
              {isEn ? crackEstimate.explanationEn : crackEstimate.explanationBm}
            </p>
          </div>

          <TakeawayCard
            takeawayNumber={1}
            title={isEn ? 'Golden Takeaway #1:' : 'Prinsip Emas #1:'}
            text={
              isEn
                ? 'Longer Passphrase (4 words) > Complicated short password. Length defeats computers every time!'
                : 'Frasa laluan panjang (4 perkataan rawak) jauh lebih mudah diingati dan jauh lebih kebal daripada kata laluan pendek yang rumit!'
            }
            variant="emerald"
          />
        </div>

        {/* Live Hacker Terminal Animation */}
        <div className="lg:col-span-5 bg-slate-950 text-white rounded-3xl border-2 border-slate-800 p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-sm text-slate-400">
            <span className="flex items-center gap-2 font-mono text-emerald-400 font-bold">
              <Terminal className="w-4 h-4" />
              <span>{isEn ? 'Hacker Bot Attack Simulator' : 'Simulator Serangan Bot Penggodam'}</span>
            </span>
            <span className={`w-2.5 h-2.5 rounded-full bg-emerald-500 ${shouldReduceMotion ? '' : 'animate-pulse'}`}></span>
          </div>

          <div className="p-6 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center space-y-3">
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : crackEstimate.strength === 'very-weak'
                  ? { x: [-3, 3, -3, 3, 0], transition: { repeat: Infinity, duration: 0.25 } }
                  : crackEstimate.strength === 'weak'
                  ? { x: [-2, 2, -2, 2, 0], transition: { repeat: Infinity, duration: 0.4 } }
                  : crackEstimate.strength === 'moderate'
                  ? { scale: [1, 1.05, 1], transition: { duration: 1.5, repeat: Infinity } }
                  : {}
              }
              className={`w-20 h-20 rounded-3xl flex items-center justify-center text-white shadow-lg ${
                crackEstimate.strength === 'fortified'
                  ? 'bg-emerald-600 shadow-emerald-900/50'
                  : crackEstimate.strength === 'strong'
                  ? 'bg-blue-600 shadow-blue-900/50'
                  : crackEstimate.strength === 'moderate'
                  ? 'bg-amber-600 shadow-amber-900/50'
                  : 'bg-rose-600 shadow-rose-900/50'
              }`}
            >
              {crackEstimate.strength === 'fortified' ? (
                <ShieldCheck className="w-10 h-10" />
              ) : crackEstimate.strength === 'strong' ? (
                <Lock className="w-10 h-10" />
              ) : crackEstimate.strength === 'moderate' ? (
                <Lock className="w-10 h-10" />
              ) : (
                <Unlock className="w-10 h-10" />
              )}
            </motion.div>

            <div>
              <strong className="text-lg font-bold text-white block">
                {crackEstimate.strength === 'fortified' && (isEn ? 'VAULT SECURED' : 'PETI BESI KEBAL')}
                {crackEstimate.strength === 'strong' && (isEn ? 'RESISTING ATTACK' : 'BERJAYA BERTAHAN')}
                {crackEstimate.strength === 'moderate' && (isEn ? 'ATTACK IN PROGRESS' : 'SEDANG DISERANG')}
                {crackEstimate.strength === 'weak' && (isEn ? 'HIGH CRACK CHANCE' : 'HAMPIR TERPECAH')}
                {crackEstimate.strength === 'very-weak' && (isEn ? 'COMPROMISED INSTANTLY' : 'TERPECAH SERTA-MERTA')}
              </strong>
              <span className="text-sm text-slate-400 font-mono">
                {isEn ? crackEstimate.attemptsPerSecEn : crackEstimate.attemptsPerSecBm}
              </span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-sm">
            <span className="text-slate-400 uppercase tracking-wider block font-bold text-xs">
              {isEn ? 'Live Brute-Force Dictionary Stream:' : 'Aliran Percubaan Bot Penggodam:'}
            </span>
            <div className="bg-black/60 rounded-xl p-3 border border-slate-800 space-y-1 text-slate-400">
              {hackerGuesses.map((guess, idx) => (
                <div key={idx} className="flex items-center justify-between font-mono">
                  <span className="text-slate-500">TRY #{idx + 1042}</span>
                  <span className="text-emerald-400 font-bold">&gt;&gt; {guess}</span>
                  <span className="text-rose-400 font-bold">{isEn ? 'FAIL' : 'GAGAL'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <PrimaryButton
          onClick={() => {
            playSuccessChime();
            setPhase('phase2');
          }}
          className="w-full sm:w-auto"
        >
          {isEn ? 'Proceed to Phase 2: Domino Breach →' : 'Seterusnya: Fasa 2 (Serangan Berjangkit) →'}
        </PrimaryButton>
      </div>
    </div>
  );

  /* =========================================================================
     PHASE 2: DOMINO BREACH
     ========================================================================= */
  const renderPhase2 = () => (
    <div className="space-y-6">
      <InfoBanner
        variant="rose"
        title={isEn ? 'Simulated Leak Event: Local Food Forum Database Hacked!' : 'Peristiwa Kebocoran: Pangkalan Data Forum Makanan Tempatan Digodam!'}
        badgeText={isEn ? 'Critical Threat' : 'Amaran Bahaya'}
        description={
          isEn
            ? 'All 4 accounts below currently use the same shared password ("KucingComel123!"). Trigger the attack to watch the domino effect, then assign unique passphrases to stop it!'
            : 'Keempat-empat akaun di bawah menggunakan kata laluan yang sama ("KucingComel123!"). Cetuskan serangan untuk melihat kesan domino, kemudian berikan kata laluan unik untuk menghentikannya!'
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border-2 border-slate-200">
        <div className="flex items-center gap-2">
          <span className="text-base font-black text-slate-900">
            {isEn ? 'Account Status:' : 'Status Akaun:'}
          </span>
          <span className="text-sm font-bold text-slate-600">
            {accounts.filter(a => a.isSecured).length} / 4 {isEn ? 'Secured with Unique Passphrase' : 'Telah Diasingkan Kata Laluan'}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {!hasRunFirstBreach ? (
            <button
              type="button"
              disabled={isDominoAttacking}
              onClick={triggerDominoBreach}
              className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              <Zap className="w-5 h-5" />
              <span>{isEn ? '⚡ Trigger Hacker Attack' : '⚡ Cetuskan Serangan Godaman'}</span>
            </button>
          ) : allAccountsSecured ? (
            <button
              type="button"
              disabled={isDominoAttacking}
              onClick={triggerRetestAttack}
              className="w-full sm:w-auto min-h-[52px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              <span>{isEn ? '🛡️ Re-Test Attack (Verify Defense)' : '🛡️ Uji Serangan Semula (Sahkan Kebal)'}</span>
            </button>
          ) : (
            <span className="text-base font-bold text-amber-700 bg-amber-50 px-4 py-2 rounded-xl border border-amber-300">
              {isEn ? '👉 Click "Assign Unique" on all accounts below' : '👉 Klik butang "Jana Unik" pada semua akaun di bawah'}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {accounts.map((account, index) => {
          const isFalling = isDominoAttacking && dominoBreachedCount === index + 1;

          return (
            <motion.div
              key={account.id}
              animate={
                shouldReduceMotion
                  ? {}
                  : isFalling
                  ? { y: [0, -10, 8, 0], rotate: [0, -3, 3, 0] }
                  : {}
              }
              transition={{ duration: 0.4 }}
              className={`rounded-3xl border-2 p-5 flex flex-col justify-between transition-all shadow-sm ${
                account.isSecured
                  ? 'bg-emerald-50/60 border-emerald-400'
                  : account.isBreached
                  ? 'bg-rose-50/70 border-rose-400'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-xs ${
                        account.serviceType === 'email'
                          ? 'bg-blue-600'
                          : account.serviceType === 'bank'
                          ? 'bg-emerald-600'
                          : account.serviceType === 'social'
                          ? 'bg-purple-600'
                          : 'bg-amber-600'
                      }`}
                    >
                      {account.serviceType === 'email' && <Mail className="w-5 h-5" />}
                      {account.serviceType === 'bank' && <Building2 className="w-5 h-5" />}
                      {account.serviceType === 'social' && <Globe className="w-5 h-5" />}
                      {account.serviceType === 'ewallet' && <Wallet className="w-5 h-5" />}
                    </div>
                    <div>
                      <span className="text-sm font-black uppercase text-slate-500 block">
                        {isEn ? `Account #${index + 1}` : `Akaun #${index + 1}`}
                      </span>
                      <strong className="text-base font-bold text-slate-900 block leading-tight">
                        {isEn ? account.nameEn : account.nameBm}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="text-sm font-mono text-slate-500 truncate">
                  {account.identifier}
                </div>

                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-500 block uppercase">
                    {isEn ? 'Password in Use:' : 'Kata Laluan Digunakan:'}
                  </span>
                  <span
                    className={`text-sm font-mono font-bold block truncate ${
                      account.isSecured ? 'text-emerald-700' : 'text-slate-700'
                    }`}
                  >
                    {account.currentPassword}
                  </span>
                </div>

                <div>
                  {account.isSecured ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 text-sm font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>{isEn ? 'Unique & Fortified' : 'Unik & Kebal'}</span>
                    </span>
                  ) : account.isBreached ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-300 text-sm font-bold ${
                        shouldReduceMotion ? 'ring-2 ring-rose-500' : 'animate-pulse'
                      }`}
                    >
                      <XCircle className="w-4 h-4 text-rose-600" />
                      <span>{isEn ? 'BREACHED BY DOMINO' : 'TUMBANG / DIGODAM'}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm font-bold">
                      <Lock className="w-3.5 h-3.5" />
                      <span>{isEn ? 'Shared Password' : 'Kata Laluan Kongsi'}</span>
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 mt-4">
                {!account.isSecured ? (
                  <button
                    type="button"
                    onClick={() => handleAssignUnique(account.id)}
                    className="w-full min-h-[48px] py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xs active:scale-95 cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>{isEn ? 'Assign Unique' : 'Jana Kata Laluan Unik'}</span>
                  </button>
                ) : (
                  <div className="text-center py-2 text-sm font-bold text-emerald-800 bg-emerald-100 rounded-xl border border-emerald-200">
                    ✓ {isEn ? 'Domino Chain Severed' : 'Kesan Domino Terputus'}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {retestPassed && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 flex items-start gap-3"
        >
          <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-lg font-black text-emerald-950 block">
              {isEn ? 'DOMINO CHAIN BLOCKED! (DEFENSE SUCCESSFUL)' : 'RANTAIAN DOMINO TERPUTUS! (BERJAYA BERTAHAN)'}
            </strong>
            <p className="text-base text-emerald-900 font-medium">
              {isEn
                ? 'Because every service has an isolated passphrase, the leak of one website could not crack any of the others!'
                : 'Oleh sebab semua akaun mempunyai frasa unik berasingan, kebocoran satu laman sesawang langsung tidak menggugat akaun yang lain!'}
            </p>
          </div>
        </motion.div>
      )}

      <TakeawayCard
        takeawayNumber={2}
        title={isEn ? 'Golden Takeaway #2:' : 'Prinsip Emas #2:'}
        text={
          isEn
            ? 'One Password Per Account. If one website leaks your details, your other services remain 100% safe.'
            : 'Satu Kata Laluan Untuk Satu Akaun. Kebocoran satu laman sesawang tidak akan memudaratkan akaun perbankan atau emel anda yang lain.'
        }
        variant="blue"
      />

      <div className="pt-4 flex justify-end">
        <PrimaryButton
          disabled={!allAccountsSecured}
          onClick={() => {
            playSuccessChime();
            setPhase('phase3');
          }}
          className="w-full sm:w-auto"
        >
          {isEn ? 'Proceed to Phase 3: Lock the Vault →' : 'Seterusnya: Fasa 3 (Kunci Peti Besi) →'}
        </PrimaryButton>
      </div>
    </div>
  );

  /* =========================================================================
     PHASE 3: LOCK THE VAULT
     ========================================================================= */
  const renderPhase3 = () => (
    <div className="space-y-6">
      <InfoBanner
        variant="blue"
        title={isEn ? 'Final Phase: Fortify the Digital Vault' : 'Fasa Terakhir: Kukuhkan Peti Besi Digital'}
        description={
          isEn
            ? 'Activate essential defense layers below: 2FA, Password Manager, and strict OTP privacy protocols.'
            : 'Aktifkan lapisan perlindungan kubu di bawah: 2FA, Pengurus Kata Laluan, dan protokol privasi kod OTP.'
        }
      />

      <div className="grid grid-cols-1 gap-4">
        {/* Toggle 1: 2FA */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <Smartphone className="w-6 h-6 text-blue-600" />
              <strong className="text-lg sm:text-xl font-black text-slate-900">
                {isEn ? 'Enable Two-Factor Authentication (2FA)' : 'Aktifkan Pengesahan Dua Faktor (2FA)'}
              </strong>
            </div>
            <p className="text-base text-slate-600 font-medium">
              {isEn
                ? 'Adds a second layer of defense. Even if someone steals your password, they cannot enter without your phone approval.'
                : 'Benteng kedua: Walaupun penjenayah tahu kata laluan anda, mereka tetap tidak boleh masuk tanpa kod telefon anda.'}
            </p>
            {enable2FA && otpVerified && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ {isEn ? '2FA Code Verified' : 'Kod 2FA Telah Disahkan'}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleToggle2FA}
            className={`min-h-[52px] px-6 py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
              enable2FA
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            {enable2FA ? <Check className="w-5 h-5" /> : null}
            <span>{enable2FA ? (isEn ? '2FA Enabled' : '2FA Diaktifkan') : (isEn ? 'Turn On 2FA' : 'Hidupkan 2FA')}</span>
          </button>
        </div>

        {/* Toggle 2: Password Manager */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <KeyRound className="w-6 h-6 text-amber-600" />
              <strong className="text-lg sm:text-xl font-black text-slate-900">
                {isEn ? 'Use a Password Manager (Pengurus Kata Laluan)' : 'Gunakan Pengurus Kata Laluan (Password Manager)'}
              </strong>
            </div>
            <p className="text-base text-slate-600 font-medium">
              {isEn
                ? 'A secure digital safe that generates and remembers unique passwords so your brain only needs to remember one master passphrase.'
                : 'Peti digital selamat yang mengingati semua kata laluan berbeza untuk anda. Anda hanya perlu ingat satu kata laluan utama.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              playPopSound();
              setUsePasswordManager(!usePasswordManager);
            }}
            className={`min-h-[52px] px-6 py-3 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95 ${
              usePasswordManager
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300'
            }`}
          >
            {usePasswordManager ? <Check className="w-5 h-5" /> : null}
            <span>{usePasswordManager ? (isEn ? 'Manager Active' : 'Pengurus Aktif') : (isEn ? 'Turn On' : 'Gunakan')}</span>
          </button>
        </div>

        {/* Toggle 3: Scam Awareness */}
        <div className="p-5 sm:p-6 rounded-3xl border-2 border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1 max-w-xl">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-6 h-6 text-rose-600" />
              <strong className="text-lg sm:text-xl font-black text-slate-900">
                {isEn ? 'Anti-Scam Test: Never Share OTP / TAC' : 'Ujian Anti-Scam: Pantang Larang Kod OTP / TAC'}
              </strong>
            </div>
            <p className="text-base text-slate-600 font-medium">
              {isEn
                ? 'Take the simulated bank call challenge to verify your readiness against phone impersonation scams.'
                : 'Uji kepekaan pasukan terhadap helah pemanggil yang menyamar sebagai pihak bank meminta kod OTP.'}
            </p>
            {scamCallFeedback === 'safe' && (
              <span className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                ✓ {isEn ? 'Safe: Refused to Disclose OTP' : 'Selamat: Menolak Berkongsi OTP'}
              </span>
            )}
          </div>

          <button
            ref={scamTriggerBtnRef}
            type="button"
            onClick={() => {
              playPopSound();
              setShowScamCallModal(true);
            }}
            className="min-h-[52px] px-6 py-3 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-900 border-2 border-rose-300 font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
          >
            <PhoneCall className="w-5 h-5 text-rose-600" />
            <span>{isEn ? 'Take Phone Call Test' : 'Ambil Ujian Panggilan'}</span>
          </button>
        </div>
      </div>

      {/* Mock 2FA Code Modal / Box */}
      {show2FAStep && !otpVerified && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-3xl bg-slate-900 text-white border-2 border-blue-500 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Smartphone className="w-5 h-5" />
              <span className="text-base">{isEn ? 'Simulated Bank Phone SMS' : 'SMS Simulasi Bank di Telefon Pintar'}</span>
            </div>
            <span className="text-sm font-mono text-slate-400 font-bold">10:42 AM</span>
          </div>

          <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 space-y-1">
            <span className="text-sm text-slate-400 uppercase tracking-wider block font-bold">
              {isEn ? 'Incoming SMS Message:' : 'Mesej SMS Diterima:'}
            </span>
            <p className="text-base text-slate-200 font-mono">
              {isEn ? (
                <>
                  &ldquo;Bank: Your vault 2FA verification code is <strong className="text-amber-400 text-lg">849 201</strong>. Never share this code with anyone.&rdquo;
                </>
              ) : (
                <>
                  &ldquo;Bank: Kod pengesahan 2FA peti besi anda ialah <strong className="text-amber-400 text-lg">849 201</strong>. Jangan kongsikan dengan sesiapa.&rdquo;
                </>
              )}
            </p>
          </div>

          <div className="space-y-3">
            <label htmlFor="otp-input" className="text-sm font-bold text-slate-300 block">
              {isEn ? 'Type the 6-Digit Code to Confirm Vault Lock:' : 'Masukkan Kod 6-Digit untuk Mengesahkan Kunci Peti Besi:'}
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                id="otp-input"
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value)}
                placeholder="849201"
                className="min-h-[52px] px-4 py-2.5 rounded-2xl bg-black border-2 border-slate-700 text-xl font-mono text-emerald-400 tracking-widest text-center focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                className="min-h-[52px] px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <span>{isEn ? 'Verify Code' : 'Sahkan Kod'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setEnteredOtp('849201');
                  handleVerifyOtp('849201');
                }}
                className="min-h-[52px] px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{isEn ? 'Auto-Fill (849201)' : 'Isi Automatik (849201)'}</span>
              </button>
            </div>
            {otpError && (
              <p className="text-sm font-bold text-rose-400">
                {isEn ? 'Incorrect code. Try typing: 849201' : 'Kod tidak tepat. Sila taip: 849201'}
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* Golden Takeaway #3 for Phase 3 */}
      <TakeawayCard
        takeawayNumber={3}
        title={isEn ? 'Golden Takeaway #3:' : 'Prinsip Emas #3:'}
        text={
          isEn
            ? 'Never share OTP/TAC codes with anyone over the phone. Real banks and police will never ask for them.'
            : 'Jangan sesekali kongsikan kod OTP/TAC melalui panggilan telefon. Pihak bank atau polis rasmi tidak pernah meminta kod pengesahan rahsia anda.'
        }
        variant="emerald"
      />

      {/* Scam Call Modal Challenge (Accessible Dialog) */}
      {showScamCallModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="scam-call-dialog-title"
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 space-y-6 shadow-2xl"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div
                className={`w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 ${
                  shouldReduceMotion ? '' : 'animate-bounce'
                }`}
              >
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className="text-sm font-black uppercase text-rose-600 tracking-wider">
                  {isEn ? 'Incoming Phone Call Simulation' : 'Simulasi Panggilan Masuk'}
                </span>
                <strong id="scam-call-dialog-title" className="text-xl font-black text-slate-900 block">
                  {isEn ? 'Claimed: Bank Security Desk' : 'Mendakwa: Pusat Keselamatan Bank'}
                </strong>
              </div>
            </div>

            <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 text-base text-slate-800 font-medium leading-relaxed italic">
              &ldquo;{isEn
                ? 'Hello! This is Officer Farid from Bank Headquarters. We detected unauthorized withdrawals on your account. I need the 6-digit OTP code that was just sent to your phone right now to cancel the theft!'
                : 'Puan/Tuan! Ini Pegawai Farid dari Ibu Pejabat Bank. Kami mengesan transaksi mencurigakan. Tolong bacakan kod 6-digit OTP yang baru dihantar ke telefon anda sekarang supaya kami boleh sekat!'}
              &rdquo;
            </div>

            <div className="space-y-3">
              <span className="text-base font-black text-slate-900 block">
                {isEn ? 'Will you read out the OTP code to this caller?' : 'Adakah anda akan membacakan kod OTP ini kepada pemanggil?'}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  ref={scamRefuseBtnRef}
                  type="button"
                  onClick={() => handleScamAnswer(false)}
                  className="min-h-[56px] p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shadow-sm focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <XCircle className="w-5 h-5" />
                  <span>{isEn ? 'NO! NEVER SHARE' : 'TIDAK! JANGAN KONGSI'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleScamAnswer(true)}
                  className="min-h-[56px] p-3 rounded-2xl bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <CheckCircle2 className="w-5 h-5 text-rose-600" />
                  <span>{isEn ? 'Yes, Read Out Code' : 'Ya, Bacakan Kod'}</span>
                </button>
              </div>
            </div>

            {scamCallFeedback && (
              <div
                role="status"
                aria-live="polite"
                className={`p-4 rounded-2xl border-2 space-y-1 ${
                  scamCallFeedback === 'safe'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                    : 'bg-rose-50 border-rose-400 text-rose-950'
                }`}
              >
                <strong className="text-base font-black block">
                  {scamCallFeedback === 'safe'
                    ? (isEn ? 'EXCELLENT DECISION! (100% CORRECT)' : 'KEPUTUSAN CEMERLANG! (100% TEPAT)')
                    : (isEn ? 'DANGER! THIS IS A SCAM TRAP!' : 'BAHAYA! INI PERANGKAP SCAMMER!')}
                </strong>
                <p className="text-base font-medium leading-relaxed">
                  {scamCallFeedback === 'safe'
                    ? (isEn
                        ? 'Banks, police, and government officers NEVER ask for OTP codes over the phone. You saved your account!'
                        : 'Pihak bank dan polis TIDAK PERNAH meminta kod OTP melalui panggilan telefon. Anda berjaya menyelamatkan wang anda!')
                    : (isEn
                        ? 'Never share OTP codes! Giving the OTP allows fraudsters to immediately transfer away all your money.'
                        : 'Jangan sesekali kongsi OTP! Memberi kod OTP membolehkan penjenayah memindahkan keluar semua wang anda.')}
                </p>
                <button
                  ref={scamModalCloseRef}
                  type="button"
                  onClick={() => setShowScamCallModal(false)}
                  className="mt-3 w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm cursor-pointer hover:bg-slate-800"
                >
                  {isEn ? 'Close & Return to Vault (Esc)' : 'Tutup & Kembali ke Peti Besi (Esc)'}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      <div className="pt-4 flex justify-end">
        <PrimaryButton
          disabled={isTestingVault}
          onClick={handleRunFinalVaultTest}
          icon={isTestingVault ? <RefreshCw className={`w-5 h-5 ${shouldReduceMotion ? '' : 'animate-spin'}`} /> : <Zap className="w-5 h-5" />}
          className="w-full sm:w-auto"
        >
          {isEn ? 'Test Final Vault Defense →' : 'Uji Pertahanan Akhir Peti Besi →'}
        </PrimaryButton>
      </div>
    </div>
  );

  /* =========================================================================
     MAIN RENDER
     ========================================================================= */
  const currentStepIndex = phase === 'phase1' ? 1 : phase === 'phase2' ? 2 : 3;
  const currentStepLabel =
    phase === 'phase1'
      ? isEn ? 'Phase 1: Crack Race' : 'Fasa 1: Perlumbaan Pecah'
      : phase === 'phase2'
      ? isEn ? 'Phase 2: Domino Breach' : 'Fasa 2: Serangan Berjangkit'
      : isEn ? 'Phase 3: Lock the Vault' : 'Fasa 3: Kunci Peti Besi';

  return (
    <div className="w-full max-w-[1400px] mx-auto py-2">
      <StationTopBar
        stationNumber="02"
        stationName={isEn ? 'Vault Defense' : 'Pertahankan Peti Besi'}
        stepLabel={currentStepLabel}
        stepIndex={currentStepIndex}
        stepTotal={3}
        onReset={handleResetForNextGroup}
      />
      {phase === 'phase1' && renderPhase1()}
      {phase === 'phase2' && renderPhase2()}
      {phase === 'phase3' && renderPhase3()}
    </div>
  );
};
