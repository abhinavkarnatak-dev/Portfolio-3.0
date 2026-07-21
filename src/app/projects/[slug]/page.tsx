import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: project.name,
      description: project.oneLiner,
      url: `/projects/${slug}`,
      siteName: site.name,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.name,
      description: project.oneLiner,
    },
  };
}

/** Numbered mono-slug + Anton title - the case-study echo of SectionMeta. */
function CaseHeading({ index, title }: { index: string; title: string }) {
  return (
    <h2 className="flex items-baseline gap-3 border-b border-foreground/15 pb-3 font-display text-2xl text-foreground uppercase sm:text-3xl">
      <span aria-hidden="true" className="font-mono text-sm font-semibold text-accent">
        {index} /
      </span>
      {title}
    </h2>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { caseStudy } = project;
  const github = project.links.find((l) => l.label === "GitHub");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.name,
    description: project.description,
    url: `${site.url}/projects/${project.slug}`,
    ...(github ? { codeRepository: github.href } : {}),
    author: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <main id="main" className="flex-1">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-content px-6 py-16 sm:py-20">
        <Link
          href="/#projects"
          className="font-mono text-sm text-muted transition-colors hover:text-accent"
        >
          ← cd ../work
        </Link>

        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-4">
            <h1 className="font-display text-display text-foreground uppercase">{project.name}</h1>
            {project.status === "building" && (
              <span className="border border-lime/60 px-2.5 py-1 font-mono text-xs font-semibold text-lime uppercase">
                Building
              </span>
            )}
          </div>
          <p className="mt-5 max-w-xl text-lg text-muted">{project.oneLiner}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="border border-line px-2 py-0.5 font-mono text-[11px] text-muted uppercase"
              >
                {tag}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-16 space-y-16">
          <section>
            <CaseHeading index="01" title="The problem" />
            <div className="mt-6 space-y-4">
              {caseStudy.problem.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section>
            <CaseHeading index="02" title="What I built" />
            <div className="mt-6 space-y-4">
              {caseStudy.built.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>

          <section>
            <CaseHeading index="03" title="Architecture" />
            <div className="mt-6 space-y-4">
              {caseStudy.architecture.description.map((paragraph) => (
                <p key={paragraph} className="leading-relaxed text-muted">
                  {paragraph}
                </p>
              ))}
            </div>
            {caseStudy.architecture.diagram && (
              <figure className="mt-8">
                <Image
                  src={caseStudy.architecture.diagram.src}
                  alt={caseStudy.architecture.diagram.alt}
                  width={caseStudy.architecture.diagram.width}
                  height={caseStudy.architecture.diagram.height}
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="border border-foreground/25"
                />
              </figure>
            )}
          </section>

          {caseStudy.hardProblems.length > 0 && (
            <section>
              <CaseHeading index="04" title="Bugs I actually debugged" />
              <div className="mt-8 space-y-6">
                {caseStudy.hardProblems.map(({ title, body }, i) => (
                  <div key={title} className="border border-foreground/25 bg-surface p-5 sm:p-6">
                    <p className="font-mono text-xs font-semibold tracking-caps text-alarm uppercase">
                      Bug {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="mt-2 font-medium text-foreground">{title}</h3>
                    <div className="mt-3 space-y-3">
                      {body.map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-relaxed text-muted">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <CaseHeading index={caseStudy.hardProblems.length > 0 ? "05" : "04"} title="Results" />
            <ul className="mt-6 space-y-3">
              {caseStudy.results.map((result) => (
                <li key={result} className="flex gap-3 leading-relaxed text-muted">
                  <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 bg-accent" />
                  {result}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <CaseHeading index={caseStudy.hardProblems.length > 0 ? "06" : "05"} title="Stack" />
            <dl className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
              {caseStudy.stack.map(({ group, items }) => (
                <div key={group}>
                  <dt className="font-mono text-xs tracking-caps text-accent uppercase">{group}</dt>
                  <dd className="mt-2 text-muted">{items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
          </section>

          {project.links.length > 0 && (
            <section className="border-t border-foreground/15 pt-10">
              <div className="flex flex-wrap gap-4">
                {project.links.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-foreground/80 px-4 py-2 font-mono text-xs font-semibold tracking-wide text-foreground uppercase transition-colors duration-200 hover:bg-foreground hover:text-background"
                  >
                    {label} <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </main>
  );
}
