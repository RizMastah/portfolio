import { profile } from "@/content/profile";
import { CopyEmailButton } from "./CopyEmailButton";
import { container } from "./Section";

export function Contact() {
  const links = [
    { href: profile.contact.linkedin, label: "LinkedIn" },
    { href: profile.contact.github, label: "GitHub" },
    { href: profile.contact.instagram, label: "Instagram" },
    { href: profile.cvPath, label: "CV (PDF)" },
  ];

  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="border-line border-t py-20 md:py-28"
    >
      <div className={container}>
        <p className="label mb-8 inline-flex items-center gap-2">
          <span aria-hidden className="bg-accent size-2 rounded-full" />
          {profile.status}
        </p>
        <h2 id="contact-title" className="display text-[clamp(3.5rem,12vw,12rem)]">
          <span className="block">Let’s build</span>
          <span className="text-outline block">with data</span>
        </h2>
        <p className="label text-muted mt-6">[models, databases, and the backends between them]</p>

        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="border-line flex flex-col gap-4 rounded-lg border p-5 sm:flex-row sm:items-center sm:justify-between">
              <a
                href={`mailto:${profile.contact.email}`}
                className="hover:text-accent text-xl break-all transition-colors md:text-2xl"
              >
                {profile.contact.email} ↗
              </a>
              <CopyEmailButton email={profile.contact.email} />
            </div>
          </div>
          <ul className="md:col-span-4 md:col-start-9">
            {links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  {...(l.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="label border-line hover:text-accent flex justify-between border-b py-4 transition-colors"
                >
                  {l.label} <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
