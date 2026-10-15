'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { RotateCcw } from 'lucide-react';
import { getStationRecords, getOverallStats, resetStationRecords } from '@/lib/storage';

export const Header: React.FC = () => {
  const [stats, setStats] = useState({ totalScore: 0, maxPossibleScore: 100, completedCount: 0 });
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const refreshStats = () => {
    const records = getStationRecords();
    setStats(getOverallStats(records));
  };

  useEffect(() => {
    refreshStats();
    const handleUpdate = () => refreshStats();
    window.addEventListener('cybersafe-storage-updated', handleUpdate);
    return () => window.removeEventListener('cybersafe-storage-updated', handleUpdate);
  }, []);

  const handleReset = () => {
    resetStationRecords();
    setShowResetConfirm(false);
    if (typeof window !== 'undefined') {
      if (window.location.pathname === '/') {
        window.location.reload();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#171914]/12 bg-[#F5F4EE]/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Identity */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-1 focus:ring-[#171914]"
          >
            <div className="w-8 h-8 rounded-sm bg-[#171914] text-[#D9FA62] font-mono text-xs font-bold flex items-center justify-center tracking-tighter">
              CS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-[#171914]">
                CyberSafe Community
              </span>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#7C7E77] leading-none">
                Bengkel Keselamatan Siber
              </span>
            </div>
          </Link>

          {/* Right Action Bar */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Station Score Indicator */}
            <div className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#171914]/20 rounded-sm shadow-xs font-mono text-xs sm:text-sm min-h-[40px]">
              <span className="text-[#7C7E77] uppercase text-[11px] tracking-wider font-medium">Mata Stesen:</span>
              <span className="font-bold text-[#171914]">
                {stats.totalScore}
                <span className="text-[#82847C] font-normal"> / {stats.maxPossibleScore}</span>
              </span>
            </div>

            {/* Reset Station for Next Team */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Set Semula Stesen untuk Pasukan Baru"
              className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#575953] hover:text-[#171914] bg-white hover:bg-[#ECEAE2] border border-[#171914]/20 rounded-sm transition-colors cursor-pointer min-h-[40px] shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Set Semula</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#171914]/40 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#171914] rounded-sm max-w-md w-full p-6 sm:p-7 shadow-xl text-[#171914]">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#171914]/10">
              <span className="font-mono text-xs uppercase font-bold tracking-wider text-[#7C7E77]">
                Tindakan Stesen
              </span>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="text-xs sm:text-sm font-mono text-[#7C7E77] hover:text-[#171914] cursor-pointer p-1"
              >
                [BATAL]
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight mb-2">
              Set Semula Stesen untuk Pasukan Baru?
            </h3>
            <p className="text-xs sm:text-sm text-[#575953] mb-6 leading-relaxed">
              Tindakan ini akan mengosongkan mata dan sejarah jawapan stesen ini supaya pasukan peserta seterusnya dapat memulakan cabaran dari awal.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-3 text-xs sm:text-sm font-semibold uppercase tracking-wider text-[#171914] bg-[#ECEAE2] hover:bg-[#E4E1D6] rounded-sm transition-colors cursor-pointer min-h-[44px]"
              >
                Kembali
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#171914] bg-[#D9FA62] hover:bg-[#CCF050] border-2 border-[#171914] rounded-sm transition-colors cursor-pointer shadow-xs min-h-[44px]"
              >
                Sahkan Set Semula
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
