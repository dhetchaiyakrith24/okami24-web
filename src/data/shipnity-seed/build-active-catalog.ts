/**
 * OKami24 — Phase 2.4: Active Catalog Seed, combined output.
 *
 * Joins `active-catalog-source.ts` (raw, as-observed) with `classify.ts` (derived, confidence-
 * tagged) into one exported dataset. This is the actual "seed" artifact the Phase 2.4 brief
 * asks for — machine-readable, not prose. It is a standalone data module: not imported by
 * `product-master.ts`/`product-master-schema.ts`/`product-master-adapter.ts`, and not imported
 * by any frontend/app code. See `README.md` in this folder.
 */

import { rawActiveParents, excludedNonProductRows, type RawActiveParent } from "./active-catalog-source";
import { classifyParentChildren, type OptionType, type Provenance, type ChildRole } from "./classify";

export interface ActiveChildRecord {
  shipnityVariantId: string;
  rawLabel: string;
  optionType: OptionType;
  optionTypeProvenance: Provenance;
  cleanedValue: string | null;
  packagingNote: string | null;
  /** How OKami24 interprets this child — see `ChildRole` doc in classify.ts. */
  childRole: ChildRole;
}

export interface ActiveParentRecord {
  shipnityProductId: string;
  name: string;
  operationalSellingPrice: number;
  /** Internal business evidence only — never customer-facing. See README §Cost handling. */
  operationalCost: number;
  sourcePages: number[];
  children: ActiveChildRecord[];
}

function buildParent(raw: RawActiveParent): ActiveParentRecord {
  // Classified as one batch per parent, not child-by-child — group-context reconciliation
  // (see classify.ts file header) needs every sibling's signal available at once.
  const classified = classifyParentChildren(
    raw.shipnityProductId,
    raw.children.map((c) => c.rawLabel)
  );
  return {
    shipnityProductId: raw.shipnityProductId,
    name: raw.name,
    operationalSellingPrice: raw.operationalSellingPrice,
    operationalCost: raw.operationalCost,
    sourcePages: raw.sourcePages,
    children: raw.children.map((c, i) => ({
      shipnityVariantId: c.shipnityVariantId,
      rawLabel: c.rawLabel,
      ...classified[i],
    })),
  };
}

export const activeCatalogSeed: ActiveParentRecord[] = rawActiveParents.map(buildParent);

export { excludedNonProductRows };
