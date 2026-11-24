# PRD: Personal Portfolio Website — Raihan Aditito Bagastama

**Version:** 1.1 (24 November 2026)
**Owner:** Raihan Aditito Bagastama (GitHub: RizMastah)
**Built with:** Claude Code
**Deployment:** Vercel
**Design reference:** https://yeahright.co/ (Tom Barrow's portfolio), analyzed in depth with REA (https://github.com/morluto/rea)

### Changelog

- **1.2 (24 Nov 2026):**
  - Typography direction set to "bold but controlled".
  - Added time-of-day palettes based on Nanjing time.
  - Easter egg chosen: the `sql` panel.
  - Motion values now come from the REA measurements in `docs/reference-notes.md` §5b.
- **1.1 (24 Nov 2026):**
  - Positioning broadened beyond internships: Data, AI/ML & Backend. Availability is now a generic, editable status, with no fixed dates.
  - Clock now shows Raihan's time (Nanjing) next to the visitor's own time zone, detected automatically.
  - All projects from semesters 1–6 are included: featured case studies, plus an organized, filterable archive at `/work`.
  - Placeholder mockups are used until real screenshots exist.
  - REA analysis scope expanded: layout, motion and interaction are studied in detail.
  - Added the project intake template (Appendix A).
- **1.0 (24 Nov 2026):** first version.

---

## 1. Summary

A portfolio site with a home page, an all-projects archive, and one case-study page per featured project. The site introduces Raihan as a Software Engineering student (UII × Nanjing Xiaozhuang University double degree) focused on **data engineering, AI/ML and backend**. The site is not limited to internship hunting. It serves recruiters, collaborators and anyone evaluating Raihan's work.

From yeahright.co the site takes structure, motion and character: taglines with personality, a compact info panel, small interaction details, and a strong contact section. Projects are presented as **technical case studies**, not a video carousel.

## 2. Goals and success metrics

| Goal                                                         | Metric                                                                                                                                                   |
| ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A visitor understands who Raihan is within 5 seconds         | Name, role, availability status and the CV button are visible on the first screen, without scrolling, on desktop and mobile                              |
| The best projects are easy to evaluate                       | Every featured project has a case-study page: problem, role, architecture, results, repo link                                                            |
| The full body of work is visible without clutter             | Every project from semesters 1–6 is listed on `/work`, grouped and filterable. The home page shows only the featured projects plus a link to the archive |
| Fast to load, including on mobile with an average connection | Lighthouse mobile: Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, Best Practices ≥ 95. LCP < 2.5 s                                                      |
| Easy to contact                                              | Email (copy button), LinkedIn, GitHub and CV download are reachable within 1 click from anywhere                                                         |
| Easy to update                                               | All content lives in one typed data folder (TypeScript/MDX). Adding a project requires no component changes                                              |

**Primary users:** recruiters and HR (often on mobile, short attention). **Secondary users:** engineering interviewers and collaborators (read case studies and repos in detail).

## 3. Reference analysis with REA

The reference is studied in depth so the site can match its quality of structure, motion and interaction.

**Analysis steps (done by Claude Code first; results saved to `docs/reference-notes.md`):**

1. Use REA (the `reverse-engineer-anything` skill, or `npx rea-agents setup` following the official README).
2. Analyze yeahright.co in detail, covering:
   - section structure and layout grid
   - scroll behavior
   - how the project carousel works
   - custom cursor
   - running clock
   - page and text transitions, including easing curves, durations and stagger timings
   - responsive breakpoints
   - libraries used (the site lists Next.js, Astro, WebGL)
3. Write the notes as patterns, measurements and techniques, for example: "hero text reveals line by line, ~80 ms stagger, ease-out-expo, 0.9 s".

**Implementation rules:**

- The site's code is written from scratch, using the techniques documented in the notes. The reference's source code, text, images, video, icons and licensed fonts are not reproduced.
- All text comes from section 6.
- The palette and fonts are chosen to match the reference's mood (dark, calm, one accent). Fonts come from freely licensed sources only (Google Fonts / Fontshare).

