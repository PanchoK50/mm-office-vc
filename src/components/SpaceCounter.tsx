import { SPACES_TOTAL } from "@/content/data";

export type SpotStatus = "open" | "reserved" | "confirmed";

export function SpaceCounter({
  spots,
  total = SPACES_TOTAL,
  compact = false,
}: {
  spots?: SpotStatus[];
  total?: number;
  compact?: boolean;
}) {
  const slotStatuses: SpotStatus[] =
    spots ?? Array.from({ length: total }, () => "open");
  const remaining = slotStatuses.filter((s) => s === "open").length;

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
          Spaces
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          {remaining} of {slotStatuses.length} remaining
        </span>
      </div>
      <div
        className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}
        role="list"
        aria-label={`${remaining} of ${slotStatuses.length} spaces remaining`}
      >
        {slotStatuses.map((status, i) => (
          <div
            key={i}
            role="listitem"
            aria-label={`Space ${i + 1} ${statusLabel(status).toLowerCase()}`}
            className={`relative flex aspect-[4/3] items-end justify-start rounded-lg border p-3 ${statusStyle(status)}`}
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className={`absolute right-3 top-3 font-mono text-[10px] uppercase tracking-[0.18em] ${statusColor(status)}`}
            >
              {statusLabel(status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function statusLabel(s: SpotStatus) {
  switch (s) {
    case "confirmed":
      return "Sold";
    case "reserved":
      return "Reserved";
    default:
      return "Open";
  }
}

function statusStyle(s: SpotStatus) {
  switch (s) {
    case "confirmed":
      return "border-accent/30 bg-accent/10";
    case "reserved":
      return "border-amber-500/30 bg-amber-500/8";
    default:
      return "border-hairline bg-surface-2/40";
  }
}

function statusColor(s: SpotStatus) {
  switch (s) {
    case "confirmed":
      return "text-accent";
    case "reserved":
      return "text-amber-400";
    default:
      return "text-muted/70";
  }
}
