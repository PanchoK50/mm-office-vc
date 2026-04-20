"use client";

import { useEffect, useState } from "react";

export function HeaderReserveButton() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const base =
    "inline-flex h-12 items-center justify-center rounded-md px-6 text-sm font-semibold tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg";
  const idle =
    "border border-hairline-strong bg-surface text-fg hover:border-accent hover:text-accent";
  const active =
    "bg-accent text-[#0b0b0f] hover:brightness-110";

  return (
    <a href="#reserve" className={`${base} ${scrolled ? active : idle}`}>
      Secure a space
    </a>
  );
}
