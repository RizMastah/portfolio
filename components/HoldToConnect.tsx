"use client";

import { useEffect, useRef, useState } from "react";

const HOLD_MS = 1400;
const LOG = [
  "resolving raihanab.vercel.app …",
  "opening socket :443",
  "tls handshake ok",
  "auth: visitor (guest)",
  "SELECT email FROM raihan;",
];

type Phase = "idle" | "holding" | "done";

/**
 * Press and hold to "connect": a ring fills while a short connection log
 * types out; at 100% the email is copied. Releasing early rewinds it.
 * Keyboard (Enter/Space) completes at once, so nobody has to hold anything.
 */
export function HoldToConnect({ email }: { email: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const raf = useRef(0);
  const value = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(
    () => () => {
      cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    },
    [],
  );

  async function finish() {
    cancelAnimationFrame(raf.current);
    value.current = 1;
    setProgress(1);
    setPhase("done");
    try {
      await navigator.clipboard.writeText(email);
    } catch {}
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      value.current = 0;
      setProgress(0);
      setPhase("idle");
    }, 4000);
  }

  // Fills while held, rewinds (faster) when released.
  function animate(direction: 1 | -1) {
    cancelAnimationFrame(raf.current);
    let last = performance.now();
    const step = (now: number) => {
      const dt = now - last;
      last = now;
      value.current = Math.min(
        1,
        Math.max(0, value.current + (direction * dt) / (direction > 0 ? HOLD_MS : 400)),
      );
      setProgress(value.current);
      if (direction > 0 && value.current >= 1) {
        finish();
        return;
      }
      if (direction < 0 && value.current <= 0) {
        setPhase("idle");
        return;
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }

  function start(e: React.PointerEvent) {
    if (phase === "done" || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPhase("holding");
    animate(1);
  }
  function release() {
    if (phase !== "holding") return;
    animate(-1);
  }

  const lines = Math.min(LOG.length, Math.floor(progress * (LOG.length + 0.5)));
  const R = 46;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
      <button
        type="button"
        onPointerDown={start}
        onPointerUp={release}
        onPointerCancel={release}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && phase !== "done") {
            e.preventDefault();
            finish();
          }
        }}
        onContextMenu={(e) => e.preventDefault()}
        aria-label={
          phase === "done"
            ? `Connected. ${email} copied`
            : "Hold to connect and copy the email address"
        }
        className="group relative grid size-32 shrink-0 touch-none place-items-center rounded-full select-none"
      >
        <svg aria-hidden viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r={R} fill="none" stroke="var(--line)" strokeWidth="2" />
          <circle
            cx="50"
            cy="50"
            r={R}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <span
          className={`label grid size-24 place-items-center rounded-full text-center leading-tight transition-colors ${
            phase === "done" ? "bg-accent text-accent-fg" : "bg-bg-raised group-hover:text-accent"
          }`}
        >
          {phase === "done" ? (
            "Connected ✓"
          ) : phase === "holding" ? (
            `${Math.round(progress * 100)}%`
          ) : (
            <>
              Hold to
              <br />
              connect
            </>
          )}
        </span>
      </button>

      <div aria-live="polite" className="label text-muted min-h-[7.5rem] font-mono normal-case!">
        {phase === "idle" ? (
          <p>
            <span className="text-accent">$</span> press &amp; hold the button
            <span className="animate-pulse">_</span>
          </p>
        ) : (
          LOG.slice(0, lines).map((l) => (
            <p key={l}>
              <span className="text-accent">›</span> {l}
            </p>
          ))
        )}
        {phase === "done" ? (
          <p className="text-fg mt-1">
            <span className="text-accent">200</span> {email} copied to clipboard
          </p>
        ) : null}
      </div>
    </div>
  );
}
