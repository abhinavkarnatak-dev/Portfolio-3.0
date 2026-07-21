import Link from "next/link";
import type { Project } from "@/data/types";

/* Hard shadows (and the giant background numeral) cycle through the three loud colors, card by card. */
export const cardShadows = ["shadow-accent", "shadow-pop", "shadow-lime"] as const;
const cardNumberColors = ["text-accent", "text-pop", "text-lime"] as const;

export function ProjectCard({
  project,
  index,
  flagship = false,
}: {
  project: Project;
  index: number;
  flagship?: boolean;
}) {
  const shadow = cardShadows[index % cardShadows.length];
  const numberColor = cardNumberColors[index % cardNumberColors.length];

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden border border-foreground/80 bg-surface p-6 shadow-hard-sm transition duration-300 ease-out-quint hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard sm:p-7 ${shadow}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute -top-3 -right-1 font-display text-6xl sm:text-8xl font-bold opacity-10 transition-opacity duration-300 ease-out-quint group-hover:opacity-20 ${numberColor}`}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="flex items-center gap-3">
        {flagship && (
          <span className="bg-accent px-2 py-0.5 font-mono text-[11px] font-semibold text-background uppercase">
            Flagship
          </span>
        )}
        {project.status === "building" && (
          <span className="border border-lime/60 px-2 py-0.5 font-mono text-[11px] font-semibold text-lime uppercase">
            Building
          </span>
        )}
      </div>

      <h3
        className={`mt-4 font-display text-foreground uppercase ${flagship ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl"}`}
      >
        {/* Stretched link - the whole card navigates to the case study. */}
        <Link href={`/projects/${project.slug}`} className="after:absolute after:inset-0">
          {project.name}
        </Link>
      </h3>

      <p className={`mt-3 text-muted ${flagship ? "max-w-2xl" : ""}`}>{project.oneLiner}</p>

      <ul className="mt-5 mb-6 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li
            key={tag}
            className="border border-line px-2 py-0.5 font-mono text-[11px] text-muted uppercase"
          >
            {tag}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center gap-5 border-t border-foreground/15 pt-5 font-mono text-xs tracking-wide uppercase">
        {project.links.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 text-muted transition-colors duration-200 hover:text-accent"
          >
            {label} <span aria-hidden="true">↗</span>
          </a>
        ))}
        <span className="ml-auto text-foreground">Case study</span>
      </div>
    </article>
  );
}
