import { awards } from "@/content/awards";
import { Section } from "./Section";

export function Awards() {
  return (
    <Section id="awards" index="02" title="Awards">
      <ul className="border-line border-t">
        {awards.map((a) => (
          <li
            key={a.event}
            className="border-line grid gap-2 border-b py-6 md:grid-cols-12 md:items-baseline md:gap-6"
          >
            <span className="label text-muted md:col-span-2">{a.year}</span>
            <span className="display text-3xl md:col-span-4 md:text-4xl">{a.title}</span>
            <span className="text-lg md:col-span-3">{a.event}</span>
            <span className="label text-muted normal-case! md:col-span-3 md:text-right">
              {a.detail}
            </span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
