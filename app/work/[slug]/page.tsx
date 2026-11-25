import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CoverFrame } from "@/components/CoverFrame";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { DecodeOnView } from "@/components/hover/DecodeOnView";
import { LightboxGallery } from "@/components/Lightbox";
import { container } from "@/components/Section";
import { describeMyRole, featuredProjects } from "@/content/projects";

// All slugs are prerendered by generateStaticParams; unknown slugs block, then 404.
export const instant = false;

export function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

function findProject(slug: string) {
  return featuredProjects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} · Case study`,
    description: project.oneLiner,
    alternates: { canonical: `/work/${project.slug}` },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const index = featuredProjects.findIndex((p) => p.slug === slug);
  const project = featuredProjects[index];
  if (!project) notFound();

  const { default: Content } = await import(`@/content/case-studies/${slug}.mdx`);
  const next = featuredProjects[(index + 1) % featuredProjects.length];

  const meta: [string, string | undefined][] = [
    ["Type", project.typeLabel],
    ["Year", project.period || undefined],
    ["Team", project.team ? (project.team === 1 ? "Solo" : `${project.team} people`) : undefined],
    ["Context", project.course],
    ["Stack", project.stack.join(", ")],
  ];
  const links = Object.entries(project.links ?? {}).filter(([, v]) => v) as [string, string][];

  return (
    <>
      <Header />
      <main id="main" className="pt-28 md:pt-36">
        <article>
          <header className={container}>
            <Link href="/work" className="label text-muted hover:text-fg transition-colors">
              ← All projects
            </Link>
            <h1 className="display mt-8 text-[clamp(4rem,16vw,15rem)]">{project.title}</h1>
            <p className="mt-6 max-w-3xl text-xl leading-relaxed md:text-2xl">{project.oneLiner}</p>
            {project.award ? <p className="label text-accent mt-4">★ {project.award}</p> : null}
            <p className="mt-6 max-w-3xl leading-relaxed">
              <span className="label text-muted">My role</span> {describeMyRole(project)}
            </p>

            <dl className="border-line mt-12 grid gap-6 border-t pt-6 sm:grid-cols-2 lg:grid-cols-5">
              {meta
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k}>
                    <dt className="label text-muted">
                      <DecodeOnView text={k} />
                    </dt>
                    <dd className="mt-1">{v}</dd>
                  </div>
                ))}
            </dl>
            {links.length ? (
              <ul className="mt-8 flex flex-wrap gap-3">
                {links.map(([kind, href]) => (
                  <li key={kind}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="label border-line hover:border-accent hover:text-accent inline-block rounded-full border px-4 py-2 transition-colors"
                    >
                      {kind === "repo" ? "GitHub repo" : kind} ↗
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}

            <CoverFrame project={project} sizes="100vw" priority className="mt-14" />
          </header>

          <div className={`${container} grid py-20 md:grid-cols-12`}>
            <div className="max-w-[66ch] min-w-0 md:col-span-8 md:col-start-3">
              <Content />
            </div>
          </div>

          {project.gallery?.length ? (
            <section aria-labelledby="screens-title" className={`${container} pb-20`}>
              <h2 id="screens-title" className="label text-muted mb-6">
                Screenshots
              </h2>
              <LightboxGallery items={project.gallery} phone={project.mockupFrame === "ios"} />
            </section>
          ) : null}
        </article>

        <nav aria-label="Next project" className="border-line border-t">
          <Link
            href={`/work/${next.slug}`}
            className={`${container} group flex items-end justify-between gap-6 py-16`}
          >
            <span>
              <span className="label text-muted">Next project</span>
              <span className="display group-hover:text-accent mt-3 block text-[clamp(3rem,10vw,9rem)] transition-colors">
                {next.title}
              </span>
            </span>
            <span
              aria-hidden
              className="display text-5xl transition-transform group-hover:translate-x-2"
            >
              →
            </span>
          </Link>
        </nav>
      </main>
      <Footer />
    </>
  );
}
