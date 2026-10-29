'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight, RotateCcw } from 'lucide-react';
import { playPopSound, playSuccessChime, playWarningTone } from '@/lib/sound';
import { useLanguage } from '@/context/LanguageContext';

interface ReflexScenario {
  id: string;
  category: string;
  scenarioTextBm: string;
  scenarioTextEn: string;
  optionABm: string;
  optionAEn: string;
  isACorrect: boolean;
  optionBBm: string;
  optionBEn: string;
  isBCorrect: boolean;
  explanationBm: string;
  explanationEn: string;
}

const REFLEX_SCENARIOS: ReflexScenario[] = [
  {
    id: 's1',
    category: 'WhatsApp',
    scenarioTextBm: 'Rakan WhatsApp hantar mesej: "Tolong saya pinjam RM300 sekarang untuk bayar ubat kecemasan di hospital, nanti petang saya ganti."',
    scenarioTextEn: 'A WhatsApp friend messages: "Please lend me RM300 right now for urgent hospital medication, I will transfer back this evening."',
    optionABm: 'Pindahkan terus ke nombor akaun yang diberikan',
    optionAEn: 'Transfer immediately to the bank account provided',
    isACorrect: false,
    optionBBm: 'Hubungi rakan melalui panggilan suara atau video dahulu untuk sahkan',
    optionBEn: 'Call the friend via normal phone/video call first to verify identity',
    isBCorrect: true,
    explanationBm: 'Tepat Sekali! Akaun WhatsApp kawan anda mungkin telah digodam atau disalin. Sentiasa buat panggilan suara bebas untuk sahkan identiti!',
    explanationEn: 'Spot on! Your friend\'s WhatsApp account may be hijacked. Always make a voice call to verify before sending any money!'
  },
  {
    id: 's2',
    category: 'SMS Bank',
    scenarioTextBm: 'SMS dari nama pengirim "BANK": Akaun anda disekat kerana aktiviti mencurigakan. Klik pautan http://bank-secure-login.xyz untuk batalkan.',
    scenarioTextEn: 'SMS from "BANK": Your account is locked due to suspicious activity. Tap http://bank-secure-login.xyz to unlock.',
    optionABm: 'Jangan klik pautan & padam SMS segera',
    optionAEn: 'Never tap the link & delete the SMS immediately',
    isACorrect: true,
    optionBBm: 'Klik pautan untuk semak apa yang berlaku',
    optionBEn: 'Tap the link to see what is happening',
    isBCorrect: false,
    explanationBm: 'Tindakan Tepat! Bank rasmi di Malaysia TIDAK PERNAH menghantar pautan terus untuk menyelesaikan isu akaun melalui SMS.',
    explanationEn: 'Correct Move! Commercial banks in Malaysia NEVER include direct clickable links to resolve security issues via SMS.'
  },
  {
    id: 's3',
    category: 'Panggilan Telefon',
    scenarioTextBm: 'Pemanggil mengaku Inspektor Polis: "Akaun anda terlibat jenayah dadah. Pindahkan semua baki ke akaun selamat kami untuk audit mahkamah."',
    scenarioTextEn: 'Caller claiming to be a Police Inspector: "Your account is linked to drug trafficking. Transfer all savings to our audit account."',
    optionABm: 'Pindahkan wang demi keselamatan diri',
    optionAEn: 'Transfer funds to prove innocence',
    isACorrect: false,
    optionBBm: 'Letak panggilan telefon serta-merta!',
    optionBEn: 'Hang up the phone immediately!',
    isBCorrect: true,
    explanationBm: 'Bijak! Polis dan mahkamah TIDAK PERNAH meminta orang awam memindahkan wang ke akaun individu untuk tujuan audit atau siasatan.',
    explanationEn: 'Smart move! Police and courts NEVER ask citizens to transfer money into private accounts for investigation or audit.'
  },
  {
    id: 's4',
    category: 'Tawaran APK',
    scenarioTextBm: 'Iklan cuci sofa RM20 di Facebook minta pasang fail "TempahanSofa.apk" untuk pilih tarikh temu janji.',
    scenarioTextEn: 'Facebook ad offering RM20 sofa cleaning asks you to install "TempahanSofa.apk" to book an appointment date.',
    optionABm: 'Tolak fail APK & jangan sesekali pasang',
    optionAEn: 'Reject the APK & never install from chats',
    isACorrect: true,
    optionBBm: 'Pasang APK untuk dapatkan harga promosi',
    optionBEn: 'Install the APK to claim the promo price',
    isBCorrect: false,
    explanationBm: 'Cemerlang! Fail (.apk) luar mengandungi perisian hasad yang boleh membaca SMS TAC bank dan mencuri duit simpanan anda.',
    explanationEn: 'Excellent! Unofficial (.apk) packages harbor trojans engineered to intercept banking TAC SMS messages and siphon savings.'
  }
];

