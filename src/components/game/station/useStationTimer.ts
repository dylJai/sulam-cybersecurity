'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface StationTimerState {
  timeLeft: number;
  isRunning: boolean;
  isCritical: boolean;
  formatted: string;
  start: () => void;
  pause: () => void;
  reset: (newSeconds?: number) => void;
}

/**
 * useStationTimer
 * 
 * Reusable countdown timer for station workshops (default 7 minutes / 420 seconds).
 * Turns critical when timeLeft <= 60s and triggers onExpire when it reaches 0.
 */
export function useStationTimer(
  totalSeconds: number = 420,
  onExpire?: () => void
): StationTimerState {
  const [timeLeft, setTimeLeft] = useState<number>(totalSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      onExpireRef.current?.();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const start = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const reset = useCallback(
    (newSeconds?: number) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsRunning(false);
      setTimeLeft(typeof newSeconds === 'number' ? newSeconds : totalSeconds);
    },
    [totalSeconds]
  );

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  const isCritical = timeLeft <= 60 && timeLeft > 0;

  return {
    timeLeft,
    isRunning,
    isCritical,
    formatted,
    start,
    pause,
    reset
  };
}
