export const OFFICETHON_FUNDRAISE_START_ISO =
  "2026-04-19T14:30:00+02:00" as const;
export const OFFICETHON_FUNDRAISE_END_ISO =
  "2026-04-21T12:18:20.788708+00:00" as const;

const START_MS = Date.parse(OFFICETHON_FUNDRAISE_START_ISO);
const END_MS = Date.parse(OFFICETHON_FUNDRAISE_END_ISO);

/** Start (Europe/Berlin wall time) through end (UTC), for display under the timer. */
export const OFFICETHON_FUNDRAISE_TIME_RANGE = (() => {
  const start = new Date(OFFICETHON_FUNDRAISE_START_ISO);
  const end = new Date(OFFICETHON_FUNDRAISE_END_ISO);
  const dateTime = {
    day: "2-digit" as const,
    month: "2-digit" as const,
    hour: "2-digit" as const,
    minute: "2-digit" as const,
  };
  const dateTimeSec = { ...dateTime, second: "2-digit" as const };
  const startStr = new Intl.DateTimeFormat("de-DE", {
    ...dateTime,
    timeZone: "Europe/Berlin",
  })
    .format(start)
    .replace(", ", " · ");
  const endStr =
    new Intl.DateTimeFormat("de-DE", {
      ...dateTimeSec,
      timeZone: "UTC",
    })
      .format(end)
      .replace(", ", " · ") + " UTC";
  return `${startStr} – ${endStr}`;
})();

const ELAPSED_MS = Math.max(0, END_MS - START_MS);

function format(diffMs: number) {
  const total = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

const PARTS = format(ELAPSED_MS);

export function OfficethonTimer({ compact = false }: { compact?: boolean }) {
  const numCls = compact
    ? "text-lg font-medium tracking-[-0.02em] tabular-nums"
    : "text-2xl font-medium tracking-[-0.02em] tabular-nums sm:text-3xl";
  const labelCls = compact
    ? "text-[9px] uppercase tracking-[0.22em] text-muted"
    : "text-[11px] uppercase tracking-[0.22em] text-muted";
  const gap = compact ? "gap-2" : "gap-3";

  return (
    <div className={`flex items-baseline ${gap} font-mono text-fg`}>
      <Segment value={PARTS.days} label="d" numCls={numCls} labelCls={labelCls} />
      <Segment value={PARTS.hours} label="h" pad numCls={numCls} labelCls={labelCls} />
      <Segment value={PARTS.minutes} label="m" pad numCls={numCls} labelCls={labelCls} />
      <Segment value={PARTS.seconds} label="s" pad numCls={numCls} labelCls={labelCls} />
    </div>
  );
}

function Segment({
  value,
  label,
  pad,
  numCls,
  labelCls,
}: {
  value: number;
  label: string;
  pad?: boolean;
  numCls: string;
  labelCls: string;
}) {
  const display = pad ? String(value).padStart(2, "0") : String(value);
  return (
    <span className="flex items-baseline gap-1">
      <span className={numCls}>{display}</span>
      <span className={labelCls}>{label}</span>
    </span>
  );
}
