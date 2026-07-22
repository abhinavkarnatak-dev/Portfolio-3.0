"use client";

import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { education, experience } from "@/data/experience";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

// Matches --color-accent / --color-line in globals.css (motion animates raw values).
const LIME = "#c6f24e";
const LINE = "#26262b";

/**
 * One timeline entry: activates (dot glows amber, block scales and brightens)
 * while the beam head - pinned to ~55% of the viewport - is inside it.
 */
function TimelineItem({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Thin viewport band at 50-55% height, aligned with the beam head.
  const active = useInView(ref, { margin: "-50% 0px -45% 0px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8"
      style={{ transformOrigin: "left center" }}
      animate={
        reducedMotion
          ? { scale: 1, opacity: 1 }
          : { scale: active ? 1.02 : 1, opacity: active ? 1 : 0.7 }
      }
      transition={{ duration: 0.4, ease: easeOutQuint }}
    >
      <motion.span
        aria-hidden="true"
        data-timeline-dot
        className="absolute top-2 left-0 size-2 -translate-x-1/2"
        animate={
          reducedMotion
            ? { backgroundColor: LIME, scale: 1, boxShadow: "none" }
            : {
                backgroundColor: active ? LIME : LINE,
                scale: active ? 1.6 : 1,
                boxShadow: active ? `0 0 12px 2px ${LIME}66` : `0 0 0px 0px ${LIME}00`,
              }
        }
        transition={{ duration: 0.4, ease: easeOutQuint }}
      />
      {children}
    </motion.div>
  );
}

export function ExperienceTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  // Track extent: from the first dot's center to the last dot's center, so the
  // beam starts and ends exactly on the timeline points.
  const [track, setTrack] = useState<{ top: number; height: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const measure = () => {
      const dots = container.querySelectorAll<HTMLElement>("[data-timeline-dot]");
      const first = dots[0];
      const last = dots[dots.length - 1];
      if (!first || !last) return;
      const containerTop = container.getBoundingClientRect().top;
      const firstRect = first.getBoundingClientRect();
      const lastRect = last.getBoundingClientRect();
      const top = firstRect.top + firstRect.height / 2 - containerTop;
      const bottom = lastRect.top + lastRect.height / 2 - containerTop;
      setTrack({ top, height: bottom - top });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Beam progress: 0 when the timeline top reaches ~60% of the viewport,
  // 1 when its bottom reaches ~50% - so the head tracks the reading line.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.6", "end 0.5"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34 });
  const headTop = useTransform(progress, (v) => `${v * 100}%`);

  const trackStyle = track ? { top: track.top, height: track.height } : undefined;

  return (
    <div ref={containerRef} className="relative mt-10">
      {/* Static track */}
      <div
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-0 w-px bg-line"
        style={trackStyle}
      />

      {!reducedMotion && (
        <div
          aria-hidden="true"
          className="absolute top-1 bottom-1 left-0 w-px overflow-visible"
          style={trackStyle}
        >
          {/* Beam: draws down the track in sync with scroll */}
          <motion.div
            className="absolute inset-0 w-px origin-top bg-linear-to-b from-lime/30 to-lime"
            style={{ scaleY: progress }}
          />
          {/* Glowing head */}
          <motion.div
            className="absolute left-0 size-2.5 -translate-x-1/2 -translate-y-1/2 bg-lime"
            style={{ top: headTop, boxShadow: `0 0 14px 3px ${LIME}59` }}
          />
        </div>
      )}

      <div className="space-y-10">
        {experience.map((item) => (
          <TimelineItem key={`${item.org}-${item.role}`}>
            <h3 className="font-medium text-foreground">
              {item.role} · {item.org}
            </h3>
            <p className="mt-1 font-mono text-xs text-faint">{item.period}</p>
            <ul className="mt-4 space-y-2.5">
              {item.bullets.map((bullet) => (
                <li key={bullet} className="text-sm leading-relaxed text-muted">
                  {bullet}
                </li>
              ))}
            </ul>
          </TimelineItem>
        ))}

        {education.map((item) => (
          <TimelineItem key={item.degree}>
            <h3 className="font-medium text-foreground">{item.degree}</h3>
            <p className="mt-1 font-mono text-xs text-faint">
              {item.institution} · {item.period}
            </p>
            {item.detail && (
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.detail}</p>
            )}
          </TimelineItem>
        ))}
      </div>
    </div>
  );
}
