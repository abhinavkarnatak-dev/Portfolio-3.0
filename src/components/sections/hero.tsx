import Image from "next/image";
import type { CSSProperties } from "react";
import { ButtonLink, buttonVariants } from "@/components/ui/button-link";
import { SectionLink } from "@/components/ui/section-link";
import { StickyNote } from "@/components/ui/sticky-note";
import { site } from "@/data/site";

/** Stagger stage for the CSS-driven load sequence (see hero-enter in globals.css). */
const stage = (n: number) => ({ "--hero-stage": n }) as CSSProperties;

const [firstName, lastName] = site.name.split(" ");

export function Hero() {
  return (
    <section className="mx-auto max-w-wide px-6 pt-16 pb-20 sm:pt-24 sm:pb-24">
      <div className="flex flex-col gap-12 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        <div className="min-w-0">
          <p
            className="hero-enter inline-flex items-center gap-3 border border-foreground/30 px-3.5 py-2 font-mono text-xs tracking-caps text-muted uppercase"
            style={stage(0)}
          >
            {site.jobTitle}
            <span aria-hidden="true" className="size-1.5 bg-alarm" />
            SDE + AI
          </p>

          <h1
            className="hero-enter mt-7 font-display text-mega text-foreground uppercase"
            style={stage(1)}
          >
            {firstName}
            <br />
            <span className="text-outline">{lastName}</span>
          </h1>

          <p
            className="hero-enter mt-7 max-w-xl text-lg leading-relaxed text-muted sm:text-xl"
            style={stage(2)}
          >
            {site.hero.lead} <span className="marker font-semibold">{site.hero.accent}</span>{" "}
            {site.hero.tail} And keeping them alive in production.
          </p>

          <p className="hero-enter mt-5 font-mono text-sm text-faint" style={stage(3)}>
            {site.tagline}
          </p>

          <p
            className="hero-enter mt-8 inline-flex items-center gap-2.5 border border-lime/60 px-3.5 py-2 font-mono text-xs font-semibold tracking-caps text-lime uppercase"
            style={stage(4)}
          >
            <span aria-hidden="true" className="size-1.5 animate-pulse bg-lime" />
            {site.status}
          </p>

          <div className="hero-enter mt-10 flex flex-wrap items-center gap-5" style={stage(5)}>
            <SectionLink id="projects" className={buttonVariants.primary}>
              View work
              <span aria-hidden="true">↓</span>
            </SectionLink>
            <ButtonLink href="/resume" variant="secondary">
              Resume
              <span aria-hidden="true">↗</span>
            </ButtonLink>
          </div>
        </div>

        {/* Portrait: hard frame, solid amber offset shadow, sticky-note label.
            Monochrome at rest, full color on hover. */}
        {/* Shadow lives on the wrapper: the image's grayscale filter would
            otherwise desaturate its own box-shadow. */}
        <div
          className="hero-enter relative order-first w-fit shrink-0 shadow-hard shadow-accent lg:order-last lg:self-center"
          style={stage(1)}
        >
          <Image
            src="/portrait.png"
            alt={`Portrait of ${site.name}`}
            width={448}
            height={448}
            priority
            sizes="(max-width: 640px) 176px, 256px"
            className="size-48 border-2 border-foreground object-cover grayscale transition duration-500 ease-out-quint hover:grayscale-0 sm:size-72"
          />
          <StickyNote className="absolute -bottom-4 -left-3 -rotate-3">~ ships at 2am</StickyNote>
        </div>
      </div>
    </section>
  );
}
