import React from 'react';
import { Smartphone, Mail, AlertTriangle, Paperclip, Clock, ShieldAlert } from 'lucide-react';

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
      <div className="w-full rounded-2xl border border-slate-700/80 bg-slate-900/95 overflow-hidden shadow-xl text-left">
        {/* Email App Header Bar */}
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              Peti Masuk Emel (Mock Inbox)
            </span>
          </div>
          {urgencyBadge && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-300 bg-rose-950/80 border border-rose-800/80 px-2.5 py-0.5 rounded-full">
              <AlertTriangle className="w-3 h-3 text-rose-400" />
              {urgencyBadge}
            </span>
          )}
        </div>

        {/* Email Metadata */}
        <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
            <span className="font-semibold text-slate-400 w-16">Daripada:</span>
            <span className="font-mono text-cyan-300 font-medium break-all bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">
              {sender}
            </span>
          </div>
          {subject && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 text-xs">
              <span className="font-semibold text-slate-400 w-16">Perkara:</span>
              <span className="font-bold text-slate-100 text-sm">{subject}</span>
            </div>
          )}
        </div>

        {/* Email Body */}
        <div className="p-5 sm:p-6 text-sm text-slate-200 leading-relaxed whitespace-pre-line bg-slate-900">
          {messageBody}

          {/* Attachment Preview if present */}
          {attachmentName && (
            <div className="mt-5 p-3.5 rounded-xl border border-rose-800/60 bg-rose-950/30 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-900/60 text-rose-300 flex items-center justify-center">
                  <Paperclip className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-rose-200">{attachmentName}</div>
                  <div className="text-[11px] text-rose-400 flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Fail Pemasangan Android Berbahaya (.apk)
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded bg-rose-900/80 text-rose-200 border border-rose-700">
                Jangan Muat Turun
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Realistic SMS view
  return (
    <div className="w-full max-w-xl mx-auto rounded-3xl border-2 border-slate-700 bg-slate-950 p-3 sm:p-4 shadow-2xl">
      {/* Phone Mock Speaker & Camera */}
      <div className="flex justify-center mb-3">
        <div className="w-20 h-4 bg-slate-800 rounded-full flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-950" />
          <div className="w-8 h-1 bg-slate-900 rounded-full" />
        </div>
      </div>

      {/* SMS Header */}
      <div className="bg-slate-900/90 rounded-2xl p-3 border border-slate-800 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center font-bold text-xs border border-slate-700">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>{sender || 'Unknown Sender'}</span>
            </div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Hari ini • SMS Masuk</span>
            </div>
          </div>
        </div>
        {urgencyBadge && (
          <span className="text-[10px] font-semibold text-rose-300 bg-rose-950/70 border border-rose-800 px-2 py-0.5 rounded-full">
            {urgencyBadge}
          </span>
        )}
      </div>

      {/* SMS Message Bubble */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-sm p-4 text-sm text-slate-100 leading-relaxed shadow-inner">
        <p className="whitespace-pre-line">{messageBody}</p>
        <div className="mt-2 text-right">
          <span className="text-[10px] text-slate-400">10:42 AM • Diterima</span>
        </div>
      </div>
    </div>
  );
};
