"use client";

import { useEffect, useState } from "react";

const START_MS = Date.parse("2026-04-19T13:00:00+02:00");

function format(diffMs: number) {
  const total = Math.max(0, Math.floor(diffMs / 1000));
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return { days, hours, minutes, seconds };
}

export function OfficethonTimer() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : format(now - START_MS);

  return (
    <div className="flex items-baseline gap-3 font-mono text-fg">
      {parts === null ? (
        <span className="text-2xl tracking-[-0.02em] text-muted sm:text-3xl">
          --d --:--:--
        </span>
      ) : (
        <>
          <Segment value={parts.days} label="d" />
          <Segment value={parts.hours} label="h" pad />
          <Segment value={parts.minutes} label="m" pad />
          <Segment value={parts.seconds} label="s" pad />
        </>
      )}
    </div>
  );
}

function Segment({
  value,
  label,
  pad,
}: {
  value: number;
  label: string;
  pad?: boolean;
}) {
  const display = pad ? String(value).padStart(2, "0") : String(value);
  return (
    <span className="flex items-baseline gap-1">
      <span className="text-2xl font-medium tracking-[-0.02em] tabular-nums sm:text-3xl">
        {display}
      </span>
      <span className="text-[11px] uppercase tracking-[0.22em] text-muted">
        {label}
      </span>
    </span>
  );
}
