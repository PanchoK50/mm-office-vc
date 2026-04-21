"use client";

import { useEffect, useState } from "react";
import { OfficethonTimer } from "@/components/OfficethonTimer";

const GREEN = "#00a2cc";
const TRACK = "#f3f4f6";

function formatEUR(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);
}

export function OfficeRaisedTotal({
  totalRaised,
  totalGoal,
}: {
  totalRaised: number;
  totalGoal: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const pct = Math.min(100, Math.round((totalRaised / totalGoal) * 100));

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Officethon
        </p>
        <a
          href="https://officethon.mm-app.de"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted transition hover:text-accent"
        >
          officethon.mm-app.de ↗
        </a>
      </div>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Total raised
          </p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-fg">
            {formatEUR(totalRaised)}
          </p>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
            Total needed
          </p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-fg">
            {formatEUR(totalGoal)}
          </p>
        </div>
      </div>

      <div
        className="relative mt-2.5 h-1.5 w-full overflow-hidden rounded-full"
        style={{ backgroundColor: TRACK }}
        aria-label={`${pct}% of total goal raised`}
      >
        <div
          className="h-full rounded-full transition-[width] duration-1000 ease-out"
          style={{
            width: mounted ? `${pct}%` : "0%",
            backgroundColor: GREEN,
          }}
        />
      </div>
      <p className="mt-1 text-right text-[10px] font-medium tabular-nums text-muted">
        {pct}%
      </p>

      <div className="mt-3 border-t border-hairline pt-3">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Live since 19.04. · 14:30
        </p>
        <div className="mt-2">
          <OfficethonTimer compact />
        </div>
      </div>
    </div>
  );
}
