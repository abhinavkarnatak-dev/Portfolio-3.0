"use client";

import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { journeyStops, type JourneyStop } from "@/data/journey";

// Matches --color-line in globals.css (motion animates raw values).
const LINE = "#26262b";

// How much empty travel sits between one card's slot and the next's, in vw - the
// plane's dedicated stage. Tuned down several times already (100 -> 70 -> 63/42 ->
// 63/29 -> 63/17, now explicit 40/10 values).
function gapVwFor(slotWidthPx: number) {
  return slotWidthPx > 0 && slotWidthPx < 640 ? 40 : 10;
}

// The scroll container's height controls how much physical scrolling one full pass
// through the journey takes - it's independent of the row's own width (which must
// still match the real horizontal travel distance). Under 1:1 makes each mouse-wheel
// tick advance the animation further; mobile got an extra bump on top of the shared
// tune-down, desktop is untouched here.
function scrollDistanceFactorFor(slotWidthPx: number) {
  return slotWidthPx > 0 && slotWidthPx < 640 ? 0.75 : 0.88;
}

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

/** One caricature per hop, themed to what that leg of the journey actually was. */
const HOP_IMAGES = [
  "/journey/caricature-hdw-ded.png", // HDW -> DED: leaving home for college
  "/journey/caricature-ded-bom.png", // DED -> BOM: college to the corporate job
  "/journey/caricature-bom-tbd.png", // BOM -> TBD: back home, next chapter open
] as const;

/**
 * One card-to-card hop: a faint dotted guide arc plus a brighter dashed trail that
 * draws itself in as a small plane flies along it, banking to face its direction of
 * travel. Lives inside the sliding row itself (not a viewport-fixed overlay), spanning
 * from slot `index` to slot `index + 1`, so it scrolls along with the very cards it
 * connects instead of drifting past them. Only visible during its own slice of the
 * scroll, fading in right as the departing card starts sliding off and out once the
 * next one has landed - which is also when the cards themselves are dimmest, so
 * nothing fights for attention.
 */
function JourneyConnector({
  index,
  total,
  progress,
  slotWidth,
  height,
  color,
}: {
  index: number;
  total: number;
  progress: ReturnType<typeof useSpring>;
  slotWidth: number;
  height: number;
  color: string;
}) {
  const start = index / (total - 1);
  const end = (index + 1) / (total - 1);
  const fadeMargin = (end - start) * 0.15;

  const t = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(
    progress,
    [
      Math.max(start - fadeMargin, 0),
      start + fadeMargin,
      end - fadeMargin,
      Math.min(end + fadeMargin, 1),
    ],
    [0, 1, 1, 0],
  );

  // Local coordinates span three slots (card, empty gap, next card): departure sits
  // just past the leaving card's real edge in the first slot, arrival just past the
  // next card's real edge in the third - arced up and over the empty middle slot,
  // which is where the plane flies alone with neither card competing for attention.
  // Cards are a fixed 280px up to the sm breakpoint and 512px (max-w-lg) above it,
  // minus the 48px of horizontal padding each slot has room for.
  const isMobile = slotWidth < 640;
  const cardWidth = Math.min(isMobile ? 280 : 512, slotWidth - 48);
  const gapVw = gapVwFor(slotWidth);
  const gapWidth = (slotWidth * gapVw) / 100;
  const edgeGap = 14;
  const x0 = slotWidth / 2 + cardWidth / 2 + edgeGap;
  const y0 = height * 0.58;
  const x1 = slotWidth + gapWidth + slotWidth / 2 - cardWidth / 2 - edgeGap;
  const y1 = height * 0.58;
  const cx = slotWidth + gapWidth / 2;
  // A shallower rise on phones - the same fraction as desktop reads as an exaggerated,
  // too-tall arc once the row is a tall portrait rectangle instead of a short wide one.
  // Trimmed down twice already (0.34 -> 0.44, now 0.5, closer to the 0.58 baseline).
  const cy = height * (isMobile ? 0.5 : 0.06);
  const pathD = `M${x0} ${y0} Q${cx} ${cy} ${x1} ${y1}`;

  // Smaller on phones, where the arc (and the gap it flies across) is more compact.
  const imageSize = isMobile ? 96 : 120;
  const imageHalf = imageSize / 2;

  const planeTransform = useTransform(t, (v) => {
    const mt = 1 - v;
    const bx = mt * mt * x0 + 2 * mt * v * cx + v * v * x1;
    const by = mt * mt * y0 + 2 * mt * v * cy + v * v * y1;
    const dx = 2 * mt * (cx - x0) + 2 * v * (x1 - cx);
    const dy = 2 * mt * (cy - y0) + 2 * v * (y1 - cy);
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return `translate(${bx - imageHalf}px, ${by - imageHalf}px) rotate(${angle}deg)`;
  });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0"
      style={{ left: `${index * (100 + gapVw)}vw`, width: `${200 + gapVw}vw`, opacity }}
    >
      <svg
        width={slotWidth * 2 + gapWidth}
        height={height}
        className="absolute inset-0 overflow-visible"
      >
        <path d={pathD} fill="none" stroke={LINE} strokeWidth={2} strokeDasharray="1 9" strokeLinecap="round" />
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth={3}
          strokeDasharray="9 7"
          strokeLinecap="round"
          style={{ pathLength: t }}
        />
      </svg>
      <motion.img
        src={HOP_IMAGES[index % HOP_IMAGES.length]}
        alt=""
        width={imageSize}
        height={imageSize}
        className="absolute top-0 left-0"
        style={{ transform: planeTransform, transformOrigin: `${imageHalf}px ${imageHalf}px` }}
      />
    </motion.div>
  );
}

