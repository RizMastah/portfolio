"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  cellKey,
  matrixProjects,
  matrixRows,
  matrixStory,
  unprovenSkills,
} from "@/content/skillMatrix";

/**
 * Skills as evidence: a skill × project matrix (one block per skill used in a
 * project) beside a short story. The sentence on the "reading line" lights
 * exactly the blocks it talks about; its numbers come from the same data.
 *
 * Reading line: the middle of the screen on desktop; on phones the matrix
 * sticks under the header and the line is the middle of the space below it.
 */
export function SkillMatrix() {
  const [active, setActive] = useState(matrixStory[0].id);
  const sentences = useRef<(HTMLParagraphElement | null)[]>([]);
  const figure = useRef<HTMLElement>(null);

  useEffect(() => {
    let raf = 0;
    const pick = () => {
      const fig = figure.current?.getBoundingClientRect();
      const phone = window.innerWidth < 768;
      const top = phone && fig ? Math.max(0, fig.bottom) : 0;
      // Phones: read high in the space under the matrix, close to it.
      const line = top + (window.innerHeight - top) * (phone ? 0.38 : 0.48);
      let best = matrixStory[0].id;
      let bestD = Infinity;
      sentences.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        // Inside the sentence counts as distance 0; otherwise distance to its nearest edge.
        const d = line < r.top ? r.top - line : line > r.bottom ? line - r.bottom : 0;
        if (d < bestD) {
          bestD = d;
          best = matrixStory[i].id;
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

  const lit = new Set(matrixStory.find((s) => s.id === active)?.cells ?? []);
  const blocks = matrixRows.reduce((n, r) => n + r.count, 0);
  const litProject = (slug: string) => matrixRows.some((r) => lit.has(cellKey(r.skill, slug)));

  return (
    <div className="flex flex-col gap-10 md:grid md:grid-cols-12 md:gap-12">
      {/* Matrix: sticky under the header on phones, beside the story on desktop. */}
      <figure
        ref={figure}
        className="bg-bg after:from-bg sticky top-14 z-10 -mx-4 px-4 pt-2 pb-1 after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-12 after:bg-gradient-to-b after:to-transparent md:top-28 md:order-2 md:col-span-7 md:mx-0 md:self-start md:bg-transparent md:p-0 md:after:hidden"
      >
        <figcaption className="label text-muted mb-1 text-[0.6rem] md:mb-4 md:text-xs">
          Fig. 04 — {matrixProjects.length} projects × {matrixRows.length} skills
          <span className="hidden md:inline">, one block per use</span> ({blocks}
          <span className="md:hidden"> blocks</span>)
        </figcaption>
        <div className="overflow-x-auto">
          <table className="border-separate border-spacing-[2px] md:border-spacing-[3px]">
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Skill
                </th>
                {matrixProjects.map((p) => (
                  <th key={p.slug} scope="col" className="h-14 w-3.5 align-bottom md:h-28 md:w-5">
                    <span
                      className={`label block w-3.5 origin-bottom-left translate-x-2 -rotate-60 text-left text-[0.5rem] whitespace-nowrap normal-case! transition-colors md:w-5 md:translate-x-3 md:text-xs ${
                        litProject(p.slug) ? "text-accent" : "text-muted"
                      }`}
                    >
                      {p.featured ? (
                        <Link href={`/work/${p.slug}`} className="hover:text-fg">
                          {p.short}
                        </Link>
                      ) : (
                        p.short
                      )}
                    </span>
                  </th>
                ))}
                <th scope="col" className="sr-only">
                  Projects using it
                </th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((r) => {
                const rowLit = r.cells.some(
                  (u, j) => u && lit.has(cellKey(r.skill, matrixProjects[j].slug)),
                );
                return (
                  <tr key={r.skill}>
                    <th
                      scope="row"
                      className={`label pr-2 text-right text-[0.55rem] leading-none font-normal whitespace-nowrap normal-case! transition-colors md:pr-3 md:text-xs ${
                        rowLit ? "text-fg" : "text-muted"
                      }`}
                    >
                      {r.skill}
                    </th>
                    {r.cells.map((used, j) => {
                      const p = matrixProjects[j];
                      const on = used && lit.has(cellKey(r.skill, p.slug));
                      return (
                        <td key={p.slug} className="p-0">
                          {used ? (
                            <span
                              title={`${r.skill} × ${p.title}`}
                              className={`cube block size-3.5 rounded-[2px] transition-[background-color,translate,box-shadow,opacity] duration-300 md:size-5 md:rounded-[3px] ${
                                on ? "cube-on" : "opacity-30"
                              }`}
                            >
                              <span className="sr-only">
                                {r.skill} used in {p.title}
                              </span>
                            </span>
                          ) : (
                            <span
                              aria-hidden
                              className="bg-line mx-auto block size-1 rounded-full"
                            />
                          )}
                        </td>
                      );
                    })}
                    <td
                      className={`label pl-2 text-[0.55rem] tabular-nums transition-colors md:pl-3 md:text-xs ${
                        rowLit ? "text-accent" : "text-muted"
                      }`}
                    >
                      {r.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </figure>

      {/* Story: the sentence on the reading line drives the highlight. */}
      <div className="md:order-1 md:col-span-5">
        {matrixStory.map((s, i) => {
          const on = s.id === active;
          return (
            <p
              key={s.id}
              data-id={s.id}
              ref={(el) => void (sentences.current[i] = el)}
              onPointerMove={(e) => e.pointerType === "mouse" && setActive(s.id)}
              className={`flex min-h-[30svh] items-center text-xl leading-snug transition-opacity duration-500 md:min-h-[42vh] md:text-3xl ${
                on ? "opacity-100" : "opacity-30"
              }`}
            >
              <span>
                {s.parts.map((part, k) =>
                  typeof part === "string" ? (
                    <span key={k}>{part}</span>
                  ) : (
                    <span
                      key={k}
                      className={`rounded px-1.5 font-mono text-[0.85em] transition-colors duration-300 ${
                        on ? "bg-accent text-accent-fg" : "outline-line outline outline-1"
                      }`}
                    >
                      {part.n}
                    </span>
                  ),
                )}
              </span>
            </p>
          );
        })}
        <p className="label text-muted mt-6 normal-case!">
          Also in my toolbox, not shown by a project here: {unprovenSkills.join(", ")}.
        </p>
      </div>
    </div>
  );
}
