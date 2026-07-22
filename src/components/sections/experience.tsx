import Link from "next/link";
import { ExperienceTimeline } from "@/components/sections/experience-timeline";
import { SectionMeta } from "@/components/ui/section-meta";
import { WordReveal } from "@/components/ui/word-reveal";
import { journeyStops } from "@/data/journey";

export function Experience() {
  const firstCode = journeyStops[0]?.code;
  const lastCode = journeyStops[journeyStops.length - 1]?.code;

  return (
    <section id="experience" className="scroll-mt-14">
      <div className="mx-auto max-w-content px-6 py-24">
        <SectionMeta index="04" title="Work logs" meta="Experience + education" accent="accent" />
        <WordReveal
          words={[{ t: "WHERE" }, { t: "I'VE" }, { t: "SHIPPED.", mark: "accent" }]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />
        <ExperienceTimeline />

        <Link
          href="/journey"
          className="group mt-12 flex items-center justify-between gap-4 border border-foreground/80 bg-surface px-6 py-5 shadow-hard-sm shadow-violet transition duration-200 ease-out-quint hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-hard sm:px-7"
        >
          <div>
            <p className="font-mono text-xs tracking-caps text-violet uppercase">
              {firstCode} → {lastCode} · my story so far
            </p>
            <p className="mt-1 font-display text-2xl text-foreground uppercase sm:text-3xl">
              Read the full journey
            </p>
          </div>
          <span
            aria-hidden="true"
            className="shrink-0 font-display text-3xl text-foreground transition-transform duration-200 ease-out-quint group-hover:translate-x-1.5 sm:text-4xl"
          >
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
