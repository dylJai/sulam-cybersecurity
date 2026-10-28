'use client';

import React from 'react';
import { PhoneCall } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto border-t border-[#171914]/12 bg-[#ECEAE2] text-[#575953] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Info */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-[#171914] uppercase tracking-wider font-mono">
            {t('footer.initiative')}
          </p>
          <p className="text-xs text-[#7C7E77]">
            {t('footer.subtext')}
          </p>
        </div>

        {/* NSRC 997 Public Service Hotline */}
        <div className="flex items-center gap-3 p-3 bg-white border border-[#171914]/15 rounded-sm">
          <div className="w-8 h-8 rounded-sm bg-[#171914] text-[#D9FA62] flex items-center justify-center shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <div className="text-[#171914] font-medium flex items-center gap-2">
              <span>{t('footer.hotlineTitle')}</span>
              <strong className="font-mono text-sm font-bold bg-[#D9FA62] px-1.5 py-0.2 rounded-xs text-[#171914]">997</strong>
            </div>
            <p className="text-[11px] text-[#7C7E77] mt-0.5">
              {t('footer.hotlineDesc')}
            </p>
          </div>
        </div>

        {/* Technical imprint */}
        <div className="font-mono text-[11px] text-[#82847C]">
          {t('footer.year')}
        </div>
      </div>
    </footer>
  );
};
