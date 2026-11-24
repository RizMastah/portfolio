"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/content/projects";

const categories: ("All" | ProjectCategory)[] = [
  "All",
  "Data & ML",
  "Backend",
  "Mobile",
  "Web",
  "UI/UX",
  "Other",
];

type Sort = "semester" | "category";

function groupLabel(p: Project) {
  if (p.semester == null) return p.campus ? `Earlier work · ${p.campus}` : "Earlier work";
  const campus = p.semester >= 5 ? "NXU" : "UII";
  return `Semester ${p.semester} · ${campus}`;
}

function Row({ p }: { p: Project }) {
  const meta = [p.period, p.role, p.team && p.team > 1 ? `team of ${p.team}` : null]
    .filter(Boolean)
    .join(" · ");
  const links = Object.entries(p.links ?? {}).filter(([, v]) => v) as [string, string][];

  return (
    <li className="border-line grid gap-3 border-b py-6 md:grid-cols-12 md:gap-6">
      <div className="md:col-span-4">
        <h3 className="display text-3xl md:text-4xl">
          {p.featured ? (
            <Link href={`/work/${p.slug}`} className="hover:text-accent transition-colors">
              {p.title} <span className="label align-middle">→ case study</span>
            </Link>
          ) : (
            p.title
          )}
        </h3>
        {meta ? <p className="label text-muted mt-2">{meta}</p> : null}
      </div>
      <div className="md:col-span-5">
        <p className="leading-relaxed">{p.oneLiner}</p>
        {p.award ? <p className="label text-accent mt-2">★ {p.award}</p> : null}
        {p.stack.length ? (
          <ul className="mt-3 flex flex-wrap gap-2" aria-label="Tech stack">
            {p.stack.map((s) => (
              <li key={s} className="label border-line text-muted rounded-full border px-2.5 py-1">
                {s}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-3 md:justify-end">
        {links.map(([kind, href]) => (
          <li key={kind}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="label hover:text-accent transition-colors"
            >
              {kind} ↗
            </a>
          </li>
        ))}
      </ul>
    </li>
  );
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<(typeof categories)[number]>("All");
  const [sort, setSort] = useState<Sort>("semester");

  const groups = useMemo(() => {
    const visible = projects.filter((p) => filter === "All" || p.category.includes(filter));
    const map = new Map<string, Project[]>();
    if (sort === "semester") {
      const sorted = [...visible].sort((a, b) => (b.semester ?? -1) - (a.semester ?? -1));
      for (const p of sorted) map.set(groupLabel(p), [...(map.get(groupLabel(p)) ?? []), p]);
    } else {
      for (const c of categories.slice(1)) {
        const items = visible.filter((p) => p.category[0] === c);
        if (items.length) map.set(c, items);
      }
    }
    return [...map.entries()];
  }, [projects, filter, sort]);

  const counts = useMemo(
    () =>
      Object.fromEntries(
        categories.map((c) => [
          c,
          c === "All" ? projects.length : projects.filter((p) => p.category.includes(c)).length,
        ]),
      ),
    [projects],
  );

  return (
    <div>
      <div className="border-line mb-10 flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
          {categories
            .filter((c) => counts[c] > 0)
            .map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={`label rounded-full border px-3 py-1.5 transition-colors ${
                  filter === c ? "bg-fg text-bg border-fg" : "border-line text-muted hover:text-fg"
                }`}
              >
                {c} <span>{counts[c]}</span>
              </button>
            ))}
        </div>
        <div role="group" aria-label="Sort" className="label flex items-center gap-3">
          <span className="text-muted">Sort:</span>
          {(["semester", "category"] as const).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={sort === s}
              onClick={() => setSort(s)}
              className={
                sort === s ? "text-fg underline underline-offset-4" : "text-muted hover:text-fg"
              }
            >
              By {s}
            </button>
          ))}
        </div>
      </div>

      {groups.length === 0 ? (
        <p className="text-muted">No projects in this category yet.</p>
      ) : (
        groups.map(([label, items]) => (
          <section key={label} className="mb-14" aria-label={label}>
            <h2 className="label text-muted mb-2">
              {label} <span>({items.length})</span>
            </h2>
            <ul className="border-line border-t">
              {items.map((p) => (
                <Row key={p.slug} p={p} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
