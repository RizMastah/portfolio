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

const rowsOf = (skills: string[]) =>
  matrixRows.filter((r) => skills.includes(r.skill)).map((r) => r.skill);
const countOf = (skill: string) => matrixRows.find((r) => r.skill === skill)?.count ?? 0;
const projectsUsing = (skills: string[]) =>
  matrixProjects.filter((_, j) => matrixRows.some((r) => skills.includes(r.skill) && r.cells[j]));

const blocks = matrixRows.reduce((n, r) => n + r.count, 0);
const dbSkills = ["SQL", "PostgreSQL", "MySQL", "Data modeling", "Prisma", "Firebase"];
const mlSkills = ["Python", "PyTorch", "Core ML", "Apple Vision"];

/**
 * The story beside the matrix. Every number is computed from the rows above;
 * `rows` is what lights up while that sentence is being read.
 */
export const matrixStory: { id: string; parts: (string | { n: string })[]; rows: string[] }[] = [
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
    rows: matrixRows.map((r) => r.skill),
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
    rows: rowsOf(dbSkills),
  },
  {
    id: "ml",
    parts: [
      "Machine learning runs on-device: PyTorch, Core ML and Apple Vision power ",
      {
        n: projectsUsing(["PyTorch", "Core ML"])
          .map((p) => p.title)
          .join(" and "),
      },
      ".",
    ],
    rows: rowsOf(mlSkills),
  },
  {
    id: "llm",
    parts: [
      "LLM APIs appear in ",
      { n: String(countOf("LLM APIs")) },
      " projects; KawalBijak pairs them with statistical anomaly detection.",
    ],
    rows: rowsOf(["LLM APIs", "Anomaly detection"]),
  },
  {
    id: "java",
    parts: [
      "Java carried the early semesters, from a desktop app to an animation, then ",
      { n: "Spring Boot" },
      " for NexaOrder.",
    ],
    rows: rowsOf(["Java", "Spring Boot"]),
  },
];
