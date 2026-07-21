/**
 * Infinite ticker strip. Pure CSS animation (see marquee-track in globals.css)
 * so it costs nothing on the main thread and freezes under reduced motion.
 * Decorative - hidden from assistive tech.
 */
export function Marquee({ items }: { items: string[] }) {
  const half = (
    <span className="flex shrink-0 items-center">
      {items.map((item) => (
        <span key={item} className="flex items-center">
          <span className="px-5">{item}</span>
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-accent" />
        </span>
      ))}
    </span>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-foreground/15 bg-surface py-3 select-none"
    >
      <div className="marquee-track flex w-max font-mono text-xs tracking-caps whitespace-nowrap text-muted uppercase">
        {half}
        {half}
      </div>
    </div>
  );
}
