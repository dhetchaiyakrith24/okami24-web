// Used by scripts/line-candidates.js: turns candidate sentences into the pieces the site would render for them, by calling
// the site's own thaiTypographyNode (so a candidate gets the same no-break spaces and whitespace-nowrap runs as real copy).
//   npx tsx scripts/lib/thai-runs.ts <in.json: string[]> <out.json: { t: string, nowrap: boolean }[][]>
import fs from "fs";
import { isValidElement, type ReactNode } from "react";
import { thaiTypographyNode } from "@/lib/thai-typography";

type Run = { t: string; nowrap: boolean };

function walk(node: ReactNode, nowrap: boolean, out: Run[]): void {
  if (typeof node === "string") {
    out.push({ t: node, nowrap });
    return;
  }
  if (Array.isArray(node)) {
    for (const n of node) walk(n, nowrap, out);
    return;
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode; "data-tj"?: string };
    walk(props.children, nowrap || props["data-tj"] !== undefined, out);
  }
}

const [inFile, outFile] = process.argv.slice(2);
const list = JSON.parse(fs.readFileSync(inFile, "utf8")) as string[];
const result = list.map((s) => {
  const out: Run[] = [];
  walk(thaiTypographyNode(s), false, out);
  return out;
});
fs.writeFileSync(outFile, JSON.stringify(result));
