"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Thin accent line at the top while an internal page loads: it starts when an
 * internal link to another page is clicked and completes when the path changes.
 */
export default function NavProgress() {
  const pathname = usePathname();
  // Path the click happened on; null when nothing is loading.
  const [from, setFrom] = useState<string | null>(null);
  const state = from === null ? "idle" : from === pathname ? "loading" : "done";

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname) return;
      if (/\.(pdf|webp|png|jpg)$/i.test(url.pathname)) return;
      setFrom(location.pathname);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (state !== "done") return;
    const id = setTimeout(() => setFrom(null), 450);
    return () => clearTimeout(id);
  }, [state]);

  return (
    <div
      aria-hidden
      className={`bg-accent pointer-events-none fixed top-0 left-0 z-[60] h-0.5 w-full origin-left transition-[scale,opacity] ${
        state === "loading"
          ? "scale-x-75 opacity-100 duration-[2500ms] ease-out"
          : state === "done"
            ? "scale-x-100 opacity-0 duration-300"
            : "scale-x-0 opacity-0 duration-0"
      }`}
    />
  );
}
