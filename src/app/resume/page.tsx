import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume of ${site.name} - ${site.jobTitle}. View online or download as PDF.`,
  alternates: { canonical: "/resume" },
  openGraph: {
    title: `Resume · ${site.name}`,
    description: `Resume of ${site.name} - ${site.jobTitle}.`,
    url: "/resume",
    siteName: site.name,
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `Resume · ${site.name}`,
    description: `Resume of ${site.name} - ${site.jobTitle}.`,
  },
};

export default function ResumePage() {
  return (
    <main id="main" className="flex-1">
      <div className="mx-auto max-w-content px-6 py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-heading text-foreground uppercase">
              Resu<span className="text-outline">me.</span>
            </h1>
            <p className="mt-3 text-muted">
              {site.name} · {site.jobTitle}
            </p>
          </div>
          <ButtonLink href={site.resumePdf} download>
            Download PDF
            <span aria-hidden="true">↓</span>
          </ButtonLink>
        </div>

        <div className="mt-10 overflow-hidden border border-foreground/25 shadow-hard shadow-pop">
          <object
            data={site.resumePdf}
            type="application/pdf"
            aria-label={`Resume of ${site.name} (PDF)`}
            className="aspect-17/22 w-full"
          >
            <p className="p-6 text-muted">
              Your browser can&apos;t display PDFs inline -{" "}
              <a
                href={site.resumePdf}
                download
                className="text-foreground underline decoration-line underline-offset-4 hover:decoration-pop"
              >
                download the resume
              </a>{" "}
              instead.
            </p>
          </object>
        </div>
      </div>
    </main>
  );
}
