import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Site-wide default share image — applies to every route that doesn't define its own
// `openGraph.images` (see src/lib/seo.ts's openGraphWithImage, only used on pages with a real
// product photo). Logo-only, no rendered text: Satori (the engine behind next/og) has no Thai
// glyph coverage without an explicitly loaded Thai font, so any Thai copy here would render as
// tofu boxes — the existing brand mark alone is honest and safe.
export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/brand/okami-logo.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0e0e10",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- next/og requires a plain <img>, not next/image */}
        <img src={logoSrc} width={840} height={255} alt="" />
      </div>
    ),
    { ...size }
  );
}
