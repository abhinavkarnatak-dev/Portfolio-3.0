/** Site-wide identity and links. */

export const site = {
  name: "Abhinav Karnatak",
  /** Wordmark shown in the nav and footer. */
  mark: "ak.",
  /** Hero positioning line, split so the accent word gets the serif-italic treatment. */
  hero: {
    lead: "Full-stack engineer building",
    accent: "AI-native",
    /** Cycled by the live hero's FlipWords effect - `accent` above is the static
        first frame, used as-is for the (unanimated) OG image render. */
    accentWords: ["AI-native", "scalable", "production-ready", "reliable"],
    tail: "products.",
  },
  tagline: "Next.js · Node · LangChain/LangGraph · AWS",
  status: "Open to SDE + AI roles",
  jobTitle: "Full-Stack Engineer",
  description:
    "Full-stack engineer building AI-native products with Next.js, Node, LangChain/LangGraph and AWS. Open to SDE + AI roles.",
  /** Canonical origin for metadata, OG images and the sitemap. Set NEXT_PUBLIC_SITE_URL in production. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.abhinavkarnatak.com",
  email: "abhinavkarnatak2004@gmail.com",
  socials: {
    twitter: "https://x.com/AbhinavK_Dev",
    github: "https://github.com/abhinavkarnatak-dev",
    linkedin: "https://www.linkedin.com/in/abhinavkarnatak/",
  },
  /** Served from public/resume.pdf. */
  resumePdf: "/resume.pdf",
} as const;
