import type { Locale } from "../config";
import type { Dictionary } from "./types";
import { en } from "./en";
import { th } from "./th";
import { zh } from "./zh";

const DICTIONARIES: Record<Locale, Dictionary> = { en, th, zh };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

/** Thai/Chinese don't inflect for plural the way English does — `count` picks the right key so a
 *  caller never hardcodes "s" onto a translated noun. */
export function pluralCount(count: number, one: string, other: string): string {
  return count === 1 ? one : other;
}

export type { Dictionary };
