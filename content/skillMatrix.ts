import { type Project, publishedProjects } from "./projects";

/**
 * Skill × project evidence: which skill shows up in which project, derived
 * from each project's stack (and, for a few skills, its one-liner). Nothing is
 * entered by hand per cell, so the matrix can't claim more than the projects do.
 */
type Rule = { skill: string; group: string; match: (p: Project) => boolean };

const stackHas = (p: Project, re: RegExp) => p.stack.some((s) => re.test(s));
const DB = /mysql|postgres|supabase|prisma|firebase/i;

const rules: Rule[] = [
  { skill: "Python", group: "Data & ML", match: (p) => stackHas(p, /python|pytorch|fastapi/i) },
  { skill: "PyTorch", group: "Data & ML", match: (p) => stackHas(p, /pytorch/i) },
  { skill: "Core ML", group: "Data & ML", match: (p) => stackHas(p, /core ml/i) },
  { skill: "Apple Vision", group: "Data & ML", match: (p) => stackHas(p, /apple vision/i) },
  {
    skill: "LLM APIs",
    group: "Data & ML",
    match: (p) => stackHas(p, /groq|gemini|llama|openai/i) || /\bLLM\b/.test(p.oneLiner),
  },
  {
    skill: "Anomaly detection",
    group: "Data & ML",
    match: (p) => /anomal/i.test(p.oneLiner),
  },
  {
    skill: "SQL",
    group: "Backend & DB",
    match: (p) => stackHas(p, /mysql|postgres|supabase|prisma/i),
  },
  { skill: "PostgreSQL", group: "Backend & DB", match: (p) => stackHas(p, /postgres/i) },
  { skill: "MySQL", group: "Backend & DB", match: (p) => stackHas(p, /mysql/i) },
  { skill: "Data modeling", group: "Backend & DB", match: (p) => stackHas(p, DB) },
  { skill: "Prisma", group: "Backend & DB", match: (p) => stackHas(p, /prisma/i) },
  { skill: "Firebase", group: "Backend & DB", match: (p) => stackHas(p, /firebase/i) },
  { skill: "Java", group: "Backend & DB", match: (p) => stackHas(p, /java|spring/i) },
  { skill: "Spring Boot", group: "Backend & DB", match: (p) => stackHas(p, /spring/i) },
  { skill: "TypeScript", group: "Backend & DB", match: (p) => stackHas(p, /typescript/i) },
  { skill: "Swift / SwiftUI", group: "Mobile", match: (p) => stackHas(p, /swift/i) },
];

export type MatrixRow = { skill: string; group: string; cells: boolean[]; count: number };

export const matrixProjects = publishedProjects.map((p) => ({
  slug: p.slug,
  title: p.title,
  short: p.title.replace(/^The Legend of /, ""),
  featured: Boolean(p.featured),
}));

export const matrixRows: MatrixRow[] = rules
  .map((r) => {
    const cells = publishedProjects.map(r.match);
    return { skill: r.skill, group: r.group, cells, count: cells.filter(Boolean).length };
  })
  .filter((r) => r.count > 0);

/** Skills I use but no project here can prove, listed honestly as such. */
export const unprovenSkills = ["Git", "Docker"];

/** Key of one block in the matrix. */
export const cellKey = (skill: string, slug: string) => `${skill}|${slug}`;

/**
 * The used blocks in the given rows, optionally only for the given projects.
 * A sentence lights exactly these blocks, so the highlight never shows more
 * than the sentence says.
 */
function cellsOf(skills: string[], slugs?: string[]) {
  const out: string[] = [];
  for (const r of matrixRows) {
    if (!skills.includes(r.skill)) continue;
    r.cells.forEach((used, j) => {
      const slug = matrixProjects[j].slug;
      if (used && (!slugs || slugs.includes(slug))) out.push(cellKey(r.skill, slug));
    });
  }
  return out;
}
const countOf = (skill: string) => matrixRows.find((r) => r.skill === skill)?.count ?? 0;
const projectsUsing = (skills: string[]) =>
  matrixProjects.filter((_, j) => matrixRows.some((r) => skills.includes(r.skill) && r.cells[j]));

const blocks = matrixRows.reduce((n, r) => n + r.count, 0);
const onDevice = projectsUsing(["PyTorch", "Core ML"]);

/**
 * The story beside the matrix. Every number is computed from the rows above;
 * `cells` are exactly the blocks that sentence talks about.
 */
export const matrixStory: { id: string; parts: (string | { n: string })[]; cells: string[] }[] = [
  {
    id: "all",
    parts: [
      { n: String(matrixProjects.length) },
      " projects, ",
      { n: String(matrixRows.length) },
      " skills, ",
      { n: String(blocks) },
      " blocks. Each block is one skill used in one project.",
    ],
    cells: cellsOf(matrixRows.map((r) => r.skill)),
  },
  {
    id: "db",
    parts: [
      "Databases are the backbone: SQL shows up in ",
      { n: `${countOf("SQL")} of ${matrixProjects.length}` },
      " projects, and data modeling in ",
      { n: String(countOf("Data modeling")) },
      ".",
    ],
    cells: cellsOf(["SQL", "Data modeling"]),
  },
  {
    id: "ml",
    parts: [
      "Machine learning runs on-device: PyTorch, Core ML and Apple Vision power ",
      { n: onDevice.map((p) => p.title).join(" and ") },
      ".",
    ],
    cells: cellsOf(
      ["PyTorch", "Core ML", "Apple Vision"],
      onDevice.map((p) => p.slug),
    ),
  },
  {
    id: "llm",
    parts: [
      "LLM APIs appear in ",
      { n: String(countOf("LLM APIs")) },
      " projects; KawalBijak pairs them with statistical anomaly detection.",
    ],
    cells: [...cellsOf(["LLM APIs"]), ...cellsOf(["Anomaly detection"], ["kawalbijak"])],
  },
  {
    id: "java",
    parts: [
      "Java carried the early semesters, from a desktop app to an animation, then ",
      { n: "Spring Boot" },
      " for NexaOrder.",
    ],
    cells: [...cellsOf(["Java"]), ...cellsOf(["Spring Boot"], ["nexaorder"])],
  },
];
