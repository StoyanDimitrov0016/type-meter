import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Timer as TimerIcon } from "lucide-react";

interface DurationSelectorProps {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DurationSelector({ options, value, onChange, disabled }: DurationSelectorProps) {
  return (
    <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-300">
      <div className="flex items-center gap-1">
        <TimerIcon className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline font-medium tracking-wide">Time</span>
      </div>

      <ToggleGroup
        type="single"
        value={String(value)}
        onValueChange={(val) => {
          if (!val || disabled) return;
          onChange(Number(val));
        }}
        disabled={disabled}
      >
        {options.map((opt) => (
          <ToggleGroupItem
            key={opt}
            value={String(opt)}
            className="h-7 px-2 text-[11px] sm:text-xs"
          >
            {opt}s
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