**Taken from the reference:**

- Hero with rotating taglines (serious + one playful).
- Labeled info panel: Role / Base / Stack / Focus.
- Availability status in the contact section, copy-email button.
- A running clock as a small detail (adapted, see 5.1).
- A personal line in the footer.
- One small, non-intrusive easter egg.
- Layout rhythm, motion timing and interaction feel, as documented in the notes.

**Deliberately not taken:**

- The "Click to enter" gate. Content must be visible immediately.
- Autoplay audio. If there is sound, it is **off** by default with a toggle.
- Projects as a heavy video carousel. Replaced with project cards + case-study pages + an archive.

## 4. Tech stack

| Area       | Choice                                                                                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| Framework  | Next.js (App Router) + TypeScript                                                                              |
| Styling    | Tailwind CSS                                                                                                   |
| Animation  | Motion (Framer Motion). GSAP only if a scroll effect can't be done with Motion. Smooth scroll optional (Lenis) |
| Content    | `content/` with typed TypeScript files for profile and project data + MDX for case studies                     |
| Diagrams   | Static SVG in `public/` (preferred), or Mermaid rendered at build time                                         |
| Images     | `next/image`, WebP/AVIF                                                                                        |
| Analytics  | Vercel Analytics + Speed Insights                                                                              |
| Quality    | ESLint, Prettier, `tsc --noEmit`, Playwright smoke tests                                                       |
| Deployment | Vercel, connected to the GitHub repo `RizMastah/portfolio` (or another name), preview deploys per branch       |

**Git:** all commits authored as `RizMastah <raihanaditito@gmail.com>`. **No** Co-Authored-By Claude trailer.

## 5. Site structure

```
/                         Home (single page, multiple sections)
/work                     All projects (semesters 1–6 and later), grouped and filterable
/work/[slug]              Project case study (featured projects only)
/cv                       Redirect to /CV_Raihan_Aditito_Bagastama.pdf
/404                      Not-found page with a personal touch
```

### 5.1 Home page sections (in order)

1. **Header**
   - Name/initials (links to top) and navigation: Work, About, Contact.
   - "CV" button, always visible.
   - Collapses to a compact menu on mobile.
2. **Hero**
   - Full name, rotating taglines, a short line about focus.
   - Two buttons: "View work" and "Download CV".
   - Status badge, with the text editable in `content/profile.ts`. Default: **"Open to opportunities"**.
3. **Info panel**
   - Role / Base / Stack / Focus (content in 6.1).
   - **Clock.** The clock shows Raihan's current time, labelled **"Nanjing · UTC+8"**. Next to it is the visitor's own local time, detected with `Intl.DateTimeFormat().resolvedOptions().timeZone`, plus the difference (e.g. "You: 14:14 · 7 h behind").
   - If the visitor is in the same zone, it shows "Same time zone as you".
   - The clock renders client-side only, to avoid hydration mismatch, with a stable-width placeholder. No location permission is requested.
4. **Selected work**
   - 4–6 featured projects as large cards: title, role, one-line impact, tech tags, image.
   - Click → case study.
   - A "See all N projects →" link to `/work`.
5. **Awards**: list of achievements.
6. **About**: short paragraph, education, experience (TA), organizations, languages.
7. **Skills**: grouped (Data & ML, Backend & Database, Mobile, Tools). No percentage progress bars.
8. **Contact**: call-to-action heading, availability status, copy-email button, LinkedIn, GitHub, CV.
9. **Footer**: © year, personal line, back-to-top button.

### 5.2 All-projects page `/work`

Keeps every project visible without making the home page long.

