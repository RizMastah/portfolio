"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";

// Lazy-loaded so phones and reduced-motion visitors never download them.
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const SqlEasterEgg = dynamic(() => import("./SqlEasterEgg"), { ssr: false });
const HeroWeight = dynamic(() => import("./HeroWeight"), { ssr: false });
const NavProgress = dynamic(() => import("./NavProgress"), { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function ClientEffects() {
  const fancy = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );

  return (
    <>
      <SqlEasterEgg />
      <NavProgress />
      <CommandPalette />
      {fancy ? (
        <>
          <Cursor />
          <SmoothScroll />
          <HeroWeight />
        </>
      ) : null}
    </>
  );
}
