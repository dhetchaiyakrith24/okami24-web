/**
 * OKami24 — moved picture table (round SEO full 07/11, batch 4). `src/data/moved-images.json` sends every old product picture
 * name to the picture that replaced it (src/proxy.ts answers 301). A later rename must rerun scripts/moved-images.js: a target
 * that is gone would redirect to a 404, and a key that exists again would hide a live file behind a redirect.
 */

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import moved from "@/data/moved-images.json";

export interface MovedImagesContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export function runMovedImagesContractTests(): MovedImagesContractResult[] {
  const results: MovedImagesContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
  const onDisk = (p: string) => existsSync(path.join(process.cwd(), "public", p));
  const entries = Object.entries(moved as Record<string, string>);

  check(`the table has rows (${entries.length})`, entries.length > 0);
  const inFolder = entries.filter(([from, to]) => !from.startsWith("/assets/products/") || !to.startsWith("/assets/products/"));
  check("every row stays under /assets/products/", inFolder.length === 0, inFolder.slice(0, 5).join(" | "));
  const noTarget = entries.filter(([, to]) => !onDisk(to));
  check("every target exists in public/", noTarget.length === 0, noTarget.slice(0, 5).join(" | "));
  const liveKey = entries.filter(([from]) => onDisk(from));
  check("no old name is a live file", liveKey.length === 0, liveKey.slice(0, 5).join(" | "));
  const chained = entries.filter(([, to]) => to in (moved as Record<string, string>));
  check("no redirect leads to another redirect", chained.length === 0, chained.slice(0, 5).join(" | "));
  const proxy = readFileSync(path.join(process.cwd(), "src/proxy.ts"), "utf8");
  check("src/proxy.ts reads the table and matches both picture routes", proxy.includes("moved-images.json") && proxy.includes("/assets/products/:path*") && proxy.includes("/_next/image"));

  return results;
}

if (require.main === module) {
  const results = runMovedImagesContractTests();
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
