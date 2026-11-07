'use client';

import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, icon, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`min-h-[56px] px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden ${className}`}
        {...props}
      >
        <span>{children}</span>
        {icon && <span className="shrink-0">{icon}</span>}
      </button>
    );
  }
);
PrimaryButton.displayName = 'PrimaryButton';

export const SecondaryButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, icon, className = '', disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`min-h-[52px] px-6 py-3 rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden ${className}`}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
    );
  }
);
SecondaryButton.displayName = 'SecondaryButton';
