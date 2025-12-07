"use client";

import { useCallback, useState } from "react";
import Timer from "./timer";
import { getWordlist } from "@/lib/wordlist";
import { cn } from "@/lib/utils";
import StatisticsPanel from "./statistics-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export type CharState = "correct" | "incorrect" | "upcoming";
export type Char = { text: string; state: CharState };

export type GameState = "idle" | "running" | "finished";
export type GameEvent = "start" | "time-up" | "reset";

function nextGameState(state: GameState, event: GameEvent): GameState {
  switch (state) {
    case "idle":
      if (event === "start") return "running";
      return state;

    case "running":
      if (event === "time-up") return "finished";
      if (event === "reset") return "idle";
      return state;

    case "finished":
      if (event === "reset") return "idle";
      return state;
  }
}
const CHAR_STYLES = {
  correct: "text-emerald-500",
  incorrect: "text-red-500",
  upcoming: "text-zinc-500",
} as const satisfies Record<CharState, string>;

function buildSequence(wordlist: string[]): Char[] {
  return wordlist
    .join(" ")
    .split("")
    .map((letter) => ({ text: letter, state: "upcoming" }));
}

interface TypingScreenProps {
  initialSeconds: number;
  initialWordlist: string[];
}

export default function TypingScreen({ initialSeconds, initialWordlist }: TypingScreenProps) {
  const [sequence, setSequence] = useState(() => buildSequence(initialWordlist));
  const [gameState, setGameState] = useState<GameState>("idle");
  const [runId, setRunId] = useState(0);
  const [input, setInput] = useState("");

  const onReset = () => {
    setSequence(buildSequence(getWordlist(initialWordlist.length)));
    setGameState((prev) => nextGameState(prev, "reset"));
    setInput("");
    setRunId((prev) => prev + 1);
  };

  const onFinish = useCallback(() => {
    setGameState((prev) => nextGameState(prev, "time-up"));
  }, []);

  const isRunning = gameState === "running";
  const isFinished = gameState === "finished";

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Timer
          key={runId}
          initialSeconds={initialSeconds}
          onFinish={onFinish}
          isRunning={isRunning}
        />
        {isFinished && (
          <Button onClick={onReset} size="sm" variant="default">
            Next challenge
          </Button>
        )}
      </div>

      <p className="mb-4 rounded-lg bg-zinc-100 px-4 py-3 text-lg leading-relaxed font-mono text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
        {sequence.map(({ text, state }, index) => (
          <span
            key={index}
            className={cn(CHAR_STYLES[state], index === input.length && "underline")}
          >
            {text}
          </span>
        ))}
      </p>

      <form>
        <Textarea
          className="font-mono"
          value={input}
          onChange={(event) => {
            const value = event.target.value;

            setInput(value);

            setGameState((prev) =>
              prev === "idle" && value.length > 0 ? nextGameState(prev, "start") : prev
            );

            setSequence((prev) =>
              prev.map((char, index) => {
                const current = value[index];
                let state: CharState;

                if (current === char.text) {
                  state = "correct";
                } else if (index < value.length) {
                  state = "incorrect";
                } else {
                  state = "upcoming";
                }

                return { ...char, state };
              })
            );
          }}
          disabled={isFinished}
          rows={5}
          autoComplete="off"
        />
      </form>
      {gameState === "finished" && (
        <StatisticsPanel sequence={sequence} input={input} seconds={initialSeconds} />
      )}
    </section>
  );
}
