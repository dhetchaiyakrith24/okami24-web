/* eslint-disable */
// Recipe kept from _incoming/sitewide-template/4/4e/lines.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Read every multi-line Thai text block on a page the way a visitor sees it (range rects per character, text nodes only) via
// scripts/shot.js — LESSONS พ21. usage (repo root): node _incoming/sitewide-template/4/4e/lines.js <url> [390|1440 ...]
const { execFileSync } = require("child_process");
const url = process.argv[2];
const widths = process.argv.slice(3).length ? process.argv.slice(3) : ["390", "1440"];
const ev = "(()=>{const L=e=>{const o=[];const w=document.createTreeWalker(e,4);let n,c='',t=null;while(n=w.nextNode()){for(let i=0;i<n.length;i++){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getClientRects()[0];if(!b)continue;if(t!==null&&Math.abs(b.top-t)>4){o.push(c);c=''}t=b.top;c+=n.data[i]}}o.push(c);return o};const out=[];for(const e of document.querySelectorAll('main p, main li, main h2, main h3, main span, main dd')){if([...e.children].some(x=>/^(P|LI|H2|H3|SPAN|DIV|UL)$/.test(x.tagName)))continue;if(!/[\u0E00-\u0E7F]/.test(e.textContent))continue;if(!e.getClientRects().length)continue;const l=L(e);if(l.length>1)out.push(l.join(' | '))}return out.join(' //// ')})()";
for (const w of widths) {
  const r = execFileSync("node", ["scripts/shot.js", `${__dirname}/lines-${w}.png`, url, "--eval", ev, "--wait", "4000", "--width", w, "--max-height", "1000", ...(w === "1440" ? ["--desktop"] : [])], { encoding: "utf8" });
  const m = r.match(/eval → "(.*)"/);
  console.log(`== ${w}\n` + (m ? m[1].split(" //// ").join("\n") : r));
}