export const QuickSecurityReflex: React.FC = () => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | null>(null);

  const scenario = REFLEX_SCENARIOS[currentIdx];
  const isAnswered = selectedOption !== null;
  const isCorrect = (selectedOption === 'A' && scenario.isACorrect) || (selectedOption === 'B' && scenario.isBCorrect);

  const handleSelect = (opt: 'A' | 'B') => {
    if (isAnswered) return;
    playPopSound();
    setSelectedOption(opt);

    const correct = (opt === 'A' && scenario.isACorrect) || (opt === 'B' && scenario.isBCorrect);
    if (correct) {
      playSuccessChime();
    } else {
      playWarningTone();
    }
  };

  const handleNext = () => {
    playPopSound();
    setSelectedOption(null);
    setCurrentIdx(prev => (prev + 1) % REFLEX_SCENARIOS.length);
  };

  return (
    <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
      {/* Decorative Warm Banner Tag */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 px-3.5 py-1.5 rounded-full text-xs font-bold border border-amber-300">
          <Zap className="w-4 h-4 text-amber-600 animate-bounce" />
          <span>{isEn ? '10-Second Reflex Check' : 'Uji Refleks Pantas 10-Saat'}</span>
        </div>
        <span className="text-xs font-bold text-slate-500">
          {isEn ? `Scenario ${currentIdx + 1} of ${REFLEX_SCENARIOS.length}` : `Situasi ${currentIdx + 1} daripada ${REFLEX_SCENARIOS.length}`}
        </span>
      </div>

      {/* Scenario Question */}
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
          [{scenario.category}]
        </span>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {isEn ? scenario.scenarioTextEn : scenario.scenarioTextBm}
        </h3>
      </div>

      {/* Interactive Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {/* Option A */}
        <motion.button
          type="button"
          onClick={() => handleSelect('A')}
          whileHover={{ scale: isAnswered ? 1 : 1.015 }}
          whileTap={{ scale: 0.98 }}
          disabled={isAnswered}
          className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all cursor-pointer flex items-start gap-3 min-h-[58px] ${
            selectedOption === 'A'
              ? scenario.isACorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                : 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
              : isAnswered && scenario.isACorrect
              ? 'bg-emerald-50/60 border-emerald-400 text-emerald-900'
              : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
            A
          </span>
          <span className="leading-snug">{isEn ? scenario.optionAEn : scenario.optionABm}</span>
        </motion.button>

        {/* Option B */}
        <motion.button
          type="button"
          onClick={() => handleSelect('B')}
          whileHover={{ scale: isAnswered ? 1 : 1.015 }}
          whileTap={{ scale: 0.98 }}
          disabled={isAnswered}
          className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all cursor-pointer flex items-start gap-3 min-h-[58px] ${
            selectedOption === 'B'
              ? scenario.isBCorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 shadow-xs'
                : 'bg-rose-50 border-rose-500 text-rose-950 shadow-xs'
              : isAnswered && scenario.isBCorrect
              ? 'bg-emerald-50/60 border-emerald-400 text-emerald-900'
              : 'bg-slate-50 border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-slate-800'
          }`}
        >
          <span className="w-6 h-6 rounded-lg bg-white border border-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 text-slate-700">
            B
          </span>
          <span className="leading-snug">{isEn ? scenario.optionBEn : scenario.optionBBm}</span>
        </motion.button>
      </div>

      {/* Result Explanation Card */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-rose-50 border-rose-300 text-rose-950'
            }`}
          >
            <div className="flex items-start gap-3">
              {isCorrect ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-0.5 text-xs sm:text-sm">
                <span className="font-extrabold block">
                  {isCorrect
                    ? (isEn ? 'Spot on! Correct Defense' : 'Tepat Sekali! Pertahanan Bijak')
                    : (isEn ? 'Caution! Scammer Trap' : 'Awas! Perangkap Penipuan')}
                </span>
                <p className="leading-relaxed">
                  {isEn ? scenario.explanationEn : scenario.explanationBm}
                </p>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={handleNext}
              whileTap={{ scale: 0.95 }}
              className="shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer self-end sm:self-auto"
            >
              <span>{isEn ? 'Next Situation' : 'Situasi Seterusnya'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
