import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: site.url, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${site.url}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/journey`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...projects.map((project) => ({
      url: `${site.url}/projects/${project.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
