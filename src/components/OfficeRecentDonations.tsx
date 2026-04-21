"use client";

import { useEffect, useState } from "react";

const GREEN = "#34d399";

export type OfficeDonationView = {
  id: number;
  donor_name: string;
  amount: number;
  generation: string | null;
  created_at: string;
};

function formatEUR(n: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
  }).format(n);
}

function formatTimeAgo(iso: string, now: Date): string {
  const then = new Date(iso).getTime();
  const diffSec = Math.max(0, Math.floor((now.getTime() - then) / 1000));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  const diffWk = Math.floor(diffDay / 7);
  if (diffWk < 5) return `${diffWk}w ago`;
  const diffMo = Math.floor(diffDay / 30);
  if (diffMo < 12) return `${diffMo}mo ago`;
  return `${Math.floor(diffDay / 365)}y ago`;
}

export function OfficeRecentDonations({
  donations,
}: {
  donations: OfficeDonationView[];
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            style={{ backgroundColor: GREEN }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: GREEN }}
          />
        </span>
        <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
          Live donations
        </h4>
      </div>

      {donations.length === 0 ? (
        <p className="text-xs text-muted">No donations yet. Be the first.</p>
      ) : (
        <ul className="space-y-2">
          {donations.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium leading-tight text-fg">
                  {d.donor_name || "Anonym"}
                  {d.generation && (
                    <span className="ml-1.5 text-[11px] font-normal text-muted">
                      · {d.generation}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 text-[11px] text-muted">
                  {now ? formatTimeAgo(d.created_at, now) : "\u00a0"}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-fg">
                {d.amount === 0 ? "? €" : formatEUR(d.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
