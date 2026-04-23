"use client";

import { useEffect, useState } from "react";

export function MobileStickyFooter({
  spotsAvailable,
}: {
  spotsAvailable: number;
}) {
  const [visible, setVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (isDesktop) return null;

  const hidden = !visible;
  const label =
    spotsAvailable === 0
      ? "All spots taken"
      : `${spotsAvailable} ${spotsAvailable === 1 ? "ticket" : "tickets"} left`;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 lg:hidden transition-transform duration-300 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div
        className="border-t border-black/10 bg-white px-5 py-3 shadow-[0_-4px_24px_-6px_rgba(0,0,0,0.15)]"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
      >
        <div className="mx-auto flex max-w-lg items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-medium text-[#0b0b0f]">
            <span
              aria-hidden="true"
              className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#00a2cc] shadow-[0_0_8px_2px_rgba(0,162,204,0.4)]"
            />
            {label}
          </span>

          <button
            type="button"
            disabled={spotsAvailable === 0}
            onClick={() =>
              window.dispatchEvent(new CustomEvent("open-reserve-dialog"))
            }
            className="shrink-0 rounded-md bg-[#00a2cc] px-4 py-2.5 text-sm font-semibold text-[#0b0b0f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {spotsAvailable === 0 ? "Sold out" : "Secure your access"}
          </button>
        </div>
      </div>
    </div>
  );
}
