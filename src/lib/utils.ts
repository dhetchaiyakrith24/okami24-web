import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import { getFamily } from "@/data/families";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// mAh is written without a thousands separator site-wide (owner, 2026-09-09, round 30.1): the
// hand-written Thai product copy already says "1600mAh", and a formatted "1,600mAh" next to it on
// the same page read as two different numbers.
export function formatBattery(mah?: number): string {
  return mah ? `${mah}mAh` : "—";
}

export function formatWattage(min?: number, max?: number): string {
  if (!max) return "—";
  return min && min !== max ? `${min}–${max}W` : `${max}W`;
}

// The unit is the caller's, from `dict.catalog.puffUnit` (round 30.2, docs/THAI_STYLE.md §3):
// Thai copy says "พัฟ", English "puffs", Chinese "口". The English default only exists so a
// caller with no dictionary in reach still renders something honest — see <PuffCount> for the
// server-component case. The thousands separator stays: "10,000" reads better than "10000".
export function formatPuffs(count?: number, unit = "puffs"): string {
  return count ? `${count.toLocaleString()} ${unit}` : "—";
}

export function brandName(brandId: string): string {
  return getBrand(brandId)?.name ?? brandId;
}

export function categoryName(categoryId: string): string {
  return getCategory(categoryId)?.shortName ?? categoryId;
}

export function familyName(familyId: string): string {
  return getFamily(familyId)?.name ?? familyId;
}
