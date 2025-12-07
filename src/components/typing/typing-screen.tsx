"use client";

import { useCallback, useState } from "react";
import Timer from "./timer";
import { getWordlist } from "@/lib/wordlist";
import { cn } from "@/lib/utils";

type CharState = "correct" | "incorrect" | "upcoming";
type Char = { text: string; state: CharState };

type GameState = "idle" | "running" | "finished";
type GameEvent = "start" | "time-up" | "reset";

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

  const [input, setInput] = useState("");

  const onReset = () => {
    setSequence(buildSequence(getWordlist(initialWordlist.length)));
    setGameState((prev) => nextGameState(prev, "reset"));
    setInput("");
  };

  const onFinish = useCallback(() => {
    setGameState((prev) => nextGameState(prev, "time-up"));
  }, []);

  return (
    <section className="flex flex-col gap-6">
      <section>
        {gameState === "running" && <Timer initialSeconds={initialSeconds} onFinish={onFinish} />}
        {gameState === "finished" && <button onClick={onReset}>Next challenge</button>}
      </section>

      <p className="mb-4 rounded-lg bg-zinc-100 px-4 py-3 text-lg leading-relaxed font-mono text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 whitespace-pre-wrap break-words">
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
        <textarea
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 font-mono text-zinc-900 outline-none focus:border-zinc-500 focus:ring-2 focus:ring-zinc-200 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
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
          disabled={gameState === "finished"}
          rows={5}
          autoComplete="off"
        ></textarea>
      </form>
    </section>
  );
}
