"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useRichHover } from "./useRichHover";

// 4×4 Bayer matrix: ordered-dither thresholds (0–15).
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const GRID = 112;

/**
 * Profile photo that first appears as a 1-bit dithered image in the accent
 * colour, computed from the photo itself. Hovering opens a growing hole at the
 * cursor that shows the real photo. Touch devices and reduced motion get the
 * plain photo.
 */
export function DitherPortrait({
  src,
  width,
  height,
  alt,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
}) {
  const rich = useRichHover();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!rich) return;
    const el = canvas.current;
    const box = wrap.current;
    if (!el || !box) return;
    const img = new window.Image();
    img.src = src;
    let cancelled = false;

    const draw = () => {
      if (cancelled || !img.complete || !img.naturalWidth) return;
      const css = getComputedStyle(document.documentElement);
      const bg = css.getPropertyValue("--bg").trim() || "#0c0f10";
      const accent = css.getPropertyValue("--accent").trim() || "#3ddc97";
      const w = box.clientWidth;
      const h = box.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      const ctx = el.getContext("2d");
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = w / GRID;
      const rows = Math.ceil(h / cell);

      // One sample pixel per dot, centre-cropped like object-cover.
      const sample = document.createElement("canvas");
      sample.width = GRID;
      sample.height = rows;
      const sctx = sample.getContext("2d", { willReadFrequently: true });
      if (!sctx) return;
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      sctx.drawImage(
        img,
        (img.naturalWidth - side) / 2,
        (img.naturalHeight - side) / 2,
        side,
        side,
        0,
        0,
        GRID,
        rows,
      );
      const data = sctx.getImageData(0, 0, GRID, rows).data;

      // Stretch tones to the photo's own 2nd–98th percentile.
      const lums = new Float32Array(GRID * rows);
      for (let k = 0; k < lums.length; k++) {
        const i = k * 4;
        lums[k] = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      }
      const sorted = Float32Array.from(lums).sort();
      const lo = sorted[Math.floor(sorted.length * 0.02)];
      const hi = sorted[Math.floor(sorted.length * 0.98)];

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = accent;
      const dot = Math.max(1, cell * 0.78);
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < GRID; x++) {
          const tone = Math.min(1, Math.max(0, (lums[y * GRID + x] - lo) / (hi - lo || 1)));
          const threshold = (BAYER[(y % 4) * 4 + (x % 4)] + 0.5) / 16;
          if (tone > threshold) ctx.fillRect(x * cell, y * cell, dot, dot);
        }
      }
    };

    img.onload = draw;
    draw();
    const resize = new ResizeObserver(draw);
    resize.observe(box);
    window.addEventListener("rab:theme-change", draw);
    return () => {
      cancelled = true;
      resize.disconnect();
      window.removeEventListener("rab:theme-change", draw);
    };
  }, [rich, src]);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    const box = wrap.current;
    if (!box) return;
    const r = box.getBoundingClientRect();
    box.style.setProperty("--px", `${e.clientX - r.left}px`);
    box.style.setProperty("--py", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={wrap}
      onPointerMove={rich ? move : undefined}
      onPointerEnter={
        rich
          ? (e) => {
              move(e);
              const size = wrap.current?.clientWidth ?? 0;
              wrap.current?.style.setProperty("--hole", `${Math.round(size * 1.5)}px`);
            }
          : undefined
      }
      onPointerLeave={rich ? () => wrap.current?.style.setProperty("--hole", "0px") : undefined}
      className="dither-wrap border-line relative aspect-square w-full max-w-sm overflow-hidden rounded-lg border"
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 768px) 30vw, 100vw"
        className="h-full w-full object-cover"
      />
      {rich ? (
        <canvas ref={canvas} aria-hidden className="dither-layer absolute inset-0 h-full w-full" />
      ) : null}
    </div>
  );
}
