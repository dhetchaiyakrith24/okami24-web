 
// Recipe kept from _incoming/seo-f/b6c/rq.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Topic 11: measure a whole NEW article before it exists - each string of window.__C (render-6b output, "match" = element
// type) goes into a borrowed REAL element of the same type on the plane guide (/guides for card + dek). Needs pagebad.js
// + bad-quit.js loaded. await __rq(true) -> flags only · await __rq(false) -> every line end too (for the eye read).
window.__ref = async (type) => {
  const vis = (e) => e.getClientRects().length > 0;
  if (type === "h1") return document.querySelector("main h1");
  if (type === "h2") return [...document.querySelectorAll("main h2")].find(vis);
  if (type === "faqq") return document.querySelector("main button[aria-expanded] span.font-display");
  if (type === "faqa") {
    const b = document.querySelector("main button[aria-expanded]");
    if (b.getAttribute("aria-expanded") === "false") { b.click(); await new Promise((r) => setTimeout(r, 600)); }
    const reg = document.getElementById(b.getAttribute("aria-controls")) || b.parentElement.parentElement;
    return [...reg.querySelectorAll("p")].find((e) => /\p{Script=Thai}/u.test(e.textContent) && vis(e)) || null;
  }
  if (type === "p") {
    // a real body paragraph (16px text-base, article column) - never the byline / dek / FAQ
    return [...document.querySelectorAll("main p")].find((e) => vis(e) && e.textContent.startsWith("จากที่ร้านเจอ"));
  }
  if (type === "lede") return document.querySelector("main p.max-w-2xl");
  if (type === "card") return [...document.querySelectorAll("main h2, main h3")].find((e) => e.textContent.includes("พอตขึ้นเครื่องบินได้ไหม"));
  if (type === "dek") return [...document.querySelectorAll("main p")].find((e) => e.textContent.includes("โดยทั่วไปพอตขึ้นเครื่องบินได้"));
  return null;
};
window.__rq = async (flagsOnly) => {
  const res = [];
  for (const [k, c] of Object.entries(window.__C)) {
    if (!c.pages.includes(location.pathname)) continue;
    const el = await window.__ref(c.match);
    if (!el) { res.push(k + " NO REF " + c.match); continue; }
    const keep = el.innerHTML;
    c.html.forEach((h, i) => {
      el.innerHTML = h;
      window.__ROOT = el;
      const r = JSON.parse(eval(window.__EVAL));
      const L = window.__L(el);
      const bad = [];
      for (let j = 0; j < L.length - 1; j++) { const x = window.__bad(L[j], L[j + 1]); if (x) bad.push(x); }
      const iss = r.flatMap((x) => x.issues.map((s) => s.type.slice(0, 6) + ":" + (s.word || s.lineEnd || "")));
      const all = iss.concat(bad);
      if (flagsOnly && !all.length) return;
      const ends = L.slice(0, -1).map((s, j) => s.slice(-7) + "|" + L[j + 1].slice(0, 5)).join(" ¦ ");
      res.push(k + "#" + i + " " + c.match + " " + (all.join(", ") || "OK") + (flagsOnly ? "" : "  " + ends));
    });
    el.innerHTML = keep;
  }
  return innerWidth + " " + location.pathname + "\n" + (res.join("\n") || "no flags");
};
