"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/content/projects";

const COVER_W = 380;
const POSTER_H = 440;

/** Preview size: full poster (portrait) for projects that have one, else the 2:1 cover. */
function sizeFor(p: Project) {
  if (p.poster) {
    const h = Math.min(POSTER_H, Math.round(window.innerHeight * 0.62));
    return { w: Math.round((h * p.poster.width) / p.poster.height), h };
  }
  return { w: COVER_W, h: COVER_W / 2 };
}

/**
 * Floating preview that trails the cursor while a project row is hovered. UII
 * projects show their whole poster, uncropped; the others show their stage
 * cover. It leans in the direction of travel (velocity → rotation), so moving
 * between rows feels like dragging a card. Only mounted for fine pointers.
 */
export function CursorPreview({ project }: { project: Project | null }) {
  const box = useRef<HTMLDivElement>(null);
  // Keep the last project while fading out, so the image doesn't vanish first.
  const [shown, setShown] = useState<Project | null>(project);
  if (project && project !== shown) setShown(project);
  const visible = project !== null;
  const size = shown ? sizeFor(shown) : { w: COVER_W, h: COVER_W / 2 };

  useEffect(() => {
    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let tilt = 0;
    let raf = 0;
    let first = true;
    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (first) {
        pos.x = target.x;
        pos.y = target.y;
        first = false;
      }
    };
    const loop = () => {
      const el = box.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const dx = target.x - pos.x;
        pos.x += dx * 0.16;
        pos.y += (target.y - pos.y) * 0.16;
        tilt += (Math.max(-10, Math.min(10, dx * 0.12)) - tilt) * 0.2;
        // Right of the cursor (left near the edge), vertically kept on screen.
        const left = pos.x + 28 + w > innerWidth ? pos.x - 28 - w : pos.x + 28;
        const top = Math.max(12, Math.min(innerHeight - h - 12, pos.y - h / 2));
        el.style.transform = `translate3d(${left.toFixed(1)}px, ${top.toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const src = shown?.poster?.src ?? shown?.cover;

  return (
    <div
      ref={box}
      aria-hidden
      style={{ width: size.w, height: size.h }}
      className="pointer-events-none fixed top-0 left-0 z-40 hidden transition-[width,height] duration-300 ease-out md:block"
    >
      <div
        className={`border-line bg-bg-raised h-full w-full overflow-hidden rounded-lg border shadow-2xl transition-[opacity,scale] duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {shown && src ? (
          <Image
            key={shown.slug}
            src={src}
            alt=""
            width={shown.poster?.width ?? COVER_W * 2}
            height={shown.poster?.height ?? COVER_W}
            sizes={`${size.w}px`}
            className="preview-in h-full w-full object-contain"
          />
        ) : shown ? (
          <div className="bg-bg flex h-full items-center justify-center">
            <span className="display text-outline text-7xl">{shown.title}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
