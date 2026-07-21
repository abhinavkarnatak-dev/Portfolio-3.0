import { ProjectCard } from "@/components/ui/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionMeta } from "@/components/ui/section-meta";
import { WordReveal } from "@/components/ui/word-reveal";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="scroll-mt-14">
      <div className="mx-auto max-w-wide px-6 py-24">
        <SectionMeta
          index="01"
          title="Selected work"
          meta={`${String(projects.length).padStart(2, "0")} case studies`}
        />
        <WordReveal
          words={[
            { t: "BUILT." },
            { t: "SHIPPED." },
            { t: "DEBUGGED", mark: true },
            { t: "AT", mark: true },
            { t: "2AM.", mark: true },
          ]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />
        <Reveal>
          <p className="mt-5 max-w-xl text-muted">
            Built end to end - designed, shipped, broken in production, and fixed. Each case study
            documents what actually went wrong.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {projects.map((project, i) => (
            <Reveal
              key={project.slug}
              delay={(i % 2) * 0.08}
              className={`h-full ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <ProjectCard project={project} index={i} flagship={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
