import Link from "next/link";
import { describeMyRole, featuredProjects, publishedProjects } from "@/content/projects";
import { CoverFrame } from "./CoverFrame";
import { Section } from "./Section";

export function SelectedWork() {
  return (
    <Section
      id="work"
      index="01"
      title="Selected work"
      aside={`${featuredProjects.length} case studies`}
    >
      <ul className="grid gap-x-6 gap-y-14 md:grid-cols-2">
        {featuredProjects.map((p) => (
          <li key={p.slug}>
            <Link href={`/work/${p.slug}`} className="group block">
              <CoverFrame project={p} sizes="(min-width: 768px) 50vw, 100vw" />
              <div className="mt-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="display text-4xl md:text-5xl">{p.title}</h3>
                  <p className="label text-muted mt-2">
                    {p.period}
                  </p>
                </div>
                <span
                  aria-hidden
                  className="label mt-2 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
                >
                  View →
                </span>
              </div>
              <p className="mt-3 max-w-xl leading-relaxed">{p.oneLiner}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed">
                <span className="label text-muted">My role</span> {describeMyRole(p)}
              </p>
              {p.award ? <p className="label text-accent mt-3">★ {p.award}</p> : null}
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="Tech stack">
                {p.stack.map((s) => (
                  <li
                    key={s}
                    className="label border-line text-muted rounded-full border px-2.5 py-1"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </Link>
          </li>
        ))}
      </ul>

      <Link
        href="/work"
        className="label border-line hover:text-accent mt-16 flex items-center justify-between border-y py-6 transition-colors"
      >
        <span>See all {publishedProjects.length} projects, semester 1 → now</span>
        <span aria-hidden>→</span>
      </Link>
    </Section>
  );
}
