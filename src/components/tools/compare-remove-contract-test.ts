/**
 * Contract tests for the /compare remove (X) button — owner 12/11: the X on a compared product did nothing.
 * Cause: the picture box under it became `relative` (07/11 fill-the-card fix) and, coming later in the DOM, painted
 * over the absolutely-positioned button and took every click. These checks read the component source (no DOM in
 * verify-catalog) and hold the two things that make the X work: it sits above the picture, and the URL follows the
 * selection so a reload does not bring a removed product back. Discovered and run by scripts/verify-catalog.ts.
 */
import fs from "node:fs";
import path from "node:path";

export interface CompareRemoveContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

const DIR = path.join(process.cwd(), "src", "components", "tools");

export function runCompareRemoveContractTests(): CompareRemoveContractResult[] {
  const results: CompareRemoveContractResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const picker = fs.readFileSync(path.join(DIR, "ProductPicker.tsx"), "utf8");
  // The <button …> element whose onClick calls onRemove.
  const removeButton = [...picker.matchAll(/<button\b[\s\S]*?\n\s*>/g)].map((m) => m[0]).find((b) => /onClick=\{\(\) => onRemove\(/.test(b));
  check("ProductPicker has a remove button wired to onRemove", Boolean(removeButton), removeButton ? "found" : "no <button> calls onRemove");
  const cls = removeButton?.match(/className="([^"]*)"/)?.[1] ?? "";
  check("the remove button is absolutely positioned AND carries a z-index class, so the picture box cannot cover it", /\babsolute\b/.test(cls) && /\bz-\d+\b/.test(cls), cls || "no className");
  check("the remove button is type=\"button\"", /type="button"/.test(removeButton ?? ""), removeButton ? "ok" : "-");

  // Every positioned sibling that follows the button inside the card must sit below it: none may carry a z-index ≥ the button's.
  const btnZ = Number(cls.match(/\bz-(\d+)\b/)?.[1] ?? 0);
  const afterButton = removeButton ? picker.slice(picker.indexOf(removeButton) + removeButton.length, picker.indexOf("{selected.length < max &&")) : "";
  const higher = [...afterButton.matchAll(/\bz-(\d+)\b/g)].map((m) => Number(m[1])).filter((z) => z >= btnZ);
  check("nothing after the remove button inside the card stacks at or above it", higher.length === 0, higher.length ? `z-${higher.join(", z-")}` : "none");

  const tool = fs.readFileSync(path.join(DIR, "CompareTool.tsx"), "utf8");
  check("CompareTool keeps ?slugs= in step with the selection (history.replaceState in an effect on slugs)", /useEffect\(\(\) => \{[\s\S]*?searchParams\.(set|delete)\("slugs"[\s\S]*?history\.replaceState[\s\S]*?\}, \[slugs\]\)/.test(tool), "replaceState effect");
  check("removeProduct drops exactly the slug passed in", /function removeProduct\(slug: string\) \{\s*setSlugs\(\(prev\) => prev\.filter\(\(s\) => s !== slug\)\);/.test(tool), "filter by slug");

  return results;
}

if (require.main === module) {
  const results = runCompareRemoveContractTests();
  const failed = results.filter((r) => !r.passed);
  for (const r of results) {
    console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
  }
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}
