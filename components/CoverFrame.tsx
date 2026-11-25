"use client";

import Image from "next/image";
import { ViewTransition, useId, useRef, useState } from "react";
import { type Project, projectYear } from "@/content/projects";
import { ScrambleText } from "./hover/ScrambleText";
import { useRichHover } from "./hover/useRichHover";

const PULSE_MS = 900;

/**
 * One frame for every project cover (16:10): the top 80% shows the project's
 * stage image; the bottom strip shows type and year in the same place on every
 * card. On hover (fine pointer, motion allowed) the image ripples like liquid
 * through a noise displacement filter and settles, and the strip decodes.
 */
export function CoverFrame({
  project,
  sizes,
  priority = false,
  className = "",
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const rich = useRichHover();
  const filterId = `liquid-${useId().replace(/[^a-zA-Z0-9-]/g, "")}`;
  const turbulence = useRef<SVGFETurbulenceElement>(null);
  const displacement = useRef<SVGFEDisplacementMapElement>(null);
  const raf = useRef(0);
  const [pulsing, setPulsing] = useState(false);
  const [run, setRun] = useState(0);

  function onEnter() {
    if (!rich) return;
    setRun((n) => n + 1);
    if (!project.cover) return;
    cancelAnimationFrame(raf.current);
    setPulsing(true);
    const start = performance.now();
    const seed = Math.random() * 100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PULSE_MS);
      // Strong at first contact, easing out to a still image.
      const strength = 70 * (1 - t) ** 3;
      displacement.current?.setAttribute("scale", strength.toFixed(2));
      turbulence.current?.setAttribute("seed", String(Math.round(seed + t * 6)));
      turbulence.current?.setAttribute(
        "baseFrequency",
        `${(0.006 + t * 0.01).toFixed(4)} ${(0.014 + t * 0.012).toFixed(4)}`,
      );
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setPulsing(false);
    };
    raf.current = requestAnimationFrame(tick);
  }

  return (
    // Same name on the card and the case-study header: navigating morphs one into the other.
    <ViewTransition name={`cover-${project.slug}`} share="morph" default="none">
      <div
        onPointerEnter={onEnter}
        className={`border-line bg-bg-raised flex aspect-[16/10] flex-col overflow-hidden rounded-lg border ${className}`}
      >
        <div className="relative min-h-0 flex-[4] overflow-hidden">
          {project.cover ? (
            <>
              {rich ? (
                <svg aria-hidden className="absolute size-0">
                  <filter id={filterId} x="-5%" y="-5%" width="110%" height="110%">
                    <feTurbulence
                      ref={turbulence}
                      type="fractalNoise"
                      baseFrequency="0.006 0.014"
                      numOctaves="2"
                      seed="1"
                    />
                    <feDisplacementMap
                      ref={displacement}
                      in="SourceGraphic"
                      scale="0"
                      xChannelSelector="R"
                      yChannelSelector="G"
                    />
                  </filter>
                </svg>
              ) : null}
              <Image
                src={project.cover}
                alt={`${project.title}: visual from the project`}
                fill
                sizes={sizes}
                priority={priority}
                style={pulsing ? { filter: `url(#${filterId})` } : undefined}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </>
          ) : (
            <div
              className="bg-bg [container-type:size] flex h-full items-center justify-center"
              aria-hidden
            >
              <span className="display text-outline text-[22cqw] leading-none">
                {project.title}
              </span>
            </div>
          )}
        </div>
        <div className="border-line label text-muted flex flex-1 items-center justify-between border-t px-[4%]">
          <span>
            <ScrambleText text={project.typeLabel} run={run} />
          </span>
          <span className="tabular-nums">
            <ScrambleText text={projectYear(project)} run={run} />
          </span>
        </div>
      </div>
    </ViewTransition>
  );
}