function StopCard({ stop, index }: { stop: JourneyStop; index: number }) {
  const isNext = index === journeyStops.length - 1;
  const style = STOP_STYLES[index % STOP_STYLES.length];

  return (
    <div
      className={`w-full max-w-[280px] border bg-surface shadow-hard sm:max-w-lg ${style.border} ${style.shadow}`}
    >
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
  // Half the stop-to-stop distance - now that there's an empty gap slot between cards,
  // this fades a card out by the time it leaves its own slot, so it's fully receded
  // (not still mid-fade) through the gap where the plane is meant to be the only thing
  // moving.
  const span = 0.5 / (total - 1);
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

  // Same amber -> lime -> pop -> alarm progression used everywhere else, but drawn as
  // one continuous route instead of a flat amber fill. The gradient is rendered at
  // full width, always in place; a bg-line mask covers the part not yet reached and
  // shrinks as you scroll, uncovering more of it - so the fill visually "becomes"
  // each stop's own color on arrival instead of just growing in a single hue.
  const stopHexes = journeyStops.map((_, i) => STOP_STYLES[i % STOP_STYLES.length].hex);
  const stopFractions = journeyStops.map((_, i) => i / (total - 1));
  const gradientStops = journeyStops
    .map((_, i) => `${stopHexes[i]} ${stopFractions[i] * 100}%`)
    .join(", ");
  const headColor = useTransform(progress, stopFractions, stopHexes);
  const headShadow = useTransform(headColor, (c) => `0 0 12px 2px ${c}66`);

  return (
    <div className="mx-auto w-full max-w-wide px-6">
      <div className="relative h-px w-full">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{ backgroundImage: `linear-gradient(to right, ${gradientStops})` }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute inset-y-0 right-0 bg-line"
          style={{ left: headLeft }}
        />
        <motion.div
          aria-hidden="true"
          className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2"
          style={{ left: headLeft, backgroundColor: headColor, boxShadow: headShadow }}
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

  // One slot's real pixel size (each StopPanel is exactly 100vw) - the connectors
  // need this in px, not vw, to fly along an undistorted bezier and rotate correctly,
  // and the gap between stops (see below) also depends on which breakpoint this is.
  const rowRef = useRef<HTMLDivElement>(null);
  const [rowSize, setRowSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    const measure = () => setRowSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  // The card width itself now scales down with the viewport (see StopCard), so there's
  // always a real gap to fly through - only skip this before the row has been measured.
  const showConnectors = rowSize.width > 0;

  // A blank spacer slot (gapVw wide) is inserted between every pair of cards (see the
  // render below), so each stop-to-stop step covers 100+gapVw instead of a plain 100vw
  // - giving the connector's plane its own stage to cross before the next card arrives,
  // instead of the two cards being adjacent. Stops still land at the same progress
  // fractions either way (i/(n-1)), since the total travel distance and the stop
  // spacing scale together.
  const gapVw = gapVwFor(rowSize.width);
  const totalTravelVw = (journeyStops.length - 1) * (100 + gapVw);
  const x = useTransform(progress, [0, 1], ["0vw", `-${totalTravelVw}vw`]);

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
    <div
      ref={containerRef}
      style={{ height: `${(totalTravelVw + 100) * scrollDistanceFactorFor(rowSize.width)}vh` }}
      className="relative"
    >
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

        <div ref={rowRef} className="relative flex flex-1 items-center overflow-hidden">
          <motion.div
            style={{ x, width: `${totalTravelVw + 100}vw` }}
            className="relative flex h-full"
          >
            {journeyStops.map((stop, i) => (
              <Fragment key={stop.code}>
                <StopPanel stop={stop} index={i} total={journeyStops.length} progress={progress} />
                {i < journeyStops.length - 1 && (
                  <div aria-hidden="true" style={{ width: `${gapVw}vw` }} className="h-full shrink-0" />
                )}
              </Fragment>
            ))}
            {showConnectors &&
              journeyStops.slice(0, -1).map((stop, i) => (
                <JourneyConnector
                  key={`${stop.code}-connector`}
                  index={i}
                  total={journeyStops.length}
                  progress={progress}
                  slotWidth={rowSize.width}
                  height={rowSize.height}
                  color={STOP_STYLES[i % STOP_STYLES.length].hex}
                />
              ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
