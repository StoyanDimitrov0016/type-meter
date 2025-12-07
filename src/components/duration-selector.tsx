import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface DurationSelectorProps {
  options: readonly number[];
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function DurationSelector({ options, value, onChange, disabled }: DurationSelectorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
      <span className="mr-1 hidden sm:inline">Time:</span>
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
