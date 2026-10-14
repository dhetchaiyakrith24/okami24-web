 
// Recipe kept from _incoming/seo-f/b5b/render-b5b.tsx (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Round SEO ฉ batch 5b helper (LESSONS 33, generalised from _incoming/seo-f/b5/render-cands.tsx): render candidate
// strings the way the page does (Thai typography per text run and per link label, links whitespace-nowrap), then write a
// JS snippet that, on the page it is run on, puts each candidate into the REAL element holding the flagged text (h1/h2/h3,
// paragraph, FAQ question, card title …) and runs the word-break scanner's in-page check (EVAL of
// scripts/wordbreak-scan.js) scoped to that element.
//   npx tsx _incoming/seo-f/b5b/render-b5b.tsx <cands.json> <out.js>
//   cands.json = { key: { pages: ["/guides/x", …], match: "substring of the element's current text", cands: ["…"] } }
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

const [inFile, outFile] = process.argv.slice(2);
type C = { pages: string[]; match: string; cands: string[] };
const cands: Record<string, C> = JSON.parse(fs.readFileSync(inFile, "utf8"));
const data: Record<string, { pages: string[]; match: string; html: string[]; text: string[] }> = {};
for (const [k, c] of Object.entries(cands)) data[k] = { pages: c.pages, match: c.match, html: c.cands.map(render), text: c.cands };

const scan = fs.readFileSync("scripts/wordbreak-scan.js", "utf8");
const start = scan.indexOf("String.raw`") + "String.raw`".length;
const end = scan.indexOf("})()`;", start) + "})()".length;
const evalSrc = scan.slice(start, end).replace("document.createTreeWalker(document.body", "document.createTreeWalker(window.__ROOT");

const js = `window.__C=${JSON.stringify(data)};window.__EVAL=${JSON.stringify(evalSrc)};
window.__norm=(s)=>s.replace(/[\\u00a0\\u2060]/g,' ').replace(/\\s+/g,' ');
window.__find=(match)=>{const all=[...document.querySelectorAll('main h1,main h2,main h3,main p,main summary,main button,main dt,main dd,main li,main a,main span,main div')].filter(e=>window.__norm(e.textContent).includes(match));
 const blocks=all.filter(e=>getComputedStyle(e).display!=='inline');return blocks.sort((a,b)=>a.textContent.length-b.textContent.length)[0]||all[0];};
window.__run=()=>{const res={};for(const [k,c] of Object.entries(window.__C)){if(!c.pages.includes(location.pathname))continue;const el=window.__find(c.match);if(!el){res[k]='NOT FOUND';continue;}
 const keep=el.innerHTML;res[k]=c.html.map((h,i)=>{el.innerHTML=h;window.__ROOT=el;const r=JSON.parse(eval(window.__EVAL));return i+': '+(r.flatMap(x=>x.issues.map(s=>s.type+' '+(s.word||s.lineEnd||''))).join(' | ')||'OK');});
 el.innerHTML=keep;}return {w:innerWidth,res};};`;
fs.writeFileSync(outFile, js);
console.log(`wrote ${outFile} (${js.length} chars, ${Object.keys(data).length} keys)`);
