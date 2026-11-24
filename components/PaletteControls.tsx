"use client";

import { useEffect, useState } from "react";
import { PALETTES, type PaletteId, nanjingHour, paletteForHour } from "@/lib/palette";
import { profile } from "@/content/profile";

const PALETTE_KEY = "rab:palette";
const THEME_KEY = "rab:theme";

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}
function write(key: string, value: string | null) {
  try {
    if (value == null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {}
}

function applyPalette(id: PaletteId) {
  document.documentElement.setAttribute("data-palette", id);
}
function applyTheme(theme: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", theme);
}

type State = { override: PaletteId | null; theme: "dark" | "light"; time: string };

function nanjingTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.location.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

/** Footer controls: time-of-day palette (auto by Nanjing hour or manual) + light/dark. */
export function PaletteControls() {
  const [state, setState] = useState<State | null>(null);

  useEffect(() => {
    const sync = () => {
      const override = read(PALETTE_KEY) as PaletteId | null;
      const theme = read(THEME_KEY) === "light" ? "light" : "dark";
      const active = override ?? paletteForHour(nanjingHour());
      applyPalette(active);
      applyTheme(theme);
      setState({ override, theme, time: nanjingTime() });
    };
    sync();
    const id = setInterval(sync, 60_000); // re-check every 60 s (reference §5b)
    return () => clearInterval(id);
  }, []);

  if (!state) return <div className="h-8" aria-hidden />;

  const active = state.override ?? paletteForHour(nanjingHour());
  const label = PALETTES.find((p) => p.id === active)?.label;

  const choose = (id: PaletteId | null) => {
    write(PALETTE_KEY, id);
    const next = id ?? paletteForHour(nanjingHour());
    applyPalette(next);
    setState({ ...state, override: id });
  };
  const toggleTheme = () => {
    const theme = state.theme === "dark" ? "light" : "dark";
    write(THEME_KEY, theme);
    applyTheme(theme);
    setState({ ...state, theme });
  };

  return (
    <div className="label text-muted flex flex-wrap items-center gap-x-4 gap-y-2">
      <span>
        Palette: <span className="text-fg">{label}</span> ({state.override ? "manual" : "auto"}) ·
        Nanjing {state.time}
      </span>
      <span role="group" aria-label="Choose palette" className="flex items-center gap-1">
        {PALETTES.map((p) => (
          <button
            key={p.id}
            type="button"
            title={`${p.label} (${p.hours})`}
            aria-label={`${p.label} palette`}
            aria-pressed={active === p.id && !!state.override}
            onClick={() => choose(p.id)}
            className={`grid size-7 place-items-center rounded-full border transition-colors ${
              active === p.id ? "border-fg" : "hover:border-line border-transparent"
            }`}
          >
            <span className="size-3.5 rounded-full" style={{ background: p.swatch }} />
          </button>
        ))}
        <button
          type="button"
          onClick={() => choose(null)}
          aria-pressed={!state.override}
          className={`ml-1 ${state.override ? "hover:text-fg" : "text-fg"}`}
        >
          Auto
        </button>
      </span>
      <button
        type="button"
        onClick={toggleTheme}
        className="border-line hover:text-fg rounded-full border px-3 py-1"
      >
        {state.theme === "dark" ? "Light mode" : "Dark mode"}
      </button>
    </div>
  );
}
