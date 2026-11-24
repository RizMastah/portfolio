import { awards } from "@/content/awards";
import { CertificateStack } from "./Lightbox";
import { Section } from "./Section";

export function Awards() {
  return (
    <Section id="awards" index="02" title="Awards">
      <ul className="border-line border-t">
        {awards.map((a) => (
          <li
            key={a.event}
            className="border-line grid gap-6 border-b py-10 md:grid-cols-12 md:items-center"
          >
            <div className="md:col-span-7">
              <span className="label text-muted">{a.year}</span>
              <p className="display mt-3 text-3xl md:text-5xl">{a.title}</p>
              <p className="mt-3 text-lg">{a.event}</p>
              <p className="label text-muted mt-2 normal-case!">{a.detail}</p>
            </div>
            <div className="md:col-span-5 md:flex md:justify-end">
              <div className="w-full max-w-sm pt-[5%] pr-[9%]">
                <CertificateStack items={a.certificates} title={a.event} />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
