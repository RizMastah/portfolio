/**
 * Renders lines of text as individually animated characters (CSS-only, see
 * `.char` in globals.css). Screen readers get the plain text once.
 */
export function SplitChars({
  lines,
  label,
}: {
  lines: { text: string; className?: string }[];
  /** Accessible text; defaults to the joined lines. */
  label?: string;
}) {
  let i = 0;
  return (
    <>
      <span className="sr-only">{label ?? lines.map((l) => l.text).join(" ")}</span>
      {lines.map((line) => (
        <span key={line.text} aria-hidden className={`chars-line ${line.className ?? ""}`}>
          {[...line.text].map((ch, k) => (
            <span key={k} className="char" style={{ ["--i" as string]: i++ }}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
