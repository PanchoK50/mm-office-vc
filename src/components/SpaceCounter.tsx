import { SPACES_TOTAL } from "@/content/data";

export type SpotStatus = "open" | "reserved" | "confirmed";

export type Spot = {
  status: SpotStatus;
  fundName: string | null;
};

export function SpaceCounter({
  spots,
  total = SPACES_TOTAL,
  compact = false,
}: {
  spots?: Spot[];
  total?: number;
  compact?: boolean;
}) {
  const slots: Spot[] =
    spots ??
    Array.from({ length: total }, () => ({ status: "open", fundName: null }));
  const remaining = slots.filter((s) => s.status === "open").length;

  return (
    <div className={compact ? "space-y-3" : "space-y-5"}>
      <div
        className={`grid gap-2 ${compact ? "grid-cols-4" : "grid-cols-2 sm:grid-cols-4"}`}
        role="list"
        aria-label={`${remaining} of ${slots.length} spaces remaining`}
      >
        {slots.map((spot, i) => {
          const showFundOnly = spot.status === "reserved" && spot.fundName;
          return (
            <div
              key={i}
              role="listitem"
              aria-label={`Space ${i + 1} ${statusLabel(spot.status).toLowerCase()}${spot.fundName ? ` — ${spot.fundName}` : ""}`}
              className={`relative flex aspect-[4/3] flex-col items-center justify-center gap-1 rounded-lg border p-2 text-center ${statusStyle(spot.status)}`}
            >
              {showFundOnly ? (
                <span
                  className="line-clamp-3 max-w-full break-words text-[12px] font-medium leading-tight text-fg"
                  title={spot.fundName!}
                >
                  {spot.fundName}
                </span>
              ) : (
                <>
                  <span
                    className={`font-mono text-[10px] uppercase tracking-[0.18em] ${statusColor(spot.status)}`}
                  >
                    {statusLabel(spot.status)}
                  </span>
                  {spot.status === "confirmed" && spot.fundName ? (
                    <span
                      className="line-clamp-2 max-w-full break-words text-[11px] font-medium leading-tight text-fg"
                      title={spot.fundName}
                    >
                      {spot.fundName}
                    </span>
                  ) : null}
                </>
              )}
            </div>
          );
        })}
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
      return "border-blue-500/40 bg-blue-500/10";
    default:
      return "border-hairline bg-surface-2/40";
  }
}

function statusColor(s: SpotStatus) {
  switch (s) {
    case "confirmed":
      return "text-accent";
    case "reserved":
      return "text-blue-400";
    default:
      return "text-muted/70";
  }
}
