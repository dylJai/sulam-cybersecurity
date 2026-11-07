'use client';

import React from 'react';
import { Info, AlertTriangle, Zap } from 'lucide-react';

export interface InfoBannerProps {
  variant?: 'blue' | 'rose' | 'amber';
  title?: string;
  description: string;
  badgeText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const InfoBanner: React.FC<InfoBannerProps> = ({
  variant = 'blue',
  title,
  description,
  badgeText,
  icon,
  className = ''
}) => {
  const styles = {
    blue: {
      wrapper: 'bg-blue-50 border-blue-200 text-blue-950',
      icon: 'text-blue-600',
      badge: 'bg-blue-100 text-blue-800 border-blue-300',
      defaultIcon: <Zap className="w-5 h-5" />
    },
    rose: {
      wrapper: 'bg-rose-50 border-rose-300 text-rose-950',
      icon: 'text-rose-600',
      badge: 'bg-rose-200 text-rose-900 border-rose-400',
      defaultIcon: <AlertTriangle className="w-5 h-5" />
    },
    amber: {
      wrapper: 'bg-amber-50 border-amber-300 text-amber-950',
      icon: 'text-amber-600',
      badge: 'bg-amber-200 text-amber-900 border-amber-400',
      defaultIcon: <AlertTriangle className="w-5 h-5" />
    }
  }[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      className={`p-4 sm:p-5 rounded-2xl border-2 space-y-1.5 transition-all ${styles.wrapper} ${className}`}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-lg sm:text-xl font-black flex items-center gap-2">
          <span className={`shrink-0 ${styles.icon}`}>
            {icon || styles.defaultIcon}
          </span>
          {title && <span>{title}</span>}
        </h3>
        {badgeText && (
          <span
            className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full border ${styles.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <p className="text-base font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
};
