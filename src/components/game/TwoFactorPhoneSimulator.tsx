'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldAlert, ShieldCheck, XCircle, CheckCircle2, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface TwoFactorPhoneSimulatorProps {
  onSuccess: () => void;
}

export const TwoFactorPhoneSimulator: React.FC<TwoFactorPhoneSimulatorProps> = ({ onSuccess }) => {
  const [decision, setDecision] = useState<'pending' | 'blocked' | 'compromised'>('pending');

  const handleDeny = () => {
    setDecision('blocked');
    onSuccess();
  };

  const handleApprove = () => {
    setDecision('compromised');
  };

  const handleRetry = () => {
    setDecision('pending');
  };

  return (
    <div className="rounded-sm border-2 border-[#171914] bg-white p-5 sm:p-7 shadow-xs space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#171914]/15 font-mono text-xs">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#171914]" />
          <span className="font-bold uppercase tracking-wider text-[#171914]">
            Simulator Pengesahan 2FA Telefon Pintar
          </span>
        </div>
        <span className="text-[#8A241C] font-bold bg-[#FAF0E6] px-2 py-0.5 rounded-xs">
          PERCUBAAN PENCEROBOHAN DIKESAN
        </span>
      </div>

      <div className="text-xs sm:text-sm text-[#575953] leading-relaxed">
        Seorang penjenayah siber berjaya meneka kata laluan Pak Ali dan kini cuba log masuk. Nasib baik Pak Ali telah mengaktifkan <strong>Pengesahan Dua Faktor (2FA)</strong>! Perhatikan notifikasi yang masuk ke telefon pintar beliau di bawah:
      </div>

      {/* Simulated Smartphone Frame */}
      <div className="max-w-md mx-auto rounded-xl border-2 border-[#171914] bg-[#090D16] text-white p-4 shadow-lg space-y-4 font-sans">
        {/* Phone Top Status */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono px-1">
          <span>10:45 AM</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>89% 🔋</span>
          </div>
        </div>

        {/* 2FA Push Alert Card */}
        <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 space-y-3 shadow-md">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold font-mono">
            <ShieldAlert className="w-4 h-4" />
            <span>AMARAN KESELAMATAN AKAUN</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-100 font-bold">
              Percubaan Log Masuk Tidak Dikenali
            </div>
            <div className="text-slate-300 text-[11px] font-mono leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800 space-y-0.5">
              <div>Akaun: <strong>ali.kampung@email.com</strong></div>
              <div>Peranti: <strong>Windows PC (Chrome)</strong></div>
              <div>Lokasi: <span className="text-rose-400 font-bold">IP Asing (185.220.101.5)</span></div>
              <div>Kata Laluan: <span className="text-emerald-400 font-bold">Padan & Betul</span></div>
            </div>
            <div className="text-slate-200 text-xs pt-1 font-medium">
              Adakah ini anda yang sedang cuba log masuk?
            </div>
          </div>

          {/* Interactive Decision Buttons - Large & Accessible for Elderly Users */}
          {decision === 'pending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={handleDeny}
                className="py-4 px-4 rounded-sm font-mono font-extrabold text-sm uppercase bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-colors cursor-pointer text-center min-h-[52px] shadow-sm flex items-center justify-center gap-2 border-2 border-rose-400"
              >
                <span>✕ TOLAK & SEKAT</span>
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="py-4 px-4 rounded-sm font-mono font-bold text-sm uppercase bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 transition-colors cursor-pointer text-center min-h-[52px] border-2 border-slate-600 flex items-center justify-center gap-2"
              >
                <span>YA, INI SAYA</span>
              </button>
            </div>
          )}

          {/* Blocked Confirmation State */}
          {decision === 'blocked' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded text-xs text-emerald-200 space-y-1 font-mono">
              <div className="font-bold flex items-center gap-1.5 text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
                <span>PENCEROBOHAN BERJAYA DISEKAT!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Akses penyerang dibatalkan serta-merta. Walaupun mereka mempunyai kata laluan, ketiadaan telefon anda menghalang mereka masuk.
              </p>
            </div>
          )}

          {/* Compromised Mistake State */}
          {decision === 'compromised' && (
            <div className="p-3 bg-rose-950/80 border border-rose-600 rounded text-xs text-rose-200 space-y-2 font-mono">
              <div className="font-bold flex items-center gap-1.5 text-rose-300">
                <XCircle className="w-4 h-4" />
                <span>AKAUN BERJAYA DITAWAN PENGGODAM!</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Menekan &ldquo;Ya, Ini Saya&rdquo; membenarkan penyerang menceroboh peti masuk anda. Jangan sesekali meluluskan notifikasi yang bukan daripada anda!
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-3 min-h-[44px] bg-rose-700 hover:bg-rose-600 text-white rounded font-mono text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer transition-colors shadow-sm mt-1"
              >
                Cuba Semula (Tolak Pencerobohan)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Outcome Note */}
      {decision === 'blocked' && (
        <div className="p-3 bg-[#E7F3EB] border border-[#1E4D2B]/30 rounded-xs text-xs text-[#123E23] flex items-center justify-between">
          <span>✓ Pengesahan 2FA menyelamatkan akaun Pak Ali! Anda memperoleh Lencana Perisai 2FA (+15 Mata).</span>
        </div>
      )}
    </div>
  );
};
