/* eslint-disable */
// Recipe kept from _incoming/sitewide-template/5/mood/gates/trylede4.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Try brand-lede candidates where the lede shows: /brands/moood and /about, at 390 + 1440 (textContent swap, rects per char).
const { execFileSync } = require("child_process");
const cands = [
  "MOOOD แบรนด์พอตใช้แล้วทิ้ง รุ่น Monster 14K คือรุ่นที่ร้านมี",
  "MOOOD แบรนด์พอตใช้แล้วทิ้ง รุ่น Monster 14K คือรุ่นที่ร้านมีขาย",
];
const items = JSON.stringify(cands).replace(/"/g, "'");
const ev = `(()=>{const L=e=>{const o=[];const w=document.createTreeWalker(e,4);let n,c='',t=null;while(n=w.nextNode()){for(let i=0;i<n.length;i++){const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);const b=r.getClientRects()[0];if(!b)continue;if(t!==null&&Math.abs(b.top-t)>4){o.push(c);c=''}t=b.top;c+=n.data[i]}}o.push(c);return o.join(' | ')};const el=[...document.querySelectorAll('p,dd,span')].filter(p=>p.textContent.includes('Monster')&&p.textContent.includes('แบรนด์')&&p.getClientRects().length).sort((a,b)=>a.textContent.length-b.textContent.length)[0];if(!el)return 'MISSING';const out=['NOW '+L(el)];for(const c of ${items}){el.textContent=c;out.push(' -> '+L(el))}return out.join(' //// ')})()`;
for (const path of ["/brands/moood", "/about"]) for (const w of ["390", "1440"]) {
  const r = execFileSync("node", ["scripts/shot.js", `${__dirname}/trylede4-${w}.png`, `http://localhost:3412${path}`, "--eval", ev, "--wait", "4000", "--width", w, "--max-height", "800", ...(w === "1440" ? ["--desktop"] : [])], { encoding: "utf8" });
  const m = r.match(/eval → "(.*)"/); console.log(`== ${path} ${w}\n` + (m ? m[1].split(" //// ").join("\n") : r));
}
