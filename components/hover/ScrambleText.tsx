"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/\\_-=+*#%$&";

/**
 * Text that decodes from random glyphs into its real value each time `run`
 * changes. Screen readers always get the real text.
 */
export function ScrambleText({
  text,
  run,
  duration = 520,
}: {
  text: string;
  run: number;
  duration?: number;
}) {
  const [shown, setShown] = useState(text);
  const frame = useRef(0);

  useEffect(() => {
    if (run === 0) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const revealed = Math.floor(t * text.length);
      setShown(
        text
          .split("")
          .map((ch, i) =>
            i < revealed || ch === " " ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)],
          )
          .join(""),
      );
      if (t < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
  }, [run, text, duration]);

  return (
    <>
      <span aria-hidden>{shown}</span>
      <span className="sr-only">{text}</span>
    </>
  );
}
