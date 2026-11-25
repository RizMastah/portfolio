import { DecodeOnView } from "./hover/DecodeOnView";

type Stop = {
  place: string;
  country: string;
  when: string;
  title: string;
  facts: string[];
  lat: number;
  lon: number;
  /** Position on the desktop route, 0–1 of width / height. */
  x: number;
  y: number;
};

// The 2+2 route. Coordinates are city centres, used only for the distances.
const stops: Stop[] = [
  {
    place: "Tangerang",
    country: "Indonesia",
    when: "Home",
    title: "Hometown",
    facts: ["Where the route starts"],
    lat: -6.18,
    lon: 106.63,
    x: 0.06,
    y: 0.62,
  },
  {
    place: "Yogyakarta",
    country: "Indonesia",
    when: "Sep 2023",
    title: "UII · Informatics (Intl.)",
    facts: ["Teaching assistant, 2025", "Informatics Expo finalist"],
    lat: -7.8,
    lon: 110.36,
    x: 0.34,
    y: 0.3,
  },
  {
    place: "Nanjing",
    country: "China",
    when: "Sep 2025",
    title: "NXU · Software Engineering",
    facts: ["TechSprint 2026, 2nd place", "On-device ML for iOS"],
    lat: 32.06,
    lon: 118.8,
    x: 0.64,
    y: 0.66,
  },
  {
    place: "Now",
    country: "Nanjing",
    when: "Nov 2026 →",
    title: "Building TABULA",
    facts: ["Learn-by-teaching AI tutor", "Open to data / ML / backend roles"],
    lat: 32.06,
    lon: 118.8,
    x: 0.93,
    y: 0.34,
  },
];

/** Great-circle distance in km (haversine). */
function km(a: Stop, b: Stop) {
  const r = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(r(b.lat - a.lat) / 2) ** 2 +
    Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return Math.round(2 * 6371 * Math.asin(Math.sqrt(h)));
}

const W = 1200;
const H = 420;

/** Smooth path through the stops (Catmull-Rom → cubic Bézier). */
function routePath(pts: { x: number; y: number }[]) {
  const p = pts.map((s) => ({ x: s.x * W, y: s.y * H }));
  let d = `M ${p[0].x} ${p[0].y}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C ${c1.x.toFixed(1)} ${c1.y.toFixed(1)}, ${c2.x.toFixed(1)} ${c2.y.toFixed(1)}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/** Topographic contour rings: wobbly closed loops around a few "hills". Deterministic. */
function contours() {
  const hills = [
    { cx: 0.2, cy: 0.35, r: 150 },
    { cx: 0.5, cy: 0.75, r: 190 },
    { cx: 0.8, cy: 0.25, r: 170 },
  ];
  const paths: string[] = [];
  hills.forEach((h, hi) => {
    for (let ring = 1; ring <= 7; ring++) {
      const base = (h.r * ring) / 7;
      let d = "";
      for (let k = 0; k <= 64; k++) {
        const a = (k / 64) * Math.PI * 2;
        const wobble =
          1 +
          0.12 * Math.sin(a * 3 + hi + ring * 0.6) +
          0.06 * Math.sin(a * 7 + ring * 1.3 + hi * 2);
        const x = h.cx * W + Math.cos(a) * base * 1.6 * wobble;
        const y = h.cy * H + Math.sin(a) * base * 0.8 * wobble;
        d += `${k ? "L" : "M"} ${x.toFixed(1)} ${y.toFixed(1)} `;
      }
      paths.push(`${d}Z`);
    }
  });
  return paths;
}

const TOPO = contours();
const ROUTE = routePath(stops);
const VERTICAL = routePath(
  stops.map((_, i) => ({ x: i % 2 ? 0.22 : 0.08, y: 0.06 + (i / (stops.length - 1)) * 0.88 })),
);

/**
 * The 2+2 journey as a route on a topographic map: a dotted line draws itself
 * as the section scrolls into view (CSS scroll-driven animation), with a stop
 * per chapter and real distances between cities. Static when motion is off.
 */
export function RouteTimeline() {
  return (
    <figure className="route border-line relative overflow-hidden rounded-lg border">
      <figcaption className="label text-muted absolute top-4 left-4 z-10">
        <DecodeOnView text="Fig. — the 2+2 route" />
      </figcaption>

      {/* Desktop: horizontal route. */}
      <div className="relative hidden aspect-[1200/420] md:block">
        <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
          <g fill="none" stroke="var(--line)" strokeWidth="1">
            {TOPO.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
          <path
            d={ROUTE}
            fill="none"
            stroke="var(--accent)"
            strokeOpacity="0.18"
            strokeWidth="10"
          />
          <path
            d={ROUTE}
            pathLength={1}
            className="route-line"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        {stops.map((s) => (
          <div
            key={s.place}
            className="absolute"
            style={{ left: `${s.x * 100}%`, top: `${s.y * 100}%` }}
          >
            <span className="route-stop bg-bg border-accent block size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2" />
            <div
              className={`absolute w-56 ${s.x > 0.8 ? "right-0 text-right" : "left-0"} ${
                s.y > 0.5 ? "top-4" : "bottom-4"
              }`}
            >
              <p className="label text-accent">{s.when}</p>
              <p className="display text-4xl lg:text-5xl">{s.place}</p>
              <p className="label text-muted normal-case!">{s.title}</p>
              <ul className="label text-muted mt-1 normal-case!">
                {s.facts.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        {/* Distance markers halfway between stops. */}
        {stops.slice(0, -1).map((s, i) => {
          const n = stops[i + 1];
          const d = km(s, n);
          if (!d) return null;
          return (
            <span
              key={`d-${i}`}
              className="label text-accent bg-bg/80 absolute -translate-x-1/2 -translate-y-1/2 rounded px-1.5 whitespace-nowrap normal-case!"
              style={{ left: `${((s.x + n.x) / 2) * 100}%`, top: `${((s.y + n.y) / 2) * 100}%` }}
            >
              ≈ {d.toLocaleString("en-US")} km
            </span>
          );
        })}
      </div>

      {/* Phone: vertical route. */}
      <div className="relative md:hidden">
        <svg
          aria-hidden
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-y-0 left-0 h-full w-24"
        >
          <path
            d={VERTICAL}
            pathLength={1}
            className="route-line"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="6"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <ol className="relative space-y-8 py-14 pr-4 pl-12">
          {stops.map((s, i) => (
            <li key={s.place} className="relative">
              <span className="bg-bg border-accent absolute top-2 -left-[2.15rem] block size-3.5 rounded-full border-2" />
              <p className="label text-accent">{s.when}</p>
              <p className="display text-4xl">{s.place}</p>
              <p className="label text-muted normal-case!">{s.title}</p>
              <ul className="label text-muted mt-1 normal-case!">
                {s.facts.map((f) => (
                  <li key={f}>· {f}</li>
                ))}
              </ul>
              {i < stops.length - 1 && km(s, stops[i + 1]) ? (
                <p className="label text-accent mt-3 normal-case!">
                  ↓ ≈ {km(s, stops[i + 1]).toLocaleString("en-US")} km
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}
