import Image from "next/image";
import { type Project, projectYear } from "@/content/projects";

/**
 * One frame for every project cover (16:10): the top 80% shows a visual cut
 * from the project's real screenshot, banner or poster; the bottom strip shows
 * the project type and year in the same position on every card. Projects
 * without a visual get a typographic frame with the same structure.
 */
export function CoverFrame({
  project,
  sizes,
  priority = false,
  className = "",
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`border-line bg-bg-raised flex aspect-[16/10] flex-col overflow-hidden rounded-lg border ${className}`}
    >
      <div className="relative min-h-0 flex-[4]">
        {project.cover ? (
          <Image
            src={project.cover}
            alt={`${project.title}: visual from the project`}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div
            className="bg-bg flex h-full items-center justify-center [container-type:size]"
            aria-hidden
          >
            <span className="display text-outline text-[22cqw] leading-none">
              {project.title}
            </span>
          </div>
        )}
      </div>
      <div className="border-line label text-muted flex flex-1 items-center justify-between border-t px-[4%]">
        <span>{project.typeLabel}</span>
        <span className="tabular-nums">{projectYear(project)}</span>
      </div>
    </div>
  );
}
