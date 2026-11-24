import type { Project } from "@/content/projects";

/** Deterministic pseudo-random numbers from the slug, so each cover differs but never changes. */
function seeded(slug: string) {
  let h = 2166136261;
  for (const c of slug) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

/**
 * Placeholder cover (PRD §5.4): abstract data-style pattern + device frame.
 * Contains no fake UI; replaced automatically once a real `cover` exists.
 */
export function ProjectMockup({ project, index }: { project: Project; index: number }) {
  const rand = seeded(project.slug);
  const bars = Array.from({ length: 28 }, () => 0.15 + rand() * 0.85);
  const ios = project.platform === "ios";

  return (
    <svg
      viewBox="0 0 800 500"
      role="img"
      aria-label={`Placeholder cover for ${project.title}`}
      className="h-full w-full"
    >
      <rect width="800" height="500" fill="var(--bg-raised)" />
      {/* background bar field */}
      {bars.map((v, i) => (
        <rect
          key={i}
          x={i * 29 + 4}
          y={500 - v * 380}
          width="18"
          height={v * 380}
          fill="var(--line)"
          opacity={0.9}
        />
      ))}
      {/* device frame */}
      {ios ? (
        <g>
          <rect
            x="300"
            y="60"
            width="200"
            height="400"
            rx="34"
            fill="var(--bg)"
            stroke="var(--fg)"
            strokeWidth="3"
          />
          <rect x="370" y="74" width="60" height="14" rx="7" fill="var(--line)" />
        </g>
      ) : (
        <g>
          <rect
            x="110"
            y="70"
            width="580"
            height="360"
            rx="14"
            fill="var(--bg)"
            stroke="var(--fg)"
            strokeWidth="3"
          />
          <line x1="110" y1="104" x2="690" y2="104" stroke="var(--line)" strokeWidth="2" />
          {[0, 1, 2].map((d) => (
            <circle key={d} cx={134 + d * 18} cy="87" r="5" fill="var(--line)" />
          ))}
        </g>
      )}
      <text
        x="400"
        y={ios ? 270 : 280}
        textAnchor="middle"
        fill="var(--fg)"
        fontFamily="var(--font-anton), Impact, sans-serif"
        fontSize={ios ? 40 : 64}
      >
        {project.title.toUpperCase()}
      </text>
      <text
        x="400"
        y={ios ? 304 : 322}
        textAnchor="middle"
        fill="var(--accent)"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="15"
      >
        {project.stack.slice(0, ios ? 2 : 3).join(" · ")}
      </text>
      <text
        x="24"
        y="40"
        fill="var(--muted)"
        fontFamily="var(--font-jetbrains), monospace"
        fontSize="16"
      >
        P {String(index + 1).padStart(2, "0")}
      </text>
    </svg>
  );
}