- **Layout:** compact rows (not big cards): title, one-liner, year/semester, role, team size, stack tags, links (repo / live / Figma / demo). Featured projects are marked and link to their case study.
- **Grouping:** by semester (Semester 1 → current), newest first, each group headed with semester + academic year + campus (UII / NXU).
- **Filter chips:** All · Data & ML · Backend · Mobile · Web · UI/UX · Other. Filters work without a page reload. The page is still usable without JS, which shows everything.
- **Sorting toggle:** By semester (default) / By category.
- Rows with missing optional fields simply omit them. No "N/A" or empty columns.
- Projects with `draft: true` are not rendered.

### 5.3 Case-study page template `/work/[slug]`

- Title, one-line summary, meta: year, role, team, stack, links (repo / live / demo).
- **Problem**: what it solves and for whom.
- **My role**: what Raihan actually built.
- **Architecture**: diagram + short explanation.
- **Technical highlights**: 3–5 concrete points.
- **Results**: verifiable numbers or outcomes.
- **What I learned / what I'd improve**: honest and short.
- Screenshot gallery (only real screenshots; mockups are not shown in the gallery).
- Navigation to the next project.

### 5.4 Project images and placeholder mockups

Real screenshots are not available yet. Until they are:

- Each project gets a generated **placeholder mockup**: an abstract cover in the site's palette, with a device frame (phone for iOS projects, browser for web projects), the project name and its main stack tags.
  - The mockups are built as SVG or with `next/og`, so no external assets are needed.
  - They contain no fake app UI, so nothing pretends to be a real screenshot.
- When real files are added to `public/projects/<slug>/`, they replace the placeholder automatically. `cover` in `content/projects.ts` falls back to the placeholder when no file is set.

## 6. Content

All content is supplied by the owner. Items marked **[OWNER DATA]** are known to the owner and will be provided using the template in Appendix A. Until then they stay `draft: true` and are not rendered. They are never filled with guesses.

### 6.1 Profile

- **Name:** Raihan Aditito Bagastama
- **Taglines (rotating):**
  - "Software Engineering student."
  - "Data & AI/ML builder."
  - "Backend lead, 2nd place at TechSprint 2026."
  - one playful tagline **[OWNER DATA]**
- **Intro:** "Software Engineering student on a 2+2 double degree between Indonesia and China. I train models, design databases, and build the backends that connect them."
- **Role:** Software Engineering student · Data, AI/ML & Backend
- **Base:** Nanjing, China (from Tangerang, Indonesia)
- **Stack:** Python, SQL, PostgreSQL, PyTorch, Core ML, TypeScript, Java (Spring Boot)
- **Focus:** Data engineering, AI/ML & backend roles
- **Status (editable):** "Open to opportunities"
- **Contact:** raihanaditito@gmail.com · linkedin.com/in/raihan-aditito · github.com/RizMastah
- **Phone number:** not shown on the site (CV only)
- **SQL easter-egg fun facts:** 4–6 short facts, e.g. coffee per day, favorite stack, current obsession **[OWNER DATA]**
- **CV:** `public/CV_Raihan_Aditito_Bagastama.pdf` (owner provides the file)

### 6.2 Featured projects (case studies)

**1. KawalBijak** (`slug: kawalbijak`)

- Apr–May 2026 · Semester 6 · Backend Lead · team of 3.
- TechSprint Innovation Cup 2026, 2nd Place Web Development.
- PostgreSQL-backed platform with statistical anomaly detection.
- Live: https://kawalbijak.vercel.app · Repo: https://github.com/RizMastah/kawalbijak
- Architecture and technical highlights: take from that repo's README.

**2. Lifty** (`slug: lifty`)

- Jun 2026 · Semester 6 · solo project · iOS Application Development course, NXU.
- iOS fitness coach app: SwiftUI, Apple Vision (human body pose detection), Core ML.
- **FlexFitClassifier** model, trained by Raihan in PyTorch and converted to Core ML via TorchScript + coremltools:
  - Pose input of 60 frames × 18 joints.
  - Conv1D → 2× LSTM → Dense architecture.
  - 5 classes: correct squat, torso lean, too shallow, none, other.
  - ~79K parameters, ~320 KB.
