import type { Product } from "@/types/catalog";
import { allProducts } from "@/data/products";
import { allCatalogItems, type CatalogItem } from "@/lib/catalog-index";

export interface FinderAnswers {
  format: "open-pod" | "pod-kit" | "disposable" | "no-preference";
  portability: "ultra-compact" | "compact" | "no-preference";
  screen: "none" | "basic" | "full" | "no-preference";
  battery: "critical" | "somewhat" | "not-priority";
  output: "low" | "flexible" | "high";
  experience: "beginner" | "experienced";
}

export interface FinderMatch {
  product: Product;
  score: number;
  reasons: string[];
}

function screenMatches(preference: FinderAnswers["screen"], product: Product) {
  const type = product.attributes.screenType;
  if (preference === "none") return type === "none" || type === "led-indicator";
  if (preference === "basic") return type === "color-display";
  if (preference === "full") return type === "touchscreen";
  return false;
}

export function scoreProduct(product: Product, answers: FinderAnswers): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];
  const a = product.attributes;

  if (answers.format !== "no-preference") {
    if (product.systemType === answers.format) {
      score += 3;
      reasons.push("Matches your preferred device format.");
    } else {
      score -= 1;
    }
  }

  if (answers.portability !== "no-preference") {
    if (a.portability === answers.portability) {
      score += 2;
      reasons.push(`${a.portability === "ultra-compact" ? "Ultra-compact" : "Compact"} form factor, as you asked for.`);
    } else if (answers.portability === "ultra-compact" && a.portability === "compact") {
      score += 0.5;
    }
  }

  if (answers.screen !== "no-preference" && screenMatches(answers.screen, product)) {
    score += 1.5;
    reasons.push(
      answers.screen === "none" ? "No screen to manage — simple, button-or-draw operation." : answers.screen === "basic" ? "Has an onboard colour display." : "Full touchscreen control."
    );
  }

  if (answers.battery === "critical") {
    if ((a.batteryMah && a.batteryMah >= 1800) || (a.puffCount && a.puffCount >= 10000)) {
      score += 2;
      reasons.push("Larger battery or puff rating for longer stretches between charges.");
    } else if (a.batteryMah && a.batteryMah >= 1300) {
      score += 1;
    }
  }

  if (answers.output === "low") {
    if (a.drawStyle === "MTL" || (a.wattageMax && a.wattageMax <= 35)) {
      score += 1.5;
      reasons.push("Lower-wattage range suited to a tighter MTL draw.");
    }
  } else if (answers.output === "high") {
    if (a.wattageMax && a.wattageMax >= 60) {
      score += 1.5;
      reasons.push("High wattage headroom for a more open, powerful draw.");
    }
    if (a.drawStyle === "DTL") score += 1;
  } else if (answers.output === "flexible") {
    if (a.drawStyle === "MTL/RDL") {
      score += 1;
      reasons.push("Flexible draw style — comfortable switching between tighter and looser airflow.");
    }
  }

  if (answers.experience === "beginner") {
    if (a.beginnerFriendly) {
      score += 2;
      reasons.push("Editorially flagged as beginner-friendly.");
    } else {
      score -= 1;
    }
  } else {
    if (!a.beginnerFriendly) {
      score += 1;
      reasons.push("More advanced control set for an experienced vaper.");
    }
  }

  return { score, reasons };
}

/**
 * Published ProductMaster DEVICES that the scored quiz above structurally cannot rank.
 *
 * Every one of `scoreProduct`'s six axes reads `product.attributes.*` — battery, wattage, screen,
 * draw style, portability, beginner-friendliness. That block is genuinely `null` on every
 * ProductMaster record (no manufacturer attribute evidence behind it), so a ProductMaster device
 * put through `scoreProduct` would be ranked almost entirely on the absence of data, landing it
 * at an arbitrary position among fully-documented legacy devices. Inventing the missing
 * attributes to make it scoreable is exactly the fabrication this catalog forbids.
 *
 * So instead of silently excluding real, purchasable devices from a device-finder (the behavior
 * before this — Finder read `allProducts` and therefore only ever saw the 28 legacy records),
 * they are returned separately and rendered UNRANKED, with the reason stated. The only signal
 * used is the one that is genuinely present and genuinely comparable: `systemType` against the
 * customer's chosen format.
 *
 * Consumables (coils, pods, cartridges, e-liquid) are never returned — `format` only offers
 * device types, so a consumable can never match, and listing one under a device question would
 * answer a question the customer didn't ask.
 */
export function unscoredCatalogMatches(answers: FinderAnswers): CatalogItem[] {
  if (answers.format === "no-preference") return [];
  return allCatalogItems().filter((item) => item.origin === "product-master" && item.systemType === answers.format);
}

export function matchProducts(answers: FinderAnswers): { matches: FinderMatch[]; alternatives: FinderMatch[] } {
  const scored = allProducts
    .map((product) => {
      const { score, reasons } = scoreProduct(product, answers);
      return { product, score, reasons };
    })
    .sort((a, b) => b.score - a.score);

  const matches = scored.slice(0, 3);
  const matchedFamilies = new Set(matches.map((m) => m.product.familyId));
  const alternatives = scored.filter((m) => !matchedFamilies.has(m.product.familyId)).slice(0, 2);

  return { matches, alternatives };
}
