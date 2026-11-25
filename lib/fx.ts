"use client";

import { useSyncExternalStore } from "react";
import { FX_EVENT, FX_KEY } from "./fx-boot";

export { FX_EVENT, FX_KEY };

/**
 * Visitor-controlled effects switch (status bar "FX" and the ⌘K palette).
 * Off adds `fx-off` to <html>; hover effects, the custom cursor, smooth scroll,
 * dust and decode animations all check it. Remembered in localStorage.
 */

export function isFxOff() {
  return typeof document !== "undefined" && document.documentElement.classList.contains("fx-off");
}

export function setFx(on: boolean) {
  document.documentElement.classList.toggle("fx-off", !on);
  try {
    localStorage.setItem(FX_KEY, on ? "on" : "off");
  } catch {}
  window.dispatchEvent(new Event(FX_EVENT));
}

function subscribe(cb: () => void) {
  window.addEventListener(FX_EVENT, cb);
  return () => window.removeEventListener(FX_EVENT, cb);
}

/** True while effects are switched on (server render: on). */
export function useFxOn() {
  return useSyncExternalStore(
    subscribe,
    () => !isFxOff(),
    () => true,
  );
}

