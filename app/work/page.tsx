import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ProjectArchive } from "@/components/ProjectArchive";
import { container } from "@/components/Section";
import { publishedProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "All projects",
  description:
    "Every project by Raihan Aditito Bagastama, from semester 1 to now: data & ML, backend, mobile and more.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <Header />
      <main id="main" className="pt-28 pb-24 md:pt-36">
        <div className={container}>
          <p className="label text-muted mb-4">(Archive)</p>
          <h1 className="display mb-6 text-[clamp(3.5rem,13vw,12rem)]">All projects</h1>
          <p className="text-muted mb-14 max-w-2xl text-lg">
            {publishedProjects.length} projects from semester 1 to now. Case studies are marked; the
            rest link straight to their repo or demo.
          </p>
          <ProjectArchive projects={publishedProjects} />
        </div>
      </main>
      <Footer />
    </>
  );
}
