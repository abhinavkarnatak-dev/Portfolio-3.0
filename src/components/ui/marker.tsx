"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

// Literal values because motion animates raw colors (match globals.css tokens).
const FILLS = { accent: "#ffb224", lime: "#c6f24e" } as const;
const INK = "#0c0c0d";
const PAPER = "#ededef";

/**
 * Marker highlight that paints itself in when scrolled into view: the colored
 * bar sweeps left to right while the text flips to ink for contrast.
 */
export function Marker({
  children,
  color = "accent",
  delay = 0,
}: {
  children: ReactNode;
  color?: keyof typeof FILLS;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();
  const transition = { duration: 0.55, delay, ease: easeOutQuint };
  const viewport = { once: true, margin: "0px 0px -10% 0px" } as const;

  if (reducedMotion) {
    return (
      <span className="px-[0.14em]" style={{ backgroundColor: FILLS[color], color: INK }}>
        {children}
      </span>
    );
  }

  return (
    <span className="relative inline-block px-[0.14em]">
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 origin-left"
        style={{ backgroundColor: FILLS[color] }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={viewport}
        transition={transition}
      />
      <motion.span
        className="relative"
        initial={{ color: PAPER }}
        whileInView={{ color: INK }}
        viewport={viewport}
        transition={transition}
      >
        {children}
      </motion.span>
    </span>
  );
}
