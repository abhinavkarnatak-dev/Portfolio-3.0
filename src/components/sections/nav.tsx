"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SectionLink } from "@/components/ui/section-link";
import { site } from "@/data/site";

const sections = [
  { id: "projects", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "github", label: "Code" },
  { id: "experience", label: "Logs" },
  { id: "contact", label: "Contact" },
];

const sectionIds = sections.map((s) => s.id);

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

export function Nav() {
  const pathname = usePathname();
  // Scroll-spy rewrites the URL to /projects, /skills, … while on the home page.
  const onHome = pathname === "/" || sectionIds.includes(pathname.slice(1));
  const [active, setActive] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  // Scroll-spy: track which section occupies the middle band of the viewport
  // and keep the URL in sync (clean paths, no hash).
  useEffect(() => {
    if (!onHome) return;
    const visible = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) visible.set(entry.target.id, entry.isIntersecting);
        const current = sectionIds.filter((id) => visible.get(id)).at(-1) ?? null;
        setActive(current);
        window.history.replaceState(null, "", current ? `/${current}` : "/");
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [onHome]);

  // Close the overlay on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-foreground/15 bg-background/90 backdrop-blur-sm">
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 max-w-wide items-center justify-between px-6"
        >
          <Link
            href="/"
            onClick={(e) => {
              // Already on the home page (URL may read /projects etc. via the
              // scroll-spy) - just scroll back to the top instead of navigating.
              if (onHome) {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
              }
            }}
            className="font-display text-xl tracking-wide text-foreground uppercase transition-colors hover:text-accent"
            aria-label={`${site.name} - home`}
          >
            AK<span className="text-accent">.</span>
          </Link>

          <ul className="hidden items-center gap-7 sm:flex">
            {sections.map(({ id, label }) => {
              const isActive = onHome && active === id;
              return (
                <li key={id}>
                  <SectionLink
                    id={id}
                    className={`relative font-mono text-xs tracking-caps uppercase transition-colors duration-200 ${
                      isActive ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {label}
                    <span
                      aria-hidden="true"
                      className={`absolute -bottom-1.5 left-0 h-0.5 bg-accent transition-all duration-300 ease-out-quint ${
                        isActive ? "w-full" : "w-0"
                      }`}
                    />
                  </SectionLink>
                </li>
              );
            })}
            <li className="hidden lg:block">
              <button
                type="button"
                onClick={() => window.dispatchEvent(new Event("ak:cmdk"))}
                aria-label="Open command palette"
                className="cursor-pointer border border-line px-2 py-1 font-mono text-[11px] text-faint uppercase transition-colors hover:border-foreground/50 hover:text-foreground"
              >
                Ctrl K
              </button>
            </li>
            <li>
              <Link
                href="/resume"
                className="bg-lime px-3.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-background uppercase shadow-[3px_3px_0_0_var(--color-foreground)] transition duration-200 ease-out-quint hover:translate-x-0.75 hover:translate-y-0.75 hover:shadow-none"
              >
                Resume ↓
              </Link>
            </li>
          </ul>

          {/* Hamburger that morphs into an X in place - the button never moves,
              so the nav row stays perfectly stable while toggling. */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="relative flex size-9 items-center justify-center text-foreground sm:hidden"
          >
            <span
              aria-hidden="true"
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ease-out-quint ${
                menuOpen ? "rotate-45" : "translate-y-[-3.5px]"
              }`}
            />
            <span
              aria-hidden="true"
              className={`absolute h-0.5 w-5 bg-current transition-transform duration-300 ease-out-quint ${
                menuOpen ? "-rotate-45" : "translate-y-[3.5px]"
              }`}
            />
          </button>
        </nav>
      </header>

      {/* Rendered outside the header: its backdrop-filter would otherwise become
          the containing block for this fixed overlay and clip it to nav height. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutQuint }}
            className="fixed inset-0 z-40 flex flex-col bg-background pt-14 sm:hidden"
          >
            <ul className="flex flex-1 flex-col justify-start gap-3 px-8 pt-8">
              {sections.map(({ id, label }, i) => (
                <motion.li
                  key={id}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 * i, ease: easeOutQuint }}
                >
                  <SectionLink
                    id={id}
                    onNavigate={() => setMenuOpen(false)}
                    className="group flex items-baseline gap-4 py-2"
                  >
                    <span aria-hidden="true" className="font-mono text-sm text-accent">
                      0{i + 1}
                    </span>
                    <span className="font-display text-heading text-foreground uppercase transition-colors group-hover:text-accent">
                      {label}
                    </span>
                  </SectionLink>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, y: reducedMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.05 * sections.length, ease: easeOutQuint }}
              >
                <Link
                  href="/resume"
                  onClick={() => setMenuOpen(false)}
                  className="mt-6 inline-block bg-lime px-5 py-2.5 font-mono text-sm font-semibold tracking-wide text-background uppercase shadow-[4px_4px_0_0_var(--color-foreground)]"
                >
                  Resume ↓
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
