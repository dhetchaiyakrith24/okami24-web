/**
 * Brand logos on product pages (owner 03/10, round "G5 template": "ทุกแบรนด์ใส่ Logo ของแบรนด์นั้นลงไปในหน้าสินค้า").
 * One entry per brand id (src/data/brands.ts) whose maker-served logo file is in public/assets/brands/ — light version
 * for the dark site. ProductHero shows it in place of the brand text chip, linked to the brand page; a brand without an
 * entry keeps the text chip, so adding a brand here is the only step. Sources: the maker's own site only (the source
 * page of each file is noted on its line).
 */
export interface BrandLogo {
  src: string;
  width: number;
  height: number;
}

export const BRAND_LOGOS: Record<string, BrandLogo> = {
  // myuwell.com footer (files.myuwell.com/uwell/neo/footer/logo.png) — white on transparent
  uwell: { src: "/assets/brands/uwell-logo.png", width: 225, height: 44 },
  // infy.my header (wp-content/uploads/2024/03/Infy-Logo.png) — white on transparent, trimmed and scaled to 120 px tall
  infy: { src: "/assets/brands/infy-logo.png", width: 386, height: 120 },
  // not yet: salthub (its site serves only the "M" mark, no word) · voopoo (brand kit is a zip; licence note on brand.voopoo.com)
  // · relx / joiway / tfit (no logo file found on the maker site) · wotofo (dark logo only) — researcher 03/10
};
