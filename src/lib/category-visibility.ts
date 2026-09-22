/**
 * OKami24 — which categories are worth offering a customer right now (round "share-deadend"
 * batch 2, 2026-09-22).
 *
 * The exact sibling of `brand-visibility.ts`, applied to categories after the review round found
 * the same dead end one level up: `/products/e-liquid` and `/products/heated-tobacco-consumables`
 * hold no product at all, yet the home SHOP grid, both header menus and the footer all offered
 * them, so a customer could click "E-Liquid" or "น้ำยา" and land on an empty page. The owner's
 * standing ruling (HANDOFF §16 item 4b) is that the e-liquid category stays off the storefront
 * until it has stock; this is that ruling applied to the links themselves.
 *
 * Same contract as the brand rule, deliberately: the PAGE stays reachable at its own URL and
 * never 404s (the shop will have these products one day and the URL must survive), it is simply
 * not advertised while it is empty — and, like an empty brand page, it is noindexed and left out
 * of the sitemap rather than offered to a crawler as a thin page. Everything is derived per
 * render from the catalog, so the day a product lands in one of these categories the links, the
 * index and the sitemap come back on their own, with no code change.
 */
import { categories } from "@/data/categories";
import { getProductsByCategory } from "@/data/products";
import { getPublishedProductsByCategory } from "@/data/shipnity-seed/storefront-bridge";
import type { Category } from "@/types/catalog";

export function categoryIsEmpty(categoryId: string): boolean {
  return getProductsByCategory(categoryId).length === 0 && getPublishedProductsByCategory(categoryId).length === 0;
}

/** Every category that has at least one product a customer can see today — the list every
 *  navigation surface (home grid, header menus, footer, sitemap) offers. */
export function categoriesWithProducts(): Category[] {
  return categories.filter((c) => !categoryIsEmpty(c.id));
}
