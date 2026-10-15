import React from 'react';
import { Paperclip, AlertTriangle } from 'lucide-react';

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
      <div className="w-full rounded-sm border border-[#171914]/20 bg-white shadow-xs text-left overflow-hidden">
        {/* Email Window Header */}
        <div className="bg-[#ECEAE2] px-4 py-2.5 border-b border-[#171914]/15 flex items-center justify-between font-mono text-xs text-[#575953]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#171914]/30" />
            <span className="font-semibold text-[#171914] uppercase tracking-wider text-[11px]">
              Simulasi Mesej Emel
            </span>
          </div>
          {urgencyBadge && (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2 py-0.5 rounded-xs border border-[#8A241C]/20">
              <AlertTriangle className="w-3 h-3" />
              {urgencyBadge}
            </span>
          )}
        </div>

        {/* Email Metadata Grid */}
        <div className="p-4 border-b border-[#171914]/10 bg-[#FAF9F5] space-y-1.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
            <span className="font-mono uppercase text-[#7C7E77] text-[10px] w-20 shrink-0">Daripada:</span>
            <span className="font-mono text-[#171914] font-medium break-all bg-white px-2 py-0.5 border border-[#171914]/10 rounded-xs">
              {sender}
            </span>
          </div>
          {subject && (
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
              <span className="font-mono uppercase text-[#7C7E77] text-[10px] w-20 shrink-0">Perkara:</span>
              <span className="font-semibold text-[#171914]">{subject}</span>
            </div>
          )}
        </div>

        {/* Email Body */}
        <div className="p-5 sm:p-6 text-sm text-[#171914] leading-relaxed whitespace-pre-line bg-white">
          {messageBody}

          {/* Attachment Preview if present */}
          {attachmentName && (
            <div className="mt-5 p-3 rounded-sm border border-[#8A241C]/30 bg-[#FDF5F4] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xs bg-[#FCE8E6] text-[#8A241C] flex items-center justify-center shrink-0">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-mono font-bold text-[#8A241C]">{attachmentName}</div>
                  <div className="text-[11px] text-[#575953]">
                    Fail Aplikasi Android Tidak Dikenali (.apk)
                  </div>
                </div>
              </div>
              <span className="text-[11px] font-mono font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2.5 py-1 rounded-xs border border-[#8A241C]/30 self-start sm:self-center">
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
    <div className="w-full max-w-lg mx-auto rounded-sm border border-[#171914]/20 bg-white p-4 shadow-xs">
      {/* Top Bar */}
      <div className="pb-3 mb-3 border-b border-[#171914]/10 flex items-center justify-between text-xs">
        <div>
          <span className="font-mono uppercase text-[10px] text-[#7C7E77] block">Pengirim SMS</span>
          <span className="font-bold text-[#171914]">{sender || 'Nombor Tidak Dikenali'}</span>
        </div>
        {urgencyBadge && (
          <span className="text-[10px] font-mono font-bold uppercase text-[#8A241C] bg-[#FCE8E6] px-2 py-0.5 rounded-xs border border-[#8A241C]/20">
            {urgencyBadge}
          </span>
        )}
      </div>

      {/* SMS Chat Bubble */}
      <div className="bg-[#ECEAE2] border border-[#171914]/10 rounded-sm p-4 text-sm text-[#171914] leading-relaxed">
        <p className="whitespace-pre-line">{messageBody}</p>
        <div className="mt-2 text-right">
          <span className="font-mono text-[10px] text-[#7C7E77]">10:42 AM • Mesej Teks</span>
        </div>
      </div>
    </div>
  );
};
