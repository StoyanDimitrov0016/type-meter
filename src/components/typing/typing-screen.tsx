"use client";

import { useCallback, useState } from "react";
import Timer from "./timer";
import { getWordlist } from "@/lib/wordlist";
import StatisticsPanel from "./statistics-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DurationSelector } from "../duration-selector";
import PromptView from "./prompt-view";
import { Character } from "@/character.types";

export type GameState = "idle" | "running" | "finished";
export type GameEvent = "start" | "time-up" | "reset";

export const DURATIONS = [15, 30, 60, 120] as const;
export type Duration = (typeof DURATIONS)[number];

const WORDS_BUFFER = 5;

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

function buildSequence(wordlist: string[]): Character[] {
  return wordlist
    .join(" ")
    .split("")
    .map((letter) => ({ text: letter, state: "upcoming" }));
}

// TODO: can validate from the cursor position until the end
// I can't validate only the actual cursor because the user can press backspace and I have to set the deleted char to upcoming
function validateSequence(sequence: Character[], input: string) {
  for (let i = 0; i < sequence.length; i++) {
    if (i >= input.length) {
      sequence[i].state = "upcoming";
      continue;
    }

    if (sequence[i].text === input[i]) {
      sequence[i].state = "correct";
    } else {
      sequence[i].state = "incorrect";
    }
  }

  return sequence;
}

interface TypingScreenProps {
  initialSeconds: number;
  initialWordlist: string[];
}

export default function TypingScreen({ initialSeconds, initialWordlist }: TypingScreenProps) {
  const [wordlist, setWordlist] = useState(initialWordlist);
  const [sequence, setSequence] = useState(() => buildSequence(initialWordlist));
  const [gameState, setGameState] = useState<GameState>("idle");
  const [runId, setRunId] = useState(0);
  const [input, setInput] = useState("");
  const [duration, setDuration] = useState<Duration>(initialSeconds as Duration);

  const onReset = () => {
    const newWordlist = getWordlist(initialWordlist.length);
    setWordlist(newWordlist);
    setSequence(buildSequence(newWordlist));
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
      <div className="flex items-center justify-between gap-4">
        <Timer key={runId} initialSeconds={duration} onFinish={onFinish} isRunning={isRunning} />

        <div className="flex items-center gap-3">
          <DurationSelector
            options={DURATIONS}
            value={duration}
            onChange={(next) => {
              // Decide: changing time resets the test
              setDuration(next as Duration);

              const newWordlist = getWordlist(initialWordlist.length);
              setWordlist(newWordlist);
              setSequence(buildSequence(newWordlist));

              setInput("");
              setGameState("idle");
              setRunId((prev) => prev + 1); // restart timer with new duration
            }}
            disabled={isRunning} // optional: don’t allow change mid-run
          />

          {isFinished && (
            <Button
              onClick={onReset}
              className="rounded-md bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-50 hover:bg-zinc-800 active:bg-zinc-950"
            >
              Next challenge
            </Button>
          )}
        </div>
      </div>

      <PromptView chars={sequence} cursor={input.length} />

      <form>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          When you're ready, start typing the text above.
        </span>
        <Textarea
          className="font-mono"
          value={input}
          onChange={(event) => {
            const input = event.target.value;
            const cursor = input.length;

            const validated = validateSequence(sequence, input);

            if (cursor === validated.length) {
              // I am sliding the sequence instead of the wordlist and derive the sequence from it
              // Otherwise I don't know where the word ends and I can transfer half a word ot the next version

              // Fix statistics
              const nextWordlist = getWordlist(WORDS_BUFFER);
              const updatedWordlist = [...wordlist.slice(wordlist.length), ...nextWordlist];
              const nextSequence = buildSequence(updatedWordlist);

              setWordlist(updatedWordlist);
              setSequence(nextSequence);
              setInput("");
            } else {
              setSequence([...validated]);
              setInput(input);
            }

            setGameState((prev) =>
              prev === "idle" && input.length > 0 ? nextGameState(prev, "start") : prev
            );
          }}
          disabled={isFinished}
          rows={5}
          autoComplete="off"
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />
      </form>

      {gameState === "finished" && (
        <StatisticsPanel sequence={sequence} input={input} seconds={duration} />
      )}
    </section>
  );
}
