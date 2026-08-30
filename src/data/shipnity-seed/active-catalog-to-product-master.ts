/**
 * OKami24 — Phase 2.5: Active Catalog → ProductMaster projection.
 *
 * Pure, read-only projection from `activeCatalogSeed` (Phase 2.4) toward `ProductMasterInput`
 * (Phase 1/2/2.1/2.3). Nothing here is imported by any frontend/app code, and nothing here
 * writes to `src/data/products/*` or the legacy catalog. See README.md §Phase 2.5.
 *
 * === The central finding of this phase ===
 * `ProductMaster.attributes` requires `screenType`/`drawStyle`/`portability`/`beginnerFriendly`/
 * `chargingType` with NO nullable/"unknown" escape hatch, and `brandId`/`familyId`/`categoryId`
 * are required FKs validated against the existing (28-product, 3-brand) legacy taxonomy — a
 * taxonomy built for the NOVA VAPOR demo catalog, not for OKami24's real Shipnity product range.
 * Shipnity gives us commerce identity, operational price, and variant structure — it gives us
 * ZERO manufacturer spec evidence and, for the large majority of products, zero brand/family/
 * category evidence either (different brands entirely: Marbo, Muro, KS, Esko Bar, IQOS, etc.).
 *
 * Per the Phase 2.5 brief: "ถ้า schema บังคับจนต้อง fabricate ให้ report friction แทนการแต่งข้อมูล"
 * — so this file NEVER invents `attributes` or an unevidenced `brandId`/`familyId`/`categoryId`.
 * Every one of the 56 active parents is classified as either a `candidate` (schema-valid,
 * evidence-only) or `blocked` (with a specific, reported reason) — see `ProjectionResult`.
 */

import type {
  ProductMasterInput,
} from "@/data/product-master-schema";
import type { SystemType } from "@/types/catalog";
import type { OptionType } from "./classify";
import { activeCatalogSeed, type ActiveParentRecord, type ActiveChildRecord } from "./build-active-catalog";

/** When this seed's evidence was captured/authored — used for every `observedAt`/`capturedAt`/
 *  `lastSyncedAt` stamp below. Reflects the Phase 2.4/2.5 authoring session, not a literal
 *  Shipnity server timestamp (none was visible in the screenshots). */
export const CAPTURE_DATE = "2026-08-31T00:00:00.000Z";

const AXIS_LABEL_TH: Record<Exclude<OptionType, "unresolved">, string> = {
  color: "สี",
  flavor: "รสชาติ",
  resistance: "ความต้านทาน",
  size: "ขนาด",
  strength: "ความเข้มข้น",
};

