'use client';

import React, { useState } from 'react';
import { Smartphone, ShieldAlert, CheckCircle2, RotateCcw } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { playPopSound, playSuccessChime, playWarningTone, triggerCelebration } from '@/lib/sound';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

interface TwoFactorPhoneSimulatorProps {
  onSuccess: () => void;
}

export const TwoFactorPhoneSimulator: React.FC<TwoFactorPhoneSimulatorProps> = ({ onSuccess }) => {
  const { language } = useLanguage();
  const [decision, setDecision] = useState<'pending' | 'blocked' | 'compromised'>('pending');
  const isEn = language === 'en';

  const handleDeny = () => {
    playSuccessChime();
    triggerCelebration();
    setDecision('blocked');
    onSuccess();
  };

  const handleApprove = () => {
    playWarningTone();
    setDecision('compromised');
  };

  const handleRetry = () => {
    playPopSound();
    setDecision('pending');
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-7 shadow-sm space-y-5">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-slate-900">
              {isEn ? 'Smartphone 2FA Notification Simulator' : 'Simulator Notifikasi 2FA Telefon Pintar'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              {isEn ? 'Experience how Two-Factor Authentication blocks intruders' : 'Alami bagaimana Pengesahan Dua Faktor menyelamatkan akaun anda'}
            </p>
          </div>
        </div>
        <span className="text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-xs font-bold self-start sm:self-auto">
          {isEn ? 'UNAUTHORIZED ATTEMPT' : 'CUBAAN PENCEROBOHAN'}
        </span>
      </div>

      <div className="text-sm sm:text-base text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
        {isEn ? (
          <>
            A scammer guessed Pak Ali&apos;s password and is attempting to log into his account from another device. Fortunately, Pak Ali turned on <strong>Two-Factor Authentication (2FA)</strong>! Look at the prompt that arrived on his phone screen below:
          </>
        ) : (
          <>
            Penjenayah siber berjaya mencuri kata laluan Pak Ali dan cuba log masuk. Mujurlah Pak Ali telah menghidupkan <strong>Pengesahan 2 Faktor (2FA)</strong>! Perhatikan notifikasi keselamatan yang muncul di skrin telefon beliau di bawah:
          </>
        )}
      </div>

      {/* Simulated Smartphone Frame */}
      <div className="max-w-md mx-auto rounded-3xl border-4 border-slate-800 bg-slate-950 text-white p-5 shadow-xl space-y-4 font-sans">
        {/* Phone Top Status */}
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-2">
          <span>10:45 AM</span>
          <div className="flex items-center gap-2">
            <span>5G</span>
            <span>89% 🔋</span>
          </div>
        </div>

        {/* 2FA Push Alert Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3.5 shadow-lg">
          <div className="flex items-center justify-between gap-2 pb-1 border-b border-slate-800">
            <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
              <ShieldAlert className="w-4 h-4" />
              <span>{isEn ? 'ACCOUNT SECURITY ALERT' : 'AMARAN KESELAMATAN AKAUN'}</span>
            </div>
            <VoiceOverButton
              text={isEn
                ? 'Account security alert! Unrecognized sign-in attempt for ali.kampung@email.com from a Windows PC with foreign IP. Matched password. Is this you trying to sign in?'
                : 'Amaran keselamatan akaun! Percubaan log masuk tidak dikenali untuk ali.kampung@email.com daripada peranti Windows PC dengan alamat IP luar negara. Kata laluan padan dan tepat. Adakah ini anda yang sedang cuba log masuk?'}
              variant="badge"
            />
          </div>

          <div className="space-y-2 text-xs sm:text-sm">
            <div className="text-white font-extrabold text-sm sm:text-base">
              {isEn ? 'Unrecognized Sign-In Attempt' : 'Percubaan Log Masuk Tidak Dikenali'}
            </div>
            <div className="text-slate-300 text-xs leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div>{isEn ? 'Account:' : 'Akaun:'} <strong className="text-white">ali.kampung@email.com</strong></div>
              <div>{isEn ? 'Device:' : 'Peranti:'} <strong className="text-white">Windows PC (Chrome)</strong></div>
              <div>{isEn ? 'Location:' : 'Lokasi:'} <span className="text-rose-400 font-bold">{isEn ? 'Foreign IP (185.220.101.5)' : 'IP Luar Negara (185.220.101.5)'}</span></div>
              <div>{isEn ? 'Password:' : 'Kata Laluan:'} <span className="text-emerald-400 font-bold">{isEn ? 'Matched & Correct' : 'Padan & Tepat'}</span></div>
            </div>
            <div className="text-slate-200 text-sm font-semibold pt-1">
              {isEn ? 'Is this you trying to sign in?' : 'Adakah ini anda yang sedang cuba log masuk?'}
            </div>
          </div>

          {/* Interactive Decision Buttons */}
          {decision === 'pending' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeny}
                className="py-3.5 px-4 rounded-xl font-bold text-sm bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white transition-all cursor-pointer text-center min-h-[48px] shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{isEn ? '✕ DENY & BLOCK' : '✕ BUKAN SAYA (SEKAT)'}</span>
              </button>
              <button
                type="button"
                onClick={handleApprove}
                className="py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer text-center min-h-[48px] border border-slate-700"
              >
                <span>{isEn ? '✓ Yes, Allow Sign-In' : '✓ Ya, Benarkan Log Masuk'}</span>
              </button>
            </div>
          )}

          {decision === 'blocked' && (
            <div className="p-3.5 bg-emerald-950 border border-emerald-600/50 rounded-xl space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>{isEn ? 'INTRUDER BLOCKED INSTANTLY!' : 'PENCEROBOH BERJAYA DISEKAT!'}</span>
              </div>
              <p className="text-xs text-emerald-200/90 leading-relaxed">
                {isEn
                  ? 'Even though the intruder had your password, 2FA required your phone confirmation. Your account remains 100% safe!'
                  : 'Walaupun penjenayah mempunyai kata laluan anda, mereka tetap disekat kerana tidak memiliki telefon anda. Akaun kekal selamat!'}
              </p>
            </div>
          )}

          {decision === 'compromised' && (
            <div className="p-3.5 bg-rose-950 border border-rose-600/50 rounded-xl space-y-2 animate-in fade-in">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>{isEn ? 'DANGER: YOU ALLOWED THE HACKER IN!' : 'BAHAYA: ANDA BENARKAN PENGGODAM MASUK!'}</span>
              </div>
              <p className="text-xs text-rose-200/90 leading-relaxed">
                {isEn
                  ? 'Never press "Allow" unless you are the one signing in right now!'
                  : 'Jangan sesekali tekan "Benarkan" jika anda tidak sedang membuat log masuk di komputer tersebut!'}
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-1 px-3 py-1.5 bg-white text-rose-900 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{isEn ? 'Try Again' : 'Cuba Semula'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
