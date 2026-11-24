import { About } from "@/components/About";
import { Awards } from "@/components/Awards";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { SelectedWork } from "@/components/SelectedWork";
import { Skills } from "@/components/Skills";

export default function Home() {
  return (
    <>
      <a
        href="#work"
        className="label bg-accent text-accent-fg sr-only z-[60] rounded px-3 py-2 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <Header />
      <main>
        <Hero />
        <SelectedWork />
        <Awards />
        <About />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
