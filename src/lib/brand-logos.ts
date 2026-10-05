/**
 * Brand logos on product pages (owner 03/10, round "G5 template": "ทุกแบรนด์ใส่ Logo ของแบรนด์นั้นลงไปในหน้าสินค้า").
 * One entry per brand id (src/data/brands.ts) whose maker-served logo file is in public/assets/brands/ — light or colour
 * version that reads on the dark site. ProductHero shows it in place of the brand text chip, linked to the brand page; a
 * brand without an entry keeps the text chip, so adding a brand here is the only step. Sources: the maker's own site only
 * (the source page of each file is noted on its line). Files are trimmed to their ink; nothing is redrawn or recoloured.
 * `scale`: the hero shows every logo 20 px tall (24 px from lg) × scale, so the LETTERS look one size across brands
 * (owner eye 03/10, item 4): > 1 for a stacked mark, an emblem or a word framed by bars/a box · < 1 for a very wide
 * wordmark · none = 1 (a plain wordmark whose letters fill the file's height, like UWELL).
 */
export interface BrandLogo {
  src: string;
  width: number;
  height: number;
  scale?: number;
}

export const BRAND_LOGOS: Record<string, BrandLogo> = {
  // myuwell.com footer (files.myuwell.com/uwell/neo/footer/logo.png) — white on transparent
  uwell: { src: "/assets/brands/uwell-logo.png", width: 225, height: 44 },
  // infy.my header (wp-content/uploads/2024/03/Infy-Logo.png) — white on transparent, trimmed and scaled to 120 px tall
  infy: { src: "/assets/brands/infy-logo.png", width: 386, height: 120 },
  // shop.voopoo.com header (img-va.myshopline.com/image/store/1747294110724/-LOGO-0.png) — white; brand.voopoo.com serves
  // only a 146 px copy and says its kit PHOTOS must be bought (the logo is the shop's own header file)
  voopoo: { src: "/assets/brands/voopoo-logo.png", width: 728, height: 120, scale: 0.85 },
  // salthub.com footer (wp-content/uploads/2023/12/Marbo-LOGO_画板-1-2.png — the file name says Marbo, the art is the
  // SaltHub wordmark) — white
  salthub: { src: "/assets/brands/salthub-logo.png", width: 370, height: 120, scale: 1.2 },
  // myjoiway.id header (cdn/shop/files/1st_Logo_JOIWAY_….png) — white word between two green bars
  joiway: { src: "/assets/brands/joiway-logo.png", width: 344, height: 120, scale: 1.6 },
  // tfitvape.com (its own API, configData.websiteLogo — 4/facts-tfit-m-power-20k.md, batch 4g 05/10) — white wordmark,
  // trimmed and scaled to 120 px tall
  tfit: { src: "/assets/brands/tfit-logo.png", width: 366, height: 120 },
  // mooodvapes.com (offline; Wayback Machine copy of wp-content/uploads/2024/09/logo-moood.png, batch 5f 06/10) — light grey
  // stacked mark (three discs over the word), trimmed and scaled to 120 px tall; stacked = scale > 1
  moood: { src: "/assets/brands/moood-logo.png", width: 149, height: 120, scale: 2 },
  // files found, not listed until the brand has a /products page to check them at size (owner eye item 4, designer 03/10;
  // candidates in _incoming/g5-template/logos/): DOTMOD (gold emblem only — letters too small at this size; keep the chip
  // unless the maker serves a word logo) · Esko Bar (403 px wide file only) · instabar · Kardinal (the site names the
  // brand "KS" — owner to choose) · NEVOKS
  // not yet (03/10): wotofo (the site serves a black wordmark only) · ske (the site's logo is a seasonal Halloween
  // version, black) · relx (relxnow.com serves no logo file; the UK store's file is a retailer lockup) · iqos (no logo on
  // iqos.com / jp.iqos.com) · lambda / rincoe (no file found, site unreachable or script-built)
};