- Joint-angle rep counter, rule-based recommendation engine, coach chat via LLM API, HealthKit integration, 41 XCTest tests.
- Repo: https://github.com/RizMastah/Lifty
- Model accuracy and dataset size: **[OWNER DATA]**

**3. NexaOrder** (`slug: nexaorder`)

- Ordering application on Spring Boot 4 / Java 17, Thymeleaf, MySQL.
- 8 design patterns: MVC, Repository, DTO, Strategy, Factory Method, State, Observer, Singleton.
- Order state machine: PENDING → PAID → PROCESSING → COMPLETED / CANCELLED.
- Repo: https://github.com/RizMastah/nexaorder
- Year, semester and course: **[OWNER DATA]**

**4. StudyLens** (`slug: studylens`)

- Jun–Jul 2026 · Semester 6 · final project, iOS Application Development, NXU.
- iOS study app: camera-based math problem solver, flashcards, study tracker.
- Repo: https://github.com/RizMastah/StudyLens

Up to 2 more featured projects may be promoted from the archive later. This only needs `featured: true` and an MDX file.

### 6.3 All projects (archive, `/work`)

Every project from semesters 1–6 (plus current work) goes here, using the Appendix A template. Known entries so far:

| Project                                           | When                            | Role                                                              | Category         | Link                                 |
| ------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- | ---------------- | ------------------------------------ |
| TABULA: an "AI student" app that the user teaches | Nov 2026 – present (Semester 7) | Creator                                                           | Data & ML        | **[OWNER DATA: OK to publish?]**     |
| TourEase (E-Tourism)                              | 2025                            | Database schema design, table relations, dummy data · team of 5   | Backend          | https://github.com/akramsu/E-Tourism |
| CampusConnect                                     | 2024/2025                       | UI · Informatics Expo finalist                                    | UI/UX            | —                                    |
| Edu-Hub                                           | UII, **[OWNER DATA: semester]** | UI/UX in Figma                                                    | UI/UX            | **[OWNER DATA: Figma link]**         |
| SeaScope                                          | UII, **[OWNER DATA: semester]** | Team leader                                                       | **[OWNER DATA]** | **[OWNER DATA: description]**        |
| The Legend of Sangkuriang                         | UII, **[OWNER DATA: semester]** | Java Processing animation: story, sound effects, most of the code | Other            | **[OWNER DATA: link]**               |
| Remaining semester 1–6 projects                   | **[OWNER DATA]**                |                                                                   |                  |                                      |

### 6.4 Awards

- **2nd Place, Web Development, TechSprint Innovation Cup 2026** (Codelab Indonesia), team labulada, project KawalBijak.
- **Finalist, Informatics Expo 2024/2025**, project CampusConnect.

### 6.5 Education

- **Nanjing Xiaozhuang University**, Nanjing, China. Software Engineering (double degree) · Sep 2025 – present · GPA 4.3 / 5.0
- **Universitas Islam Indonesia (UII)**, Yogyakarta. Software Engineering · Sep 2023 – 2025 · GPA 3.84 / 4.00

### 6.6 Experience

- **Teaching Assistant, Software Engineering, UII** · Mar–Jul 2025 · Assisted the lecturer by grading assignments for about 20 students and preparing course materials.

### 6.7 Organizations

- **IMIX (Indonesian Student Association at Xiaozhuang)**: Member, Sports & Recreation Division · Sep 2026 – present · Organizes the IMIX Sports Championship (ISC) and recreation activities for Indonesian students.
- **Porsematik HMIF LEM FTI UII 2024**: Staff, Public Relations & Transportation Department.

### 6.8 Skills

- **Data & ML:** Python, PyTorch, Core ML, Apple Vision, data modeling, anomaly detection, LLM APIs
- **Backend & Database:** SQL, PostgreSQL, MySQL, Prisma, Java (Spring Boot), TypeScript, Firebase
- **Mobile:** Swift, SwiftUI
- **Tools:** Git, Docker

