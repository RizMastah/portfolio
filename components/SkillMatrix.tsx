"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { matrixProjects, matrixRows, matrixStory, unprovenSkills } from "@/content/skillMatrix";

/**
 * Skills as evidence: a skill × project matrix (one block per skill used in a
 * project) beside a short story. While a sentence is being read (or hovered),
 * the rows it talks about rise and light up; its numbers are computed from the
 * same data as the matrix.
 */
export function SkillMatrix() {
  const [active, setActive] = useState(matrixStory[0].id);
  const sentences = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting)
            setActive((e.target as HTMLElement).dataset.id ?? matrixStory[0].id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    sentences.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const lit = new Set(matrixStory.find((s) => s.id === active)?.rows ?? []);
  const blocks = matrixRows.reduce((n, r) => n + r.count, 0);

  return (
    <div className="grid gap-12 md:grid-cols-12">
      {/* Story: each sentence drives which rows light up. */}
      <div className="md:col-span-5">
        {matrixStory.map((s, i) => {
          const on = s.id === active;
          return (
            <p
              key={s.id}
              data-id={s.id}
              ref={(el) => void (sentences.current[i] = el)}
              onPointerEnter={() => setActive(s.id)}
              className={`text-2xl leading-snug transition-opacity duration-500 md:flex md:min-h-[42vh] md:items-center md:text-3xl ${
                on ? "opacity-100" : "opacity-30"
              } ${i ? "mt-8 md:mt-0" : ""}`}
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
      </div>

      {/* Matrix: sticky beside the story on desktop. */}
      <figure className="md:sticky md:top-28 md:col-span-7 md:self-start">
        <figcaption className="label text-muted mb-4">
          Fig. 04 — {matrixProjects.length} projects × {matrixRows.length} skills, one block per use
          ({blocks})
        </figcaption>
        <div className="overflow-x-auto pb-2">
          <table className="border-separate border-spacing-[3px]">
            <thead>
              <tr>
                <th scope="col" className="sr-only">
                  Skill
                </th>
                {matrixProjects.map((p) => (
                  <th key={p.slug} scope="col" className="h-28 w-5 align-bottom">
                    <span className="label text-muted block w-5 origin-bottom-left translate-x-3 -rotate-60 text-left whitespace-nowrap normal-case!">
                      {p.featured ? (
                        <Link href={`/work/${p.slug}`} className="hover:text-accent">
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
                const on = lit.has(r.skill);
                return (
                  <tr key={r.skill} className="group">
                    <th
                      scope="row"
                      className={`label pr-3 text-right font-normal whitespace-nowrap normal-case! transition-colors ${
                        on ? "text-fg" : "text-muted"
                      }`}
                    >
                      {r.skill}
                    </th>
                    {r.cells.map((used, j) => (
                      <td key={j} className="p-0">
                        {used ? (
                          <span
                            title={`${r.skill} × ${matrixProjects[j].title}`}
                            className={`cube block size-5 rounded-[3px] transition-[background-color,translate,box-shadow,opacity] duration-300 ${
                              on ? "cube-on" : "opacity-40"
                            }`}
                          >
                            <span className="sr-only">
                              {r.skill} used in {matrixProjects[j].title}
                            </span>
                          </span>
                        ) : (
                          <span aria-hidden className="bg-line mx-auto block size-1 rounded-full" />
                        )}
                      </td>
                    ))}
                    <td
                      className={`label pl-3 tabular-nums transition-colors ${on ? "text-accent" : "text-muted"}`}
                    >
                      {r.count}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="label text-muted mt-4 normal-case!">
          Also in my toolbox, not shown by a project here: {unprovenSkills.join(", ")}.
        </p>
      </figure>
    </div>
  );
}
