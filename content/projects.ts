// All projects (PRD §6.2, §6.3, schema in Appendix A).
// `draft: true` = data still missing; never rendered.

export type ProjectCategory = "Data & ML" | "Backend" | "Mobile" | "Web" | "UI/UX" | "Other";

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  semester: number | null;
  period: string;
  campus?: "UII" | "NXU";
  course?: string;
  category: ProjectCategory[];
  role: string;
  team?: number;
  stack: string[];
  links?: { repo?: string; live?: string; figma?: string; demo?: string };
  award?: string;
  featured?: boolean;
  /** Device frame for the placeholder mockup. */
  platform: "web" | "ios";
  /** Path under /public; falls back to the generated mockup when absent. */
  cover?: string;
  draft?: boolean;
};

export const projects: Project[] = [
  {
    slug: "kawalbijak",
    title: "KawalBijak",
    oneLiner: "PostgreSQL-backed platform with statistical anomaly detection.",
    semester: 6,
    period: "Apr – May 2026",
    course: "TechSprint Innovation Cup 2026",
    category: ["Backend", "Data & ML"],
    role: "Backend Lead",
    team: 3,
    stack: ["PostgreSQL", "TypeScript", "Anomaly detection"],
    links: {
      repo: "https://github.com/RizMastah/kawalbijak",
      live: "https://kawalbijak.vercel.app",
    },
    award: "2nd Place, Web Development, TechSprint Innovation Cup 2026",
    featured: true,
    platform: "web",
  },
  {
    slug: "lifty",
    title: "Lifty",
    oneLiner:
      "iOS fitness coach that checks squat form on-device with a PyTorch model converted to Core ML.",
    semester: 6,
    period: "Jun 2026",
    campus: "NXU",
    course: "iOS Application Development",
    category: ["Data & ML", "Mobile"],
    role: "Solo project",
    team: 1,
    stack: ["SwiftUI", "PyTorch", "Core ML", "Apple Vision", "HealthKit"],
    links: { repo: "https://github.com/RizMastah/Lifty" },
    featured: true,
    platform: "ios",
  },
  {
    slug: "nexaorder",
    title: "NexaOrder",
    oneLiner:
      "Order management for small businesses on Spring Boot, built around 8 design patterns and an order state machine.",
    // Period from the repo README; semester and course: [OWNER DATA]
    semester: 6,
    period: "Jun 2026",
    campus: "NXU",
    category: ["Backend"],
    role: "Solo project",
    team: 1,
    stack: ["Spring Boot", "Java 17", "MySQL", "Thymeleaf"],
    links: { repo: "https://github.com/RizMastah/nexaorder" },
    featured: true,
    platform: "web",
  },
  {
    slug: "studylens",
    title: "StudyLens",
    oneLiner:
      "Camera-first iOS study app: scan an equation for step-by-step solutions, turn notes into flashcards, track study time.",
    semester: 6,
    period: "Jun – Jul 2026",
    campus: "NXU",
    course: "iOS Application Development (final project)",
    category: ["Mobile", "Data & ML"],
    role: "Solo project",
    team: 1,
    stack: ["SwiftUI", "Core ML", "Apple Vision", "Firebase"],
    links: { repo: "https://github.com/RizMastah/StudyLens" },
    featured: true,
    platform: "ios",
  },
  {
    slug: "tourease",
    title: "TourEase (E-Tourism)",
    oneLiner: "Tourism platform; designed the database schema, relations and seed data.",
    semester: null,
    period: "2025",
    campus: "UII",
    category: ["Backend"],
    role: "Database design",
    team: 5,
    stack: ["SQL"],
    links: { repo: "https://github.com/akramsu/E-Tourism" },
    platform: "web",
  },
  {
    slug: "campusconnect",
    title: "CampusConnect",
    oneLiner: "Campus app UI; Informatics Expo finalist.",
    semester: null,
    period: "2024/2025",
    campus: "UII",
    category: ["UI/UX"],
    role: "UI",
    stack: ["UI design"],
    award: "Finalist, Informatics Expo 2024/2025",
    platform: "web",
  },
  // [OWNER DATA] — hidden until confirmed
  {
    slug: "tabula",
    title: "TABULA",
    oneLiner: "",
    semester: 7,
    period: "Nov 2026 – present",
    category: ["Data & ML"],
    role: "Creator",
    stack: [],
    platform: "web",
    draft: true,
  },
  {
    slug: "edu-hub",
    title: "Edu-Hub",
    oneLiner: "",
    semester: null,
    period: "",
    campus: "UII",
    category: ["UI/UX"],
    role: "UI/UX",
    stack: ["Figma"],
    platform: "web",
    draft: true,
  },
  {
    slug: "seascope",
    title: "SeaScope",
    oneLiner: "",
    semester: null,
    period: "",
    campus: "UII",
    category: ["Other"],
    role: "Team leader",
    stack: [],
    platform: "web",
    draft: true,
  },
  {
    slug: "sangkuriang",
    title: "The Legend of Sangkuriang",
    oneLiner: "",
    semester: null,
    period: "",
    campus: "UII",
    category: ["Other"],
    role: "Story, sound, most of the code",
    stack: ["Java", "Processing"],
    platform: "web",
    draft: true,
  },
];

export const publishedProjects = projects.filter((p) => !p.draft);
export const featuredProjects = publishedProjects.filter((p) => p.featured);
