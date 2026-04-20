import { SPACES_FILLED, SPACES_TOTAL } from "@/content/data";

export function SpaceCounter({
  filled = SPACES_FILLED,
  total = SPACES_TOTAL,
  compact = false,
}: {
  filled?: number;
  total?: number;
  compact?: boolean;
}) {
  const remaining = total - filled;
  const slots = Array.from({ length: total }, (_, i) => i < filled);

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Spaces
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          {remaining} of {total} remaining
        </span>
      </div>
      <div
        className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}
        role="list"
        aria-label={`${remaining} of ${total} spaces remaining`}
      >
        {slots.map((isFilled, i) => (
          <div
            key={i}
            role="listitem"
            aria-label={isFilled ? `Space ${i + 1} taken` : `Space ${i + 1} available`}
            className={
              isFilled
                ? "relative flex aspect-[4/3] items-end justify-start rounded-lg border border-accent/30 bg-accent/10 p-3"
                : "relative flex aspect-[4/3] items-end justify-start rounded-lg border border-hairline bg-surface-2/40 p-3"
            }
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] ${
                isFilled ? "text-accent" : "text-muted/70"
              }`}
            >
              {isFilled ? "Taken" : "Open"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
