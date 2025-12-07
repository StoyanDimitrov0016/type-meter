import { Char } from "./typing-screen";

interface StatisticsPanelProps {
  sequence: Char[];
  input: string;
  seconds: number;
}

export default function StatisticsPanel({ sequence, input, seconds }: StatisticsPanelProps) {
  const correctChars = sequence.filter((c) => c.state === "correct").length;
  const incorrectChars = sequence.filter((c) => c.state === "incorrect").length;
  const typedChars = correctChars + incorrectChars;

  const accuracy = typedChars > 0 ? correctChars / typedChars : 0;
  const minutes = seconds / 60;
  const grossWpm = minutes > 0 ? input.length / 5 / minutes : 0;
  const netWpm = minutes > 0 ? Math.max(grossWpm - incorrectChars / minutes, 0) : 0;

  return (
    <div className="mt-2 flex w-full justify-between text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
      <div>
        <p className="font-medium">Accuracy</p>
        <p className="text-base font-semibold">{(accuracy * 100).toFixed(0)}%</p>
      </div>
      <div>
        <p className="font-medium">Gross WPM</p>
        <p className="text-base font-semibold">{grossWpm.toFixed(1)}</p>
      </div>
      <div>
        <p className="font-medium">Net WPM</p>
        <p className="text-base font-semibold">{netWpm.toFixed(1)}</p>
      </div>
    </div>
  );
}
