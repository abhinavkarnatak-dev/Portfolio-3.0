import Link from "next/link";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SectionMeta } from "@/components/ui/section-meta";
import { WordReveal } from "@/components/ui/word-reveal";

export function Experience() {
  return (
    <section id="experience" className="scroll-mt-14">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionMeta index="04" title="Work logs" meta="Experience + education" />
        <WordReveal
          words={[{ t: "WHERE" }, { t: "I'VE" }, { t: "SHIPPED.", mark: true }]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />
        <ExperienceTimeline />

        <Link
          href="/journey"
          className="mt-10 inline-flex items-center gap-2 font-mono text-xs tracking-caps text-muted uppercase transition-colors hover:text-accent"
        >
          → Read the full journey
        </Link>
      </div>
    </section>
  );
}
