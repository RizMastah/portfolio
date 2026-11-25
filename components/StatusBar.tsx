"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

const COMMIT = process.env.NEXT_PUBLIC_COMMIT ?? "local";

function nanjingTime() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: profile.location.timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

/**
 * Developer-style strip above the header (desktop only): Raihan's local time,
 * the deployed commit, this page's measured LCP, and the ⌘K palette trigger.
 */
export function StatusBar() {
  const [time, setTime] = useState<string | null>(null);
  const [lcp, setLcp] = useState<number | null>(null);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    const tick = () => setTime(nanjingTime());
    const first = setTimeout(() => {
      tick();
      setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }, 0);
    const id = setInterval(tick, 1000);

    let po: PerformanceObserver | undefined;
    try {
      po = new PerformanceObserver((list) => {
        const last = list.getEntries().at(-1);
        if (last) setLcp(last.startTime);
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}
    return () => {
      clearTimeout(first);
      clearInterval(id);
      po?.disconnect();
    };
  }, []);

  return (
    <div className="border-line/60 text-muted hidden h-6 items-center border-b text-[0.6875rem] tracking-wide uppercase md:flex">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-6 px-8 font-mono tabular-nums">
        <span className="flex items-center gap-2">
          <span aria-hidden className="bg-accent size-1.5 animate-pulse rounded-full" />
          <span>
            {profile.location.city} <time suppressHydrationWarning>{time ?? "--:--:--"}</time> (
            {profile.location.utcLabel})
          </span>
        </span>
        <span className="flex items-center gap-4">
          <span>build {COMMIT}</span>
          <span>lcp {lcp === null ? "—" : `${(lcp / 1000).toFixed(2)}s`}</span>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("rab:open-palette"))}
            className="border-line hover:text-fg rounded border px-1.5 transition-colors"
            aria-label="Open command palette"
          >
            {mac ? "⌘K" : "Ctrl K"}
          </button>
        </span>
      </div>
    </div>
  );
}
