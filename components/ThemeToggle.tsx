"use client";

import { useSyncExternalStore } from "react";
import { THEME_KEY, type Theme, applyTheme } from "@/lib/theme";

const EVENT = "rab:theme-change";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

/** Footer switch between the two color modes; the choice is remembered. */
export function ThemeToggle() {
  // Server render and first paint use "dark"; the boot script already set the real value.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);
  const next: Theme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {}
        applyTheme(next);
        window.dispatchEvent(new Event(EVENT));
      }}
      className="label border-line text-muted hover:text-fg rounded-full border px-3 py-1.5 transition-colors"
    >
      {theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    </button>
  );
}
