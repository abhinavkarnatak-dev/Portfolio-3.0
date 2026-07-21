import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { GithubHeatmap } from "@/components/sections/github-heatmap";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Marquee } from "@/components/ui/marquee";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const tickerItems = [
  `${projects.length} projects shipped`,
  "Next.js",
  "Node",
  "LangChain / LangGraph",
  "AWS EC2",
  "Redis",
  "RabbitMQ",
  "PostgreSQL",
  "Self-hosted everything",
  "Open to SDE + AI roles",
];

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name} - ${site.jobTitle}`,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.jobTitle}`,
    description: site.description,
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  jobTitle: site.jobTitle,
  url: site.url,
  email: `mailto:${site.email}`,
  sameAs: [site.socials.github, site.socials.linkedin],
};

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <Hero />
      <Marquee items={tickerItems} />
      <Projects />
      <Skills />
      <GithubHeatmap />
      <Experience />
      <Contact />
    </main>
  );
}
