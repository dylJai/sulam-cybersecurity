'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, MessageSquare } from 'lucide-react';
import { playPopSound, triggerCelebration } from '@/lib/sound';
import { useLanguage } from '@/context/LanguageContext';

interface MascotProps {
  completedCount: number;
  totalMissions: number;
}

export const InteractiveGuardianMascot: React.FC<MascotProps> = ({
  completedCount,
  totalMissions
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const [speechIdx, setSpeechIdx] = useState(0);
  const [hearts, setHearts] = useState<{ id: number; x: number }[]>([]);

  const speechesBm = [
    completedCount === 0
      ? 'Hai! Saya Kapten CyberSafe. Klik mana-mana misi di bawah untuk mula belajar mempertahankan diri daripada penipu!'
      : completedCount < totalMissions
      ? `Hebat! Anda dah selesaikan ${completedCount} daripada ${totalMissions} misi! Teruskan usaha melindungi keluarga.`
      : 'Tahniah Wira Komuniti! Anda telah kuasai kesemua 6 benteng keselamatan siber!',
    'Petua Pantas: Jangan sesekali dedahkan kod TAC 6-digit kepada sesiapa pun, termasuk yang mengaku pegawai bank!',
    'Ingat formula 3S: Selidik sebelum klik, Sahkan nombor akaun di SemakMule, dan Segera hubungi 997 jika terpedaya!',
    'Tahukah anda? Bank rasmi tidak pernah menghantar pautan log masuk melalui SMS biasa.'
  ];

  const speechesEn = [
    completedCount === 0
      ? 'Hi! I am Captain CyberSafe. Tap any mission below to start learning how to outsmart online scammers!'
      : completedCount < totalMissions
      ? `Awesome job! You have cleared ${completedCount} of ${totalMissions} missions! Keep protecting your family.`
      : 'Congratulations Community Hero! You have mastered all 6 cybersecurity defense shields!',
    'Quick Pro-Tip: Never disclose your 6-digit banking TAC/OTP to anyone, even callers claiming to be bank officers!',
    'Remember the 3S Rule: Screen links carefully, Scrutinize accounts on SemakMule, and Swiftly call 997 if trapped!',
    'Did you know? Genuine banks never send direct login links via generic promotional SMS.'
  ];

  const speechList = isEn ? speechesEn : speechesBm;
  const currentSpeech = speechList[speechIdx % speechList.length];

  const handleMascotTap = () => {
    playPopSound();
    setSpeechIdx(prev => prev + 1);

    // Spawn floating heart
    const newHeart = { id: Date.now(), x: (Math.random() - 0.5) * 40 };
    setHearts(prev => [...prev.slice(-3), newHeart]);

    if (completedCount === totalMissions) {
      triggerCelebration();
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white rounded-3xl p-5 sm:p-6 shadow-md relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />

      {/* Mascot Avatar Button */}
      <div className="relative shrink-0">
        <motion.button
          type="button"
          onClick={handleMascotTap}
          whileHover={{ scale: 1.08, rotate: [0, -3, 3, 0] }}
          whileTap={{ scale: 0.92 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-white text-blue-700 p-2 shadow-lg flex items-center justify-center cursor-pointer border-2 border-white/60 relative focus:outline-none"
          title={isEn ? 'Tap me for friendly tips!' : 'Tekan saya untuk tips keselamatan!'}
          aria-label="Interactive Mascot"
        >
          {/* Animated Mascot Graphic */}
          <div className="flex flex-col items-center justify-center select-none">
            <span className="text-3xl sm:text-4xl filter drop-shadow-sm">🤖</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-blue-700 mt-0.5">
              KAPTEN
            </span>
          </div>

          {/* Sparkle badge */}
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-bold shadow-xs">
            ✨
          </span>
        </motion.button>

        {/* Floating Heart / Reaction */}
        <AnimatePresence>
          {hearts.map(h => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -45, scale: 1.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ left: `calc(50% + ${h.x}px)` }}
              className="absolute -top-3 pointer-events-none text-rose-300 font-bold text-sm"
            >
              💙
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Speech Bubble */}
      <div className="flex-1 text-center sm:text-left space-y-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-blue-200">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{isEn ? 'Kapten CyberSafe Community Guide' : 'Panduan Kapten CyberSafe'}</span>
          <span className="text-blue-300">• {isEn ? 'Tap to switch tip' : 'Tekan untuk petua lain'}</span>
        </div>

        <motion.p
          key={speechIdx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-sm sm:text-base font-semibold text-white leading-relaxed"
        >
          &ldquo;{currentSpeech}&rdquo;
        </motion.p>
      </div>
    </div>
  );
};
