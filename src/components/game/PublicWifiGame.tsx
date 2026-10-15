'use client';

import React, { useState } from 'react';
import { wifiNetworksList, WifiNetworkItem } from '@/data/public-wifi-data';
import { BadgesDrawer, BadgeItem } from '@/components/game/BadgesDrawer';
import { saveChallengeResult } from '@/lib/storage';
import {
  Wifi,
  WifiOff,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Unlock,
  Check,
  Home,
  Award,
  Radio,
  Eye,
  KeyRound
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export const PublicWifiGame: React.FC = () => {
  const [stage, setStage] = useState<'briefing' | 'investigating' | 'results'>('briefing');
  const [activeNetworkId, setActiveNetworkId] = useState<string>('wifi-open-cafe');
  const [inspectedNetworkIds, setInspectedNetworkIds] = useState<string[]>(['wifi-open-cafe']);
  const [isVpnActive, setIsVpnActive] = useState<boolean>(false);
  const [selectedSafeNetworkId, setSelectedSafeNetworkId] = useState<string | null>(null);
  const [isDecisionSubmitted, setIsDecisionSubmitted] = useState<boolean>(false);
  const [totalScore, setTotalScore] = useState<number>(0);
  const [showBadges, setShowBadges] = useState<boolean>(false);
  const [vpnToggled, setVpnToggled] = useState<boolean>(false);

  const activeNetwork: WifiNetworkItem =
    wifiNetworksList.find(w => w.id === activeNetworkId) || wifiNetworksList[0];

  // Badges
  const badges: BadgeItem[] = [
    {
      id: 'b-radar-master',
      name: 'Pengimbas Gelombang',
      icon: '📡',
      description: 'Meneliti semua 4 rangkaian Wi-Fi di kawasan awam',
      isUnlocked: inspectedNetworkIds.length === wifiNetworksList.length
    },
    {
      id: 'b-vpn-shield',
      name: 'Kubu VPN',
      icon: '🛡️',
      description: 'Mengaktifkan penyulitan VPN untuk melindungi teks kata laluan',
      isUnlocked: vpnToggled
    },
    {
      id: 'b-wifi-hero',
      name: 'Pakar Hotspot Selamat',
      icon: '🔒',
      description: 'Menyelesaikan audit keselamatan rangkaian awam',
      isUnlocked: stage === 'results'
    }
  ];

  const handleStart = () => {
    setStage('investigating');
    setActiveNetworkId('wifi-open-cafe');
    setInspectedNetworkIds(['wifi-open-cafe']);
    setIsVpnActive(false);
    setSelectedSafeNetworkId(null);
    setIsDecisionSubmitted(false);
    setTotalScore(0);
    setVpnToggled(false);
  };

  const handleSelectNetwork = (id: string) => {
    setActiveNetworkId(id);
    if (!inspectedNetworkIds.includes(id)) {
      setInspectedNetworkIds(prev => [...prev, id]);
    }
  };

  const handleToggleVpn = () => {
    setIsVpnActive(prev => !prev);
    setVpnToggled(true);
  };

  const handleSubmitDecision = () => {
    if (!selectedSafeNetworkId || isDecisionSubmitted) return;
    setIsDecisionSubmitted(true);

    const chosen = wifiNetworksList.find(w => w.id === selectedSafeNetworkId);
    let scoreEarned = 15; // exploration points

    if (inspectedNetworkIds.length === wifiNetworksList.length) {
      scoreEarned += 10;
    }
    if (vpnToggled) {
      scoreEarned += 10;
    }
    if (chosen?.isSafe) {
      scoreEarned += 15;
    }

    const finalScore = Math.min(50, scoreEarned);
    setTotalScore(finalScore);
    saveChallengeResult('public-wifi', finalScore, 50);
  };

  /* =========================================================================
     STAGE 1: BRIEFING
     ========================================================================= */
  if (stage === 'briefing') {
    return (
      <div className="w-full space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs sm:text-sm text-[#7C7E77] hover:text-[#171914] transition-colors"
          >
            ← [KEMBALI KE MENU UTAMA]
          </Link>
        </div>

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  MISI 05
                </span>
                <span className="text-[#7C7E77] uppercase font-bold">
                  MASA: 5-7 MINIT • MAKSIMUM: 50 MATA
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#171914] tracking-tight">
                Perangkap Wi-Fi Awam & Hotspot Palsu
              </h1>

              <p className="text-base sm:text-lg text-[#575953] leading-relaxed">
                &ldquo;Apabila berada di kedai kopi, pusat membeli-belah, atau lapangan terbang, kita sering menyambung ke Wi-Fi percuma tanpa kata laluan. Namun, penjenayah siber boleh memasang hotspot palsu (*Evil Twin*) atau menggunakan alat intipan (*Packet Sniffer*) untuk merakam semua kata laluan dan aktiviti perbankan anda secara senyap.&rdquo;
              </p>

              <div className="p-4 bg-[#F5F4EE] border border-[#171914]/15 rounded-sm space-y-2 text-xs sm:text-sm">
                <span className="font-mono font-bold uppercase text-[#171914] block">
                  3 Peraturan Wi-Fi Selamat di Ruang Awam:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[#575953]">
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>1. Elak Wi-Fi Terbuka</strong>
                    <p className="text-xs mt-0.5">Jangan buat transaksi bank atau log masuk sensitif pada Wi-Fi tanpa kunci.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>2. Aktifkan Enkripsi VPN</strong>
                    <p className="text-xs mt-0.5">VPN menyulitkan data anda menjadi kod rawak yang mustahil dibaca pengintip.</p>
                  </div>
                  <div className="p-2.5 bg-white border border-[#171914]/10 rounded-xs">
                    <strong>3. Utamakan Hotspot 5G</strong>
                    <p className="text-xs mt-0.5">Gunakan data mudah alih telefon anda sendiri untuk keselamatan maksimum.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Alat Interaktif Stesen:
              </span>

              <div className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Radio className="w-4 h-4 text-[#8A241C]" />
                    <span>Radar Pengimbas Gelombang Wi-Fi</span>
                  </div>
                  <p>Kaji 4 rangkaian berbeza di kedai kopi dan kesan hotspot perangkap (*Evil Twin*).</p>
                </div>

                <div className="p-3 bg-white border border-[#171914]/15 rounded-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold text-[#171914]">
                    <Lock className="w-4 h-4 text-[#1E4D2B]" />
                    <span>Simulator Intipan & Suis Perisai VPN</span>
                  </div>
                  <p>Saksikan bagaimana teks kata laluan berubah menjadi kod kebal apabila VPN diaktifkan.</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-4 px-6 min-h-[54px] rounded-sm font-mono font-bold text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Mulakan Ujian Keselamatan Wi-Fi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 3: RESULTS
     ========================================================================= */
  if (stage === 'results') {
    return (
      <div className="w-full space-y-6">
        <BadgesDrawer badges={badges} />

        <div className="rounded-sm border-2 border-[#171914] bg-white p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] px-2.5 py-1 rounded-xs border border-[#171914]/20">
                  LAPORAN MISI 05 SELESAI
                </span>
                <span className="text-[#7C7E77]">KESELAMATAN WI-FI AWAM</span>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#171914] tracking-tight">
                  Perisai Rangkaian Sedia Beroperasi!
                </h2>
                <p className="text-sm sm:text-base text-[#575953] mt-2 leading-relaxed">
                  Pasukan anda kini mahir membezakan rangkaian rasmi berbanding hotspot perangkap (*Evil Twin*), serta menguasai penggunaan VPN untuk melindungi data peribadi.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 border-y border-[#171914]/15 py-4">
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Rangkaian Diaudit</span>
                  <span className="font-mono text-2xl font-black text-[#171914] mt-1 block">4 / 4 Rangkaian</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Ujian Suis VPN</span>
                  <span className="font-mono text-2xl font-black text-[#1E4D2B] mt-1 block">Diuji ✓</span>
                </div>
                <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#7C7E77] block font-bold">Pilihan Sambungan</span>
                  <span className="font-mono text-2xl font-black text-[#1E4D2B] mt-1 block">Selamat ✓</span>
                </div>
                <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/20 rounded-xs">
                  <span className="font-mono text-[10px] uppercase text-[#123E23] block font-bold">Jumlah Mata</span>
                  <span className="font-mono text-2xl font-black text-[#123E23] mt-1 block">
                    {totalScore} <span className="text-xs font-normal text-[#123E23]/70">/ 50</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm p-6 space-y-6">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#171914] block pb-2 border-b border-[#171914]/15">
                Prinsip Komuniti Luar Rumah:
              </span>

              <ul className="space-y-3 text-xs sm:text-sm text-[#575953]">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Matikan Sambungan Automatik:</strong> Matikan fungsi <em>"Auto-Connect to Open Networks"</em> pada telefon dan komputer riba anda.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Gunakan Hotspot 5G Sendiri:</strong> Apabila perlu membuat pindahan wang perbankan, gunakan data mudah alih anda sendiri.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-xs bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span><strong>Pastikan HTTPS:</strong> Jangan masukkan sebarang maklumat peribadi pada laman web yang memaparkan amaran "Not Secure" atau "Sijil Tidak Sah".</span>
                </li>
              </ul>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleStart}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Ulang Siasatan</span>
                </button>

                <Link
                  href="/"
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-white hover:bg-[#ECEAE2] border-2 border-[#171914]/20 transition-colors cursor-pointer"
                >
                  <Home className="w-4 h-4" />
                  <span>Menu Utama</span>
                </Link>

                <Link
                  href="/challenge/investment-scam"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 min-h-[48px] rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors shadow-xs text-center"
                >
                  <span>Misi 06: Skim Pelaburan</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================================
     STAGE 2: INVESTIGATION (SPLIT SCREEN)
     ========================================================================= */
  const allAudited = inspectedNetworkIds.length === wifiNetworksList.length;

  return (
    <div className="w-full space-y-4">
      {/* Top Bar */}
      <div className="bg-white border-2 border-[#171914] rounded-sm p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#171914]/15 font-mono text-xs">
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/" className="text-[#7C7E77] hover:text-[#171914] font-bold transition-colors">
              ← [MENU UTAMA]
            </Link>
            <span className="text-[#171914]/20">|</span>
            <span className="font-bold text-[#171914] bg-[#D9FA62] px-2.5 py-0.5 rounded-xs border border-[#171914]/20">
              MISI 05 / WI-FI AWAM
            </span>
            <span className="font-bold text-[#171914] text-xs sm:text-sm">
              Audit Rangkaian Kafe Komuniti & Ujian Enkripsi
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleStart}
              title="Mulakan Semula Bengkel Dari Awal"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#FAF0E6] border border-[#8A241C]/30 text-[#8A241C] hover:text-[#8A241C] rounded-xs cursor-pointer font-mono font-bold text-xs transition-colors min-h-[36px] shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Set Semula</span>
            </button>

            <button
              type="button"
              onClick={() => setShowBadges(!showBadges)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F4EE] hover:bg-[#ECEAE2] border border-[#171914]/20 rounded-xs cursor-pointer font-mono font-bold text-xs text-[#171914] min-h-[36px]"
            >
              <Award className="w-3.5 h-3.5 text-[#171914]" />
              <span className="hidden sm:inline">Lencana</span> ({badges.filter(b => b.isUnlocked).length}/{badges.length})
            </button>

            <div className="font-bold text-[#171914] bg-white px-3 py-1.5 border border-[#171914]/20 rounded-xs min-h-[36px] flex items-center">
              MATA: <span className="bg-[#D9FA62] px-2 py-0.5 border border-[#171914]/20 ml-1">{totalScore} / 50</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center gap-3 font-mono text-xs text-[#7C7E77]">
          <span>Kemajuan Audit:</span>
          <div className="flex-1 h-2 bg-[#ECEAE2] rounded-xs overflow-hidden border border-[#171914]/10">
            <div
              className="h-full bg-[#171914] transition-all duration-300"
              style={{ width: `${(inspectedNetworkIds.length / wifiNetworksList.length) * 100}%` }}
            />
          </div>
          <span className="font-bold text-[#171914]">
            {inspectedNetworkIds.length} / {wifiNetworksList.length} Diaudit
          </span>
        </div>
      </div>

      {showBadges && <BadgesDrawer badges={badges} />}

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT COLUMN: Wi-Fi Radar Scanner & Selected Network (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#171914]" />
                  <span>1. Radar Gelombang Wi-Fi Kawasan Awam</span>
                </span>
                <span className="bg-[#ECEAE2] px-2.5 py-0.5 rounded-xs font-bold text-[#171914]">
                  KLIK 4 RANGKAIAN UNTUK AUDIT
                </span>
              </div>

              {/* 4 Wi-Fi Networks Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {wifiNetworksList.map(net => {
                  const isActive = activeNetworkId === net.id;
                  const isChecked = inspectedNetworkIds.includes(net.id);

                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => handleSelectNetwork(net.id)}
                      className={`p-4 rounded-sm border-2 text-left transition-all cursor-pointer flex flex-col justify-between min-h-[115px] ${
                        isActive
                          ? 'border-[#171914] bg-[#F5F4EE] shadow-xs ring-1 ring-[#171914]'
                          : 'border-[#171914]/20 bg-white hover:border-[#171914]/50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {net.isSafe ? (
                              <Lock className="w-4 h-4 text-[#1E4D2B]" />
                            ) : (
                              <Unlock className="w-4 h-4 text-[#8A241C]" />
                            )}
                            <span className="font-bold font-mono text-xs text-[#171914] truncate">
                              {net.ssid}
                            </span>
                          </div>
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-xs border ${
                            isChecked ? 'bg-[#E7F3EB] text-[#123E23] border-[#1E4D2B]/30' : 'bg-[#ECEAE2] text-[#82847C]'
                          }`}>
                            {isChecked ? 'DIAUDIT ✓' : 'KLIK AUDIT'}
                          </span>
                        </div>

                        <span className={`text-[11px] font-mono font-bold block ${
                          net.isSafe ? 'text-[#1E4D2B]' : 'text-[#8A241C]'
                        }`}>
                          {net.securityType}
                        </span>
                      </div>

                      <div className="mt-2 text-[11px] text-[#575953] font-mono truncate">
                        Isyarat: {net.signalStrength} • {net.notes}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dossier for Active Network */}
              <div className="p-4 sm:p-5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[#171914]/10 font-mono text-xs">
                  <span className="font-bold text-[#171914]">
                    Butiran Rangkaian: &ldquo;{activeNetwork.ssid}&rdquo;
                  </span>
                  <span className={`px-2 py-0.5 rounded-xs font-bold ${
                    activeNetwork.isSafe ? 'bg-[#E7F3EB] text-[#123E23]' : 'bg-[#FAF0E6] text-[#8A241C]'
                  }`}>
                    {activeNetwork.isSafe ? 'SELAMAT DIGUNAKAN' : 'BERISIKO / TIDAK DIENKRIPSI'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#575953] leading-relaxed">
                  {activeNetwork.notes}
                </p>

                {activeNetwork.captivePortalWarning && (
                  <div className="p-2.5 bg-[#FAF0E6] border border-[#8A241C]/30 rounded-xs text-[#78271C] text-xs">
                    <strong>⚠ Amaran Laman Log Masuk (Captive Portal):</strong> {activeNetwork.captivePortalWarning}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-2 font-mono text-xs text-[#7C7E77]">
              Sila pastikan anda mengklik keempat-empat gelombang Wi-Fi untuk melengkapkan audit rangkaian.
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Live Packet Sniffer & VPN Switch & Action (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-6 shadow-xs flex-1 flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
                <span className="font-bold text-[#171914] uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-[#171914]" />
                  <span>2. Makmal Intipan Trafik & Suis VPN</span>
                </span>
                <span className="bg-[#D9FA62] text-[#171914] px-2 py-0.5 rounded-xs font-bold text-[11px]">
                  INTERAKTIF
                </span>
              </div>

              {/* VPN Toggle Control Bar */}
              <div className="p-3.5 bg-[#FAF9F5] border-2 border-[#171914]/20 rounded-sm flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="font-mono text-xs font-bold uppercase text-[#171914] block flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#171914]" />
                    <span>Perisai Enkripsi VPN Maya:</span>
                  </span>
                  <span className="text-[11px] font-mono text-[#575953]">
                    Status: <strong>{isVpnActive ? 'AKTIF (AES-256)' : 'TIDAK AKTIF (DEDAH)'}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleToggleVpn}
                  className={`px-4 py-2.5 rounded-xs font-mono font-bold text-xs uppercase tracking-wider transition-all cursor-pointer min-h-[42px] border-2 flex items-center gap-1.5 shadow-xs ${
                    isVpnActive
                      ? 'bg-[#1E4D2B] text-white border-[#1E4D2B]'
                      : 'bg-[#8A241C] text-white border-[#8A241C]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isVpnActive ? 'VPN AKTIF [ON]' : 'AKTIFKAN VPN'}</span>
                </button>
              </div>

              {/* Live Packet Sniffer Visualizer */}
              <div className="rounded-sm border-2 border-[#171914] bg-[#0F141C] text-slate-100 p-4 space-y-2 font-mono text-xs">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-[11px]">
                  <span className="text-[#D9FA62] font-bold">
                    PENGINTIP DATA RANGKAIAN (PACKET SNIFFER):
                  </span>
                  <span className="text-slate-400">
                    {isVpnActive ? 'ENKRIPSI BERJAYA' : 'DATA MENTAH DILIHAT'}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-xs leading-relaxed space-y-1">
                  <div className="text-slate-400 text-[10px] uppercase">
                    Trafik Semasa Rangkaian [{activeNetwork.ssid}]:
                  </div>
                  <div className={`font-bold text-xs sm:text-sm break-all ${
                    isVpnActive ? 'text-[#D9FA62]' : 'text-[#FA8072]'
                  }`}>
                    {isVpnActive ? activeNetwork.encryptedSampleText : activeNetwork.sniffableSampleText}
                  </div>
                </div>

                <div className="text-[10px] text-slate-400 pt-1 leading-normal">
                  💡 <strong>Kesan Nyata:</strong> Apabila VPN aktif, penggodam yang berkongsi Wi-Fi kedai hanya melihat kod rawak yang mustahil didekod.
                </div>
              </div>

              {/* Safe Network Connection Question */}
              <div className="space-y-2 pt-2">
                <span className="font-mono text-xs font-bold uppercase text-[#171914] block">
                  Keputusan: Rangkaian Manakah Paling Selamat Untuk Perbankan?
                </span>

                <div className="space-y-2">
                  {wifiNetworksList.map(net => {
                    const isSelected = selectedSafeNetworkId === net.id;

                    return (
                      <button
                        key={net.id}
                        type="button"
                        disabled={isDecisionSubmitted}
                        onClick={() => setSelectedSafeNetworkId(net.id)}
                        className={`w-full p-3 rounded-sm border-2 text-left font-mono text-xs transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#171914] text-[#D9FA62] border-[#171914] font-bold'
                            : 'bg-white text-[#171914] border-[#171914]/20 hover:border-[#171914]'
                        }`}
                      >
                        <span>{net.ssid}</span>
                        <span>{isSelected ? '✓ PILIHAN ANDA' : 'PILIH'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#171914]/15 space-y-2">
              <div className="font-mono text-xs text-[#7C7E77]">
                {selectedSafeNetworkId
                  ? 'Pasukan anda sedia mengesahkan keputusan sambungan selamat.'
                  : 'Sila pilih satu rangkaian paling selamat di atas.'}
              </div>

              {!isDecisionSubmitted ? (
                <button
                  type="button"
                  disabled={!selectedSafeNetworkId}
                  onClick={handleSubmitDecision}
                  className={`w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    selectedSafeNetworkId
                      ? 'bg-[#D9FA62] text-[#171914] hover:bg-[#CCF050] border-2 border-[#171914] cursor-pointer shadow-xs'
                      : 'bg-[#ECEAE2] text-[#82847C] cursor-not-allowed border border-[#171914]/10'
                  }`}
                >
                  <span>Sahkan Keputusan & Selesaikan Misi 05 (+50 Mata)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setStage('results')}
                  className="w-full py-4 px-6 min-h-[50px] rounded-sm font-mono font-bold text-xs sm:text-sm uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <span>Lihat Laporan Misi 05 Selesai</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