### 6.9 Languages

Indonesian (native) · English (professional working proficiency) · Mandarin (elementary)

## 7. Visual design

- **Mood:** dark, technical, with one accent color at a time, matching the reference's mood (see section 3).
- **Direction: "bold but controlled".** The reference's loud style is used only where it creates first impressions. Every reading area stays calm and readable.
- **Theme:** dark mode by default + light mode (toggle; persist choice in `localStorage` wrapped in try/catch).
- **Time-of-day palettes (dark mode)** are selected automatically by **Nanjing hour** (`Asia/Shanghai`):

  | Hours (Nanjing) | Palette       | Character                            |
  | --------------- | ------------- | ------------------------------------ |
  | 06–10           | Morning       | blue-tinted dark, warm yellow accent |
  | 10–18           | Lab (default) | neutral dark, green/teal accent      |
  | 18–22           | Evening       | warm dark, orange accent             |
  | 22–06           | Late night    | near-black, violet/blue neon accent  |
  - Only the accent and a slight background tint change. Every palette must pass WCAG AA.
  - The footer shows e.g. "Palette: Late night (auto) · Nanjing 23:14", plus color dots for a manual override. The override is saved in `localStorage` (try/catch) and re-checked every 60 s while on auto.
  - The palette is resolved by an inline script before first paint, so there is no flash.
  - Light mode is a separate toggle and has one palette.

- **Typography:**
  - **Display:** a condensed, heavy, uppercase font (free license, e.g. Anton / Big Shoulders Display). Used **only** for the Hero name, section titles and the giant footer wordmark. Hero size is fit-to-width.
  - **Body:** a clean sans for paragraphs, case studies and the archive.
  - **Mono:** for labels, tech tags, clocks and `[bracket]` asides.
  - All fonts come from Google Fonts or Fontshare.
- **Grid:** 12 columns on desktop, 1 column on mobile. Generous whitespace.
- **Motion** (values from `docs/reference-notes.md` §5b):
  - Hero text reveals per character, staggered by 0.05 s; taglines rotate every ~2.5 s.
  - Sections reveal when their top reaches 75% of the viewport, and reverse on scroll back.
  - Lenis smooth scroll at `lerp 0.1`, desktop only.
  - Project card hover: image scales slightly, arrow shifts.
  - Custom cursor, desktop only (`hover: hover`):
    - an instant dot, plus a trailing shape (0.33 s, expo-out) that rotates toward the direction of travel and skews with speed;
    - our own shape, e.g. a square crosshair;
    - lazy-loaded.
  - All animation disabled under `prefers-reduced-motion: reduce`.
- **Easter egg: `sql` panel.**
  - Typing `sql` anywhere on the page (outside inputs) opens a small terminal-style panel. It shows a playful query, e.g. `SELECT * FROM raihan WHERE coffee > 0;`, with a result table of fun facts.
  - The fun facts come from `content/profile.ts`, and the owner writes them.
  - Closes with Esc or a close button, and is keyboard accessible.
  - Lazy-loaded, and it never blocks content.
  - A tiny hint is shown in the footer, e.g. "psst: type sql".

## 8. Non-functional requirements

- **Performance:**
  - Home page JS < 150 KB gzipped.
  - The custom cursor and the easter egg are lazy-loaded.
  - Images are lazy-loaded except the hero.
  - No autoplay video on the home page.
- **Accessibility:** WCAG AA contrast, full keyboard navigation (including `/work` filters), visible focus states, alt text on every image, one `h1` per page.
- **SEO:** per-page metadata, 1200×630 Open Graph image (generated with `next/og`), `sitemap.xml`, `robots.txt`, `Person` JSON-LD.
- **Responsive:** tested at 360, 768, 1280 and 1920 px widths.
- **Privacy:** do not show phone number, full address, or student ID. The visitor-time clock uses only the browser's time zone setting. It requests no location permission and sends no data anywhere.

