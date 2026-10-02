/**
 * Brand logos on product pages (owner 03/10, round "G5 template": "ทุกแบรนด์ใส่ Logo ของแบรนด์นั้นลงไปในหน้าสินค้า").
 * One entry per brand id (src/data/brands.ts) whose maker-served logo file is in public/assets/brands/ — light or colour
 * version that reads on the dark site. ProductHero shows it in place of the brand text chip, linked to the brand page; a
 * brand without an entry keeps the text chip, so adding a brand here is the only step. Sources: the maker's own site only
 * (the source page of each file is noted on its line). Files are trimmed to their ink; nothing is redrawn or recoloured.
 * `shape`: "square" = a stacked mark or emblem, shown taller so it stays legible · "long" = a very wide wordmark, shown
 * shorter so it does not outgrow the hero's chip row · no shape = an ordinary wordmark.
 */
export interface BrandLogo {
  src: string;
  width: number;
  height: number;
  shape?: "square" | "long";
}

export const BRAND_LOGOS: Record<string, BrandLogo> = {
  // myuwell.com footer (files.myuwell.com/uwell/neo/footer/logo.png) — white on transparent
  uwell: { src: "/assets/brands/uwell-logo.png", width: 225, height: 44 },
  // infy.my header (wp-content/uploads/2024/03/Infy-Logo.png) — white on transparent, trimmed and scaled to 120 px tall
  infy: { src: "/assets/brands/infy-logo.png", width: 386, height: 120 },
  // shop.voopoo.com header (img-va.myshopline.com/image/store/1747294110724/-LOGO-0.png) — white; brand.voopoo.com serves
  // only a 146 px copy and says its kit PHOTOS must be bought (the logo is the shop's own header file)
  voopoo: { src: "/assets/brands/voopoo-logo.png", width: 728, height: 120 },
  // salthub.com footer (wp-content/uploads/2023/12/Marbo-LOGO_画板-1-2.png — the file name says Marbo, the art is the
  // SaltHub wordmark) — white
  salthub: { src: "/assets/brands/salthub-logo.png", width: 370, height: 120 },
  // dotmod.com header (cdn/shop/files/LOGO_035ae761….png) — gold emblem, no light version on the site
  dotmod: { src: "/assets/brands/dotmod-logo.png", width: 120, height: 120, shape: "square" },
  // eskobarvape.com header + footer (assets/eskobar-logo.avif, the only size served) — yellow
  "esko-bar": { src: "/assets/brands/esko-bar-logo.png", width: 403, height: 37, shape: "long" },
  // instabar.net header (cdn/shop/files/20220704165456.png) — white, two lines
  instabar: { src: "/assets/brands/instabar-logo.png", width: 167, height: 120, shape: "square" },
  // myjoiway.id header (cdn/shop/files/1st_Logo_JOIWAY_….png) — white word between two green bars
  joiway: { src: "/assets/brands/joiway-logo.png", width: 344, height: 120 },
  // kardinal.com header (cdn.prod.website-files.com/…/kardinal_logo_red.png) — red
  "kardinal-stick": { src: "/assets/brands/kardinal-stick-logo.png", width: 525, height: 120 },
  // nevoks.com header (cdn/shop/files/NEVOKS-Logo_20231108.png) — white
  nevoks: { src: "/assets/brands/nevoks-logo.png", width: 600, height: 120 },
  // not yet (03/10): wotofo (the site serves a black wordmark only) · ske (the site's logo is a seasonal Halloween
  // version, black) · relx (relxnow.com serves no logo file; the UK store's file is a retailer lockup) · iqos (no logo on
  // iqos.com / jp.iqos.com) · tfit / lambda / rincoe (no file found, site unreachable or script-built)
};
