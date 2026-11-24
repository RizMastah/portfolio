import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { container } from "@/components/Section";

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main" className="pt-28 pb-24 md:pt-36">
        <div className={container}>
          <pre className="label text-muted overflow-x-auto normal-case!">
            {`> SELECT * FROM pages WHERE url = :this_one;
  0 rows returned (0.42 ms)`}
          </pre>
          <h1 className="display mt-10 text-[clamp(5rem,26vw,22rem)]">
            4<span className="text-outline">0</span>4
          </h1>
          <p className="mt-6 max-w-xl text-xl leading-relaxed">
            This page doesn’t exist, or it moved while I was refactoring. The good stuff is still
            here:
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/"
              className="label bg-fg text-bg rounded-full px-5 py-3 transition-opacity hover:opacity-85"
            >
              ← Home
            </Link>
            <Link
              href="/work"
              className="label border-line hover:border-fg rounded-full border px-5 py-3 transition-colors"
            >
              All projects
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
