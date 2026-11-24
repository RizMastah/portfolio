// All projects (PRD §6.2, §6.3, schema in Appendix A).
// `draft: true` = data still missing or not cleared for publishing; never rendered.
//
// Two separate facts per project (owner's decision, v1.6):
// - `type`: what the project IS (one value, used for the /work filter)
// - `myRole`: what Raihan did in it (free text, shown on every project)
// Descriptions come from the owner, the projects' READMEs and their posters.

export type ProjectType = "Web" | "Mobile" | "Desktop" | "UI/UX" | "Animation" | "Other";

export const projectTypes: ProjectType[] = [
  "Web",
  "Mobile",
  "Desktop",
  "UI/UX",
  "Animation",
  "Other",
];

export type Project = {
  slug: string;
  title: string;
  oneLiner: string;
  semester: number | null;
  period: string;
  campus?: "UII" | "NXU";
  /** Course, competition or other context. */
  course?: string;
  type: ProjectType;
  /** How the type is shown, e.g. "iOS app" or "Desktop app (JavaFX)". */
  typeLabel: string;
  /** What Raihan did, in plain words. */
  myRole: string;
  team?: number;
  stack: string[];
  links?: { repo?: string; live?: string; figma?: string; video?: string; demo?: string };
  award?: string;
  featured?: boolean;
  /** Device frame of the generated placeholder, used when there is no `cover`. */
  mockupFrame: "web" | "ios";
  /**
   * 2:1 card image cut from a real source (screenshot, banner or poster);
   * shown inside CoverFrame with the type and year. No cover = typographic frame.
   */
  cover?: string;
  /** Full project poster, opened in the lightbox. */
  poster?: { src: string; width: number; height: number };
  /** Real screenshots shown on the case-study page. */
  gallery?: { src: string; alt: string; width: number; height: number }[];
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
    type: "Web",
    typeLabel: "Web app",
    myRole: "Backend lead: Formula Engine, Stats Engine, API routes and the Groq integration.",
    team: 3,
    stack: ["TypeScript", "Next.js", "Supabase PostgreSQL", "Groq Llama 3.3 70B"],
    links: {
      repo: "https://github.com/RizMastah/kawalbijak",
      live: "https://kawalbijak.vercel.app",
    },
    award: "2nd Place, Web Development, TechSprint Innovation Cup 2026",
    featured: true,
    mockupFrame: "web",
    cover: "/projects/kawalbijak/stage.webp",
    gallery: [
      {
        src: "/projects/kawalbijak/landingpage.webp",
        alt: "Landing page",
        width: 1429,
        height: 933,
      },
      {
        src: "/projects/kawalbijak/dampak.webp",
        alt: "Impact page: policy ledger, AI advisor and what-if simulator",
        width: 1335,
        height: 922,
      },
      {
        src: "/projects/kawalbijak/policy.webp",
        alt: "Policy detail: gap score, report distribution and regional signals",
        width: 1359,
        height: 903,
      },
      { src: "/projects/kawalbijak/gapScore.webp", alt: "Gap score", width: 960, height: 956 },
      {
        src: "/projects/kawalbijak/adaptasiFinansial.webp",
        alt: "Financial adaptation advice",
        width: 779,
        height: 997,
      },
    ],
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
    type: "Mobile",
    typeLabel: "iOS app",
    myRole:
      "Solo: the app, rep counting, the recommendation engine and the squat-form model trained in PyTorch.",
    team: 1,
    stack: ["SwiftUI", "PyTorch", "Core ML", "Apple Vision", "HealthKit"],
    links: { repo: "https://github.com/RizMastah/Lifty" },
    featured: true,
    mockupFrame: "ios",
    cover: "/projects/lifty/stage.webp",
    gallery: [
      {
        src: "/projects/lifty/today.webp",
        alt: "Today: weekly goal, calories and the next workout",
        width: 504,
        height: 1051,
      },
      {
        src: "/projects/lifty/camera-coach.webp",
        alt: "Camera Coach: live pose tracking with rep count and form score",
        width: 509,
        height: 1067,
      },
      {
        src: "/projects/lifty/progress.webp",
        alt: "Progress: weekly streak and trend",
        width: 516,
        height: 1052,
      },
    ],
  },
  {
    slug: "nexaorder",
    title: "NexaOrder",
    oneLiner:
      "Order management for small businesses on Spring Boot, built around 8 design patterns and an order state machine.",
    semester: 6,
    period: "Jun 2026",
    campus: "NXU",
    course: "J2EE-Based Framework for Enterprise",
    type: "Web",
    typeLabel: "Web app",
    myRole: "Solo: domain model, 8-table database, service layer and design patterns.",
    team: 1,
    stack: ["Spring Boot", "Java 17", "MySQL", "Thymeleaf"],
    links: { repo: "https://github.com/RizMastah/nexaorder" },
    featured: true,
    mockupFrame: "web",
    cover: "/projects/nexaorder/stage.webp",
    gallery: [
      {
        src: "/projects/nexaorder/dashboard.webp",
        alt: "Admin dashboard: totals, low-stock alert and charts",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/nexaorder/orders.webp",
        alt: "Orders: status, payment state and the next legal action",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/nexaorder/order-detail.webp",
        alt: "Order detail with payment and status timeline",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/nexaorder/reports.webp",
        alt: "Reports: monthly filter, Chart.js charts and CSV export",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/nexaorder/products.webp",
        alt: "Product catalogue with stock levels",
        width: 1600,
        height: 1000,
      },
      {
        src: "/projects/nexaorder/invoice.webp",
        alt: "Printable invoice",
        width: 1600,
        height: 1000,
      },
    ],
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
    type: "Mobile",
    typeLabel: "iOS app",
    myRole:
      "Solo: the app, the math recognition pipeline and solver, and the on-device classifier.",
    team: 1,
    stack: ["SwiftUI", "Core ML", "Apple Vision", "Firebase", "Groq"],
    links: { repo: "https://github.com/RizMastah/StudyLens" },
    featured: true,
    mockupFrame: "ios",
    cover: "/projects/studylens/stage.webp",
    gallery: [
      ["home", "Home dashboard"],
      ["math-scanner", "Math scanner"],
      ["math-result", "Solved equation with steps"],
      ["math-explanation", "Step-by-step explanation"],
      ["scan-notes", "Scanning notes"],
      ["flashcards", "Flashcard decks"],
      ["card-review", "Flashcard review"],
      ["study-tracker", "Study tracker"],
    ].map(([f, alt]) => ({ src: `/projects/studylens/${f}.webp`, alt, width: 420, height: 910 })),
  },
  {
    slug: "tourease",
    title: "TourEase",
    oneLiner:
      "Data-driven tourism analytics: dashboards for tourism authorities, attraction owners and travelers, with Gemini-powered recommendations and interactive maps.",
    semester: 4,
    period: "2025",
    campus: "UII",
    course: "Information Systems Development",
    type: "Web",
    typeLabel: "Web app",
    myRole: "Database design: schema, table relations and seed data.",
    team: 5,
    stack: ["Next.js", "Express", "Prisma", "MySQL", "Gemini AI"],
    links: { repo: "https://github.com/akramsu/E-Tourism" },
    mockupFrame: "web",
    cover: "/projects/tourease/stage.webp",
    poster: { src: "/projects/tourease/poster.webp", width: 1600, height: 2266 },
  },
  {
    slug: "sangkuriang",
    title: "The Legend of Sangkuriang",
    oneLiner: "Animated retelling of the West Javanese legend, coded in Java with Processing.",
    semester: 4,
    period: "2025",
    campus: "UII",
    type: "Animation",
    typeLabel: "Animation (Processing)",
    myRole: "Story, sound effects and most of the code.",
    team: 3,
    stack: ["Java", "Processing"],
    links: { video: "https://youtu.be/2N7p4n-RD9w" },
    mockupFrame: "web",
    cover: "/projects/sangkuriang/stage.webp",
    poster: { src: "/projects/sangkuriang/poster.webp", width: 896, height: 1280 },
  },
  {
    slug: "campusconnect",
    title: "CampusConnect",
    oneLiner:
      "Web platform for campus communities: join student groups, discover events and follow campus news.",
    semester: 3,
    period: "2024",
    campus: "UII",
    course: "Web-Based Application Development & Computer Networks",
    type: "Web",
    typeLabel: "Web app",
    myRole: "UI.",
    stack: ["PHP", "MySQL"],
    links: { repo: "https://github.com/amga-d/CampusConnect" },
    award: "Finalist, Informatics Expo 2024/2025",
    mockupFrame: "web",
    cover: "/projects/campusconnect/stage.webp",
    poster: { src: "/projects/campusconnect/poster.webp", width: 1600, height: 2264 },
  },
  {
    slug: "edu-hub",
    title: "Edu-Hub",
    oneLiner:
      "Desktop learning app with courses and quizzes, a forum, mentor chat and progress tracking.",
    semester: 2,
    period: "2024",
    campus: "UII",
    type: "Desktop",
    typeLabel: "Desktop app (JavaFX)",
    myRole: "UI/UX design in Figma.",
    stack: ["Java", "JavaFX", "Figma", "Scene Builder"],
    links: { repo: "https://github.com/amga-d/Edu-Hub" },
    mockupFrame: "web",
    cover: "/projects/edu-hub/stage.webp",
    poster: { src: "/projects/edu-hub/poster.webp", width: 1600, height: 2265 },
  },
  {
    slug: "seascope",
    title: "SeaScope",
    oneLiner:
      "Mobile app concept against marine pollution: learn about ocean pollution, report coastal problems with photos, and trade beach waste for reward points.",
    semester: 1,
    period: "2023",
    campus: "UII",
    type: "UI/UX",
    typeLabel: "Mobile app prototype (Figma)",
    myRole: "Team leader.",
    team: 4,
    stack: ["Figma"],
    links: {
      figma:
        "https://www.figma.com/proto/H9A4WQdylnMfpIvksfpqIm/Sea-Scope?node-id=7-31&starting-point-node-id=1%3A2",
    },
    mockupFrame: "ios",
    cover: "/projects/seascope/stage.webp",
    poster: { src: "/projects/seascope/poster.webp", width: 1600, height: 2265 },
  },
  // Cleared for publishing by the owner (v1.6). Details from the owner's CV.
  // The repo is still private (in development), so no link yet.
  {
    slug: "tabula",
    title: "TABULA",
    oneLiner:
      "Learn-by-teaching web app: you teach an AI student, and a rule-based + LLM guard blocks anything it hasn’t been taught.",
    semester: 7,
    period: "Nov 2026 – present",
    campus: "NXU",
    type: "Web",
    typeLabel: "Web app",
    myRole: "Solo: building it end to end, with 600+ tests so far.",
    team: 1,
    stack: ["Python", "FastAPI", "React", "PostgreSQL"],
    mockupFrame: "web",
  },
];

/** Year shown on the cover, taken from the period ("Apr – May 2026" → "2026"). */
export function projectYear(p: Project) {
  return p.period.match(/\d{4}/g)?.at(-1) ?? "";
}

/** "Team of 3. Backend lead: …", or just the role for solo projects. */
export function describeMyRole(p: Project) {
  return p.team && p.team > 1 ? `Team of ${p.team}. ${p.myRole}` : p.myRole;
}

export const publishedProjects = projects.filter((p) => !p.draft);
export const featuredProjects = publishedProjects.filter((p) => p.featured);
