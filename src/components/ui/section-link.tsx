"use client";

import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Link to a home-page section. On the home page it scrolls in place; from any
 * other page it client-side navigates to /#section (no reload) and the nav's
 * scroll-spy then rewrites the URL to the clean /section form.
 */
export function SectionLink({
  id,
  className,
  onNavigate,
  children,
}: {
  id: string;
  className?: string;
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <Link
      href={`/#${id}`}
      className={className}
      onClick={(e) => {
        onNavigate?.();
        const el = document.getElementById(id);
        if (!el) return; // not on the home page - let Link navigate client-side
        e.preventDefault();
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      }}
    >
      {children}
    </Link>
  );
}
