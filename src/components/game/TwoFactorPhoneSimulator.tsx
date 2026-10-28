'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface TwoFactorPhoneSimulatorProps {
  onSuccess: () => void;
}

export const TwoFactorPhoneSimulator: React.FC<TwoFactorPhoneSimulatorProps> = ({ onSuccess }) => {
  const { language } = useLanguage();
  const [decision, setDecision] = useState<'pending' | 'blocked' | 'compromised'>('pending');
  const isEn = language === 'en';

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
            {isEn ? 'Smartphone 2FA Push Notification Simulator' : 'Simulator Pengesahan 2FA Telefon Pintar'}
          </span>
        </div>
        <span className="text-[#8A241C] font-bold bg-[#FAF0E6] px-2 py-0.5 rounded-xs">
          {isEn ? 'UNAUTHORIZED BREACH ATTEMPT DETECTED' : 'PERCUBAAN PENCEROBOHAN DIKESAN'}
        </span>
      </div>

      <div className="text-xs sm:text-sm text-[#575953] leading-relaxed">
        {isEn ? (
          <>
            A cybercriminal obtained Pak Ali&apos;s password and is now attempting to sign in. Fortunately, Pak Ali activated <strong>Two-Factor Authentication (2FA)</strong>! Look at the prompt that popped up on his smartphone screen below:
          </>
        ) : (
          <>
            Seorang penjenayah siber berjaya meneka kata laluan Pak Ali dan kini cuba log masuk. Nasib baik Pak Ali telah mengaktifkan <strong>Pengesahan Dua Faktor (2FA)</strong>! Perhatikan notifikasi yang masuk ke telefon pintar beliau di bawah:
          </>
        )}
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
            <span>{isEn ? 'ACCOUNT SECURITY ALERT' : 'AMARAN KESELAMATAN AKAUN'}</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="text-slate-100 font-bold">
              {isEn ? 'Unrecognized Sign-In Attempt' : 'Percubaan Log Masuk Tidak Dikenali'}
            </div>
            <div className="text-slate-300 text-[11px] font-mono leading-relaxed bg-slate-950 p-2.5 rounded border border-slate-800 space-y-0.5">
              <div>{isEn ? 'Account:' : 'Akaun:'} <strong>ali.kampung@email.com</strong></div>
              <div>{isEn ? 'Device:' : 'Peranti:'} <strong>Windows PC (Chrome)</strong></div>
              <div>{isEn ? 'Location:' : 'Lokasi:'} <span className="text-rose-400 font-bold">{isEn ? 'Foreign IP (185.220.101.5)' : 'IP Asing (185.220.101.5)'}</span></div>
              <div>{isEn ? 'Password:' : 'Kata Laluan:'} <span className="text-emerald-400 font-bold">{isEn ? 'Matched & Correct' : 'Padan & Betul'}</span></div>
            </div>
            <div className="text-slate-200 text-xs pt-1 font-medium">
              {isEn ? 'Are you currently trying to sign in?' : 'Adakah ini anda yang sedang cuba log masuk?'}
            </div>
          </div>

          {/* Interactive Decision Buttons */}
          {decision === 'pending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={handleDeny}
                className="py-4 px-4 rounded-sm font-mono font-extrabold text-sm uppercase bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-colors cursor-pointer text-center min-h-[52px] shadow-sm flex items-center justify-center gap-2 border-2 border-rose-400"
              >
                <span>{isEn ? '✕ DENY & BLOCK' : '✕ TOLAK & SEKAT'}</span>
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="py-4 px-4 rounded-sm font-mono font-bold text-sm uppercase bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-slate-200 transition-colors cursor-pointer text-center min-h-[52px] border-2 border-slate-600 flex items-center justify-center gap-2"
              >
                <span>{isEn ? 'YES, IT IS ME' : 'YA, INI SAYA'}</span>
              </button>
            </div>
          )}

          {/* Blocked Confirmation State */}
          {decision === 'blocked' && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Access Blocked Successfully!' : 'Pencerobohan Berjaya Disekat!'}</span>
              </div>
              <p className="text-emerald-200 text-[11px] leading-relaxed">
                {isEn
                  ? 'Even though the hacker possessed your password, 2FA completely prevented unauthorized access.'
                  : 'Walaupun penjenayah mempunyai kata laluan anda, mereka tetap disekat kerana tidak memegang telefon fizikal anda.'}
              </p>
            </div>
          )}

          {/* Compromised State */}
          {decision === 'compromised' && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/50 rounded-sm space-y-2 text-xs">
              <div className="flex items-center gap-2 text-rose-400 font-bold">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{isEn ? 'Account Compromised!' : 'Akaun Telah Dicerobohi!'}</span>
              </div>
              <p className="text-rose-200 text-[11px] leading-relaxed">
                {isEn
                  ? 'You approved an unrecognized login attempt! The hacker was granted full access to your email.'
                  : 'Anda menekan kelulusan bagi percubaan yang bukan daripada anda! Penjenayah kini memiliki akses penuh.'}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xs font-mono font-bold text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Try Again (Deny Breach)' : 'Cuba Semula (Tolak Pencerobohan)'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
