import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "This page doesn't exist.",
};

export default function NotFound() {
  return (
    <main id="main" className="flex flex-1 items-center">
      <div className="mx-auto max-w-content px-6 py-24">
        <p className="inline-flex items-center gap-3 border border-foreground/30 px-3.5 py-2 font-mono text-sm tracking-caps text-alarm uppercase">
          <span aria-hidden="true" className="size-1.5 bg-alarm" />
          Error 404
        </p>
        <h1 className="mt-8 font-display text-display text-foreground uppercase">
          Nothing <span className="marker">here.</span>
        </h1>
        <p className="mt-5 max-w-md text-muted">
          This page doesn&apos;t exist - it may have moved, or the link was wrong from the start.
        </p>
        <div className="mt-10">
          <ButtonLink href="/">Back home</ButtonLink>
        </div>
      </div>
    </main>
  );
}
