import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { site } from "@/data/site";
import { loadOgFonts, ogColors } from "@/lib/og";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const fonts = await loadOgFonts();

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: ogColors.background,
        padding: 40,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          border: `3px solid ${ogColors.foreground}`,
          padding: 56,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontFamily: "Space Mono",
            fontSize: 26,
          }}
        >
          <span style={{ fontFamily: "Anton", fontSize: 34, color: ogColors.accent }}>AK.</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: ogColors.faint }}>
            <span style={{ width: 12, height: 12, backgroundColor: ogColors.alarm }} />
            CASE STUDY
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Anton",
              fontSize: 116,
              lineHeight: 1,
              color: ogColors.foreground,
              textTransform: "uppercase",
            }}
          >
            {project.name}
          </div>
          <div
            style={{
              fontFamily: "Space Mono",
              fontSize: 30,
              color: ogColors.muted,
              marginTop: 24,
              lineHeight: 1.4,
              maxWidth: 980,
            }}
          >
            {project.oneLiner}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: `1px solid ${ogColors.line}`,
            paddingTop: 26,
            fontFamily: "Space Mono",
            fontSize: 22,
            color: ogColors.faint,
            textTransform: "uppercase",
          }}
        >
          <span>{project.tags.slice(0, 4).join(" · ")}</span>
          <span style={{ color: ogColors.accent }}>{site.name}</span>
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
