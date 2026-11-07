'use client';

import React, { useEffect, useRef } from 'react';
import { Globe, Server, Lock, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';

export interface LinkScanData {
  url: string;
  protocol: 'http' | 'https';
  domain: string;
  country: string;
  riskScore: number;
  verdict: string;
  redFlags: string[];
}

interface LinkScannerModalProps {
  scanData: LinkScanData | null;
  onClose: () => void;
}

export const LinkScannerModal: React.FC<LinkScannerModalProps> = ({ scanData, onClose }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';
  const shouldReduceMotion = useReducedMotion();
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  // Accessible dialog: Escape key & focus management
  useEffect(() => {
    if (!scanData) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timeout = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [scanData, onClose]);

  if (!scanData) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="scanner-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
    >
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-slate-300 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl text-slate-900 space-y-6"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 id="scanner-modal-title" className="font-black text-xl text-slate-900">
                {isEn ? 'Diagnostic Link Scanner (X-Ray)' : 'Pengimbas Pautan X-Ray Diagnostik'}
              </h3>
              <p className="text-sm text-slate-600 font-medium">
                {isEn ? 'Technical Security Analysis' : 'Analisis Keselamatan Teknikal'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? 'Close scanner modal (Esc)' : 'Tutup pengimbas (Esc)'}
            title={isEn ? 'Close (Esc)' : 'Tutup (Esc)'}
            className="text-slate-400 hover:text-slate-800 hover:bg-slate-100 p-2.5 rounded-2xl border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Target URL Display */}
        <div className="p-4 bg-slate-50 border-2 border-slate-200 rounded-2xl space-y-1">
          <span className="text-xs text-slate-500 block font-black uppercase tracking-wider">
            {isEn ? 'Target Link Scanned:' : 'Pautan yang Dikesan:'}
          </span>
          <code className="text-base text-rose-700 font-black font-mono break-all block">
            {scanData.url}
          </code>
        </div>

        {/* Technical Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>{isEn ? 'Protocol:' : 'Protokol:'}</span>
            </div>
            <span
              className={`text-base font-black block ${
                scanData.protocol === 'http' ? 'text-rose-600' : 'text-emerald-700'
              }`}
            >
              {scanData.protocol === 'http'
                ? isEn
                  ? 'HTTP (Insecure ⚠)'
                  : 'HTTP (Tidak Selamat ⚠)'
                : 'HTTPS (Encrypted)'}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Globe className="w-4 h-4 text-slate-600" />
              <span>{isEn ? 'Actual Domain:' : 'Domain Sebenar:'}</span>
            </div>
            <span className="text-base font-black text-rose-700 block truncate" title={scanData.domain}>
              {scanData.domain}
            </span>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-2xl border-2 border-slate-200 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <Server className="w-4 h-4 text-slate-600" />
              <span>{isEn ? 'Server Location:' : 'Lokasi Pelayan:'}</span>
            </div>
            <span className="text-base font-bold text-slate-900 block truncate">
              {scanData.country}
            </span>
          </div>

          <div className="p-3.5 bg-rose-50 rounded-2xl border-2 border-rose-300 space-y-1">
            <div className="flex items-center gap-1.5 text-rose-700 text-xs font-black uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{isEn ? 'Risk Score:' : 'Tahap Risiko:'}</span>
            </div>
            <span className="text-base font-black text-rose-700 block">
              {scanData.riskScore} / 100 ({scanData.riskScore > 75 ? (isEn ? 'High Threat' : 'Bahaya Tinggi') : (isEn ? 'Medium' : 'Sederhana')})
            </span>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl space-y-2">
          <span className="text-xs font-black text-rose-900 uppercase tracking-wider block">
            {isEn ? 'Diagnostic Verdict:' : 'Keputusan Siasatan:'}
          </span>
          <p className="text-base text-rose-950 leading-relaxed font-bold">
            {scanData.verdict}
          </p>

          <div className="pt-2 border-t border-rose-200 space-y-1">
            <span className="text-xs font-black text-rose-800 block uppercase tracking-wider">
              {isEn ? 'Identified Warning Indicators:' : 'Petunjuk Bahaya Dikesan:'}
            </span>
            <ul className="text-sm text-rose-950 font-medium space-y-1 list-disc list-inside">
              {scanData.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2 flex justify-end">
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-base rounded-2xl cursor-pointer transition-all shadow-md min-h-[52px] active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {isEn ? 'Understood, Close Scanner (Esc)' : 'Faham, Tutup Pengimbas (Esc)'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
