/** Each homepage section owns one loud accent, reused across its nav link, section bullet and headline mark - so the same section reads as the same color everywhere instead of everything defaulting to amber. */
export type AccentName = "accent" | "lime" | "pop" | "alarm" | "violet";

export const sectionAccents: Record<string, AccentName> = {
  projects: "alarm",
  skills: "pop",
  github: "lime",
  experience: "accent",
  contact: "violet",
};

export const accentText: Record<AccentName, string> = {
  accent: "text-accent",
  lime: "text-lime",
  pop: "text-pop",
  alarm: "text-alarm",
  violet: "text-violet",
};

export const accentBg: Record<AccentName, string> = {
  accent: "bg-accent",
  lime: "bg-lime",
  pop: "bg-pop",
  alarm: "bg-alarm",
  violet: "bg-violet",
};

/* Full compound-variant strings, not built by concatenation - Tailwind's scanner
   only picks up classes that appear as a complete literal token in source. */
export const accentGroupHoverText: Record<AccentName, string> = {
  accent: "group-hover:text-accent",
  lime: "group-hover:text-lime",
  pop: "group-hover:text-pop",
  alarm: "group-hover:text-alarm",
  violet: "group-hover:text-violet",
};
