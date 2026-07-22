const dotColors = {
  accent: "bg-accent",
  lime: "bg-lime",
  pop: "bg-pop",
  alarm: "bg-alarm",
  violet: "bg-violet",
} as const;

/**
 * Numbered section slug: "■ 01 / SELECTED WORK        07 case studies".
 * The square + mono caps line every section opens with - each section gets its
 * own accent so the squares cycle through the palette down the page.
 */
export function SectionMeta({
  index,
  title,
  meta,
  accent = "alarm",
}: {
  index: string;
  title: string;
  meta?: string;
  accent?: keyof typeof dotColors;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-foreground/15 pb-3 font-mono text-xs tracking-caps uppercase">
      <span className="flex items-center gap-3 text-muted">
        <span aria-hidden="true" className={`size-2 shrink-0 ${dotColors[accent]}`} />
        {index} / {title}
      </span>
      {meta ? <span className="hidden text-faint sm:block">{meta}</span> : null}
    </div>
  );
}
