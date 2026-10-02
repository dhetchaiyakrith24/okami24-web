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

export const BRAND_LOGOS: Record<string, BrandLogo> = {};
