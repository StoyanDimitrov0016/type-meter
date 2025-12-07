"use client";

import { useEffect, useState } from "react";

interface TimerProps {
  initialSeconds: number;
  onReset: () => void;
}

export default function Timer({ initialSeconds, onReset }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds]);

  const finished = seconds === 0;
  const suffix = seconds === 1 ? "second" : "seconds";

  const onResetClick = () => {
    setSeconds(initialSeconds);
    onReset();
  };

  return (
    <div>
      {finished ? (
        <div>
          <p>Countdown finished</p>
          <button onClick={onResetClick}>Reset countdown</button>
        </div>
      ) : (
        <div>
          <p>
            {seconds} {suffix} left
          </p>
        </div>
      )}
    </div>
  );
}
