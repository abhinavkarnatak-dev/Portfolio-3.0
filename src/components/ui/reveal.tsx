"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered reveal: opacity + small translate, fires once.
 * Collapses to a plain fade when the user prefers reduced motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -64px 0px" }}
      transition={{ duration: 0.55, delay, ease: easeOutQuint }}
    >
      {children}
    </motion.div>
  );
}
