import { AnimatedCounter } from "@/components/ui/animated-counter";
import { HeatmapGrid } from "@/components/ui/heatmap-grid";
import { Reveal } from "@/components/ui/reveal";
import { SectionMeta } from "@/components/ui/section-meta";
import { WordReveal } from "@/components/ui/word-reveal";
import { getContributions, type ContributionDay } from "@/lib/github";
import { site } from "@/data/site";

const username = site.socials.github.replace(/\/+$/, "").split("/").pop() ?? "";

const legend = [0, 1, 2, 3, 4] as const;
const legendClasses: Record<number, string> = {
  0: "bg-line/60",
  1: "bg-accent/25",
  2: "bg-accent/55",
  3: "bg-accent/85",
  4: "bg-lime",
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** The calendar month (across the whole fetched range) with the most contributions. */
function mostActiveMonth(days: ContributionDay[]) {
  const totals = new Map<string, number>();
  for (const day of days) {
    const key = day.date.slice(0, 7); // YYYY-MM
    totals.set(key, (totals.get(key) ?? 0) + day.count);
  }
  let bestKey: string | null = null;
  let bestCount = 0;
  for (const [key, count] of totals) {
    if (count > bestCount) {
      bestKey = key;
      bestCount = count;
    }
  }
  if (!bestKey) return null;
  const month = Number(bestKey.slice(5, 7)) - 1;
  return { label: monthNames[month], count: bestCount };
}

export async function GithubHeatmap() {
  const data = await getContributions(username);
  const days = data?.contributions ?? [];
  const total = data?.total.lastYear ?? days.reduce((sum, d) => sum + d.count, 0);
  const topMonth = mostActiveMonth(days);

  return (
    <section id="github" className="scroll-mt-14">
      <div className="mx-auto max-w-wide px-6 py-24">
        <SectionMeta index="03" title="Shipping" accent="lime" />
        <WordReveal
          words={[{ t: "STILL" }, { t: "COMMITTING" }, { t: "AT" }, { t: "MIDNIGHT.", mark: "lime" }]}
          className="mt-8 font-display text-heading text-foreground uppercase"
        />

        <Reveal delay={0.1} className="mt-12">
          <div className="border border-foreground/25 bg-surface p-6">
            {days.length > 0 ? (
              <>
                <div className="flex flex-wrap items-end gap-x-10 gap-y-4 border-b border-foreground/15 pb-6">
                  <div>
                    <div className="font-display text-4xl text-lime">
                      <AnimatedCounter value={total} />+
                    </div>
                    <div className="mt-1.5 font-mono text-[11px] tracking-caps text-faint uppercase">
                      Contributions / last year
                    </div>
                  </div>
                  {topMonth && (
                    <div>
                      <div className="font-display text-4xl text-violet">
                        <AnimatedCounter value={topMonth.count} />+
                      </div>
                      <div className="mt-1.5 font-mono text-[11px] tracking-caps text-faint uppercase">
                        Most active - {topMonth.label}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <HeatmapGrid days={days} />
                </div>
              </>
            ) : (
              <p className="font-mono text-sm text-faint">
                Couldn&apos;t load GitHub activity right now.
              </p>
            )}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-foreground/15 pt-4">
              <a
                href={site.socials.github}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-xs tracking-caps text-muted uppercase transition-colors hover:text-accent"
              >
                → github.com/{username}
              </a>
              <div className="flex items-center gap-1.5 font-mono text-[11px] text-faint uppercase">
                Less
                {legend.map((level) => (
                  <span
                    key={level}
                    aria-hidden="true"
                    className={`size-[11px] border border-foreground/10 ${legendClasses[level]}`}
                  />
                ))}
                More
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