## 9. Expected repo structure

```
app/
  layout.tsx
  page.tsx
  work/page.tsx
  work/[slug]/page.tsx
  not-found.tsx
  opengraph-image.tsx
components/
  Header.tsx  Hero.tsx  InfoPanel.tsx  DualClock.tsx
  ProjectCard.tsx  ProjectArchive.tsx  ProjectFilter.tsx  ProjectMockup.tsx
  Awards.tsx  About.tsx  Skills.tsx  Contact.tsx  CopyEmailButton.tsx  Footer.tsx
content/
  profile.ts        (6.1, 6.5–6.9)
  projects.ts       (all projects + metadata, schema in Appendix A)
  awards.ts
  case-studies/*.mdx
public/
  CV_Raihan_Aditito_Bagastama.pdf
  projects/<slug>/*.webp
docs/
  reference-notes.md   (REA analysis results)
```

## 10. Build plan for Claude Code

1. **Reference analysis** with REA → `docs/reference-notes.md`. Show it to the owner before continuing.
2. **Project setup:** Next.js + TypeScript + Tailwind, lint, format, folder structure from section 9.
3. **Content:** fill `content/` from section 6 and the owner's Appendix A data. **[OWNER DATA]** items get `draft: true` and are not rendered.
4. **Home page** sections 1–9, without animation first, fully responsive. Placeholder mockups (5.4) for project images.
5. **`/work` archive** with grouping, filters and sorting (5.2).
6. **Case studies** for the featured projects using template 5.3. Pull technical details from each repo's README.
7. **Animation and interaction details** (section 7), with reduced-motion support.
8. **SEO, OG image, sitemap, analytics.**
9. **QA:**
   - Lighthouse mobile.
   - Keyboard testing.
   - 4 screen widths.
   - Playwright smoke tests: home, `/work` filter, one case study, CV link, copy-email button, clock renders.
10. **Deploy to Vercel:** connect the GitHub repo; make sure preview and production builds pass.

## 11. Definition of Done

- [ ] Every section in 5.1 renders with the content from section 6, with no visible placeholder text.
- [ ] `/work` lists every non-draft project, grouped by semester, with working filters.
- [ ] All featured case-study pages are complete; repo and live links work.
- [ ] Every project has either a real screenshot or a placeholder mockup.
- [ ] CV downloadable from the header and the contact section.
- [ ] Copy-email button works and gives visual feedback.
- [ ] Clock shows Nanjing time and the visitor's local time with the correct difference.
- [ ] Lighthouse mobile meets the targets in section 2.
- [ ] Production deploy on Vercel succeeds; URL listed in the repo README.
- [ ] All commits authored as RizMastah, with no Claude co-author trailer.

## 12. Out of scope for v1

- Blog / technical notes (reserve a `/notes` route for v2).
- Custom domain (can be added in Vercel at any time).
- Indonesian / Mandarin versions.
- External CMS.

---

## Appendix A: Project intake template

Copy one block per project. Only `title`, `semester`, `category` and `oneLiner` are required; leave out anything you don't have.

```yaml
- title: KawalBijak
  slug: kawalbijak # lowercase, dashes
  semester: 6 # 1–6, or 7 for current
  period: Apr–May 2026
  campus: UII | NXU
  course: Web Programming # course name or "Competition" / "Personal"
  category: [Backend, Data & ML] # Data & ML · Backend · Mobile · Web · UI/UX · Other
  role: Backend Lead
  team: 3 # 1 = solo
  stack: [PostgreSQL, TypeScript]
  oneLiner: PostgreSQL-backed platform with statistical anomaly detection.
  links:
    repo: https://github.com/...
    live: https://...
    figma: https://...
    demo: https://...
  award: 2nd Place, TechSprint Innovation Cup 2026
  featured: true # true = gets a case-study page
  publish: true # false = keep hidden
```
