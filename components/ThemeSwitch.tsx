"use client";

import { useSyncExternalStore } from "react";
import { isFxOff } from "@/lib/fx";
import { THEME_KEY, type Theme, applyTheme } from "@/lib/theme";

const EVENT = "rab:theme-change";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function commit(theme: Theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {}
  applyTheme(theme);
  window.dispatchEvent(new Event(EVENT));
}

/**
 * Switch theme. With an origin point, the new theme spreads out from it as a
 * growing circle (View Transitions API); without support, reduced motion or
 * FX off, it switches instantly.
 */
export function switchTheme(theme: Theme, origin?: { x: number; y: number }) {
  if (theme === readTheme()) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!document.startViewTransition || reduce || isFxOff() || !origin) {
    commit(theme);
    return;
  }
  const root = document.documentElement;
  root.classList.add("theme-vt");
  const vt = document.startViewTransition(() => commit(theme));
  const r = Math.hypot(
    Math.max(origin.x, innerWidth - origin.x),
    Math.max(origin.y, innerHeight - origin.y),
  );
  vt.ready
    .then(() =>
      root.animate(
        {
          clipPath: [
            `circle(0px at ${origin.x}px ${origin.y}px)`,
            `circle(${r}px at ${origin.x}px ${origin.y}px)`,
          ],
        },
        {
          duration: 650,
          easing: "cubic-bezier(0.16, 1, 0.3, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      ),
    )
    .catch(() => {});
  vt.finished.finally(() => root.classList.remove("theme-vt"));
}

const Sun = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
);
const Moon = () => (
  <svg
    aria-hidden
    viewBox="0 0 24 24"
    className="size-3.5"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11Z" />
  </svg>
);

/** Header segmented switch: light | dark, with a sliding thumb. */
export function ThemeSwitch() {
  // Server render and first paint use "dark"; the boot script already set the real value.
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  const option = (value: Theme, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      role="radio"
      aria-checked={theme === value}
      aria-label={label}
      title={label}
      onClick={(e) => {
        const b = e.currentTarget.getBoundingClientRect();
        switchTheme(value, { x: b.left + b.width / 2, y: b.top + b.height / 2 });
      }}
      className={`relative z-10 grid size-7 place-items-center md:size-8 rounded-full transition-colors ${
        theme === value ? "text-bg" : "text-muted hover:text-fg"
      }`}
    >
      {icon}
    </button>
  );

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="border-line relative flex rounded-full border p-0.5"
    >
      <span
        aria-hidden
        className={`bg-fg absolute top-0.5 left-0.5 size-7 rounded-full md:size-8 transition-transform duration-300 ease-out ${
          theme === "dark" ? "translate-x-7 md:translate-x-8" : "translate-x-0"
        }`}
      />
      {option("light", "Light theme", <Sun />)}
      {option("dark", "Dark theme", <Moon />)}
    </div>
  );
}
