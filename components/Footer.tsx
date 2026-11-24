import { profile } from "@/content/profile";
import { PaletteControls } from "./PaletteControls";
import { container } from "./Section";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="border-line overflow-hidden border-t pt-10">
      <div className={`${container} grid gap-6`}>
        <PaletteControls />
        <div className="label text-muted flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <Year /> {profile.name}
          </p>
          <p className="normal-case!">
            {profile.footerLine}{" "}
            <span className="hidden opacity-60 md:inline">· psst: type “sql”</span>
          </p>
          <a href="#" className="hover:text-fg transition-colors">
            Back to top ↑
          </a>
        </div>
      </div>
      <p
        aria-hidden
        className="display mt-10 text-center text-[24vw] leading-[0.75] select-none"
        data-reveal
      >
        RAIHAN<span className="text-outline">.</span>
      </p>
    </footer>
  );
}
