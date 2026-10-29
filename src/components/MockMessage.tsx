import React from 'react';
import { Paperclip, AlertTriangle } from 'lucide-react';
import { VoiceOverButton } from '@/components/common/VoiceOverButton';

interface MockMessageProps {
  format?: 'sms' | 'email';
  sender?: string;
  subject?: string;
  messageBody?: string;
  attachmentName?: string;
  urgencyBadge?: string;
}

export const MockMessage: React.FC<MockMessageProps> = ({
  format = 'sms',
  sender,
  subject,
  messageBody,
  attachmentName,
  urgencyBadge
}) => {
  if (format === 'email') {
    return (
      <div className="w-full rounded-2xl border border-slate-200 bg-white shadow-sm text-left overflow-hidden">
        {/* Email Window Header */}
        <div className="bg-slate-100 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-400" />
            <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
              Simulasi Mesej Emel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <VoiceOverButton
              text={`${subject ? subject + '. ' : ''}${messageBody || ''}`}
              variant="badge"
            />
            {urgencyBadge && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5" />
                {urgencyBadge}
              </span>
            )}
          </div>
        </div>

        {/* Email Metadata Grid */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/60 space-y-2 text-xs sm:text-sm">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="uppercase font-semibold text-slate-500 text-xs w-20 shrink-0">Daripada:</span>
            <span className="font-mono text-slate-900 font-medium break-all bg-white px-3 py-1 border border-slate-200 rounded-lg">
              {sender}
            </span>
          </div>
          {subject && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="uppercase font-semibold text-slate-500 text-xs w-20 shrink-0">Perkara:</span>
              <span className="font-bold text-slate-900">{subject}</span>
            </div>
          )}
        </div>

        {/* Email Body */}
        <div className="p-5 sm:p-6 text-sm sm:text-base text-slate-800 leading-relaxed whitespace-pre-line bg-white">
          {messageBody}

          {/* Attachment Preview if present */}
          {attachmentName && (
            <div className="mt-5 p-4 rounded-2xl border border-rose-200 bg-rose-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-rose-900">{attachmentName}</div>
                  <div className="text-xs text-rose-700 font-medium">
                    Fail Aplikasi Android Tidak Dikenali (.apk)
                  </div>
                </div>
              </div>
              <span className="text-xs font-bold uppercase text-rose-800 bg-white px-3 py-1 rounded-full border border-rose-200 self-start sm:self-center shadow-xs">
                MENCURIGAKAN
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Realistic SMS view
  return (
    <div className="w-full max-w-lg mx-auto rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
      {/* Top Bar */}
      <div className="pb-3 mb-3 border-b border-slate-100 flex items-center justify-between text-xs">
        <div>
          <span className="uppercase text-[11px] font-semibold text-slate-500 block">Pengirim SMS</span>
          <span className="font-bold text-slate-900 text-sm">{sender || 'Nombor Tidak Dikenali'}</span>
        </div>
        <div className="flex items-center gap-2">
          <VoiceOverButton
            text={messageBody || ''}
            variant="badge"
          />
          {urgencyBadge && (
            <span className="text-xs font-bold uppercase text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              {urgencyBadge}
            </span>
          )}
        </div>
      </div>

      {/* SMS Chat Bubble */}
      <div className="bg-slate-100 rounded-2xl p-4 text-sm sm:text-base text-slate-800 leading-relaxed border border-slate-200">
        <p className="whitespace-pre-line">{messageBody}</p>
        <div className="mt-2 text-right">
          <span className="text-xs text-slate-500">10:42 AM • Mesej Teks</span>
        </div>
      </div>
    </div>
  );
};
