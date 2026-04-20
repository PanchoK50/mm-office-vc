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

export function OfficethonTimer({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const parts = now === null ? null : format(now - START_MS);
  const numCls = compact
    ? "text-lg font-medium tracking-[-0.02em] tabular-nums"
    : "text-2xl font-medium tracking-[-0.02em] tabular-nums sm:text-3xl";
  const labelCls = compact
    ? "text-[9px] uppercase tracking-[0.22em] text-muted"
    : "text-[11px] uppercase tracking-[0.22em] text-muted";
  const gap = compact ? "gap-2" : "gap-3";

  return (
    <div className={`flex items-baseline ${gap} font-mono text-fg`}>
      {parts === null ? (
        <span className={`${numCls} text-muted`}>--d --:--:--</span>
      ) : (
        <>
          <Segment value={parts.days} label="d" numCls={numCls} labelCls={labelCls} />
          <Segment value={parts.hours} label="h" pad numCls={numCls} labelCls={labelCls} />
          <Segment value={parts.minutes} label="m" pad numCls={numCls} labelCls={labelCls} />
          <Segment value={parts.seconds} label="s" pad numCls={numCls} labelCls={labelCls} />
        </>
      )}
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
