/**
 * Numbered section slug: "■ 01 / SELECTED WORK        07 case studies".
 * The red square + mono caps line every section opens with.
 */
export function SectionMeta({
  index,
  title,
  meta,
}: {
  index: string;
  title: string;
  meta?: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-foreground/15 pb-3 font-mono text-xs tracking-caps uppercase">
      <span className="flex items-center gap-3 text-muted">
        <span aria-hidden="true" className="size-2 shrink-0 bg-alarm" />
        {index} / {title}
      </span>
      {meta ? <span className="hidden text-faint sm:block">{meta}</span> : null}
    </div>
  );
}
