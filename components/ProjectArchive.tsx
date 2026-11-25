"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { type Project, type ProjectType, describeMyRole, projectTypes } from "@/content/projects";
import { CoverFrame } from "./CoverFrame";
import { CursorPreview } from "./hover/CursorPreview";
import { useRichHover } from "./hover/useRichHover";
import { LightboxLink } from "./Lightbox";

type Filter = "All" | ProjectType;
type Sort = "semester" | "type";

const linkLabels: Record<string, string> = {
  repo: "repo",
  live: "live site",
  figma: "figma prototype",
  video: "video",
  demo: "demo",
};

function groupLabel(p: Project) {
  if (p.semester == null) return p.campus ? `Earlier work · ${p.campus}` : "Earlier work";
  // 2+2 double degree: semesters 1–4 at UII, 5 onwards at NXU.
  const campus = p.semester >= 5 ? "NXU" : "UII";
  return `Semester ${p.semester} · ${campus}`;
}

function Row({ p, onHover }: { p: Project; onHover: (p: Project | null) => void }) {
  const meta = [p.typeLabel, p.period, p.course].filter(Boolean).join(" · ");
  const links = Object.entries(p.links ?? {}).filter(([, v]) => v) as [string, string][];

  return (
    <li
      id={`p-${p.slug}`}
      onPointerEnter={() => onHover(p)}
      className="group/row border-line grid gap-4 border-b py-6 md:grid-cols-12 md:gap-6"
    >
      {/* On desktop with a mouse the cover follows the cursor instead (CursorPreview). */}
      <div className="fancy:md:hidden max-w-64 md:col-span-2 md:max-w-none">
        <CoverFrame project={p} sizes="(min-width: 768px) 16vw, 256px" />
      </div>
      <div className="fancy:md:col-span-5 md:col-span-3">
        <h3
          className="display group-hover/row:text-accent fancy:md:text-6xl fancy:md:group-hover/row:translate-x-3 text-3xl transition-[translate,color] duration-300 md:text-4xl"
          translate="no"
        >
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
        <p className="mt-3 text-sm leading-relaxed">
          <span className="label text-muted">My role</span> {describeMyRole(p)}
        </p>
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
      <ul className="flex flex-wrap gap-x-4 gap-y-1 md:col-span-2 md:flex-col md:items-end">
        {links.map(([kind, href]) => (
          <li key={kind}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="label hover:text-accent transition-colors"
            >
              {linkLabels[kind] ?? kind} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        ))}
        {p.poster ? (
          <li>
            <LightboxLink item={{ ...p.poster, alt: `${p.title} poster` }} label="View poster" />
          </li>
        ) : null}
      </ul>
    </li>
  );
}

export function ProjectArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [sort, setSort] = useState<Sort>("semester");
  const [hovered, setHovered] = useState<Project | null>(null);
  const rich = useRichHover();

  const groups = useMemo(() => {
    const visible = projects.filter((p) => filter === "All" || p.type === filter);
    const map = new Map<string, Project[]>();
    if (sort === "semester") {
      const sorted = [...visible].sort((a, b) => (b.semester ?? -1) - (a.semester ?? -1));
      for (const p of sorted) map.set(groupLabel(p), [...(map.get(groupLabel(p)) ?? []), p]);
    } else {
      for (const t of projectTypes) {
        const items = visible
          .filter((p) => p.type === t)
          .sort((a, b) => (b.semester ?? -1) - (a.semester ?? -1));
        if (items.length) map.set(t, items);
      }
    }
    return [...map.entries()];
  }, [projects, filter, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: projects.length };
    for (const t of projectTypes) c[t] = projects.filter((p) => p.type === t).length;
    return c;
  }, [projects]);

  const filters: Filter[] = ["All", ...projectTypes];

  return (
    <div>
      <div className="border-line mb-10 flex flex-col gap-4 border-y py-4 md:flex-row md:items-center md:justify-between">
        <div role="group" aria-label="Filter by project type" className="flex flex-wrap gap-2">
          {filters
            .filter((f) => counts[f] > 0)
            .map((f) => (
              <button
                key={f}
                type="button"
                aria-pressed={filter === f}
                onClick={() => setFilter(f)}
                className={`label rounded-full border px-3 py-1.5 transition-colors ${
                  filter === f ? "bg-fg text-bg border-fg" : "border-line text-muted hover:text-fg"
                }`}
              >
                {f} <span>{counts[f]}</span>
              </button>
            ))}
        </div>
        <div role="group" aria-label="Sort" className="label flex items-center gap-3">
          <span className="text-muted">Sort:</span>
          {(["semester", "type"] as const).map((s) => (
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

      {rich ? <CursorPreview project={hovered} /> : null}
      {groups.length === 0 ? (
        <p className="text-muted">No projects of this type yet.</p>
      ) : (
        groups.map(([label, items]) => (
          <section key={label} className="mb-14" aria-label={label}>
            <h2 className="label text-muted mb-2">
              {label} <span>({items.length})</span>
            </h2>
            <ul className="border-line border-t" onPointerLeave={() => setHovered(null)}>
              {items.map((p) => (
                <Row key={p.slug} p={p} onHover={rich ? setHovered : () => {}} />
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}
