"use client";

import { useEffect, useRef, useState } from "react";
import { awards } from "@/content/awards";
import { education, languages, profile } from "@/content/profile";
import { publishedProjects } from "@/content/projects";

// Facts built only from confirmed profile data. Owner-written fun facts
// (PRD §6.1 [OWNER DATA]) can be appended to `profile.funFacts` later.
const rows: [string, string][] = [
  ["name", profile.name],
  ["based_in", profile.location.city],
  ["campuses", education.map((e) => e.school.split(" (")[0]).join(" + ")],
  ["projects_shipped", String(publishedProjects.length)],
  ["podium_finishes", String(awards.filter((a) => a.title.includes("Place")).length)],
  ["languages", languages.map((l) => l.name).join(", ")],
  ["favorite_join", "models ⋈ databases ⋈ backends"],
  ["status", profile.status],
];

const TRIGGER = "sql";

/** Type `sql` anywhere (outside form fields) to open a tiny query console. */
export default function SqlEasterEgg() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    let buffer = "";
    const onKey = (e: KeyboardEvent) => {
      const t = e.target;
      if (t instanceof Element && t.closest("input, textarea, select, [contenteditable='true']"))
        return;
      if (e.key.length !== 1 || e.metaKey || e.ctrlKey || e.altKey) return;
      buffer = (buffer + e.key.toLowerCase()).slice(-TRIGGER.length);
      if (buffer === TRIGGER && !dialog.current?.open) {
        setOpened(true);
        dialog.current?.showModal();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="sql-title"
      className="bg-bg-raised text-fg border-line m-auto w-[min(40rem,calc(100vw-2rem))] rounded-lg border p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="border-line flex items-center justify-between border-b px-4 py-3">
        <h2 id="sql-title" className="label text-muted">
          raihan.db — psql
        </h2>
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="label text-muted hover:text-fg"
        >
          Esc ✕
        </button>
      </div>
      {opened ? (
        <div className="overflow-x-auto p-4 font-mono text-sm">
          <p>
            <span className="text-accent">raihan=#</span> SELECT * FROM raihan WHERE curious = true;
          </p>
          <table className="mt-4 w-full text-left">
            <thead>
              <tr className="text-muted">
                <th className="border-line border-b py-1 pr-6 font-normal">key</th>
                <th className="border-line border-b py-1 font-normal">value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([k, v]) => (
                <tr key={k}>
                  <td className="text-muted py-1 pr-6 align-top">{k}</td>
                  <td className="py-1">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-muted mt-4">({rows.length} rows) · Time: 0.42 ms</p>
          <p className="mt-2">
            <span className="text-accent">raihan=#</span> <span className="animate-pulse">▍</span>
          </p>
        </div>
      ) : null}
    </dialog>
  );
}
