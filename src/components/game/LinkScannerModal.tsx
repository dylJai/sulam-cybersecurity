'use client';

import React from 'react';
import { Globe, Server, Lock, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
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
  if (!scanData) return null;

  const isEn = language === 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-slate-900 space-y-5"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {isEn ? 'Diagnostic Link Scanner (X-Ray)' : 'Pengimbas Pautan X-Ray Diagnostik'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEn ? 'Technical Security Analysis' : 'Analisis Keselamatan Teknikal'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={isEn ? 'Close scanner modal' : 'Tutup pengimbas'}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target URL Display */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
          <span className="text-xs text-slate-500 block font-bold uppercase tracking-wider">
            {isEn ? 'Target Link Scanned:' : 'Pautan yang Dikesan:'}
          </span>
          <code className="text-sm text-red-600 font-bold break-all block">
            {scanData.url}
          </code>
        </div>

        {/* Technical Diagnostics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>{isEn ? 'Protocol:' : 'Protokol:'}</span>
            </div>
            <span className={`font-bold block ${scanData.protocol === 'http' ? 'text-red-600' : 'text-emerald-700'}`}>
              {scanData.protocol === 'http'
                ? (isEn ? 'HTTP (Insecure ⚠)' : 'HTTP (Tidak Selamat ⚠)')
                : 'HTTPS (Encrypted)'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              <span>{isEn ? 'Actual Domain:' : 'Domain Sebenar:'}</span>
            </div>
            <span className="font-bold text-red-700 block truncate" title={scanData.domain}>
              {scanData.domain}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
            <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold">
              <Server className="w-3.5 h-3.5" />
              <span>{isEn ? 'Server Location:' : 'Lokasi Pelayan:'}</span>
            </div>
            <span className="font-bold text-slate-900 block truncate">
              {scanData.country}
            </span>
          </div>

          <div className="p-3 bg-red-50 rounded-xl border border-red-200 space-y-1">
            <div className="flex items-center gap-1.5 text-red-700 text-xs font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Risk Score:' : 'Tahap Risiko:'}</span>
            </div>
            <span className="font-extrabold text-red-700 block">
              {scanData.riskScore} / 100 ({scanData.riskScore > 75 ? (isEn ? 'High Risk' : 'Bahaya Tinggi') : (isEn ? 'Medium' : 'Sederhana')})
            </span>
          </div>
        </div>

        {/* Verdict Box */}
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl space-y-2">
          <span className="text-xs font-bold text-red-800 uppercase tracking-wider block">
            {isEn ? 'Diagnostic Verdict:' : 'Keputusan Siasatan:'}
          </span>
          <p className="text-sm text-red-900 leading-relaxed font-semibold">
            {scanData.verdict}
          </p>

          <div className="pt-2 border-t border-red-200/80 space-y-1">
            <span className="text-xs font-bold text-red-800 block">
              {isEn ? 'Identified Warning Indicators:' : 'Petunjuk Bahaya Dikesan:'}
            </span>
            <ul className="text-xs text-red-900 space-y-1 list-disc list-inside">
              {scanData.redFlags.map((flag, idx) => (
                <li key={idx}>{flag}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Dismiss Button */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl cursor-pointer transition-colors shadow-sm min-h-[46px]"
          >
            {isEn ? 'Understood, Close Scanner' : 'Faham, Tutup Pengimbas'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
