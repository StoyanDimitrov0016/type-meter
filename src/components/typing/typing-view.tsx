"use client";

import { buildSequence, validateSequence } from "@/utils/sequence.utils";
import { getWords } from "@/utils/words.utils";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import PromptView from "./prompt-view";
import { Textarea } from "../ui/textarea";

const WORDS_COUNT = 5;

interface Progress {
  chars: {
    total: number;
    correct: number;
  };
  keystrokes: number;
  words: number;
}

const INITIAL_PROGRESS: Progress = {
  chars: { total: 0, correct: 0 },
  keystrokes: 0,
  words: 0,
} as const;

type ProgressSummary = Omit<Progress, "words">;

const INITIAL_PROGRESS_SUMMARY: ProgressSummary = {
  chars: { total: 0, correct: 0 },
  keystrokes: 0,
} as const;

interface TypingViewProps {
  wordsCount?: number;
}

export default function TypingView({ wordsCount = WORDS_COUNT }: TypingViewProps) {
  const [words, setWords] = useState(getWords(wordsCount));
  const [progress, setProgress] = useState(INITIAL_PROGRESS);
  const [sessionId, setSessionId] = useState<number>(0);

  const onNextWords = () => {
    setWords(getWords(wordsCount));
  };

  const onCommit = (summary: ProgressSummary) => {
    setProgress((prev) => ({
      chars: {
        total: prev.chars.total + summary.chars.total,
        correct: prev.chars.correct + summary.chars.correct,
      },
      keystrokes: prev.keystrokes + summary.keystrokes,
      words: prev.words + words.length,
    }));

    onNextWords();
    setSessionId((prev) => prev + 1);
  };

  return (
    <div>
      {sessionId <= 3 ? (
        <TypingBlock key={sessionId} words={words} onCommit={onCommit} />
      ) : (
        <span>Game end</span>
      )}
      <pre>{JSON.stringify(progress)}</pre>
    </div>
  );
}

interface TypingBlockProps {
  words: string[];
  onCommit: (summary: ProgressSummary) => void;
}

function TypingBlock({ words, onCommit }: TypingBlockProps) {
  const [sequence, setSequence] = useState(buildSequence(words));
  const [progress, setProgress] = useState<ProgressSummary>(INITIAL_PROGRESS_SUMMARY);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onInputClear = () => {
    setInput("");
  };

  const onFocus = () => {
    inputRef.current?.focus();
  };

  const onInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const written = event.target.value;
    const cursor = written.length;

    const validated = validateSequence(sequence, written);

    if (cursor >= sequence.length) {
      const correct = validated.reduce(
        (acc, { state }) => (state === "correct" ? acc + 1 : acc),
        0
      );

      const progressSummary: ProgressSummary = {
        ...progress,
        chars: { total: sequence.length, correct },
      };

      setProgress(INITIAL_PROGRESS_SUMMARY);
      onInputClear();
      onCommit(progressSummary);

      return;
    }

    setInput(written);
    setSequence(validated);
  };

  return (
    <div>
      <div className="relative" onClick={onFocus} onMouseDown={(e) => e.preventDefault()}>
        <PromptView chars={sequence} cursor={input.length} />

        <Textarea
          className="absolute inset-0 h-full w-full opacity-0 resize-none border-0 bg-transparent p-0"
          ref={inputRef}
          onChange={onInputChange}
          onKeyDown={(event) => {
            if (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter") {
              setProgress((prev) => ({ ...prev, keystrokes: prev.keystrokes + 1 }));
            }
          }}
          value={input}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onPaste={(e) => e.preventDefault()}
          onDrop={(e) => e.preventDefault()}
        />
      </div>
      <pre>{JSON.stringify(progress)}</pre>
    </div>
  );
}
