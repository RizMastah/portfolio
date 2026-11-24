export type Certificate = { src: string; alt: string; width: number; height: number };

export const awards: {
  title: string;
  event: string;
  detail: string;
  year: string;
  certificates: Certificate[];
}[] = [
  {
    title: "2nd Place, Web Development",
    event: "TechSprint Innovation Cup 2026",
    detail: "Codelab Indonesia · team labulada · project KawalBijak",
    year: "2026",
    certificates: [
      {
        src: "/certificates/techsprint-2026-team.webp",
        alt: "TechSprint Innovation Cup 2026 certificate, team labulada",
        width: 1600,
        height: 1131,
      },
      {
        src: "/certificates/techsprint-2026-raihan.webp",
        alt: "TechSprint Innovation Cup 2026 certificate, Raihan Aditito Bagastama",
        width: 1600,
        height: 1131,
      },
    ],
  },
  {
    title: "Finalist",
    event: "Informatics Expo 2024/2025",
    detail: "Project CampusConnect · Web-Based Application Development & Computer Networks",
    year: "2025",
    certificates: [
      {
        src: "/certificates/informatics-expo-2024-2025.webp",
        alt: "Informatics Expo 2024/2025 finalist certificate",
        width: 1600,
        height: 1130,
      },
    ],
  },
];
