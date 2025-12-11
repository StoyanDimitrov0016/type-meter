import { Char, CharState } from "@/char-types";
import { cn } from "@/lib/utils";

const CHAR_STYLES = {
  correct: "text-emerald-500",
  incorrect: "text-red-500",
  upcoming: "text-zinc-500",
} as const satisfies Record<CharState, string>;

interface PromptViewProps {
  chars: Char[];
  cursor: number;
}

export default function PromptView({ chars, cursor }: PromptViewProps) {
  return (
    <p className="mb-4 rounded-lg bg-zinc-100 px-4 py-3 text-lg leading-relaxed font-mono text-zinc-900 dark:bg-zinc-900 dark:text-zinc-100 whitespace-pre-wrap wrap-break-word">
      {chars.map((char, index) => (
        <span key={index} className={cn(CHAR_STYLES[char.state], index === cursor && "underline")}>
          {char.text}
        </span>
      ))}
    </p>
  );
}
