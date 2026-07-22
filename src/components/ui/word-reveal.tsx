"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export type RevealWord = {
  t: string;
  /** Render this word as a marker highlight in one of the five loud accents. */
  mark?: "accent" | "lime" | "pop" | "alarm" | "violet";
  /** Render this word as hollow outline type. */
  outline?: boolean;
};

const motionTags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p } as const;

/* Full literal class names, not built by concatenation - Tailwind's scanner only
   compiles a utility it can see as a complete token somewhere in source, and
   `marker-${item.mark}` never produces one. */
const markerClasses = {
  accent: "marker-accent",
  lime: "marker-lime",
  pop: "marker-pop",
  alarm: "marker-alarm",
  violet: "marker-violet",
} as const;

/**
 * Big-headline entrance: each word rises out of its own clipping box,
 * staggered left to right, once, when the headline scrolls into view.
 *
 * The in-view trigger lives on the headline element itself - the clipped word
 * spans start fully hidden by overflow, so observing them would never fire.
 */
export function WordReveal({
  words,
  className,
  as = "h2",
}: {
  words: RevealWord[];
  className?: string;
  as?: keyof typeof motionTags;
}) {
  const reducedMotion = useReducedMotion();
  const MotionTag = motionTags[as];

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reducedMotion ? 0 : 0.07 } },
  };
  const word: Variants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration: 0.4 } },
      }
    : {
        hidden: { y: "115%" },
        show: { y: 0, transition: { duration: 0.65, ease: easeOutQuint } },
      };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
    >
      {words.map((item, i) => (
        <span key={`${item.t}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
            <motion.span
              variants={word}
              className={`inline-block ${item.mark ? markerClasses[item.mark] : ""} ${item.outline ? "text-outline" : ""}`}
            >
              {item.t}
            </motion.span>
          </span>{" "}
        </span>
      ))}
    </MotionTag>
  );
}
