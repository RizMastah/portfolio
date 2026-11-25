"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { type SpacePoint, projectSpace } from "@/content/projectSpace";

const { points, axes, dims } = projectSpace;

/** Screen position (0–1) of a point: PC2 grows upward. */
const pos = (p: SpacePoint) => ({ x: p.x, y: 1 - p.y });

/** Each point's two nearest neighbours, drawn as faint edges (a kNN graph). */
function knnEdges(k = 2) {
  const edges = new Set<string>();
  points.forEach((a, i) => {
    points
      .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter(({ j }) => j !== i)
      .sort((m, n) => m.d - n.d)
      .slice(0, k)
      .forEach(({ j }) => edges.add([Math.min(i, j), Math.max(i, j)].join("-")));
  });
  return [...edges].map((e) => e.split("-").map(Number) as [number, number]);
}

/**
 * Map view: the archive as an embedding space. Each project is a point placed
 * by PCA over its stack and type (content/projectSpace.ts), so similar work
 * clusters. Dust particles orbit the points; hovering or focusing a point
 * shows the project. Points are real buttons/links, the canvas is decoration.
 */
export function ProjectMap({ onShowInList }: { onShowInList: (slug: string) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const edges = useMemo(() => knnEdges(), []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth < 768;

    // Dust: most particles orbit a project point, the rest drift freely.
    const N = small ? 700 : 1800;
    const dust = Array.from({ length: N }, (_, i) => {
      const home = i % 10 < 7 ? i % points.length : -1;
      const r =
        home >= 0 ? Math.abs((Math.random() + Math.random() + Math.random()) / 3 - 0.5) * 0.28 : 0;
      return {
        home,
        r,
        a: Math.random() * Math.PI * 2,
        w: (0.02 + Math.random() * 0.08) * (Math.random() < 0.5 ? -1 : 1),
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0004,
        vy: (Math.random() - 0.5) * 0.0004,
        s: 0.8 + Math.random() * 1.6,
        o: 0.25 + Math.random() * 0.6,
      };
    });

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth;
      h = box.clientHeight;
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    let raf = 0;
    const start = performance.now();
    const frame = (now: number) => {
      const t = (now - start) / 1000;
      const css = getComputedStyle(document.documentElement);
      const accent = css.getPropertyValue("--accent").trim() || "#3ddc97";
      const fg = css.getPropertyValue("--fg").trim() || "#e8ece9";
      const act = activeRef.current;
      ctx.clearRect(0, 0, w, h);

      // Faint plot grid, like a chart.
      ctx.strokeStyle = fg;
      ctx.globalAlpha = 0.045;
      ctx.lineWidth = 1;
      for (let g = 1; g < 10; g++) {
        ctx.beginPath();
        ctx.moveTo((g / 10) * w, 0);
        ctx.lineTo((g / 10) * w, h);
        ctx.moveTo(0, (g / 10) * h);
        ctx.lineTo(w, (g / 10) * h);
        ctx.stroke();
      }

      // kNN edges.
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const pa = pos(points[a]);
        const pb = pos(points[b]);
        const lit = act === a || act === b;
        ctx.strokeStyle = lit ? accent : fg;
        ctx.globalAlpha = lit ? 0.7 : 0.08;
        ctx.beginPath();
        ctx.moveTo(pa.x * w, pa.y * h);
        ctx.lineTo(pb.x * w, pb.y * h);
        ctx.stroke();
      }

      // Dust.
      ctx.fillStyle = accent;
      for (const d of dust) {
        let x: number;
        let y: number;
        if (d.home >= 0) {
          const p = pos(points[d.home]);
          const a = d.a + t * d.w;
          x = p.x + Math.cos(a) * d.r * (h / w);
          y = p.y + Math.sin(a) * d.r;
        } else {
          if (!reduce) {
            d.x = (d.x + d.vx + 1) % 1;
            d.y = (d.y + d.vy + 1) % 1;
          }
          x = d.x;
          y = d.y;
        }
        const near = d.home >= 0 && d.home === act;
        ctx.globalAlpha = near ? Math.min(1, d.o + 0.35) : d.o * (act === null ? 1 : 0.6);
        ctx.fillRect(x * w, y * h, d.s, d.s);
      }

      // Glow under each point.
      points.forEach((p, i) => {
        const { x, y } = pos(p);
        const pulse = 1 + Math.sin(t * 1.6 + i) * 0.12;
        const r = (p.featured ? 26 : 18) * pulse * (act === i ? 1.6 : 1);
        const g = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r);
        g.addColorStop(0, accent);
        g.addColorStop(1, "transparent");
        ctx.globalAlpha = act === i ? 0.75 : 0.42;
        ctx.fillStyle = g;
        ctx.fillRect(x * w - r, y * h - r, r * 2, r * 2);
      });
      ctx.globalAlpha = 1;

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [edges]);

  const shown = active === null ? null : points[active];

  return (
    <section aria-label="Project map">
      <div
        ref={wrap}
        onPointerLeave={() => setActive(null)}
        className="border-line bg-bg-raised/40 relative aspect-[4/5] w-full overflow-hidden rounded-lg border sm:aspect-[16/10]"
      >
        <canvas ref={canvas} aria-hidden className="absolute inset-0 h-full w-full" />

        {/* Axes: what each principal component is mostly made of. */}
        <p className="label text-muted absolute right-3 bottom-3 text-right normal-case!">
          PC1 → {axes.x.join(" · ")}
        </p>
        <p className="label text-muted absolute top-1/2 left-3 origin-left -translate-y-1/2 -rotate-90 normal-case!">
          <span className="relative left-[-50%]">PC2 → {axes.y.join(" · ")}</span>
        </p>

        <ul>
          {points.map((p, i) => {
            const { x, y } = pos(p);
            const label = (
              <>
                <span
                  aria-hidden
                  className={`block size-2.5 rounded-full transition-transform ${
                    active === i ? "bg-accent scale-150" : "bg-fg"
                  }`}
                />
                <span
                  className={`label absolute top-1/2 -translate-y-1/2 whitespace-nowrap transition-colors ${
                    x > 0.6 ? "right-4" : "left-4"
                  } ${active === i ? "text-accent" : "text-fg"}`}
                >
                  {p.title}
                </span>
              </>
            );
            const common = {
              onPointerEnter: () => setActive(i),
              onFocus: () => setActive(i),
              onBlur: () => setActive(null),
              className: "absolute -translate-x-1/2 -translate-y-1/2 p-2",
              style: { left: `${x * 100}%`, top: `${y * 100}%` },
            };
            return (
              <li key={p.slug}>
                {p.featured ? (
                  <Link href={`/work/${p.slug}`} {...common} aria-label={`${p.title}, case study`}>
                    {label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    {...common}
                    onClick={() => onShowInList(p.slug)}
                    aria-label={`${p.title}, show details`}
                  >
                    {label}
                  </button>
                )}
              </li>
            );
          })}
        </ul>

        {shown ? (
          <div
            aria-hidden
            className="border-line bg-bg/90 pointer-events-none absolute w-48 rounded-md border p-2 shadow-2xl backdrop-blur-sm"
            style={{
              left: `clamp(0.5rem, calc(${pos(shown).x * 100}% + 1rem), calc(100% - 12.5rem))`,
              top: `clamp(0.5rem, calc(${pos(shown).y * 100}% + 1.25rem), calc(100% - 12rem))`,
            }}
          >
            {shown.image ? (
              <Image
                key={shown.slug}
                src={shown.image}
                alt=""
                width={384}
                height={240}
                sizes="12rem"
                className="preview-in aspect-[8/5] w-full rounded-sm object-cover object-top"
              />
            ) : null}
            <p className="display mt-2 text-2xl">{shown.title}</p>
            <p className="label text-muted normal-case!">
              {shown.typeLabel} · {shown.year} · {shown.featured ? "case study →" : "details →"}
            </p>
          </div>
        ) : null}
      </div>
      <p className="label text-muted mt-4 max-w-3xl leading-relaxed normal-case!">
        How to read this: each point is a project, placed by a 2-component PCA over {dims} features
        (its tech stack, its type and a few skill groups). Nearby points share tools; lines join
        each project to its two nearest neighbours.
      </p>
    </section>
  );
}
