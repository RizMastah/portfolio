"use client";

import { useEffect, useRef } from "react";

/**
 * Two-layer cursor (reference §5b, own shape):
 * - dot: follows the pointer instantly
 * - frame: a square crosshair that trails (~0.33 s ease-out), rotates toward the
 *   direction of travel and stretches with speed; grows over links/buttons.
 */
export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.add("has-cursor");
    const target = { x: innerWidth / 2, y: innerHeight / 2 };
    const pos = { ...target };
    let angle = 0;
    let hover = false;
    let visible = false;
    let last = performance.now();
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        dot.current?.style.setProperty("opacity", "1");
        frame.current?.style.setProperty("opacity", "1");
      }
      const el = e.target as Element | null;
      hover = !!el?.closest("a, button, [role='button'], input, textarea, select, label");
    };
    const onLeave = () => {
      visible = false;
      dot.current?.style.setProperty("opacity", "0");
      frame.current?.style.setProperty("opacity", "0");
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      // Exponential smoothing; tau 0.07 s settles in ~0.33 s like an expo-out tween.
      const k = 1 - Math.exp(-dt / 0.07);
      const vx = target.x - pos.x;
      const vy = target.y - pos.y;
      pos.x += vx * k;
      pos.y += vy * k;
      const speed = Math.hypot(vx, vy);
      if (speed > 1) angle = Math.atan2(vy, vx) * (180 / Math.PI);
      const stretch = Math.min(speed / 300, 0.45);
      const scale = hover ? 2.2 : 1;

      if (dot.current) {
        dot.current.style.transform = `translate3d(${target.x}px, ${target.y}px, 0) translate(-50%, -50%)`;
      }
      if (frame.current) {
        frame.current.style.transform =
          `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%) ` +
          `rotate(${hover ? 0 : angle}deg) scale(${scale * (1 + stretch)}, ${scale * (1 - stretch * 0.5)})`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <div
        ref={dot}
        className="bg-accent fixed top-0 left-0 size-1.5 opacity-0 transition-opacity"
      />
      <div
        ref={frame}
        className="border-fg/70 fixed top-0 left-0 size-5 border opacity-0 transition-[opacity,border-color] duration-300 [&::after]:absolute [&::after]:inset-x-0 [&::after]:top-1/2 [&::after]:h-px [&::after]:bg-current [&::after]:opacity-30 [&::after]:content-['']"
      />
    </div>
  );
}
