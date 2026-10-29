'use client';

import React from 'react';
import { PhoneCall, ShieldAlert, Heart } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white text-slate-600 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* NSRC 997 Emergency Banner */}
        <div className="bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border-2 border-red-200/90 rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shrink-0 shadow-md">
              <PhoneCall className="w-7 h-7 animate-pulse" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-red-800 bg-red-100/90 px-2.5 py-0.5 rounded-full border border-red-200">
                  {language === 'en' ? 'National Scam Emergency Line' : 'Talian Kecemasan Penipuan Wang'}
                </span>
                <span className="text-sm sm:text-base font-extrabold text-slate-900">
                  {t('footer.hotlineTitle')}
                </span>
              </div>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-2xl">
                {t('footer.hotlineDesc')}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            <a
              href="tel:997"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base sm:text-lg rounded-xl shadow-md hover:shadow-lg transition-all min-h-[52px]"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Dail 997 Segera</span>
            </a>
          </div>
        </div>

        {/* Bottom Credits & Info */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-slate-500">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldAlert className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              {t('footer.initiative')} • {t('footer.subtext')}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-medium text-slate-400">
            <span>Dihasilkan dengan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>untuk Komuniti Malaysia (2026)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
