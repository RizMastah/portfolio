"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { THEME_KEY, applyTheme } from "@/lib/theme";

type Command = { id: string; label: string; group: string; hint?: string; run: () => void };

/**
 * ⌘K / Ctrl+K command palette: jump to sections and case studies, open links,
 * copy the email, switch theme, or open the SQL console. Also opened by the
 * status bar button (event `rab:open-palette`).
 */
export default function CommandPalette() {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [note, setNote] = useState<string | null>(null);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const open = (href: string) => () => window.open(href, "_blank", "noopener");
    return [
      { id: "work", label: "Selected work", group: "Go to", run: go("/#work") },
      { id: "all", label: "All projects", group: "Go to", run: go("/work") },
      { id: "about", label: "About", group: "Go to", run: go("/#about") },
      { id: "contact", label: "Contact", group: "Go to", run: go("/#contact") },
      ...featuredProjects.map((p) => ({
        id: `cs-${p.slug}`,
        label: p.title,
        group: "Case study",
        hint: p.typeLabel,
        run: go(`/work/${p.slug}`),
      })),
      { id: "cv", label: "Download CV (PDF)", group: "Do", run: open(profile.cvPath) },
      {
        id: "email",
        label: "Copy email address",
        group: "Do",
        hint: profile.contact.email,
        run: () => {
          navigator.clipboard?.writeText(profile.contact.email).catch(() => {});
          setNote("Email copied");
        },
      },
      {
        id: "theme",
        label: "Switch light / dark mode",
        group: "Do",
        run: () => {
          const next = document.documentElement.dataset.theme === "light" ? "dark" : "light";
          try {
            localStorage.setItem(THEME_KEY, next);
          } catch {}
          applyTheme(next);
          window.dispatchEvent(new Event("rab:theme-change"));
        },
      },
      {
        id: "sql",
        label: "Query raihan.db",
        group: "Do",
        hint: "SQL console",
        run: () => window.dispatchEvent(new Event("rab:open-sql")),
      },
      { id: "github", label: "GitHub", group: "Open", run: open(profile.contact.github) },
      { id: "linkedin", label: "LinkedIn", group: "Open", run: open(profile.contact.linkedin) },
      { id: "instagram", label: "Instagram", group: "Open", run: open(profile.contact.instagram) },
    ];
  }, [router]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.group} ${c.label} ${c.hint ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Closes via the clicked element's dialog so render code never touches refs.
  function runCommand(c: Command | undefined, from: Element) {
    if (!c) return;
    c.run();
    if (c.id !== "email") from.closest("dialog")?.close();
  }

  useEffect(() => {
    const show = () => {
      if (dialog.current?.open) return;
      setQuery("");
      setActive(0);
      setNote(null);
      dialog.current?.showModal();
      requestAnimationFrame(() => input.current?.focus());
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("rab:open-palette", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("rab:open-palette", show);
    };
  }, []);

  let lastGroup = "";
  return (
    <dialog
      ref={dialog}
      aria-label="Command palette"
      className="bg-bg-raised text-fg border-line mx-auto mt-[12vh] w-[min(36rem,calc(100vw-2rem))] rounded-lg border p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="border-line flex items-center gap-3 border-b px-4">
        <span aria-hidden className="text-accent font-mono">
          ›
        </span>
        <input
          ref={input}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((i) => Math.min(results.length - 1, i + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => Math.max(0, i - 1));
            } else if (e.key === "Enter") {
              e.preventDefault();
              runCommand(results[active], e.currentTarget);
            }
          }}
          placeholder="Type a command or search…"
          aria-label="Search commands"
          aria-controls="palette-list"
          aria-activedescendant={results[active] ? `cmd-${results[active].id}` : undefined}
          className="placeholder:text-muted h-12 flex-1 bg-transparent font-mono text-sm outline-none"
        />
        <kbd className="label text-muted">Esc</kbd>
      </div>
      <ul id="palette-list" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
        {results.length === 0 ? (
          <li className="label text-muted px-3 py-6 text-center">No command matches “{query}”</li>
        ) : (
          results.map((c, i) => {
            const header = c.group !== lastGroup;
            lastGroup = c.group;
            return (
              <li key={c.id} role="presentation">
                {header ? <p className="label text-muted px-3 pt-3 pb-1">{c.group}</p> : null}
                <div
                  id={`cmd-${c.id}`}
                  role="option"
                  aria-selected={i === active}
                  onPointerMove={() => setActive(i)}
                  onClick={(e) => runCommand(c, e.currentTarget)}
                  className={`flex cursor-pointer items-center justify-between gap-4 rounded px-3 py-2 ${
                    i === active ? "bg-fg/10" : ""
                  }`}
                >
                  <span>{c.label}</span>
                  <span className="label text-muted normal-case!">
                    {c.id === "email" && note ? note : (c.hint ?? "")}
                  </span>
                </div>
              </li>
            );
          })
        )}
      </ul>
    </dialog>
  );
}
