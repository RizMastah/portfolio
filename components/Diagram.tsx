import type { ReactNode } from "react";

type Step = { title: string; detail?: string; tone?: "io" | "core" | "ml" };

const tone = {
  io: "border-line",
  core: "border-fg/40",
  ml: "border-accent",
} as const;

/**
 * Pipeline diagram: boxes connected by arrows. Vertical on mobile,
 * horizontal (wrapping) on wide screens when `direction="row"`.
 */
export function Flow({
  steps,
  direction = "column",
  caption,
}: {
  steps: Step[];
  direction?: "row" | "column";
  caption?: ReactNode;
}) {
  return (
    <figure className="not-prose my-10">
      <ol
        className={`flex flex-col items-stretch gap-0 ${
          direction === "row" ? "lg:flex-row lg:flex-wrap lg:items-center" : ""
        }`}
      >
        {steps.map((s, i) => (
          <li
            key={s.title}
            className={`flex flex-col items-center ${direction === "row" ? "lg:flex-row" : ""}`}
          >
            <div
              className={`bg-bg-raised w-full rounded-lg border px-4 py-3 ${tone[s.tone ?? "core"]} ${
                direction === "row" ? "lg:w-auto" : ""
              }`}
            >
              <p className="label text-fg">{s.title}</p>
              {s.detail ? <p className="text-muted mt-1 text-sm">{s.detail}</p> : null}
            </div>
            {i < steps.length - 1 ? (
              <span
                aria-hidden
                className={`text-accent py-1 ${direction === "row" ? "lg:rotate-[-90deg] lg:px-2" : ""}`}
              >
                ↓
              </span>
            ) : null}
          </li>
        ))}
      </ol>
      {caption ? (
        <figcaption className="label text-muted mt-4 normal-case!">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/** Key/value fact table, e.g. model card. */
export function Facts({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className="not-prose border-line my-8 border-t">
      {rows.map(([k, v]) => (
        <div
          key={k}
          className="border-line grid gap-1 border-b py-3 sm:grid-cols-[12rem_1fr] sm:gap-6"
        >
          <dt className="label text-muted">{k}</dt>
          <dd className="leading-relaxed">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
