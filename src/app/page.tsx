'use client';

import React, { useEffect, useState } from 'react';
import { allChallengesMeta } from '@/data/challenges';
import { ChallengeCard } from '@/components/ChallengeCard';
import { getStationRecords, StationRecords, getOverallStats } from '@/lib/storage';
import { ArrowDown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-16">
      {/* Top Editorial Metadata Line */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#171914]/15 pb-3 font-mono text-[11px] text-[#7C7E77] uppercase tracking-wider">
        <span>BENGKEL KESELAMATAN SIBER KOMUNITI</span>
        <span>EDISI STESEN KOMPUTER RIBA • MALAYSIA</span>
      </div>

      {/* Distinctive Editorial Hero Section */}
      <section className="space-y-8">
        <div className="space-y-4 max-w-4xl">
          <div className="inline-block bg-[#171914] text-[#D9FA62] font-mono text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-xs">
            CyberSafe Community • Komuniti Siber Selamat
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#171914] tracking-tight leading-[1.05]">
            Kenali Ancaman. <br className="hidden sm:inline" />
            Lindungi Keluarga.
          </h1>

          <p className="text-xl sm:text-2xl font-serif italic text-[#575953] tracking-normal">
            &ldquo;Kesan ancaman dalam talian. Kekal selamat. Lindungi diri anda.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-[#575953] leading-relaxed max-w-2xl pt-2">
            Modul latihan praktikal stesen komputer riba untuk bengkel komuniti. Bekerjasama dalam kumpulan untuk mengesan SMS tipu, membongkar emel phishing, dan membina kata laluan yang tidak boleh dipecahkan oleh penggodam.
          </p>
        </div>

        {/* Hero Actions & Station Summary Bar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 border-t border-[#171914]/15 pt-6">
          <Link
            href="/challenge/phishing"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 min-h-[52px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs"
          >
            <span>Mula Cabaran 01: Pengesanan Phishing</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href="#cabaran-stesen"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm uppercase tracking-wider text-[#575953] hover:text-[#171914] transition-colors py-2 min-h-[44px]"
          >
            <span>Pilih Modul di Bawah</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <div className="sm:ml-auto flex items-center gap-3 font-mono text-xs bg-white border border-[#171914]/15 px-3 py-2 rounded-sm">
            <span className="text-[#7C7E77] uppercase text-[10px]">Kemajuan Stesen:</span>
            <span className="font-bold text-[#171914]">
              {stats.completedCount} / 2 Selesai
            </span>
            <span className="text-[#D8D5CA]">|</span>
            <span className="font-bold text-[#171914]">
              {stats.totalScore} / 100 Mata
            </span>
          </div>
        </div>
      </section>

      {/* Two Challenges as Numbered Editorial Entries */}
      <section id="cabaran-stesen" className="space-y-6 pt-6 border-t-2 border-[#171914]">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <span className="font-mono text-xs uppercase tracking-wider text-[#7C7E77] block">
              BAHAGIAN 01 / MISI AMALI INTERAKTIF
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171914] tracking-tight">
              Misi Keselamatan Siber Stesen
            </h2>
          </div>
          <span className="font-mono text-xs text-[#7C7E77]">
            2 PERMAINAN INTERAKTIF • 100 MATA MAKSIMUM
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            BAHAGIAN 02 / PANDUAN PENYIASATAN
          </span>
          <h3 className="text-xl font-bold text-[#171914] tracking-tight">
            Bagaimana Misi Interaktif Ini Berfungsi?
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-y border-[#171914]/15">
          <div className="py-6 md:py-0 md:pr-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">01.</span>
            <h4 className="font-bold text-sm text-[#171914]">Siasat Petunjuk Tersembunyi</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              Klik pada bahagian mesej yang meragukan—seperti pautan aneh, fail .apk, atau desakan masa 15 minit.
            </p>
          </div>

          <div className="py-6 md:py-0 md:px-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">02.</span>
            <h4 className="font-bold text-sm text-[#171914]">Buat Keputusan Bertindak</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              Pilih tindakan selamat untuk menyelamatkan baki wang anda dan saksikan akibat serta-merta bagi setiap langkah.
            </p>
          </div>

          <div className="py-6 md:py-0 md:pl-6 space-y-2">
            <span className="font-mono text-2xl font-bold text-[#171914]">03.</span>
            <h4 className="font-bold text-sm text-[#171914]">Kukuhkan Perisai Akaun</h4>
            <p className="text-xs text-[#575953] leading-relaxed">
              Bina frasa laluan unik, sekat pencerobohan berjangkit, dan aktifkan 2FA untuk mencapai skor perlindungan 100%.
            </p>
          </div>
        </div>
      </section>

      {/* 3 Core Rules (Crisp Editorial Callout Block) */}
      <section className="bg-[#171914] text-[#F5F4EE] rounded-sm p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between font-mono text-xs border-b border-[#F5F4EE]/20 pb-3">
          <span className="text-[#D9FA62] font-bold uppercase tracking-wider">
            PRINSIP PERTAHANAN UTAMA
          </span>
          <span className="text-[#7C7E77]">INGATAN PANTAS KOMUNITI</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">A. JANGAN PANIK</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              Scammer sengaja mencipta perasaan cemas (contoh: 2 jam sebelum bekalan dipotong). Bertenang dan semak kesahihan.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">B. JANGAN KLIK PAUTAN RAWAK</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              Bank dan agensi rasmi tidak lagi menghantar pautan melalui SMS. Sentiasa buka aplikasi rasmi secara terus.
            </p>
          </div>
          <div>
            <span className="font-mono text-xs text-[#D9FA62] block">C. KATA LALUAN PANJANG & KOD TAC</span>
            <p className="text-xs text-[#ECEAE2] mt-1 leading-relaxed">
              Gunakan frasa laluan 4–5 perkataan dan jangan sekali-kali menyerahkan kod 6-digit TAC kepada sesiapa pun.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
