"use client";

import { useState, useRef, useEffect } from "react";

interface TimerProps {
  initialSeconds: number;
  onFinish: () => void;
  isRunning: boolean;
}

export default function Timer({ initialSeconds, onFinish, isRunning }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          // stop at 0
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning) return;
    if (remainingSeconds === 0) {
      onFinish();
    }
  }, [remainingSeconds, isRunning, onFinish]);

  const suffix = remainingSeconds === 1 ? "second" : "seconds";
  const label = `${suffix.toUpperCase()} LEFT`;

  return (
    <div className="flex items-center gap-3 text-xs font-medium text-zinc-500 dark:text-zinc-300">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-base font-semibold text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50">
        {remainingSeconds}
      </div>
      <span className="tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}
