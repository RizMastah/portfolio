"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Project, projectYear } from "@/content/projects";
import { MeltCanvas } from "./MeltCanvas";

/**
 * Index view: every project title stacked in big type. Scrolling moves the
 * list under a fixed pair of brackets in the middle of the screen; the title
 * inside the brackets is the selection, and the background melts into that
 * project's cover.
 */
export function ProjectIndex({
  projects,
  onShowInList,
}: {
  projects: Project[];
  onShowInList: (slug: string) => void;
}) {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const brackets = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const pick = () => {
      // Measure against the brackets themselves (svh and innerHeight can differ on phones).
      const b = brackets.current?.getBoundingClientRect();
      const mid = b ? b.top + b.height / 2 : window.innerHeight / 2;
      let best = 0;
      let bestD = Infinity;
      items.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
      });
      setActive(best);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(pick);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const current = projects[active];

  return (
    <section aria-label="Project index" className="relative -mx-4 md:-mx-8">
      {/* Fixed stage: melting background + the brackets that mark the selection. */}
      <div className="pointer-events-none sticky top-0 -mb-[100svh] h-[100svh] overflow-hidden">
        <MeltCanvas
          src={current?.cover ?? null}
          className="absolute inset-0 h-full w-full opacity-45"
        />
        <div className="from-bg via-bg/40 to-bg absolute inset-0 bg-gradient-to-b" />
        <div
          ref={brackets}
          className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center px-4 md:px-8"
        >
          <span className="bg-accent h-px w-[4%] md:w-[6%]" />
          <span className="display text-accent px-2 text-[clamp(3rem,11vw,9rem)] leading-none">
            [
          </span>
          <span className="flex-1" />
          <span className="display text-accent px-2 text-[clamp(3rem,11vw,9rem)] leading-none">
            ]
          </span>
          <span className="bg-accent h-px w-[4%] md:w-[6%]" />
        </div>
        <div className="label text-muted absolute right-4 bottom-8 text-right md:right-8">
          <p className="text-accent">
            {String(active + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
          </p>
          {current ? (
            <p className="mt-1">
              {current.typeLabel} · {projectYear(current)}
            </p>
          ) : null}
        </div>
        <p className="label text-muted absolute bottom-8 left-4 md:left-8">
          SELECT * FROM projects;
        </p>
      </div>

      <ol className="relative py-[calc(50svh-0.6em)] text-center">
        {projects.map((p, i) => {
          const on = i === active;
          // One line per title: long names get a smaller size instead of wrapping.
          const size =
            p.title.length > 12
              ? "text-[clamp(1.4rem,5vw,4.4rem)]"
              : "text-[clamp(2.4rem,9vw,7.5rem)]";
          const cls = `display flex min-h-[clamp(3rem,10vw,8.5rem)] items-center justify-center whitespace-nowrap px-[12%] leading-none ${size} transition-[color,opacity,letter-spacing] duration-300 ${
            on ? "text-fg tracking-wide" : "text-outline opacity-40 hover:opacity-80"
          }`;
          return (
            <li key={p.slug} ref={(el) => void (items.current[i] = el)}>
              {p.featured ? (
                <Link
                  href={`/work/${p.slug}`}
                  className={cls}
                  aria-current={on ? "true" : undefined}
                >
                  {p.title}
                  <span className="sr-only"> (case study)</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => onShowInList(p.slug)}
                  className={`${cls} w-full`}
                >
                  {p.title}
                  <span className="sr-only"> (show details)</span>
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
