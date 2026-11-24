import type { ReactNode } from "react";

export const container = "mx-auto w-full max-w-[1440px] px-4 md:px-8";

type Props = {
  id: string;
  index: string;
  title: string;
  aside?: string;
  children: ReactNode;
};

/** Section with a numbered mono label and a big condensed title. */
export function Section({ id, index, title, aside, children }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="border-line border-t py-20 md:py-28"
    >
      <div className={container}>
        <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-12 md:items-end" data-reveal>
          <p className="label text-muted md:col-span-2">({index})</p>
          <h2 id={`${id}-title`} className="display text-[clamp(3rem,9vw,8.5rem)] md:col-span-7">
            {title}
          </h2>
          {aside ? <p className="label text-muted md:col-span-3 md:text-right">[{aside}]</p> : null}
        </div>
        <div data-reveal>{children}</div>
      </div>
    </section>
  );
}
