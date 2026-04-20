"use client";

import { useEffect, useState } from "react";

export function OfficeRaisedTotal({ amount }: { amount: number }) {
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const duration = 1100;
    let raf = 0;

    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setAnimated(Math.round(amount * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [amount]);

  return (
    <span className="text-[38px] font-medium leading-none tracking-[-0.03em] tabular-nums text-fg sm:text-[42px]">
      {animated.toLocaleString("de-DE")}
    </span>
  );
}
