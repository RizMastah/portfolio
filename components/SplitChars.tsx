/**
 * Renders lines of text as individually animated characters (CSS-only, see
 * `.char` in globals.css). Letters are grouped per word so the browser can
 * only wrap at the spaces between words, never inside a word.
 * Screen readers get the plain text once.
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
          {line.text.split(" ").map((word, w, words) => (
            <span key={w}>
              <span className="word">
                {[...word].map((ch, k) => (
                  <span key={k} className="char" style={{ ["--i" as string]: i++ }}>
                    {ch}
                  </span>
                ))}
              </span>
              {w < words.length - 1 ? " " : null}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}
