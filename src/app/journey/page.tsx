import type { Metadata } from "next";
import Link from "next/link";
import { JourneyScroll } from "@/components/journey/journey-scroll";
import { SectionLink } from "@/components/ui/section-link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "The Journey",
  description: `${site.name}'s life in brief - hometown, college, first job, and what's next - told as a flight log.`,
  alternates: { canonical: "/journey" },
  openGraph: {
    title: `The Journey · ${site.name}`,
    description: "Hometown, college, first job, and what's next - told as a flight log.",
    url: "/journey",
    siteName: site.name,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `The Journey · ${site.name}`,
    description: "Hometown, college, first job, and what's next - told as a flight log.",
  },
};

export default function JourneyPage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-wide px-6 pt-16 sm:pt-20">
        <Link
          href="/"
          className="font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          ← cd ../home
        </Link>

        <h1 className="mt-8 font-display text-display text-foreground uppercase">
          The journey<span className="text-outline">.</span>
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Four stops so far: a small hill town, a college campus, one corporate proving ground,
          and whatever comes next. Scroll to board.
        </p>
      </div>

      <JourneyScroll />

      <div className="mx-auto max-w-wide px-6 py-20 text-center">
        <p className="font-mono text-xs tracking-caps text-faint uppercase">■ End of log</p>
        <h2 className="mt-4 font-display text-heading text-foreground uppercase">
          Boarding for the <span className="marker-pop">next</span> one.
        </h2>
        <SectionLink
          id="contact"
          className="mt-8 inline-flex items-center gap-2 bg-pop px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-background uppercase shadow-hard-sm shadow-foreground transition duration-200 ease-out-quint hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-none"
        >
          Let&apos;s talk
          <span aria-hidden="true">→</span>
        </SectionLink>
      </div>
    </main>
  );
}
