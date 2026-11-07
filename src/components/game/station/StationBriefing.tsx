'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

export interface BriefingStep {
  title: string;
  description: string;
}

export interface StationBriefingProps {
  stationNumber: string | number;
  stationName: string;
  title: string;
  description: string;
  voiceOverText?: string;
  privacyNotice?: {
    title: string;
    description: string;
  };
  steps: BriefingStep[];
  durationMinutes?: number;
  onStart: () => void;
  startLabel?: string;
  backHref?: string;
}

export const StationBriefing: React.FC<StationBriefingProps> = ({
  stationNumber,
  stationName,
  title,
  description,
  voiceOverText,
  privacyNotice,
  steps,
  durationMinutes,
  onStart,
  startLabel,
  backHref = '/'
}) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const formattedStationNumber =
    typeof stationNumber === 'number'
      ? stationNumber < 10
        ? `0${stationNumber}`
        : `${stationNumber}`
      : stationNumber;

  return (
    <main
      aria-label={isEn ? `Station ${formattedStationNumber} Briefing` : `Taklimat Stesen ${formattedStationNumber}`}
      className="w-full space-y-6"
    >
      <div>
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-base font-bold text-slate-600 hover:text-blue-600 transition-colors py-1 mb-2 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-lg"
        >
          <span>← {isEn ? 'Back to Challenge Hub' : 'Kembali ke Menu Misi'}</span>
        </Link>
      </div>

      <div className="rounded-3xl border-2 border-slate-200 bg-white p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header Banner */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full text-blue-700 font-black text-xs uppercase tracking-wider">
            <span>
              {isEn
                ? `Station ${formattedStationNumber} • Group Challenge`
                : `Stesen ${formattedStationNumber} • Cabaran Berkumpulan`}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed font-medium max-w-3xl">
              {description}
            </p>
            <div className="shrink-0 self-start sm:self-center">
              <VoiceOverButton
                text={voiceOverText || `${title}. ${description}`}
                variant="badge"
                label={isEn ? 'Listen Briefing' : 'Dengar Taklimat'}
              />
            </div>
          </div>
        </div>

        {/* Optional Privacy / Safety Warning Banner */}
        {privacyNotice && (
          <div
            role="region"
            aria-label={isEn ? 'Privacy Notice' : 'Notis Privasi'}
            className="p-4 sm:p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-start gap-4"
          >
            <AlertTriangle className="w-7 h-7 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-base sm:text-lg font-black text-amber-950 block">
                {privacyNotice.title}
              </strong>
              <p className="text-base text-amber-900 font-medium leading-relaxed">
                {privacyNotice.description}
              </p>
            </div>
          </div>
        )}

        {/* Numbered Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-2 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                  {idx + 1}
                </span>
                <h2 className="text-xl font-bold text-slate-900">
                  {step.title}
                </h2>
                <p className="text-base text-slate-600 font-medium leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action CTA Footer */}
        <div className={`pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-4 ${durationMinutes ? 'justify-between' : 'justify-end'}`}>
          {durationMinutes && (
            <span className="text-base text-slate-500 font-medium flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span>
                {isEn
                  ? `Round Duration: ${durationMinutes}:00 Minutes`
                  : `Masa Latihan: ${durationMinutes}:00 Minit`}
              </span>
            </span>
          )}

          <button
            type="button"
            onClick={onStart}
            className="w-full sm:w-auto min-h-[56px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden"
          >
            <span>{startLabel || (durationMinutes ? (isEn ? `Start ${durationMinutes}-Minute Mission →` : `Mula Misi ${durationMinutes} Minit →`) : (isEn ? 'Start Mission →' : 'Mula Misi →'))}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
};
