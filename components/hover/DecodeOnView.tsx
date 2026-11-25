"use client";

import { useEffect, useRef, useState } from "react";
import { isFxOff } from "@/lib/fx";
import { ScrambleText } from "./ScrambleText";

const REDUCED = "(prefers-reduced-motion: reduce)";

/**
 * Mono label that decodes from random glyphs the first time it scrolls into
 * view. Server render and no-JS show the real text; reduced motion skips it.
 */
export function DecodeOnView({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia(REDUCED).matches || isFxOff()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRun(1);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref}>
      <ScrambleText text={text} run={run} duration={700} />
    </span>
  );
}
