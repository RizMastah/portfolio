"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { profile } from "@/content/profile";
import { container } from "./Section";
import { StatusBar } from "./StatusBar";

const nav = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="border-line/60 bg-bg/80 fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md">
      <StatusBar />
      <div className={`${container} flex h-14 items-center justify-between gap-4`}>
        <Link href="/#top" className="label text-fg" onClick={() => setOpen(false)}>
          {profile.shortName}
          <span className="text-accent">_</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={
                item.href === "/#work" && pathname.startsWith("/work") ? "page" : undefined
              }
              className="bracket label text-muted hover:text-fg aria-[current=page]:text-fg transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={profile.cvPath}
            className="label bg-accent text-accent-fg rounded-full px-4 py-2 transition-opacity hover:opacity-85"
          >
            CV ↓
          </a>
          <button
            type="button"
            className="label border-line rounded-full border px-4 py-2 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" aria-label="Main" className="border-line bg-bg border-t md:hidden">
          <ul className={`${container} flex flex-col py-4`}>
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="display block py-2 text-5xl"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
