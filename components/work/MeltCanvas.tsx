"use client";

import { useEffect, useRef } from "react";

const DURATION = 950;
const COL = 3; // css px per column

const cache = new Map<string, Promise<HTMLImageElement>>();
function load(src: string) {
  let p = cache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    cache.set(src, p);
  }
  return p;
}

/** Source rect that covers a w×h box (like object-fit: cover). */
function coverRect(img: HTMLImageElement, w: number, h: number) {
  const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const sw = w / s;
  const sh = h / s;
  return { sx: (img.naturalWidth - sw) / 2, sy: (img.naturalHeight - sh) / 2, sw, sh, s };
}

/**
 * Full-bleed background that "melts" from one image to the next: the old
 * picture slides down in thin columns at uneven speeds, and each column's top
 * pixel row is stretched into the gap it leaves, like paint dripping. Drawn
 * live on a 2D canvas, so it works for any image. Reduced motion: hard cut.
 */
export function MeltCanvas({ src, className = "" }: { src: string | null; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const current = useRef<HTMLImageElement | null>(null);
  const raf = useRef(0);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let cancelled = false;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (el.width !== Math.round(w * dpr)) {
        el.width = Math.round(w * dpr);
        el.height = Math.round(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return { w, h };
    };
    const drawFull = (img: HTMLImageElement | null) => {
      const { w, h } = size();
      ctx.clearRect(0, 0, w, h);
      if (!img) return;
      const r = coverRect(img, w, h);
      ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, 0, 0, w, h);
    };

    const run = async () => {
      const next = src ? await load(src).catch(() => null) : null;
      if (cancelled) return;
      const prev = current.current;
      current.current = next;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!prev || reduce) {
        drawFull(next);
        return;
      }
      const { w, h } = size();
      const cols = Math.ceil(w / COL);
      // Smooth, uneven delays: neighbouring columns drip at similar times.
      const seed = Math.random() * 10;
      const delay = Array.from({ length: cols }, (_, i) => {
        const t = i / cols;
        const n =
          Math.sin(t * 9 + seed) * 0.5 +
          Math.sin(t * 23 + seed * 2) * 0.3 +
          Math.sin(t * 61 + seed * 3) * 0.2;
        return (n * 0.5 + 0.5) * 0.45;
      });
      const pr = coverRect(prev, w, h);
      const start = performance.now();
      const tick = (now: number) => {
        const t = (now - start) / DURATION;
        drawFull(next);
        let done = true;
        for (let c = 0; c < cols; c++) {
          const local = Math.min(1, Math.max(0, (t - delay[c]) / 0.55));
          if (local < 1) done = false;
          const y = h * local * local * local; // accelerate like a drip
          if (y >= h) continue;
          const dx = c * COL;
          const sx = pr.sx + dx / pr.s;
          const sw = COL / pr.s;
          // Old column, shifted down.
          ctx.drawImage(prev, sx, pr.sy, sw, pr.sh * (1 - y / h), dx, y, COL, h - y);
          // Its top pixel row stretched into the gap above it.
          if (y > 0) ctx.drawImage(prev, sx, pr.sy, sw, 1, dx, 0, COL, y);
        }
        if (!done && !cancelled) raf.current = requestAnimationFrame(tick);
      };
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(tick);
    };
    run();

    const onResize = () => drawFull(current.current);
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
    };
  }, [src]);

  return <canvas ref={canvas} aria-hidden className={className} />;
}
