import Link from "next/link";
import type { ReactNode } from "react";

const base =
  "inline-flex items-center gap-2.5 px-6 py-3 font-mono text-sm font-semibold uppercase tracking-wide transition duration-200 ease-out-quint";

/* Primary presses into its own shadow on hover - shadow offset (4px) and
   translate distance must stay equal for the press illusion. */
export const buttonVariants = {
  primary: `${base} bg-accent text-background shadow-hard-sm shadow-foreground hover:translate-x-1 hover:translate-y-1 hover:shadow-none`,
  secondary: `${base} border border-foreground/80 text-foreground hover:bg-foreground hover:text-background`,
} as const;

export function ButtonLink({
  href,
  variant = "primary",
  download,
  children,
}: {
  href: string;
  variant?: keyof typeof buttonVariants;
  download?: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} download={download} className={buttonVariants[variant]}>
      {children}
    </Link>
  );
}
