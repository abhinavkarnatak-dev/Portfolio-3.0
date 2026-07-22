import { Reveal } from "@/components/ui/reveal";
import { SectionMeta } from "@/components/ui/section-meta";
import { WordReveal } from "@/components/ui/word-reveal";
import { skillGroups } from "@/data/skills";

const groupLabelColors = [
  "text-accent",
  "text-lime",
  "text-pop",
  "text-alarm",
  "text-violet",
] as const;

export function Skills() {
  return (
    <section id="skills" className="scroll-mt-14">
      <div className="mx-auto max-w-wide px-6 py-24">
        <SectionMeta index="02" title="Stack" meta={`${skillGroups.length} groups`} accent="pop" />
        <WordReveal
          words={[
            { t: "TOOLS" },
            { t: "I" },
            { t: "ACTUALLY" },
            { t: "SHIP", mark: "pop" },
            { t: "WITH." },
          ]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />

        <dl className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map(({ label, skills }, i) => (
            <Reveal key={label} delay={(i % 3) * 0.07} className="h-full">
              <div className="h-full border border-foreground/25 bg-surface p-5">
                <dt
                  className={`flex items-center gap-2.5 font-mono text-xs tracking-caps uppercase ${groupLabelColors[i % groupLabelColors.length]}`}
                >
                  <span aria-hidden="true" className="text-faint">
                    {String(i + 1).padStart(2, "0")} /
                  </span>
                  {label}
                </dt>
                <dd className="mt-4">
                  <ul className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <li
                        key={skill}
                        className="border border-line px-2 py-0.5 font-mono text-[11px] text-muted uppercase"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
