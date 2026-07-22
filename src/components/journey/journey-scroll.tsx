"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { journeyStops, type JourneyStop } from "@/data/journey";

// Matches --color-accent / --color-line in globals.css (motion animates raw values).
const ACCENT = "#ffb224";
const LINE = "#26262b";

const statusColor: Record<string, string> = {
  Departed: "text-muted",
  Landed: "text-accent",
  Completed: "text-lime",
  Boarding: "text-alarm",
};

/** Each stop gets its own accent from the site palette, cycling through - not every card amber. */
const STOP_STYLES = [
  { shadow: "shadow-accent", border: "border-accent/40", text: "text-accent", hex: "#ffb224" },
  { shadow: "shadow-lime", border: "border-lime/40", text: "text-lime", hex: "#c6f24e" },
  { shadow: "shadow-pop", border: "border-pop/40", text: "text-pop", hex: "#5468ff" },
  { shadow: "shadow-alarm", border: "border-alarm/40", text: "text-alarm", hex: "#ff4d2e" },
] as const;

function StopCard({ stop, index }: { stop: JourneyStop; index: number }) {
  const isNext = index === journeyStops.length - 1;
  const style = STOP_STYLES[index % STOP_STYLES.length];

  return (
    <div className={`w-full max-w-md border bg-surface shadow-hard sm:max-w-lg ${style.border} ${style.shadow}`}>
      <div
        className={`flex items-center justify-between border-b px-4 py-2 font-mono text-[11px] tracking-caps uppercase ${
          isNext
            ? "border-alarm/30 bg-alarm/10 text-alarm"
            : "border-foreground/15 bg-background text-muted"
        }`}
      >
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 bg-alarm" />
          Departures{isNext ? " - next" : ""}
        </span>
        <span>
          Stop {String(index + 1).padStart(2, "0")} / {String(journeyStops.length).padStart(2, "0")}
        </span>
      </div>

      <div className="p-6 sm:p-8">
        <div className={`font-display text-7xl leading-none sm:text-8xl ${style.text}`}>{stop.code}</div>
        <div className="mt-2 font-mono text-sm font-semibold text-foreground uppercase">
          {stop.city} <span className="text-faint normal-case">- {stop.place}</span>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-foreground/15 pt-4 font-mono text-xs uppercase">
          <span className="text-muted">{stop.era}</span>
          <span className={statusColor[stop.status] ?? "text-muted"}>{stop.status}</span>
        </div>

        <h3 className="mt-5 font-display text-xl text-foreground uppercase">{stop.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{stop.body}</p>

        {stop.layover && (
          <div className="mt-5 border border-line bg-background p-4">
            <p className="font-mono text-[10px] tracking-caps text-lime uppercase">Layover</p>
            <p className="mt-1.5 text-sm font-semibold text-foreground">
              {stop.layover.org} - {stop.layover.role}
            </p>
            <p className="font-mono text-[11px] text-faint">{stop.layover.period}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{stop.layover.detail}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/** One rail node: lights up in its stop's own color once scroll progress passes its threshold. */
function RouteNode({
  index,
  total,
  progress,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const threshold = index / (total - 1);
  const hex = STOP_STYLES[index % STOP_STYLES.length].hex;
  const backgroundColor = useTransform(progress, [Math.max(threshold - 0.001, 0), threshold], [LINE, hex]);
  return (
    <motion.span
      aria-hidden="true"
      className="size-2 -translate-y-px border border-background"
      style={{ backgroundColor }}
    />
  );
}

/** Stop-code pill under the rail: outlined until passed, then fills solid in its own color. */
function StopBadge({
  index,
  total,
  progress,
  code,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  code: string;
}) {
  const threshold = index / (total - 1);
  const hex = STOP_STYLES[index % STOP_STYLES.length].hex;
  const backgroundColor = useTransform(
    progress,
    [Math.max(threshold - 0.001, 0), threshold],
    ["transparent", hex],
  );
  const borderColor = useTransform(progress, [Math.max(threshold - 0.001, 0), threshold], [LINE, hex]);
  return (
    <motion.span
      className="border px-2 py-0.5 font-mono text-[10px] tracking-caps text-foreground uppercase"
      style={{ backgroundColor, borderColor }}
    >
      {code}
    </motion.span>
  );
}

/** Wraps a stop's card with scroll-linked depth: full size and opacity at center stage, receding at the edges. */
function StopPanel({
  stop,
  index,
  total,
  progress,
}: {
  stop: JourneyStop;
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
}) {
  const threshold = index / (total - 1);
  const span = 1 / (total - 1);
  const scale = useTransform(progress, [threshold - span, threshold, threshold + span], [0.92, 1, 0.92]);
  const opacity = useTransform(progress, [threshold - span, threshold, threshold + span], [0.45, 1, 0.45]);

  return (
    <div style={{ width: "100vw" }} className="flex h-full shrink-0 items-center justify-center px-6">
      <motion.div style={{ scale, opacity }}>
        <StopCard stop={stop} index={index} />
      </motion.div>
    </div>
  );
}

function RouteRail({ progress }: { progress: ReturnType<typeof useSpring> }) {
  const total = journeyStops.length;
  const headLeft = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div className="mx-auto w-full max-w-wide px-6">
      <div className="relative h-px w-full bg-line">
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 w-full origin-left bg-linear-to-r from-accent/40 to-accent"
          style={{ scaleX: progress }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-accent"
          style={{ left: headLeft, boxShadow: `0 0 12px 2px ${ACCENT}66` }}
        />
        <div className="absolute inset-0 flex items-center justify-between">
          {journeyStops.map((stop, i) => (
            <RouteNode key={stop.code} index={i} total={total} progress={progress} />
          ))}
        </div>
      </div>
      <div className="mt-3 flex justify-between">
        {journeyStops.map((stop, i) => (
          <StopBadge key={stop.code} index={i} total={total} progress={progress} code={stop.code} />
        ))}
      </div>
    </div>
  );
}

export function JourneyScroll() {
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 32 });
  const x = useTransform(progress, [0, 1], ["0vw", `-${(journeyStops.length - 1) * 100}vw`]);

  const [activeIndex, setActiveIndex] = useState(0);
  useMotionValueEvent(progress, "change", (v) => {
    setActiveIndex(Math.min(journeyStops.length - 1, Math.round(v * (journeyStops.length - 1))));
  });
  const nextStop = journeyStops[activeIndex + 1];

  // The scroll-scrub position is driven purely by window.scrollY, so a stale scroll
  // position left over from history/bfcache restoration (or the previous page's own
  // scroll depth) makes this open mid- or end-of-journey instead of at HDW. Force it
  // back to the top on every mount and stop the browser from re-restoring it later.
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    // Instant, not smooth - the CSS `scroll-behavior: smooth` on <html> would otherwise
    // animate this reset, and a mid-flight layout shift (this page's content mounting)
    // can leave it short of 0.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  if (reducedMotion) {
    return (
      <div className="mx-auto flex max-w-wide flex-col items-center gap-8 px-6 py-16">
        {journeyStops.map((stop, i) => (
          <StopCard key={stop.code} stop={stop} index={i} />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ height: `${journeyStops.length * 100}vh` }} className="relative">
      <div className="sticky top-14 flex h-[calc(100vh-3.5rem)] flex-col overflow-hidden">
        <div className="pt-10">
          <RouteRail progress={progress} />
          <p className="mt-4 text-center font-mono text-[11px] tracking-caps text-faint uppercase">
            {nextStop ? (
              <>
                » Next stop · {String(activeIndex + 2).padStart(2, "0")} / {nextStop.code}
              </>
            ) : (
              "■ End of log"
            )}
          </p>
        </div>

        <div className="flex flex-1 items-center overflow-hidden">
          <motion.div style={{ x, width: `${journeyStops.length * 100}vw` }} className="flex h-full">
            {journeyStops.map((stop, i) => (
              <StopPanel
                key={stop.code}
                stop={stop}
                index={i}
                total={journeyStops.length}
                progress={progress}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
