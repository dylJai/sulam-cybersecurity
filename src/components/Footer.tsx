import React from 'react';
import { PhoneCall, ShieldAlert, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/70 text-slate-400 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Info */}
        <div className="text-center md:text-left space-y-1">
          <p className="text-sm font-semibold text-slate-200">
            CyberSafe Community — Inisiatif Keselamatan Siber Komuniti
          </p>
          <p className="text-xs text-slate-400">
            Dibina untuk kegunaan bengkel interaktif komputer riba kampung & sekolah komuniti.
          </p>
        </div>

        {/* Emergency scam hotline banner (NSRC 997) */}
        <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <div className="text-slate-300 font-medium flex items-center gap-1.5">
              <span>Talian Bantuan Scam Kebangsaan (NSRC):</span>
              <span className="font-bold text-rose-400 text-sm">997</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Hubungi segera jika anda terpedaya atau terhantar wang kepada penipu.
            </p>
          </div>
        </div>

        {/* Simple signoff */}
        <div className="flex items-center gap-1 text-xs text-slate-400">
          <span>Bersama Melindungi Komuniti Kita</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 inline fill-rose-500" />
        </div>
      </div>
    </footer>
  );
};
