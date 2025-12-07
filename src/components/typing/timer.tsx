"use client";

import { useState, useRef, useEffect } from "react";

interface TimerProps {
  initialSeconds: number;
  onFinish: () => void;
}

export default function Timer({ initialSeconds, onFinish }: TimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(initialSeconds);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (intervalRef.current !== null) {
            clearInterval(intervalRef.current);
          }
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [onFinish]);

  const suffix = remainingSeconds === 1 ? "second" : "seconds";

  return (
    <div className="inline-flex items-center gap-3 rounded-lg bg-zinc-100 px-3 py-2 text-sm text-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-300 bg-white text-base font-semibold dark:border-zinc-700 dark:bg-zinc-950">
        {remainingSeconds}
      </div>
      <span className="text-xs uppercase tracking-wide">{suffix} left</span>
    </div>
  );
}
