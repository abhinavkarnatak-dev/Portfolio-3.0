import { site } from "@/data/site";

const footerLinks = [
  { label: "Journey", href: "/journey" },
  { label: "GitHub", href: site.socials.github },
  { label: "LinkedIn", href: site.socials.linkedin },
  { label: "Email", href: `mailto:${site.email}` },
];

export function Footer() {
  return (
    <footer className="overflow-hidden border-t border-foreground/15">
      {/* Giant hollow wordmark - pure decoration. */}
      <p
        aria-hidden="true"
        className="text-outline px-6 pt-10 text-center font-display text-[11.5vw] leading-none whitespace-nowrap uppercase opacity-70 select-none"
      >
        {site.name}
      </p>

      <div className="mx-auto flex max-w-wide flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <p className="font-mono text-xs tracking-wide text-muted uppercase">
          © {new Date().getFullYear()} {site.name}
        </p>
        <p className="font-mono text-xs tracking-wide text-faint uppercase">
          Built with Next.js + Claude Design
        </p>
        <ul className="flex flex-wrap items-center gap-6">
          {footerLinks.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="font-mono text-xs tracking-wide text-muted uppercase transition-colors duration-200 hover:text-accent"
                {...(href.startsWith("mailto:") || href.startsWith("/")
                  ? {}
                  : { target: "_blank", rel: "noopener noreferrer" })}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
