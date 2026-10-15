'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, RotateCcw, Trophy, Users } from 'lucide-react';
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
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          {/* Logo & Title */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-500 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                  CyberSafe Community
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                  Bengkel Siber
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Station Interactive Workshop
              </p>
            </div>
          </Link>

          {/* Right Action Area */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Team Workshop Badge */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Stesen Komuniti</span>
            </div>

            {/* Score Tracker Pill */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-white shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium leading-none">
                  Mata Pasukan
                </span>
                <span className="text-sm font-bold text-amber-300 leading-tight">
                  {stats.totalScore} <span className="text-slate-500 text-xs font-normal">/ {stats.maxPossibleScore}</span>
                </span>
              </div>
            </div>

            {/* Reset Station Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset Station for Next Team"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Set Semula</span>
            </button>
          </div>
        </div>
      </header>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-100">
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <RotateCcw className="w-6 h-6" />
              <h3 className="text-lg font-bold">Set Semula Stesen Pasukan?</h3>
            </div>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Tindakan ini akan mengosongkan markah dan kemajuan stesen ini supaya pasukan peserta seterusnya dapat bermula dari awal.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-colors"
              >
                Ya, Set Semula Stesen
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
