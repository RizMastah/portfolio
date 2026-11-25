import { DitherPortrait } from "./hover/DitherPortrait";
import { RouteTimeline } from "./RouteTimeline";
import { education, experience, languages, organizations, profile } from "@/content/profile";
import { Section } from "./Section";

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="label border-line text-muted mb-4 border-b pb-3">{title}</h3>
      {children}
    </div>
  );
}

export function About() {
  return (
    <Section id="about" index="03" title="About" aside="2+2 · Indonesia ⇄ China">
      <div className="grid gap-14 md:grid-cols-12">
        <div className="grid gap-5 text-2xl leading-snug md:col-span-8 md:text-3xl">
          {profile.about.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <div className="md:col-span-4">
          <DitherPortrait
            src={profile.photo.src}
            width={profile.photo.width}
            height={profile.photo.height}
            alt={`Portrait of ${profile.name}`}
          />
          <p
            aria-hidden
            className="text-muted mt-3 max-w-sm font-[family-name:var(--font-doto)] text-[0.8rem] leading-snug tracking-[0.12em] uppercase"
          >
            subj raihan a.b. / loc nanjing 32.06n 118.80e / scan 112x112 1-bit
          </p>
        </div>

        <div className="md:col-span-12">
          <RouteTimeline />
        </div>

        <div className="grid gap-12 md:col-span-12 md:grid-cols-2 lg:grid-cols-4">
          <Block title="Education">
            <ul className="grid gap-5">
              {education.map((e) => (
                <li key={e.school}>
                  <p className="font-semibold">{e.school}</p>
                  <p className="text-muted">{e.degree}</p>
                  <p className="label text-muted mt-1 normal-case!">
                    {e.period} · GPA {e.gpa}
                  </p>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Experience">
            <ul className="grid gap-5">
              {experience.map((x) => (
                <li key={x.title}>
                  <p className="font-semibold">{x.title}</p>
                  <p className="text-muted">{x.org}</p>
                  <p className="label text-muted mt-1 normal-case!">{x.period}</p>
                  <p className="mt-2 text-sm leading-relaxed">{x.description}</p>
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Organizations">
            <ul className="grid gap-5">
              {organizations.map((o) => (
                <li key={o.name}>
                  <p className="font-semibold">{o.name}</p>
                  <p className="text-muted">{o.role}</p>
                  <p className="label text-muted mt-1 normal-case!">{o.period}</p>
                  {o.description ? (
                    <p className="mt-2 text-sm leading-relaxed">{o.description}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Languages">
            <ul className="grid gap-3">
              {languages.map((l) => (
                <li key={l.name} className="flex justify-between gap-4">
                  <span className="font-semibold">{l.name}</span>
                  <span className="label text-muted normal-case!">{l.level}</span>
                </li>
              ))}
            </ul>
          </Block>
        </div>
      </div>
    </Section>
  );
}
