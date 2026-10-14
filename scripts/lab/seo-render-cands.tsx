 
// Recipe kept from _incoming/seo-f/b5/render-cands.tsx (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Round SEO ฉ batch 5 helper: render candidate paragraphs the way ArticleBody.renderInline does (Thai typography per
// text run and per link label, links whitespace-nowrap) and write a JS snippet that holds the HTML, the wordbreak
// scanner's in-page check (EVAL from scripts/wordbreak-scan.js, scoped to one element) and a runner.
import fs from "fs";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { thaiTypographyNode } from "@/lib/thai-typography";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const CLS = "whitespace-nowrap font-medium text-foreground underline";
function render(text: string): string {
  const out: ReactNode[] = [];
  let last = 0;
  let n = 0;
  for (const m of text.matchAll(LINK)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(createElement("span", { key: `t${n}` }, thaiTypographyNode(text.slice(last, idx))));
    out.push(createElement("a", { key: `l${n}`, href: m[2], className: CLS }, thaiTypographyNode(m[1])));
    last = idx + m[0].length;
    n++;
  }
  if (last < text.length) out.push(createElement("span", { key: "end" }, thaiTypographyNode(text.slice(last))));
  return renderToStaticMarkup(createElement("span", null, ...out));
}

const files = process.argv.slice(2, -1);
const outFile = process.argv[process.argv.length - 1];
const cands: Record<string, string[]> = {};
for (const f of files) Object.assign(cands, JSON.parse(fs.readFileSync(f, "utf8")));
const html: Record<string, string[]> = {};
for (const [k, list] of Object.entries(cands)) html[k] = list.map(render);

const scan = fs.readFileSync("scripts/wordbreak-scan.js", "utf8");
const start = scan.indexOf("String.raw`") + "String.raw`".length;
const end = scan.indexOf("})()`;", start) + "})()".length;
const evalSrc = scan.slice(start, end).replace("document.createTreeWalker(document.body", "document.createTreeWalker(window.__ROOT");

const js = `window.__HTML=${JSON.stringify(html)};window.__EVAL=${JSON.stringify(evalSrc)};
window.__run=()=>{const p=[...document.querySelectorAll('main p')].find(e=>e.className.includes('leading-relaxed'));const keep=p.innerHTML;const res={};
for(const [k,list] of Object.entries(window.__HTML)){res[k]=list.map((h,i)=>{p.innerHTML=h;window.__ROOT=p;const r=JSON.parse(eval(window.__EVAL));return i+': '+(r.flatMap(x=>x.issues.map(s=>s.type+' '+(s.word||s.lineEnd||''))).join(' | ')||'OK');});}
p.innerHTML=keep;return {w:innerWidth,pw:p.clientWidth,res};};`;
fs.writeFileSync(outFile, js);
console.log(`wrote ${outFile} (${js.length} chars)`);
