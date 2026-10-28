'use client';

import React, { useEffect, useState } from 'react';
import { allChallengesMeta } from '@/data/challenges';
import { ChallengeCard } from '@/components/ChallengeCard';
import { getStationRecords, StationRecords, getOverallStats } from '@/lib/storage';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePage() {
  const { t } = useLanguage();
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Top Editorial Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#171914]/15 pb-3 font-mono text-[11px] text-[#7C7E77] uppercase tracking-wider">
        <span>{t('home.topTag')}</span>
        <span>MALAYSIA • EDISI KOMUNITI</span>
      </div>

      {/* Distinctive Editorial Hero Section */}
      <section className="space-y-8">
        <div className="space-y-4 max-w-4xl">
          <div className="inline-block bg-[#171914] text-[#D9FA62] font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">
            {t('home.heroBadge')}
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#171914] tracking-tight leading-[1.05]">
            {t('home.heroTitle1')} <br className="hidden sm:inline" />
            {t('home.heroTitle2')}
          </h1>

          <p className="text-xl sm:text-2xl font-serif italic text-[#575953] tracking-normal">
            {t('home.heroQuote')}
          </p>

          <p className="text-sm sm:text-base text-[#575953] leading-relaxed max-w-2xl pt-2">
            {t('home.heroDesc')}
          </p>
        </div>

        {/* Hero Actions & Station Summary Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-[#171914]/15 pt-6">
          <Link
            href="/challenge/phishing"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs"
          >
            <span>{t('home.startBtn')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#cabaran-stesen"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-wider text-[#575953] hover:text-[#171914] transition-colors py-2 min-h-[44px]"
          >
            <span>{t('home.browseBtn')}</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <div className="sm:ml-auto flex items-center gap-3 font-mono text-xs bg-white border border-[#171914]/15 px-3.5 py-2 rounded-sm shadow-xs">
            <span className="text-[#7C7E77] uppercase text-[10px]">{t('home.progressLabel')}</span>
            <span className="font-bold text-[#171914]">
              {stats.completedCount} / {allChallengesMeta.length} {t('home.completedText')}
            </span>
            <span className="text-[#D8D5CA]">|</span>
            <span className="font-bold text-[#171914]">
              {stats.totalScore} / {stats.maxPossibleScore} {t('home.pointsText')}
            </span>
          </div>
        </div>
      </section>

      {/* Numbered Editorial Challenge Cards */}
      <section id="cabaran-stesen" className="space-y-6 pt-6 border-t-2 border-[#171914]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#7C7E77] block">
              {t('home.missionsHeader')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
              {t('home.missionsTitle')}
            </h2>
          </div>
          <span className="font-mono text-xs text-[#7C7E77] font-bold">
            {t('home.missionsSummary')}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allChallengesMeta.map((meta, idx) => (
            <ChallengeCard
              key={meta.id}
              meta={meta}
              numberIndex={`0${idx + 1}`}
              scoreRecord={records[meta.id]}
            />
          ))}
        </div>
      </section>

      {/* Station Operating Instructions (Swiss Editorial Grid) */}
      <section className="border-t border-[#171914]/15 pt-10 space-y-6">
        <div>
          <span className="font-mono text-xs uppercase tracking-wider text-[#7C7E77] block">
            {t('home.guideHeader')}
          </span>
          <h3 className="text-xl font-bold text-[#171914] tracking-tight">
            {t('home.guideTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-y border-[#171914]/15">
          <div className="py-6 md:py-0 md:pr-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">{t('home.step1Num')}</span>
            <h4 className="font-bold text-sm text-[#171914]">{t('home.step1Title')}</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              {t('home.step1Desc')}
            </p>
          </div>

          <div className="py-6 md:py-0 md:px-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">{t('home.step2Num')}</span>
            <h4 className="font-bold text-sm text-[#171914]">{t('home.step2Title')}</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              {t('home.step2Desc')}
            </p>
          </div>

          <div className="py-6 md:py-0 md:pl-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">{t('home.step3Num')}</span>
            <h4 className="font-bold text-sm text-[#171914]">{t('home.step3Title')}</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              {t('home.step3Desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Rules (Crisp Editorial Callout Block) */}
      <section className="bg-[#171914] text-[#F5F4EE] rounded-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs border-b border-[#F5F4EE]/20 pb-3">
          <span className="text-[#D9FA62] font-bold uppercase tracking-wider">
            {t('home.rulesHeader')}
          </span>
          <span className="text-[#7C7E77]">{t('home.rulesSubtitle')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">{t('home.ruleATitle')}</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              {t('home.ruleADesc')}
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">{t('home.ruleBTitle')}</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              {t('home.ruleBDesc')}
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">{t('home.ruleCTitle')}</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              {t('home.ruleCDesc')}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
