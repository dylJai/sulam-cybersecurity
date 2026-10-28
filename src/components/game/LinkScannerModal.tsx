'use client';

import React from 'react';
import { ShieldAlert, Globe, Server, Lock, AlertTriangle, X } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/60 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white border-2 border-[#171914] rounded-sm max-w-lg w-full p-6 shadow-2xl text-[#171914] space-y-5"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#171914]/15 font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#8A241C] animate-pulse" />
            <span className="font-bold uppercase tracking-wider text-[#171914]">
              {isEn ? 'Diagnostic X-Ray Link Scanner' : 'Pengimbas Pautan X-Ray Siasatan'}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label={isEn ? 'Close scanner modal' : 'Tutup tetingkap pengimbas'}
            className="text-[#7C7E77] hover:text-[#171914] cursor-pointer p-2 rounded-xs border border-transparent hover:border-[#171914]/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Target URL Display */}
        <div className="p-3 bg-[#FAF9F5] border border-[#171914]/10 rounded-xs font-mono text-xs break-all">
          <span className="text-[10px] text-[#7C7E77] block uppercase font-bold mb-0.5">
            {isEn ? 'Target Link Scanned:' : 'Pautan Dikesan:'}
          </span>
          <span className="text-[#8A241C] font-bold">{scanData.url}</span>
        </div>

        {/* Technical Diagnostics Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-[#F5F4EE] rounded-xs border border-[#171914]/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#7C7E77] text-[10px] uppercase">
              <Lock className="w-3.5 h-3.5" />
              <span>{isEn ? 'Security Protocol:' : 'Protokol Keselamatan:'}</span>
            </div>
            <span className={`font-bold block ${scanData.protocol === 'http' ? 'text-[#8A241C]' : 'text-[#1E4D2B]'}`}>
              {scanData.protocol === 'http'
                ? (isEn ? 'HTTP (Insecure ⚠)' : 'HTTP (Tidak Selamat ⚠)')
                : 'HTTPS'}
            </span>
          </div>

          <div className="p-3 bg-[#F5F4EE] rounded-xs border border-[#171914]/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#7C7E77] text-[10px] uppercase">
              <Globe className="w-3.5 h-3.5" />
              <span>{isEn ? 'Actual Domain:' : 'Domain Sebenar:'}</span>
            </div>
            <span className="font-bold text-[#8A241C] block truncate">
              {scanData.domain}
            </span>
          </div>

          <div className="p-3 bg-[#F5F4EE] rounded-xs border border-[#171914]/10 space-y-1">
            <div className="flex items-center gap-1.5 text-[#7C7E77] text-[10px] uppercase">
              <Server className="w-3.5 h-3.5" />
              <span>{isEn ? 'Server Location:' : 'Lokasi Pelayan:'}</span>
            </div>
            <span className="font-bold text-[#171914] block">
              {scanData.country}
            </span>
          </div>

          <div className="p-3 bg-[#FAF0E6] rounded-xs border border-[#8A241C]/20 space-y-1">
            <div className="flex items-center gap-1.5 text-[#8A241C] text-[10px] uppercase font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isEn ? 'Threat Score:' : 'Tahap Risiko:'}</span>
            </div>
            <span className="font-bold text-sm text-[#8A241C] block">
              {scanData.riskScore}% {isEn ? 'CRITICAL' : 'TINGGI'}
            </span>
          </div>
        </div>

        {/* Red Flags Discovered */}
        <div className="space-y-1.5">
          <span className="font-mono text-xs uppercase font-bold text-[#171914] block">
            {isEn ? 'Technical Warning Signs Detected:' : 'Petunjuk Bahaya Teknikal Dikesan:'}
          </span>
          <div className="space-y-1 text-xs text-[#575953]">
            {scanData.redFlags.map((flag, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-[#FAF0E6] rounded-xs border border-[#8A241C]/20 text-[#8A241C]">
                <span className="font-bold">•</span>
                <span>{flag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Analyst Verdict */}
        <div className="p-3 bg-[#FAF9F5] border-l-4 border-l-[#8A241C] border border-[#171914]/10 text-xs text-[#171914] space-y-1">
          <span className="font-mono font-bold uppercase text-[#8A241C] block">
            {isEn ? 'Diagnostic Security Verdict:' : 'Rumusan Keselamatan Penyiasat:'}
          </span>
          <p className="leading-relaxed">
            {scanData.verdict}
          </p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-sm font-mono font-bold text-xs uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] transition-colors cursor-pointer min-h-[44px]"
        >
          {isEn ? 'Close & Return to Investigation' : 'Tutup & Kembali Ke Siasatan'}
        </button>
      </motion.div>
    </div>
  );
};
