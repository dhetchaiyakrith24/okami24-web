"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import type { Brand } from "@/types/catalog";
import type { ReactNode } from "react";

/**
 * Structural i18n fix (owner quality review, 2026-09-02) — found by the strengthened
 * i18n-contract-test.ts check ("no Server Component page.tsx calls <PageHeader> directly").
 * `brand.tagline`/`.name`/`.description` are real brand-specific editorial copy (like
 * `category.name` in CategoryPageHeader.tsx), not generic UI chrome, so they stay untranslated
 * exactly as before — this wrapper changes nothing visible. It exists so `brands/[brand]/page.tsx`
 * can stay a plain Server Component while matching the same "PageHeader always goes through a
 * `\"use client\"` wrapper" shape as every other page, which is what the contract test enforces
 * structurally so a future page doesn't reintroduce this exact gap.
 */
export function BrandPageHeader({ brand, meta }: { brand: Brand; meta?: ReactNode }) {
  return <PageHeader eyebrow={brand.tagline} title={brand.name} description={brand.description} meta={meta} />;
}
