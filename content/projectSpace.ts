import { type Project, projectYear, publishedProjects } from "./projects";

/**
 * "Embedding space" for the project map: every project becomes a feature
 * vector (its stack, its type, and a few broader skill groups), and PCA
 * projects those vectors onto two axes. Similar projects land near each other.
 * Computed once at module load; deterministic, no randomness.
 */

// Broader groups so that e.g. MySQL and PostgreSQL count as related.
const GROUPS: Record<string, RegExp> = {
  "ml/ai": /pytorch|core ml|vision|groq|gemini|llama|llm/i,
  database: /mysql|postgres|prisma|supabase|firebase/i,
  java: /java|spring|processing|javafx/i,
  "web stack": /next|react|express|php|fastapi|thymeleaf|typescript/i,
  apple: /swiftui|core ml|apple|healthkit/i,
  design: /figma|scene builder/i,
};
const GROUP_WEIGHT = 1.6;
const TYPE_WEIGHT = 1.2;

function features(p: Project): Map<string, number> {
  const f = new Map<string, number>();
  for (const s of p.stack) f.set(`stack:${s.toLowerCase()}`, 1);
  f.set(`type:${p.type}`, TYPE_WEIGHT);
  for (const [g, re] of Object.entries(GROUPS)) {
    if (p.stack.some((s) => re.test(s))) f.set(`group:${g}`, GROUP_WEIGHT);
  }
  return f;
}

/** Top `k` principal components of a centered matrix, by power iteration with deflation. */
function principalComponents(rows: number[][], k: number): number[][] {
  const d = rows[0].length;
  const cov = Array.from({ length: d }, () => new Array<number>(d).fill(0));
  for (const r of rows)
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) cov[i][j] += r[i] * r[j];
  const comps: number[][] = [];
  for (let c = 0; c < k; c++) {
    // Deterministic start vector.
    let v = Array.from({ length: d }, (_, i) => 1 + ((i * 7919) % 13) / 13);
    for (let it = 0; it < 200; it++) {
      const next = cov.map((row) => row.reduce((s, x, j) => s + x * v[j], 0));
      const norm = Math.hypot(...next) || 1;
      v = next.map((x) => x / norm);
    }
    const lambda = cov.reduce(
      (s, row, i) => s + v[i] * row.reduce((t, x, j) => t + x * v[j], 0),
      0,
    );
    for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) cov[i][j] -= lambda * v[i] * v[j];
    comps.push(v);
  }
  return comps;
}

export type SpacePoint = {
  slug: string;
  title: string;
  type: Project["type"];
  typeLabel: string;
  year: string;
  featured: boolean;
  image: string | null;
  /** Position in 0–1 on each axis. */
  x: number;
  y: number;
};

function build() {
  const projects = publishedProjects;
  const vecs = projects.map(features);
  const keys = [...new Set(vecs.flatMap((v) => [...v.keys()]))].sort();
  const matrix = vecs.map((v) => keys.map((k) => v.get(k) ?? 0));
  const mean = keys.map((_, j) => matrix.reduce((s, r) => s + r[j], 0) / matrix.length);
  const centered = matrix.map((r) => r.map((x, j) => x - mean[j]));
  const [pc1, pc2] = principalComponents(centered, 2);
  const raw = centered.map((r) => [
    r.reduce((s, x, j) => s + x * pc1[j], 0),
    r.reduce((s, x, j) => s + x * pc2[j], 0),
  ]);

  // Scale into 0.1–0.9 so labels have room at the edges.
  const scale = (vals: number[]) => {
    const lo = Math.min(...vals);
    const hi = Math.max(...vals);
    return vals.map((v) => 0.1 + (0.8 * (v - lo)) / (hi - lo || 1));
  };
  const xs = scale(raw.map((r) => r[0]));
  const ys = scale(raw.map((r) => r[1]));

  // Push apart points that would overlap (identical vectors land on one spot).
  for (let pass = 0; pass < 40; pass++) {
    for (let a = 0; a < xs.length; a++) {
      for (let b = a + 1; b < xs.length; b++) {
        const dx = xs[b] - xs[a];
        const dy = ys[b] - ys[a];
        const dist = Math.hypot(dx, dy);
        const min = 0.09;
        if (dist < min) {
          const push = (min - dist) / 2;
          const ux = dist ? dx / dist : Math.cos(a + b);
          const uy = dist ? dy / dist : Math.sin(a + b);
          xs[a] -= ux * push;
          ys[a] -= uy * push;
          xs[b] += ux * push;
          ys[b] += uy * push;
        }
      }
    }
  }

  const points: SpacePoint[] = projects.map((p, i) => ({
    slug: p.slug,
    title: p.title,
    type: p.type,
    typeLabel: p.typeLabel,
    year: projectYear(p),
    featured: Boolean(p.featured),
    image: p.poster?.src ?? p.cover ?? null,
    x: Math.min(0.94, Math.max(0.06, xs[i])),
    y: Math.min(0.92, Math.max(0.08, ys[i])),
  }));

  // Strongest features of each axis, used as axis captions.
  const topOf = (pc: number[]) =>
    keys
      .map((k, j) => ({ k, w: pc[j] }))
      .sort((a, b) => Math.abs(b.w) - Math.abs(a.w))
      .slice(0, 2)
      .map(({ k }) => k.split(":")[1]);

  return { points, axes: { x: topOf(pc1), y: topOf(pc2) }, dims: keys.length };
}

export const projectSpace = build();
