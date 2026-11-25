import { profile } from "@/content/profile";
import { container } from "./Section";
import { Year } from "./Year";

export function Footer() {
  return (
    <footer className="border-line border-t py-10">
      <div className={container}>
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
    </footer>
  );
}
