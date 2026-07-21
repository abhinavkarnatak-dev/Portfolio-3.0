import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import { loadOgFonts, ogColors } from "@/lib/og";

export const alt = `${site.name} - ${site.jobTitle}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
            color: ogColors.accent,
          }}
        >
          <span style={{ fontFamily: "Anton", fontSize: 34 }}>AK.</span>
          <span style={{ display: "flex", alignItems: "center", gap: 14, color: ogColors.faint }}>
            <span style={{ width: 12, height: 12, backgroundColor: ogColors.alarm }} />
            PORTFOLIO
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Anton",
              fontSize: 118,
              lineHeight: 1,
              color: ogColors.foreground,
              textTransform: "uppercase",
            }}
          >
            {site.name}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Space Mono",
              fontSize: 30,
              color: ogColors.muted,
              marginTop: 26,
              textTransform: "uppercase",
            }}
          >
            <span>{site.hero.lead}&nbsp;</span>
            <span
              style={{
                backgroundColor: ogColors.accent,
                color: ogColors.background,
                padding: "2px 10px",
              }}
            >
              {site.hero.accent}
            </span>
            <span>&nbsp;{site.hero.tail}</span>
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
          <span>{site.tagline}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 12, color: ogColors.lime }}>
            <span style={{ width: 10, height: 10, backgroundColor: ogColors.lime }} />
            {site.status}
          </span>
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
