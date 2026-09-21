/**
 * Round SEO ข (owner ruling 2026-09-21): the one inline markup an article paragraph may carry is
 * `[text](href)`. This module holds the pattern so the renderer (ArticleBody, client) and the
 * JSON-LD helpers (article-jsonld, server) agree on it without the client bundle importing seo.ts.
 */
export const INLINE_LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

/** Strips the link syntax down to its label — FAQ text and JSON-LD never show brackets (checker flag 6(e), batch 2.5). */
export function plainText(s: string): string {
  return s.replace(INLINE_LINK, "$1");
}
