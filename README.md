# Raihan Aditito Bagastama · Portfolio

Personal portfolio: Software Engineering student (UII × Nanjing Xiaozhuang University), focused on data engineering, AI/ML and backend.

**Live:** _added after the first Vercel deploy_

## Stack

- Next.js 16 (App Router, Cache Components) + TypeScript
- Tailwind CSS v4
- MDX for case studies (`content/case-studies/*.mdx`)
- Lenis smooth scroll (desktop only); motion is CSS-first (scroll-driven reveals, per-character hero reveal)
- Vercel Analytics + Speed Insights (enabled on Vercel only)
- Playwright smoke tests

## Content

Everything visitors read lives in `content/`:

| File                              | What                                                                                            |
| --------------------------------- | ----------------------------------------------------------------------------------------------- |
| `content/profile.ts`              | Name, intro, taglines, status, contact, education, experience, organizations, skills, languages |
| `content/projects.ts`             | Every project (schema in PRD Appendix A). `featured: true` = case study, `draft: true` = hidden |
| `content/awards.ts`               | Awards                                                                                          |
| `content/case-studies/<slug>.mdx` | One case study per featured project                                                             |

Add a project by appending an entry to `content/projects.ts`. No component changes needed. Real screenshots go in `public/projects/<slug>/` and are referenced with `cover`; until then a generated placeholder mockup is shown.

The CV must be placed at `public/CV_Raihan_Aditito_Bagastama.pdf` (served at `/cv`).

## Scripts

```bash
npm run dev          # dev server on http://localhost:3000
npm run build        # production build
npm run typecheck    # route types + tsc
npm run lint         # ESLint
npm run format       # Prettier
npm run test:e2e     # Playwright smoke tests (desktop + mobile)
```

## Notes

- Two color modes: dark (default) and light, switched in the footer and remembered per visitor.
- Type `sql` anywhere on the page for the easter egg.
- Design reference analysis (patterns only): `docs/reference-notes.md`. Product requirements: `PRD-portfolio-raihan.md`.
- Set `NEXT_PUBLIC_SITE_URL` in Vercel if a custom domain is added; otherwise the Vercel production URL is used for metadata and the sitemap.
