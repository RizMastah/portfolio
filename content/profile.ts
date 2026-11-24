// Profile content (PRD §6.1, §6.5–6.9). Items marked [OWNER DATA] in the PRD
// stay out of this file until the owner supplies them.

export const profile = {
  name: "Raihan Aditito Bagastama",
  shortName: "Raihan",
  initials: "RAB",
  taglines: [
    "Software Engineering student.",
    "Data & AI/ML builder.",
    "Backend lead, 2nd place at TechSprint 2026.",
    "Hidup tenang, bebas nafas, nasi padang, kopi panas.",
  ],
  intro:
    "Software Engineering student on a 2+2 double degree between Indonesia and China. I train models, design databases, and build the backends that connect them.",
  /** About section: built only from confirmed facts (PRD §6.5–6.7, case studies). */
  about: [
    "I started Informatics at Universitas Islam Indonesia in 2023 and moved to Nanjing Xiaozhuang University in 2025 for the Software Engineering half of a 2+2 double degree.",
    "Along the way I graded and prepared material as a teaching assistant, led the backend of the team that took 2nd place at TechSprint Innovation Cup 2026, and trained my own on-device models for two iOS apps.",
  ],
  status: "Open to opportunities",
  info: [
    { label: "Role", value: "Software Engineering student · Data, AI/ML & Backend" },
    { label: "Base", value: "Nanjing, China (from Tangerang, Indonesia)" },
    {
      label: "Stack",
      value: "Python / SQL / PostgreSQL / PyTorch / Core ML / TypeScript / Spring Boot",
    },
    { label: "Focus", value: "Data engineering, AI/ML & backend roles" },
  ],
  location: { city: "Nanjing", timeZone: "Asia/Shanghai", utcLabel: "UTC+8" },
  contact: {
    email: "raihanaditito@gmail.com",
    linkedin: "https://www.linkedin.com/in/raihan-aditito",
    github: "https://github.com/RizMastah",
    instagram: "https://instagram.com/raihan_aditito",
  },
  /** Profile photo for the About section (from the owner's old portfolio). */
  photo: { src: "/profile-raihan.webp", width: 900, height: 900 },
  cvPath: "/cv",
  footerLine: "Hand-built between Tangerang and Nanjing.",
} as const;

export const education = [
  {
    school: "Nanjing Xiaozhuang University",
    place: "Nanjing, China",
    degree: "Software Engineering (double degree)",
    period: "Sep 2025 – present",
    gpa: "4.3 / 5.0",
  },
  {
    school: "Universitas Islam Indonesia (UII)",
    place: "Yogyakarta, Indonesia",
    degree: "Informatics, International Program (double degree)",
    period: "Sep 2023 – 2025",
    gpa: "3.84 / 4.00",
  },
] as const;

export const experience = [
  {
    title: "Teaching Assistant, Software Engineering",
    org: "Universitas Islam Indonesia",
    period: "Mar – Jul 2025",
    description:
      "Assisted the lecturer by grading assignments for about 20 students and preparing course materials.",
  },
] as const;

export const organizations = [
  {
    name: "IMIX (Indonesian Student Association at Xiaozhuang)",
    role: "Member, Sports & Recreation Division",
    period: "Sep 2026 – present",
    description:
      "Organizes the IMIX Sports Championship (ISC) and recreation activities for Indonesian students.",
  },
  {
    name: "Porsematik HMIF LEM FTI UII 2024",
    role: "Staff, Public Relations & Transportation Department",
    period: "2024",
    description: null,
  },
] as const;

export const languages = [
  { name: "Indonesian", level: "Native" },
  { name: "English", level: "Professional working proficiency" },
  { name: "Mandarin", level: "Elementary" },
] as const;

export const skills = [
  {
    group: "Data & ML",
    items: [
      "Python",
      "PyTorch",
      "Core ML",
      "Apple Vision",
      "Data modeling",
      "Anomaly detection",
      "LLM APIs",
    ],
  },
  {
    group: "Backend & Database",
    items: ["SQL", "PostgreSQL", "MySQL", "Prisma", "Java (Spring Boot)", "TypeScript", "Firebase"],
  },
  { group: "Mobile", items: ["Swift", "SwiftUI"] },
  { group: "Tools", items: ["Git", "Docker"] },
] as const;
