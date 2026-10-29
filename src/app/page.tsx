'use client';

import React, { useEffect, useState } from 'react';
import { allChallengesMeta } from '@/data/challenges';
import { ChallengeCard } from '@/components/ChallengeCard';
import { getStationRecords, StationRecords, getOverallStats } from '@/lib/storage';
import { ArrowDown, ArrowRight, Shield, Sparkles, CheckCircle2, Lock, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, triggerCelebration } from '@/lib/sound';
import { InteractiveGuardianMascot } from '@/components/home/InteractiveGuardianMascot';
import { QuickSecurityReflex } from '@/components/home/QuickSecurityReflex';

export default function HomePage() {
  const { t, language } = useLanguage();
  const isEn = language === 'en';
  const [records, setRecords] = useState<StationRecords>({});
  const [stats, setStats] = useState({ totalScore: 0, maxPossibleScore: 300, completedCount: 0 });

  const refreshData = () => {
    const data = getStationRecords();
    setRecords(data);
    setStats(getOverallStats(data));
  };

  useEffect(() => {
    refreshData();
    const handleUpdate = () => refreshData();
    window.addEventListener('cybersafe-storage-updated', handleUpdate);
    return () => window.removeEventListener('cybersafe-storage-updated', handleUpdate);
  }, []);

  const progressPercent = Math.round((stats.completedCount / allChallengesMeta.length) * 100);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-12">
      {/* Friendly Community Hero Section */}
      <section className="bg-gradient-to-b from-blue-50/70 via-white to-white border border-blue-100/80 rounded-3xl p-6 sm:p-12 shadow-sm relative overflow-hidden space-y-8">
        <div className="space-y-5 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-blue-100/90 text-blue-900 text-xs sm:text-sm font-bold px-3.5 py-1.5 rounded-full border border-blue-200">
            <Shield className="w-4 h-4 text-blue-600" />
            <span>{t('home.heroBadge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            {t('home.heroTitle1')}{' '}
            <span className="text-blue-600 underline decoration-blue-300 decoration-wavy decoration-2">
              {t('home.heroTitle2')}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-700 font-medium leading-relaxed">
            {t('home.heroQuote')}
          </p>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-1">
            {t('home.heroDesc')}
          </p>
        </div>

        {/* Hero Actions & Interactive Progress Banner */}
        <div className="pt-2 flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-t border-slate-200/80 pt-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <Link
              href="/challenge/phishing"
              onClick={() => playPopSound()}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 min-h-[56px] rounded-2xl font-bold text-base sm:text-lg text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              <span>{t('home.startBtn')}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <a
              href="#cabaran-stesen"
              onClick={() => playPopSound()}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 min-h-[56px] rounded-2xl font-semibold text-sm sm:text-base text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 transition-all shadow-2xs active:scale-95"
            >
              <span>{t('home.browseBtn')}</span>
              <ArrowDown className="w-4 h-4" />
            </a>
          </div>

          {/* Progress Card */}
          <div className="flex-1 lg:max-w-md bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-bold text-slate-700 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
                <span>{t('home.progressLabel')}</span>
              </span>
              <span className="font-extrabold text-blue-700">
                {stats.completedCount} / {allChallengesMeta.length} {t('home.completedText')}
              </span>
            </div>

            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium pt-0.5">
              <span>{progressPercent}% {isEn ? 'Completed' : 'Selesai'}</span>
              <button
                type="button"
                onClick={() => {
                  if (stats.completedCount > 0) triggerCelebration();
                  else playPopSound();
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
              >
                ⭐ {stats.totalScore} / {stats.maxPossibleScore} {t('home.pointsText')}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Mascot Guide */}
      <InteractiveGuardianMascot
        completedCount={stats.completedCount}
        totalMissions={allChallengesMeta.length}
      />

      {/* 10-Second Quick Security Reflex Warm-up */}
      <QuickSecurityReflex />

      {/* 6 Friendly Challenge Station Cards */}
      <section id="cabaran-stesen" className="space-y-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700 block">
              {t('home.missionsHeader')}
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
              {t('home.missionsTitle')}
            </h2>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            {t('home.missionsSummary')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {allChallengesMeta.map((meta, idx) => (
            <motion.div
              key={meta.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: 'spring',
                stiffness: 260,
                damping: 22,
                delay: idx * 0.07
              }}
            >
              <ChallengeCard
                meta={meta}
                numberIndex={`0${idx + 1}`}
                scoreRecord={records[meta.id]}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* How the Workshop Works (Friendly Step Cards) */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
        <div>
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-700 block">
            {t('home.guideHeader')}
          </span>
          <h3 className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {t('home.guideTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 transition-shadow hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
              1
            </div>
            <h4 className="font-extrabold text-lg text-slate-900">{t('home.step1Title')}</h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('home.step1Desc')}
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 transition-shadow hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xl">
              2
            </div>
            <h4 className="font-extrabold text-lg text-slate-900">{t('home.step2Title')}</h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('home.step2Desc')}
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            whileHover={{ y: -4 }}
            className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-3 transition-shadow hover:shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black text-xl">
              3
            </div>
            <h4 className="font-extrabold text-lg text-slate-900">{t('home.step3Title')}</h4>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {t('home.step3Desc')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* 3 Golden Community Rules (Comforting & High Contrast) */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700 pb-4">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
              {t('home.rulesSubtitle')}
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              {t('home.rulesHeader')}
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            Ingat & Kongsi Bersama Keluarga
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-1">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm sm:text-base">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{t('home.ruleATitle')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.ruleADesc')}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold text-sm sm:text-base">
              <Lock className="w-5 h-5 shrink-0" />
              <span>{t('home.ruleBTitle')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.ruleBDesc')}
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm sm:text-base">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{t('home.ruleCTitle')}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('home.ruleCDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
