"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { site } from "@/data/site";

const easeOutQuint = [0.22, 1, 0.36, 1] as const;

type Command = {
  label: string;
  hint: string;
  action: { type: "section"; id: string } | { type: "href"; href: string };
};

const commands: Command[] = [
  { label: "Selected work", hint: "section", action: { type: "section", id: "projects" } },
  { label: "Stack", hint: "section", action: { type: "section", id: "skills" } },
  { label: "GitHub activity", hint: "section", action: { type: "section", id: "github" } },
  { label: "Work logs", hint: "section", action: { type: "section", id: "experience" } },
  { label: "Contact", hint: "section", action: { type: "section", id: "contact" } },
  { label: "Resume", hint: "page", action: { type: "href", href: "/resume" } },
  { label: "The journey", hint: "page", action: { type: "href", href: "/journey" } },
  ...projects.map((p) => ({
    label: p.name,
    hint: "case study",
    action: { type: "href" as const, href: `/projects/${p.slug}` },
  })),
  { label: "Email me", hint: site.email, action: { type: "href", href: `mailto:${site.email}` } },
];

/**
 * Ctrl/Cmd+K command palette: type-to-filter navigation across sections,
 * case studies and contact. Also opens via the nav's "Ctrl K" chip, which
 * dispatches the "ak:cmdk" event.
 */
export function CommandPalette() {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) => `${c.label} ${c.hint}`.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    // Reset the filter on every open so the palette starts fresh.
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setQuery("");
        setActiveIndex(0);
        setOpen((v) => !v);
      }
    };
    const onOpenEvent = () => {
      setQuery("");
      setActiveIndex(0);
      setOpen(true);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("ak:cmdk", onOpenEvent);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("ak:cmdk", onOpenEvent);
    };
  }, []);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const run = (command: Command) => {
    setOpen(false);
    if (command.action.type === "section") {
      const el = document.getElementById(command.action.id);
      if (el) {
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
      } else {
        router.push(`/#${command.action.id}`);
      }
      return;
    }
    if (command.action.href.startsWith("mailto:")) {
      window.location.href = command.action.href;
    } else {
      router.push(command.action.href);
    }
  };

  const onInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && results[activeIndex]) {
      e.preventDefault();
      run(results[activeIndex]);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18, ease: easeOutQuint }}
          className="fixed inset-0 z-60 flex items-start justify-center bg-background/85 px-4 pt-[18vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.22, ease: easeOutQuint }}
            className="w-full max-w-lg border border-foreground/80 bg-surface shadow-hard shadow-accent"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-foreground/15 px-4">
              <span aria-hidden="true" className="font-mono text-sm text-accent">
                ❯
              </span>
              <input
                ref={inputRef}
                autoFocus
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
                placeholder="Jump to..."
                aria-label="Search sections and projects"
                className="w-full bg-transparent py-3.5 font-mono text-sm text-foreground outline-none placeholder:text-faint"
              />
              <kbd className="border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint uppercase">
                Esc
              </kbd>
            </div>

            <ul className="max-h-72 overflow-y-auto py-2">
              {results.length === 0 && (
                <li className="px-4 py-3 font-mono text-sm text-faint">No matches.</li>
              )}
              {results.map((command, i) => (
                <li key={command.label}>
                  <button
                    type="button"
                    onClick={() => run(command)}
                    onMouseEnter={() => setActiveIndex(i)}
                    className={`flex w-full cursor-pointer items-baseline justify-between gap-4 px-4 py-2.5 text-left font-mono text-sm transition-colors ${
                      i === activeIndex
                        ? "bg-accent text-background"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    <span className="uppercase">{command.label}</span>
                    <span
                      className={`text-[11px] uppercase ${i === activeIndex ? "text-background/70" : "text-faint"}`}
                    >
                      {command.hint}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
