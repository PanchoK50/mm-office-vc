"use client";

import { useEffect, useState } from "react";

export type OfficeDonationView = {
  id: number;
  donor_name: string;
  amount: number;
  generation: string | null;
  created_at: string;
};

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
    <ul className="mt-4 divide-y divide-hairline">
      {donations.map((d, i) => (
        <li
          key={d.id}
          className="fade-in-up flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="min-w-0">
            <p className="truncate text-[14px] font-medium leading-tight text-fg">
              {d.donor_name || "Anonym"}
              {d.generation ? (
                <span className="ml-1.5 font-mono text-[11px] font-normal text-muted">
                  · {d.generation}
                </span>
              ) : null}
            </p>
            <p className="mt-0.5 text-[11px] text-muted tabular-nums">
              {now ? formatTimeAgo(d.created_at, now) : "\u00a0"}
            </p>
          </div>
          <span className="font-mono text-[15px] font-medium tabular-nums text-accent">
            €{d.amount.toLocaleString("de-DE")}
          </span>
        </li>
      ))}
    </ul>
  );
}