function slugifyValue(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

// ===================================================================================
// Taxonomy identity matches — evidence-driven only. Every entry below is justified by
// EXPLICIT text in the Shipnity product name matching an EXISTING brand/family already
// committed in src/data/brands.ts / families.ts (never the reverse: never picking a brand
// from outside knowledge of what a coil platform "really" is). Substring matches that could
// be a false positive (e.g. "Marbo Zero Pro" containing "Zero" — a SALTHUB family name — but
// clearly Marbo's own product line, not SaltHub's) are deliberately excluded.
// ===================================================================================

interface TaxonomyMatch {
  brandId: string;
  familyId: string;
  /** Present only when categoryId/systemType can be determined with real evidence too. */
  categoryId?: string;
  systemType?: SystemType;
  /** Present only when this Shipnity parent IS the same physical product as an existing
   *  legacy ProductMaster record — a dedup/merge case, not a new-record case. */
  exactLegacyMatch?: string;
  evidence: string;
}

const TAXONOMY_MATCHES: Record<string, TaxonomyMatch> = {
  "Coil-1": { brandId: "voopoo", familyId: "vinci", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Vinci" (VOOPOO VINCI family) + Shipnity "Coil-" prefix' },
  "Coil-21": { brandId: "voopoo", familyId: "argus", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Argus" (VOOPOO ARGUS family) + Shipnity "Coil-" prefix' },
  "Coil-53": { brandId: "uwell", familyId: "caliburn", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Caliburn" (UWELL CALIBURN family) + Shipnity "Coil-" prefix' },
  "Coil-55": { brandId: "uwell", familyId: "caliburn", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Caliburn" (UWELL CALIBURN family) + Shipnity "Coil-" prefix' },
  "Coil-72": { brandId: "voopoo", familyId: "vmate", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Vmate" (VOOPOO VMATE family) + Shipnity "Coil-" prefix' },
  "Coil-74": { brandId: "uwell", familyId: "caliburn", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Caliburn" (UWELL CALIBURN family) + Shipnity "Coil-" prefix' },
  "Coil-83": { brandId: "voopoo", familyId: "argus", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Argus" (VOOPOO ARGUS family) + Shipnity "Coil-" prefix' },
  "Coil-94": { brandId: "uwell", familyId: "caliburn", categoryId: "coils-accessories", systemType: "coil", evidence: 'name contains "Caliburn G4&G3" (UWELL CALIBURN family) + Shipnity "Coil-" prefix' },
  "Pod-147": { brandId: "salthub", familyId: "m-switch", evidence: 'name contains "M Switch" (SALTHUB M SWITCH family) — categoryId/systemType left undetermined: ambiguous between the reusable device body and a prefilled pod/cartridge, no textual evidence resolves it either way' },
  "Pod-168": { brandId: "uwell", familyId: "caliburn", exactLegacyMatch: "caliburn-g4-pro", evidence: 'name "Caliburn G4 Pro" is an exact match to legacy product internalId "caliburn-g4-pro" (displayName "UWELL CALIBURN G4 PRO")' },
  "Pod-177": { brandId: "voopoo", familyId: "vmate", exactLegacyMatch: "vmate-i3", evidence: 'name "Vmate i3" is an exact match to legacy product internalId "vmate-i3" (displayName "VOOPOO VMATE i3")' },
  "Pod-179": { brandId: "voopoo", familyId: "argus", exactLegacyMatch: "argus-g4", evidence: 'name "Voopoo Argus G4" is an exact match to legacy product internalId "argus-g4" (displayName "VOOPOO ARGUS G4")' },
};

// ===================================================================================
// Variant structure — built ONLY from childRole === "variant" children. Never from
// accessory-component/sell-unit/unresolved. Reports every excluded child instead of
// silently dropping it.
// ===================================================================================

export interface ExcludedChild {
  shipnityVariantId: string;
  rawLabel: string;
  role: ActiveChildRecord["childRole"];
  reason: string;
}

export interface VariantStructureResult {
  optionDefinitions: ProductMasterInput["optionDefinitions"];
  variants: ProductMasterInput["variants"];
  excludedChildren: ExcludedChild[];
  /** Set when the parent's variant-role children span more than one optionType — a real
   *  deviation, never silently collapsed into one axis. */
  mixedAxisError: string | null;
}

export function buildVariantStructure(
  parentInternalId: string,
  children: ActiveChildRecord[]
): VariantStructureResult {
  const excludedChildren: ExcludedChild[] = [];
  const variantChildren = children.filter((c) => {
    if (c.childRole === "variant") return true;
    const reasonByRole: Record<string, string> = {
      "accessory-component": "accessory/component, not a product option — never merged into flavor/color/resistance options",
      "sell-unit": "packaging/unit-of-sale text only, no differentiating option value",
      unresolved: "no confirmed semantic option type — reported, not guessed",
    };
    excludedChildren.push({
      shipnityVariantId: c.shipnityVariantId,
      rawLabel: c.rawLabel,
      role: c.childRole,
      reason: reasonByRole[c.childRole] ?? "excluded",
    });
    return false;
  });

  if (variantChildren.length === 0) {
    return { optionDefinitions: [], variants: [], excludedChildren, mixedAxisError: null };
  }

  const axes = new Set(variantChildren.map((c) => c.optionType));
  if (axes.size > 1) {
    return {
      optionDefinitions: [],
      variants: [],
      excludedChildren,
      mixedAxisError: `variant children span ${axes.size} different optionTypes (${[...axes].join(", ")}) — a single ProductOptionDefinition axis cannot represent this without guessing which is primary`,
    };
  }

  const axis = [...axes][0] as Exclude<OptionType, "unresolved">;
  const valueMap = new Map<string, { code: string; label: string }>();
  for (const c of variantChildren) {
    const label = c.cleanedValue ?? c.rawLabel;
    const code = slugifyValue(label);
    if (!valueMap.has(code)) valueMap.set(code, { code, label });
  }

  const optionDefinitions: ProductMasterInput["optionDefinitions"] = [
    { code: axis, label: AXIS_LABEL_TH[axis], allowedValues: [...valueMap.values()] },
  ];

  const variants: ProductMasterInput["variants"] = variantChildren.map((c) => ({
    id: c.shipnityVariantId,
    parentInternalId,
    optionSelections: [{ optionCode: axis, valueCode: slugifyValue(c.cleanedValue ?? c.rawLabel) }],
    sku: null, // never fabricated — see file header / README
    integrationRef: {
      provider: "shipnity",
      externalId: c.shipnityVariantId,
      lastSyncedAt: CAPTURE_DATE,
      syncStatus: "ok",
    },
    availability: { status: "in-stock", source: "shipnity", observedAt: CAPTURE_DATE },
  }));

  return { optionDefinitions, variants, excludedChildren, mixedAxisError: null };
}

// ===================================================================================
// Full parent projection
// ===================================================================================

export type ProjectionBlockReason =
  | "no-taxonomy-match" // no evidenced brandId/familyId/categoryId at all
  | "no-attributes-evidence" // brand/family known, but manufacturer attributes have zero evidence
  | "identity-matches-existing-legacy-product" // dedup — needs a merge into the legacy record, not a new one
  | "mixed-variant-axis"; // variant children span more than one optionType

export interface ProjectionBlocked {
  status: "blocked";
  shipnityProductId: string;
  name: string;
  reason: ProjectionBlockReason;
  detail: string;
  excludedChildren: ExcludedChild[];
}

export interface ProjectionCandidate {
  status: "candidate";
  shipnityProductId: string;
  product: ProductMasterInput;
  excludedChildren: ExcludedChild[];
}

export type ProjectionResult = ProjectionBlocked | ProjectionCandidate;

/**
 * When the whole PARENT is blocked, none of its children end up in a ProductVariant — including
 * the ones `buildVariantStructure` successfully classified as `variant` role. Those must still
 * be reported, not silently dropped from the accounting, so every one of the 228 active children
 * is traceable to exactly one outcome (built into a candidate, or excluded with a stated reason).
 */
function allChildrenExcluded(parent: ActiveParentRecord, variantStructure: VariantStructureResult, blockReason: string): ExcludedChild[] {
  const alreadyListed = new Set(variantStructure.excludedChildren.map((c) => c.shipnityVariantId));
  const parentBlockedEntries: ExcludedChild[] = parent.children
    .filter((c) => !alreadyListed.has(c.shipnityVariantId))
    .map((c) => ({
      shipnityVariantId: c.shipnityVariantId,
      rawLabel: c.rawLabel,
      role: c.childRole,
      reason: `parent "${parent.shipnityProductId}" blocked (${blockReason}) before this variant-role child could be built`,
    }));
  return [...variantStructure.excludedChildren, ...parentBlockedEntries];
}

function projectParent(parent: ActiveParentRecord): ProjectionResult {
  const match = TAXONOMY_MATCHES[parent.shipnityProductId];
  const variantStructure = buildVariantStructure(parent.shipnityProductId.toLowerCase(), parent.children);

  // Exact-legacy-match is checked FIRST and independent of variant-structure quality: whether
  // this parent's variant labels classify cleanly is irrelevant when the correct action is a
  // merge into an existing record, not building new variants here at all.
  if (match?.exactLegacyMatch) {
    return {
      status: "blocked",
      shipnityProductId: parent.shipnityProductId,
      name: parent.name,
      reason: "identity-matches-existing-legacy-product",
      detail: `${match.evidence}. This is the SAME product as legacy ProductMaster "${match.exactLegacyMatch}" — projecting it as a new record would duplicate an existing one. Shipnity integration data (commerce.integrationRef, variants, pricing.priceReference) belongs merged into "${match.exactLegacyMatch}" in a future phase, not created fresh here.`,
      excludedChildren: allChildrenExcluded(parent, variantStructure, "identity-matches-existing-legacy-product"),
    };
  }

  if (variantStructure.mixedAxisError) {
    return {
      status: "blocked",
      shipnityProductId: parent.shipnityProductId,
      name: parent.name,
      reason: "mixed-variant-axis",
      detail: variantStructure.mixedAxisError,
      excludedChildren: allChildrenExcluded(parent, variantStructure, "mixed-variant-axis"),
    };
  }

  if (!match) {
    return {
      status: "blocked",
      shipnityProductId: parent.shipnityProductId,
      name: parent.name,
      reason: "no-taxonomy-match",
      detail: `No brandId/familyId/categoryId can be evidenced from "${parent.name}" against the current 3-brand/8-family legacy taxonomy — inventing one would fabricate classification data.`,
      excludedChildren: allChildrenExcluded(parent, variantStructure, "no-taxonomy-match"),
    };
  }

  // Brand/family identified, but ProductMaster.attributes (screenType/drawStyle/portability/
  // beginnerFriendly/chargingType) has NO nullable escape hatch and zero evidence exists for
  // any of these products from Shipnity data alone.
  return {
    status: "blocked",
    shipnityProductId: parent.shipnityProductId,
    name: parent.name,
    reason: "no-attributes-evidence",
    detail: `Taxonomy identified (${match.evidence}), but ProductMaster.attributes requires screenType/drawStyle/portability/beginnerFriendly/chargingType with no nullable fallback, and no manufacturer spec evidence exists for this product in the Shipnity seed.`,
    excludedChildren: allChildrenExcluded(parent, variantStructure, "no-attributes-evidence"),
  };
}

export function projectActiveCatalog(): ProjectionResult[] {
  return activeCatalogSeed.map(projectParent);
}

export { TAXONOMY_MATCHES };
