"use client";

import dynamic from "next/dynamic";
import { useRichHover } from "../hover/useRichHover";

// Lazy-loaded so phones and reduced-motion visitors never download them.
const Cursor = dynamic(() => import("./Cursor"), { ssr: false });
const SmoothScroll = dynamic(() => import("./SmoothScroll"), { ssr: false });
const SqlEasterEgg = dynamic(() => import("./SqlEasterEgg"), { ssr: false });
const HeroWeight = dynamic(() => import("./HeroWeight"), { ssr: false });
const NavProgress = dynamic(() => import("./NavProgress"), { ssr: false });
const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

export function ClientEffects() {
  const fancy = useRichHover();

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
