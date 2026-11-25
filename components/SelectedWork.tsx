import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { describeMyRole, featuredProjects, publishedProjects } from "@/content/projects";
import { CoverFrame } from "./CoverFrame";
import { ProjectMap } from "./work/ProjectMap";
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
                  <p className="label text-muted mt-2">{p.period}</p>
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

      <div className="mt-20">
        <ProjectMap compact />
      </div>
      <AllProjectsLink />
    </Section>
  );
}

/**
 * Closing call to the archive: big type plus a fanned stack of the projects
 * that aren't on the home page, so visitors see there is more before clicking.
 * Hover spreads the stack like a dealt hand.
 */
function AllProjectsLink() {
  const more = publishedProjects.filter((p) => !p.featured);
  const types = [...new Set(more.concat(featuredProjects).map((p) => p.type))].join(", ");
  const stack = more
    .map((p) =>
      p.poster
        ? { slug: p.slug, src: p.poster.src, w: p.poster.width, h: p.poster.height }
        : p.cover
          ? { slug: p.slug, src: p.cover, w: 1000, h: 1000 }
          : null,
    )
    .filter((x) => x !== null)
    .slice(0, 5);
  const mid = (stack.length - 1) / 2;

  return (
    <Link
      href="/work"
      className="group border-line mt-20 grid items-center gap-10 border-y py-10 md:grid-cols-12 md:py-14"
    >
      <div className="md:col-span-7">
        <p className="label text-accent">(+{more.length} more)</p>
        <p className="display group-hover:text-accent mt-3 text-[clamp(2.5rem,13.5vw,5rem)] whitespace-nowrap transition-colors duration-300 md:text-[clamp(4rem,7vw,7.5rem)]">
          All projects{" "}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-3"
          >
            →
          </span>
        </p>
        <p className="label text-muted mt-4 normal-case!">
          All {publishedProjects.length} projects, semester 1 → now · {types}
        </p>
      </div>

      <div aria-hidden className="relative h-56 md:col-span-5 md:h-72">
        {stack.map((s, i) => {
          const offset = i - mid;
          return (
            <span
              key={s.slug}
              style={
                {
                  "--o": offset,
                  zIndex: stack.length - Math.abs(Math.round(offset)),
                  aspectRatio: `${s.w} / ${s.h}`,
                } as CSSProperties
              }
              className="border-line absolute top-1/2 left-1/2 h-[88%] [transform:translate(calc(-50%+var(--o)*18%),-50%)_rotate(calc(var(--o)*5deg))] overflow-hidden rounded-md border shadow-xl transition-transform duration-500 ease-out group-hover:[transform:translate(calc(-50%+var(--o)*62%),calc(-50%+var(--o)*var(--o)*3%))_rotate(calc(var(--o)*9deg))]"
            >
              <Image
                src={s.src}
                alt=""
                width={s.w}
                height={s.h}
                sizes="12rem"
                className="h-full w-full object-cover"
              />
            </span>
          );
        })}
      </div>
    </Link>
  );
}
