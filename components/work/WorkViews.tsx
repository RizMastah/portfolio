"use client";

import { useEffect, useState } from "react";
import type { Project } from "@/content/projects";
import { ProjectArchive } from "../ProjectArchive";
import { ProjectIndex } from "./ProjectIndex";
import { ProjectMap } from "./ProjectMap";

type View = "list" | "index" | "map";
const VIEWS: { id: View; label: string; hint: string }[] = [
  { id: "list", label: "List", hint: "filter & details" },
  { id: "index", label: "Index", hint: "scroll through" },
  { id: "map", label: "Map", hint: "embedding space" },
];

/** Three ways to browse the archive; the choice is kept in the URL hash. */
export function WorkViews({ projects }: { projects: Project[] }) {
  const [view, setView] = useState<View>("list");

  useEffect(() => {
    const read = () => {
      const h = location.hash.slice(1);
      if (h === "index" || h === "map" || h === "list") setView(h);
    };
    const id = setTimeout(read, 0);
    window.addEventListener("hashchange", read);
    return () => {
      clearTimeout(id);
      window.removeEventListener("hashchange", read);
    };
  }, []);

  function choose(v: View) {
    setView(v);
    history.replaceState(null, "", v === "list" ? location.pathname : `#${v}`);
  }

  /** From Index/Map: open a project that has no case study in the list view. */
  function showInList(slug: string) {
    choose("list");
    requestAnimationFrame(() =>
      document.getElementById(`p-${slug}`)?.scrollIntoView({ block: "center", behavior: "smooth" }),
    );
  }

  return (
    <div>
      <div role="tablist" aria-label="View" className="mb-10 flex flex-wrap gap-x-8 gap-y-2">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            role="tab"
            type="button"
            aria-selected={view === v.id}
            onClick={() => choose(v.id)}
            className={`bracket label text-left transition-colors ${
              view === v.id ? "text-fg" : "text-muted hover:text-fg"
            }`}
          >
            {v.label} <span className="text-muted normal-case!">· {v.hint}</span>
          </button>
        ))}
      </div>
      {view === "list" ? <ProjectArchive projects={projects} /> : null}
      {view === "index" ? <ProjectIndex projects={projects} onShowInList={showInList} /> : null}
      {view === "map" ? <ProjectMap onShowInList={showInList} /> : null}
    </div>
  );
}
