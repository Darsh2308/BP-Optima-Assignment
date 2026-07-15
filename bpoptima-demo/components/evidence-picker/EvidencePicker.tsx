import { CATEGORY_LABELS, formatFieldPreview } from "@/lib/decision-presentation";
import type { EvidenceItem } from "@/types/domain";

interface EvidencePickerProps {
  items: EvidenceItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

export function EvidencePicker({ items, selectedId, onSelect, disabled }: EvidencePickerProps) {
  const categories = Array.from(new Set(items.map((item) => item.category)));

  return (
    <div className="flex flex-col gap-7">
      {categories.map((category) => (
        <div key={category} className="flex flex-col gap-2.5">
          <h2 className="text-muted text-[11px] font-semibold tracking-widest uppercase">
            {CATEGORY_LABELS[category]}
          </h2>
          <div className="flex flex-col gap-2">
            {items
              .filter((item) => item.category === category)
              .map((item) => {
                const isSelected = item.id === selectedId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => onSelect(item.id)}
                    aria-pressed={isSelected}
                    className={`group focus-visible:ring-primary relative flex flex-col gap-1.5 rounded-lg border px-4 py-3 text-left transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
                      isSelected
                        ? "border-primary/60 bg-primary/10 shadow-[0_0_0_1px_rgba(56,163,198,0.25)]"
                        : "border-hairline bg-surface/40 hover:border-hairline-strong hover:bg-surface"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-foreground text-sm font-medium">{item.label}</span>
                      <span
                        className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
                          isSelected ? "bg-primary" : "bg-hairline-strong group-hover:bg-faint"
                        }`}
                      />
                    </div>
                    <span className="text-muted text-xs">{item.description}</span>
                    <span className="text-muted mt-0.5 font-mono text-[11px]">
                      {formatFieldPreview(item)}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
