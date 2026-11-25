"use client";

import Image from "next/image";
import { type CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import { useRichHover } from "./hover/useRichHover";

export type LightboxItem = { src: string; alt: string; width: number; height: number };

/** Shared viewer: a modal <dialog> with caption, previous/next and Esc to close. */
function useLightbox(items: LightboxItem[]) {
  const ref = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  // Content mounts only while open, so the large image loads on demand.
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback((i: number) => {
    setIndex(i);
    setIsOpen(true);
    ref.current?.showModal();
  }, []);
  const step = useCallback(
    (d: number) => setIndex((i) => (i + d + items.length) % items.length),
    [items.length],
  );

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const item = items[index];
  const many = items.length > 1;
  const dialog = (
    <dialog
      ref={ref}
      aria-label={item?.alt}
      className="m-auto max-h-none max-w-none overscroll-contain bg-transparent p-0 backdrop:bg-black/85 backdrop:backdrop-blur-sm"
      onClose={() => setIsOpen(false)}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      {isOpen && item ? (
        <figure className="flex max-h-[92dvh] w-[min(92vw,1100px)] flex-col items-center gap-3">
          <Image
            key={item.src}
            src={item.src}
            alt={item.alt}
            width={item.width}
            height={item.height}
            sizes="92vw"
            loading="eager"
            className="h-auto max-h-[80dvh] w-auto max-w-full rounded-md object-contain"
          />
          <figcaption className="label flex w-full items-center justify-between gap-4 text-white/80 normal-case!">
            <span>
              {item.alt}
              {many ? ` (${index + 1}/${items.length})` : ""}
            </span>
            <span className="flex gap-2">
              {many ? (
                <>
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="rounded-full border border-white/30 px-3 py-1.5 hover:bg-white/10"
                    aria-label="Previous image"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="rounded-full border border-white/30 px-3 py-1.5 hover:bg-white/10"
                    aria-label="Next image"
                  >
                    →
                  </button>
                </>
              ) : null}
              <button
                type="button"
                onClick={() => ref.current?.close()}
                className="rounded-full border border-white/30 px-3 py-1.5 hover:bg-white/10"
              >
                Close (Esc)
              </button>
            </span>
          </figcaption>
        </figure>
      ) : null}
    </dialog>
  );
  return { open, dialog };
}

/** Screenshot gallery of a case study: thumbnails in a grid, each opens the viewer. */
export function LightboxGallery({ items, phone }: { items: LightboxItem[]; phone: boolean }) {
  const { open, dialog } = useLightbox(items);
  return (
    <>
      <ul className={`grid gap-4 ${phone ? "grid-cols-2 sm:grid-cols-4" : "sm:grid-cols-2"}`}>
        {items.map((g, i) => (
          <li key={g.src}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full text-left"
              aria-label={`Enlarge: ${g.alt}`}
            >
              <span
                className={`border-line bg-bg-raised block overflow-hidden rounded-lg border ${phone ? "aspect-[420/910]" : "aspect-[16/10]"}`}
              >
                <Image
                  src={g.src}
                  alt=""
                  width={g.width}
                  height={g.height}
                  sizes={phone ? "(min-width: 640px) 25vw, 50vw" : "(min-width: 640px) 50vw, 100vw"}
                  className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
                />
              </span>
              <span className="label text-muted mt-2 block normal-case!">{g.alt}</span>
            </button>
          </li>
        ))}
      </ul>
      {dialog}
    </>
  );
}

/** Certificates as a fanned stack of cards; click opens all of them in the viewer. */
export function CertificateStack({ items, title }: { items: LightboxItem[]; title: string }) {
  const { open, dialog } = useLightbox(items);
  const rich = useRichHover();
  const button = useRef<HTMLButtonElement>(null);

  // Cursor position (0–1) drives the foil sheen and the front card's tilt.
  function track(e: React.PointerEvent<HTMLButtonElement>) {
    if (!rich || !button.current) return;
    const box = button.current.getBoundingClientRect();
    button.current.style.setProperty("--mx", ((e.clientX - box.left) / box.width).toFixed(3));
    button.current.style.setProperty("--my", ((e.clientY - box.top) / box.height).toFixed(3));
  }
  function reset() {
    button.current?.style.setProperty("--mx", "0.5");
    button.current?.style.setProperty("--my", "0.5");
  }

  return (
    <>
      <button
        ref={button}
        type="button"
        onClick={() => open(0)}
        onPointerMove={track}
        onPointerLeave={reset}
        aria-label={`View ${items.length > 1 ? `${items.length} certificates` : "certificate"}: ${title}`}
        className="group relative block aspect-[1.41] w-full max-w-sm [perspective:900px]"
      >
        {items
          .map((c, i) => ({ c, i }))
          .reverse()
          .map(({ c, i }) => (
            <span
              key={c.src}
              style={
                {
                  "--r": `${i === 0 ? -2 : 4}deg`,
                  "--x": `${i * 7}%`,
                  "--y": `${i * -5}%`,
                } as CSSProperties
              }
              className="absolute inset-0 [transform:translate(var(--x),var(--y))_rotate(var(--r))] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:translate(calc(var(--x)*1.6),calc(var(--y)*1.6))_rotate(calc(var(--r)*1.5))]"
            >
              <span
                className={`border-line absolute inset-0 overflow-hidden rounded-md border shadow-lg ${
                  i === 0 && rich ? "cert-tilt" : ""
                }`}
              >
                <Image
                  src={c.src}
                  alt=""
                  width={c.width}
                  height={c.height}
                  sizes="(min-width: 768px) 24rem, 90vw"
                  className="h-full w-full object-cover"
                />
                {i === 0 && rich ? <span aria-hidden className="cert-holo" /> : null}
              </span>
            </span>
          ))}
        <span className="label bg-bg/85 absolute bottom-3 left-3 rounded-full px-3 py-1.5 backdrop-blur-sm">
          {items.length > 1 ? `${items.length} certificates` : "Certificate"} · View
        </span>
      </button>
      {dialog}
    </>
  );
}

/** Text trigger ("poster ↗") that opens a single image in the viewer. */
export function LightboxLink({ item, label }: { item: LightboxItem; label: string }) {
  const { open, dialog } = useLightbox([item]);
  return (
    <>
      <button
        type="button"
        onClick={() => open(0)}
        className="label hover:text-accent transition-colors"
      >
        {label}
      </button>
      {dialog}
    </>
  );
}
