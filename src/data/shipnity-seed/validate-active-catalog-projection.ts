/**
 * OKami24 — Phase 2.5: Active Catalog → ProductMaster projection, structural validation.
 *
 * Lightweight, no test framework — `runActiveCatalogProjectionValidation()` returns a
 * structured report; run via throwaway `npx tsx`, same convention as every other Phase 2
 * validation file.
 */

import { productMasterSchema, validateProductMasterRegistry } from "@/data/product-master-schema";
import { brands } from "@/data/brands";
import { families } from "@/data/families";
import { categories } from "@/data/categories";
import { activeCatalogSeed } from "./build-active-catalog";
import { projectActiveCatalog, type ProjectionBlockReason } from "./active-catalog-to-product-master";

export interface ProjectionValidationIssue {
  check: string;
  detail: string;
}

export interface ProjectionValidationReport {
  totalParents: number;
  candidateCount: number;
  blockedCount: number;
  blockedByReason: Record<ProjectionBlockReason, number>;
  totalChildrenAccountedFor: number; // excludedChildren + variants, across every parent — must equal 228
  totalActiveChildren: number;
  passed: boolean;
  issues: ProjectionValidationIssue[];
}

export function runActiveCatalogProjectionValidation(): ProjectionValidationReport {
  const issues: ProjectionValidationIssue[] = [];
  const results = projectActiveCatalog();

  const blockedByReason: Record<ProjectionBlockReason, number> = {
    "no-taxonomy-match": 0,
    "no-attributes-evidence": 0,
    "identity-matches-existing-legacy-product": 0,
    "mixed-variant-axis": 0,
  };

  const candidates = results.filter((r) => r.status === "candidate");
  const blocked = results.filter((r) => r.status === "blocked");
  for (const b of blocked) blockedByReason[b.reason]++;

  // 1. Every candidate must validate against schema + registry (real committed taxonomy)
  const productExternalIds = new Set<string>();
  const variantExternalIds = new Set<string>();
  for (const c of candidates) {
    const shapeResult = productMasterSchema.safeParse(c.product);
    if (!shapeResult.success) {
      issues.push({ check: "candidate-validates-schema", detail: `${c.shipnityProductId}: ${shapeResult.error.issues[0]?.message}` });
      continue;
    }
    try {
      validateProductMasterRegistry({
        products: [shapeResult.data],
        brandIds: brands.map((b) => b.id),
        familyIds: families.map((f) => f.id),
        categoryIds: categories.map((c2) => c2.id),
        faqEntryIds: [],
      });
    } catch (e) {
      issues.push({ check: "candidate-validates-registry", detail: `${c.shipnityProductId}: ${e instanceof Error ? e.message : String(e)}` });
    }

    // 2. Product external identity uniqueness
    const extId = c.product.commerce.integrationRef?.externalId;
    if (extId) {
      if (productExternalIds.has(extId)) {
        issues.push({ check: "product-external-id-unique", detail: `Duplicate product externalId: ${extId}` });
      }
      productExternalIds.add(extId);
    }

    // 3. Variant external identity uniqueness + 4. SKU never fabricated
    for (const v of c.product.variants) {
      const vExtId = v.integrationRef?.externalId;
      if (vExtId) {
        if (variantExternalIds.has(vExtId)) {
          issues.push({ check: "variant-external-id-unique", detail: `Duplicate variant externalId: ${vExtId}` });
        }
        variantExternalIds.add(vExtId);
      }
      if (v.sku !== null) {
        issues.push({ check: "sku-never-fabricated", detail: `${c.shipnityProductId} variant ${v.id} has a non-null sku ("${v.sku}") — should always be null in this projection` });
      }
    }
  }

  // 5. No child silently dropped — every child across every parent is either in a candidate's
  // variants[] or listed in some result's excludedChildren[].
  let totalChildrenAccountedFor = 0;
  for (const r of results) {
    totalChildrenAccountedFor += r.excludedChildren.length;
    if (r.status === "candidate") totalChildrenAccountedFor += r.product.variants.length;
  }
  const totalActiveChildren = activeCatalogSeed.reduce((s, p) => s + p.children.length, 0);
  if (totalChildrenAccountedFor !== totalActiveChildren) {
    issues.push({
      check: "no-child-silently-dropped",
      detail: `accounted-for children (${totalChildrenAccountedFor}) !== total active children (${totalActiveChildren})`,
    });
  }

  return {
    totalParents: results.length,
    candidateCount: candidates.length,
    blockedCount: blocked.length,
    blockedByReason,
    totalChildrenAccountedFor,
    totalActiveChildren,
    passed: issues.length === 0,
    issues,
  };
}
