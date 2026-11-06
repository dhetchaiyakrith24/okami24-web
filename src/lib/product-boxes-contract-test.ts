/**
 * OKami24 — product-boxes contract tests (watermark generation 3, owner 04/11).
 *
 * A generation-3 watermark spills faint text past a cut-out product's edge, which widens the file's alpha box. So that every
 * card keeps the product at today's size ("ทุกอย่างต้องเหมือนเดิมแค่มีลายน้ำเพิ่มเข้าไป"), scripts/watermark.js writes the
 * UNMARKED original's long side to src/data/product-boxes.json and src/lib/media-quality.ts reads it instead of measuring.
 * This test keeps that file honest: every entry names a marked file that exists, and its stored size can only be the same as
 * or smaller than what the marked file's own alpha box measures (the spill only adds pixels outside the product).
 */

import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import productBoxes from "@/data/product-boxes.json";

export interface ProductBoxesContractResult {
  name: string;
  passed: boolean;
  detail: string;
}

export async function runProductBoxesContractTests(): Promise<ProductBoxesContractResult[]> {
  const results: ProductBoxesContractResult[] = [];
  const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });
  const entries = Object.entries(productBoxes as Record<string, number>);
  check("product-boxes.json is an object of path → whole pixels", entries.every(([k, v]) => k.startsWith("/assets/products/") && Number.isInteger(v) && v > 0), "");
  const bad: string[] = [];
  for (const [src, long] of entries) {
    const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
    if (!/-wm[34]\.webp$/.test(src)) { bad.push(`${src}: not a generation 3, 4 or 5 (-wm3, -wm4, -wm5) file`); continue; }
    if (!existsSync(file)) { bad.push(`${src}: file missing`); continue; }
    const meta = await sharp(file).metadata();
    const { info: box } = await sharp(file).extractChannel(3).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
    const measured = Math.max(box.width, box.height);
    if (long > Math.max(meta.width ?? 0, meta.height ?? 0)) bad.push(`${src}: stored ${long} > canvas`);
    else if (long > measured) bad.push(`${src}: stored ${long} > measured ${measured} (the spill can only widen the box)`);
  }
  check(`every stored box (${entries.length}) names an existing -wm3, -wm4 or -wm5 file and is ≤ its measured box`, bad.length === 0, bad.slice(0, 10).join("\n      "));
  return results;
}

if (require.main === module) {
  runProductBoxesContractTests().then((results) => {
    const failed = results.filter((r) => !r.passed);
    for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `\n      ${r.detail}` : ""}`);
    if (failed.length > 0) {
      console.error(`\n${failed.length} of ${results.length} checks failed.`);
      process.exit(1);
    }
    console.log(`\nAll ${results.length} checks passed.`);
  });
}
