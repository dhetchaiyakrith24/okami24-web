/**
 * OKami24 — Phase 2.4: Active Catalog Seed, structural validation.
 *
 * Lightweight, no test framework (same convention as `product-master-contract-test.ts`) —
 * `runActiveCatalogSeedValidation()` returns a structured report; run it via a throwaway
 * `npx tsx` script the same way Phase 2/2.1/2.3 validation was run.
 *
 * Scope: structural integrity of THIS seed only (uniqueness, correct parent/child nesting, no
 * blank fields, no invented codes, provenance present, junk rows not leaked in). It does NOT
 * re-verify against Data_31-08-2026.xlsx at import/build time — that cross-check was run once,
 * ad hoc, against the live evidence during Phase 2.4 authoring (see README.md §Excel cross-
 * check) and is not wired into the repo as a standing dependency, since the Excel snapshot
 * itself goes stale and adding the `xlsx` package as a project dependency for a one-time
 * evidence check would be scope creep this phase explicitly avoids.
 */

import { activeCatalogSeed, excludedNonProductRows } from "./build-active-catalog";

export interface ValidationIssue {
  check: string;
  detail: string;
}

export interface ValidationReport {
  parentCount: number;
  activeChildCount: number;
  confirmedOwnerCount: number;
  confirmedUiCount: number; // raw id/name/price/cost fields, always confirmed-ui by construction
  inferredCount: number;
  unresolvedCount: number;
  roleCounts: { variant: number; "accessory-component": number; "sell-unit": number; unresolved: number };
  passed: boolean;
  issues: ValidationIssue[];
}

export function runActiveCatalogSeedValidation(): ValidationReport {
  const issues: ValidationIssue[] = [];

  // 1. Parent Shipnity ID uniqueness
  const parentIds = new Set<string>();
  for (const p of activeCatalogSeed) {
    if (parentIds.has(p.shipnityProductId)) {
      issues.push({ check: "parent-id-unique", detail: `Duplicate parent id: ${p.shipnityProductId}` });
    }
    parentIds.add(p.shipnityProductId);
  }

  // 2. Child Shipnity ID uniqueness (global)
  const childIds = new Set<string>();
  let activeChildCount = 0;
  let inferredCount = 0;
  let confirmedOwnerCount = 0;
  let unresolvedCount = 0;
  const roleCounts = { variant: 0, "accessory-component": 0, "sell-unit": 0, unresolved: 0 };

  for (const p of activeCatalogSeed) {
    // 4a. Blank parent fields
    if (!p.shipnityProductId.trim()) issues.push({ check: "no-blank-id", detail: "Parent has blank shipnityProductId" });
    if (!p.name.trim()) issues.push({ check: "no-blank-name", detail: `Parent ${p.shipnityProductId} has blank name` });
    if (p.children.length === 0) {
      issues.push({ check: "parent-has-children", detail: `Parent ${p.shipnityProductId} has zero active children` });
    }

    for (const c of p.children) {
      activeChildCount++;

      if (childIds.has(c.shipnityVariantId)) {
        issues.push({ check: "child-id-unique", detail: `Duplicate child id: ${c.shipnityVariantId}` });
      }
      childIds.add(c.shipnityVariantId);

      // 3. Child must be correctly nested under the parent it claims (also catches transcription
      // typos where a child id's prefix doesn't match the parent it was placed under)
      if (!c.shipnityVariantId.startsWith(`${p.shipnityProductId}-`)) {
        issues.push({
          check: "child-under-correct-parent",
          detail: `${c.shipnityVariantId} is listed under parent ${p.shipnityProductId} but its id prefix doesn't match`,
        });
      }

      // 5. No invented child code — suffix after the parent id must be a plain positive integer
      const suffix = c.shipnityVariantId.slice(p.shipnityProductId.length + 1);
      if (!/^\d+$/.test(suffix)) {
        issues.push({
          check: "no-invented-child-code",
          detail: `${c.shipnityVariantId} has a non-numeric suffix ("${suffix}") — not a plain Shipnity child code shape`,
        });
      }

      // 4b. Blank child fields
      if (!c.rawLabel.trim()) {
        issues.push({ check: "no-blank-name", detail: `${c.shipnityVariantId} has blank rawLabel` });
      }

      // 6. Provenance must be present (always true by construction, checked defensively)
      if (!c.optionTypeProvenance) {
        issues.push({ check: "provenance-present", detail: `${c.shipnityVariantId} missing optionTypeProvenance` });
      }

      if (c.optionTypeProvenance === "confirmed-owner") confirmedOwnerCount++;
      else if (c.optionTypeProvenance === "inferred") inferredCount++;
      else if (c.optionTypeProvenance === "unresolved") unresolvedCount++;

      roleCounts[c.childRole]++;

      // 8. Role/optionType consistency — "variant" role must have a resolved optionType, and
      // every non-"variant" role must correspond to an unresolved optionType (a real
      // color/flavor/resistance/size/strength axis is always a variant, never re-labeled
      // accessory/sell-unit).
      if (c.childRole === "variant" && c.optionType === "unresolved") {
        issues.push({
          check: "role-optionType-consistency",
          detail: `${c.shipnityVariantId} has childRole "variant" but optionType is "unresolved"`,
        });
      }
      if (c.childRole !== "variant" && c.optionType !== "unresolved") {
        issues.push({
          check: "role-optionType-consistency",
          detail: `${c.shipnityVariantId} has a resolved optionType ("${c.optionType}") but childRole is "${c.childRole}", not "variant"`,
        });
      }
    }
  }

  // 7. Excluded junk rows must not have leaked into the seed
  for (const junk of excludedNonProductRows) {
    if (parentIds.has(junk.shipnityProductId)) {
      issues.push({
        check: "no-junk-rows",
        detail: `Excluded non-product row "${junk.shipnityProductId}" was found in activeCatalogSeed`,
      });
    }
  }

  return {
    parentCount: activeCatalogSeed.length,
    activeChildCount,
    confirmedOwnerCount,
    confirmedUiCount: activeCatalogSeed.length + activeChildCount, // every parent + child raw field is confirmed-ui by construction
    inferredCount,
    unresolvedCount,
    roleCounts,
    passed: issues.length === 0,
    issues,
  };
}

// Storefront quality-correction pass (2026-09-02) — see product-master-contract-test.ts's own
// comment on this same fix: this file had no self-executing runner, so it never actually ran its
// checks when invoked directly (exactly how scripts/verify-catalog.ts invokes it).
if (require.main === module) {
  const report = runActiveCatalogSeedValidation();
  console.log(JSON.stringify({ ...report, issues: undefined }, null, 2));
  for (const issue of report.issues) console.log(`FAIL  ${issue.check}\n      ${issue.detail}`);
  if (!report.passed) {
    console.error(`\n${report.issues.length} issue(s) found.`);
    process.exit(1);
  }
  console.log("\nNo issues found.");
}
