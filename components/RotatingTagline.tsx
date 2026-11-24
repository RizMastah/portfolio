"use client";

import { useEffect, useState } from "react";

/** Cycles through taglines every 2.5 s. Static under reduced motion. */
export function RotatingTagline({ items }: { items: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 2500);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    // Brackets sit inside the animated box so they stay attached to the text when it wraps.
    <span key={index} className="tagline-enter inline-block">
      [{items[index]}]
    </span>
  );
}
