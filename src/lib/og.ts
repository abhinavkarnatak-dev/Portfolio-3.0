import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Self-hosted fonts for `ImageResponse` OG cards (no network at build time). */
export async function loadOgFonts() {
  const dir = join(process.cwd(), "src", "assets", "fonts");
  const [anton, mono] = await Promise.all([
    readFile(join(dir, "Anton-Regular.ttf")),
    readFile(join(dir, "SpaceMono-Regular.ttf")),
  ]);

  return [
    { name: "Anton", data: anton, style: "normal" as const, weight: 400 as const },
    { name: "Space Mono", data: mono, style: "normal" as const, weight: 400 as const },
  ];
}

export const ogColors = {
  background: "#0c0c0d",
  surface: "#141416",
  foreground: "#ededef",
  muted: "#9c9ca4",
  faint: "#7c7c85",
  accent: "#ffb224",
  lime: "#c6f24e",
  alarm: "#ff4d2e",
  line: "#26262b",
} as const;
