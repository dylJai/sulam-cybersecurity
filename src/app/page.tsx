'use client';

import React, { useEffect, useState } from 'react';
import { allChallengesMeta } from '@/data/challenges';
import { ChallengeCard } from '@/components/ChallengeCard';
import { getStationRecords, StationRecords, getOverallStats } from '@/lib/storage';
import { ShieldCheck, Sparkles, Users, Award, HelpCircle, CheckCircle, Smartphone, KeyRound, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [records, setRecords] = useState<StationRecords>({});
  const [stats, setStats] = useState({ totalScore: 0, maxPossibleScore: 100, completedCount: 0 });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border-2 border-slate-700/80 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950 p-6 sm:p-12 text-center shadow-2xl">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs sm:text-sm font-semibold shadow-inner">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Bengkel Keselamatan Siber Komuniti</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            CyberSafe <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400 bg-clip-text text-transparent">Community</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl font-medium text-slate-200">
            &ldquo;Learn to spot online threats. Stay safe. Protect yourself.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Selamat datang ke stesen interaktif bengkel siber! Bekerjasama bersama ahli kumpulan anda di komputer riba ini, uji kepekaan mengesan penipuan SMS & emel, serta pelajari cara membina kata laluan yang tidak boleh dipecahkan.
          </p>

          {/* Team Progress Overview Bar */}
          <div className="pt-2">
            <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-3.5 sm:p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Format: <strong>Kerjasama Kumpulan</strong></span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-slate-800" />
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Mata Keseluruhan: <strong className="text-amber-300">{stats.totalScore} / 100 Mata</strong></span>
              </div>
              <div className="hidden sm:block w-px h-5 bg-slate-800" />
              <div className="flex items-center gap-2 text-slate-300">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>Status: <strong className="text-emerald-400">{stats.completedCount} / 2 Cabaran Selesai</strong></span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Two Large Challenge Cards */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Pilih Cabaran Stesen Anda
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Setiap cabaran mengandungi 5 soalan interaktif. Selesaikan kedua-dua cabaran untuk mengumpul 100 mata!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {allChallengesMeta.map((meta) => (
            <ChallengeCard
              key={meta.id}
              meta={meta}
              scoreRecord={records[meta.id]}
            />
          ))}
        </div>
      </section>

      {/* How the Challenges Work */}
      <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6">
        <div className="text-center sm:text-left">
          <h3 className="text-xl font-bold text-white flex items-center justify-center sm:justify-start gap-2">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Bagaimana Cabaran Ini Berfungsi?</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Panduan mudah untuk peserta bengkel pelbagai peringkat umur di komputer riba stesen:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold text-base border border-cyan-800/50">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-100">Bincang Dalam Kumpulan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Baca mesej, pautan, dan situasi bersama rakan sepasukan di skrin komputer riba sebelum membuat pilihan.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-800/50">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-100">Siasat Petunjuk Bahaya</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Klik pada bahagian mencurigakan seperti domain pengirim palsu, ugutan masa singkat, atau permintaan TAC/PIN.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-800/50">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-100">Dapatkan Maklum Balas Segera</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ketahui penerangan tepat serta-merta selepas menjawab dan kumpul sehingga 100 mata untuk stesen anda!
            </p>
          </div>
        </div>
      </section>

      {/* Cyber Safety Community Pledge Banner */}
      <section className="rounded-2xl border border-cyan-900/60 bg-gradient-to-r from-cyan-950/40 to-blue-950/40 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-cyan-200">
              3 Prinsip Emas Keselamatan Siber Komuniti:
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              <strong>1. Bertenang & Jangan Panik</strong> • <strong>2. Jangan Klik Pautan Pelik</strong> • <strong>3. Jangan Sekali-kali Kongsi Kod TAC / OTP</strong>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
