import type { ReactNode } from "react";

const fills = {
  lime: "bg-lime",
  accent: "bg-accent",
} as const;

/** Rotated label slapped onto things - the human-touch artifact. */
export function StickyNote({
  children,
  color = "lime",
  className = "",
}: {
  children: ReactNode;
  color?: keyof typeof fills;
  className?: string;
}) {
  return (
    <span
      className={`inline-block px-3 py-1.5 font-mono text-xs font-semibold text-background uppercase ${fills[color]} ${className}`}
    >
      {children}
    </span>
  );
}
