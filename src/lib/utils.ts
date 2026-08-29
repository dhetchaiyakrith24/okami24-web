import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getBrand } from "@/data/brands";
import { getCategory } from "@/data/categories";
import { getFamily } from "@/data/families";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBattery(mah?: number): string {
  return mah ? `${mah.toLocaleString()}mAh` : "—";
}

export function formatWattage(min?: number, max?: number): string {
  if (!max) return "—";
  return min && min !== max ? `${min}–${max}W` : `${max}W`;
}

export function formatPuffs(count?: number): string {
  return count ? `${count.toLocaleString()} puffs` : "—";
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
