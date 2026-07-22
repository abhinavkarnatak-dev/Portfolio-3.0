"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";

/**
 * Cycles through `words`, one at a time, each letter blurring/fading in with a
 * stagger and the outgoing word blurring, scaling up and drifting off on exit -
 * the "flip words" text effect (à la Aceternity's component), reimplemented here
 * so the amber marker-chip styling stays this site's own instead of importing
 * their whole component.
 */
export function FlipWords({
  words,
  duration = 2000,
  className = "",
}: {
  words: string[];
  duration?: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();
  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    const next = words[(words.indexOf(currentWord) + 1) % words.length];
    setCurrentWord(next);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (reducedMotion || isAnimating) return;
    const timeout = setTimeout(startAnimation, duration);
    return () => clearTimeout(timeout);
  }, [reducedMotion, isAnimating, duration, startAnimation]);

  if (reducedMotion) {
    return <span className={`marker-accent font-semibold ${className}`}>{words[0]}</span>;
  }

  return (
    <AnimatePresence onExitComplete={() => setIsAnimating(false)}>
      <motion.span
        key={currentWord}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{
          opacity: 0,
          y: -30,
          x: 30,
          scale: 1.3,
          filter: "blur(8px)",
          position: "absolute",
        }}
        transition={{ type: "spring", stiffness: 100, damping: 10 }}
        className={`marker-accent inline-block font-semibold whitespace-nowrap ${className}`}
      >
        {currentWord.split("").map((letter, i) => (
          <motion.span
            key={`${currentWord}-${i}`}
            initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            className="inline-block"
          >
            {letter === " " ? " " : letter}
          </motion.span>
        ))}
      </motion.span>
    </AnimatePresence>
  );
}
