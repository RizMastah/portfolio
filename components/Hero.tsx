import { profile } from "@/content/profile";
import { DualClock } from "./DualClock";
import { RotatingTagline } from "./RotatingTagline";
import { SplitChars } from "./SplitChars";
import { container } from "./Section";

export function Hero() {
  const [first, ...rest] = profile.name.toUpperCase().split(" ");

  return (
    <section id="top" aria-labelledby="hero-title" className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className={container}>
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <p className="label border-line inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
            <span aria-hidden className="bg-accent size-2 rounded-full" />
            {profile.status}
          </p>
          <p className="label text-muted" aria-hidden>
            <RotatingTagline items={profile.taglines} />
          </p>
        </div>

        <h1 id="hero-title" className="display text-[15vw] md:text-[clamp(3rem,10.6vw,9.25rem)]">
          <SplitChars
            label={profile.name}
            lines={[{ text: first }, { text: rest.join(" "), className: "text-outline" }]}
          />
        </h1>

        <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-6 lg:col-span-5">
            <ul className="sr-only" aria-label="Taglines">
              {profile.taglines.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <p className="text-lg leading-relaxed md:text-xl">{profile.intro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="label bg-fg text-bg rounded-full px-5 py-3 transition-opacity hover:opacity-85"
              >
                View work →
              </a>
              <a
                href={profile.cvPath}
                className="label border-line hover:border-fg rounded-full border px-5 py-3 transition-colors"
              >
                Download CV ↓
              </a>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <dl className="border-line grid gap-3 border-t pt-6">
              {profile.info.map((row) => (
                <div key={row.label} className="grid grid-cols-[5.5rem_1fr] gap-4">
                  <dt className="label text-muted">{row.label}</dt>
                  <dd className="label leading-relaxed normal-case!">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className="border-line mt-6 border-t pt-6">
              <DualClock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
