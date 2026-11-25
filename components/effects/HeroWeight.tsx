"use client";

import { useEffect } from "react";

const HEAVY = 900;
const LIGHT = 260;
const RADIUS = 220; // px: how far the cursor’s pull reaches

/**
 * Hero name reacts to the cursor: Big Shoulders is a variable font, so each
 * letter's weight eases toward heavy when the cursor is near and light when it
 * is far. Leaving the hero returns every letter to full weight.
 * Mounted only for fine pointers without reduced motion (ClientEffects).
 */
export default function HeroWeight() {
  useEffect(() => {
    const title = document.getElementById("hero-title");
    const hero = title?.closest("section");
    if (!title || !hero) return;
    const chars = Array.from(title.querySelectorAll<HTMLElement>(".char"));
    const current = chars.map(() => HEAVY);
    const target = chars.map(() => HEAVY);
    let raf = 0;
    let running = false;

    const step = () => {
      let moving = false;
      chars.forEach((el, i) => {
        const next = current[i] + (target[i] - current[i]) * 0.14;
        current[i] = Math.abs(next - target[i]) < 0.5 ? target[i] : next;
        if (current[i] !== target[i]) moving = true;
        el.style.fontVariationSettings = `"wght" ${current[i].toFixed(0)}`;
      });
      if (moving) raf = requestAnimationFrame(step);
      else running = false;
    };
    const kick = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(step);
      }
    };

    const onLeave = () => {
      target.fill(HEAVY);
      kick();
    };
    const onMove = (e: PointerEvent) => {
      // Only react while the cursor is over or just around the name itself.
      const t = title.getBoundingClientRect();
      const near =
        e.clientX > t.left - 60 &&
        e.clientX < t.right + 60 &&
        e.clientY > t.top - 60 &&
        e.clientY < t.bottom + 60;
      if (!near) {
        onLeave();
        return;
      }
      chars.forEach((el, i) => {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(
          e.clientX - (r.left + r.width / 2),
          e.clientY - (r.top + r.height / 2),
        );
        const pull = Math.max(0, 1 - d / RADIUS);
        target[i] = LIGHT + (HEAVY - LIGHT) * pull * pull * (3 - 2 * pull);
      });
      kick();
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      chars.forEach((el) => (el.style.fontVariationSettings = ""));
    };
  }, []);

  return null;
}
