"use client";

import { useEffect, useState } from "react";
import { profile } from "@/content/profile";

/** Minutes east of UTC for a given IANA zone at a given instant. */
function offsetMinutes(date: Date, timeZone: string) {
  const local = new Date(date.toLocaleString("en-US", { timeZone }));
  const utc = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
  return Math.round((local.getTime() - utc.getTime()) / 60000);
}

function formatTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).format(date);
}

function describeDiff(minutes: number) {
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const amount = m ? `${h} h ${m} min` : `${h} h`;
  return minutes > 0 ? `Raihan is ${amount} ahead` : `Raihan is ${amount} behind`;
}

type State = { now: Date; visitorZone: string } | null;

export function DualClock() {
  const [state, setState] = useState<State>(null);
  const { timeZone, city, utcLabel } = profile.location;

  useEffect(() => {
    const visitorZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const tick = () => setState({ now: new Date(), visitorZone });
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const raihanTime = state ? formatTime(state.now, timeZone) : "--:--:--";
  const visitorTime = state ? formatTime(state.now, state.visitorZone) : "--:--:--";
  const diff = state
    ? offsetMinutes(state.now, timeZone) - offsetMinutes(state.now, state.visitorZone)
    : null;
  const sameZone = diff === 0;

  return (
    <dl className="label grid gap-2 tabular-nums">
      <div className="flex flex-wrap gap-x-3">
        <dt className="text-muted">Raihan</dt>
        <dd>
          <time suppressHydrationWarning>{raihanTime}</time> · {city} ({utcLabel})
        </dd>
      </div>
      {state && !sameZone ? (
        <div className="flex flex-wrap gap-x-3">
          <dt className="text-muted">You</dt>
          <dd>
            <time>{visitorTime}</time> · {describeDiff(diff ?? 0)}
          </dd>
        </div>
      ) : null}
      {state && sameZone ? (
        <div className="flex flex-wrap gap-x-3">
          <dt className="sr-only">You</dt>
          <dd className="text-muted">Same time zone as you</dd>
        </div>
      ) : null}
    </dl>
  );
}
