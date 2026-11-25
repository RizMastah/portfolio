"use client";

import { useSyncExternalStore } from "react";
import { FX_EVENT, isFxOff } from "@/lib/fx";

// Hover effects run only for a precise pointer that can hover, never under reduced
// motion, and not when the visitor switched effects off (FX toggle).
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  window.addEventListener(FX_EVENT, onChange);
  return () => {
    mq.removeEventListener("change", onChange);
    window.removeEventListener(FX_EVENT, onChange);
  };
}

export function useRichHover() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches && !isFxOff(),
    () => false,
  );
}
