import { skills } from "@/content/profile";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" index="04" title="Skills" aside="no progress bars, promise">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {skills.map((g) => (
          <div key={g.group}>
            <h3 className="label border-line text-muted mb-4 border-b pb-3">{g.group}</h3>
            <ul className="flex flex-wrap gap-2">
              {g.items.map((s) => (
                <li key={s} className="border-line rounded-full border px-3 py-1.5 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
