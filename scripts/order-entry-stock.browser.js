// Run IN THE PAGE https://app.shipnitymax.com/order/create with the "เลือกสินค้า" picker open (javascript tool, prefixed
// with `await `). Reads every option button of every picker page — clicks only the picker's own pager, never an option,
// never บันทึก (owner OK 24/10, read only). The steps around it and the decoder = scripts/order-entry-stock.js header.
// Each row's React props hold the product (sku + options with sku, available) — the button state is the truth the admin
// sees; `available` is the cross-check.
(async () => {
  const fib = (el) => { const k = Object.keys(el).find((x) => x.startsWith("__reactFiber")); return k && el[k]; };
  const productOf = (tr) => {
    for (const el of tr.querySelectorAll("*")) {
      let f = fib(el);
      for (let i = 0; i < 8 && f; i++, f = f.return) {
        const p = f.memoizedProps;
        if (p && p.product && typeof p.product.sku === "string") return p.product;
      }
    }
    return null;
  };
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const rowsNow = () => [...document.querySelectorAll("[role=dialog] tr")].map((tr) => [tr, productOf(tr)]).filter(([, p]) => p);
  // Only the picker's own pager (inside the dialog) — the order form behind it has dropdowns with the same chevron icon.
  const pagerBtn = (label) => [...document.querySelectorAll("[role=dialog] button")].find((b) => b.innerText.trim() === label);
  const label = (b) => b.innerText.replace("add_circle", "").replace(/^\s*เพิ่ม\s*/, "").trim();
  const products = [], problems = [], disagree = [], seen = new Set();
  let pages = 0;
  const one = pagerBtn("1");
  if (one && !one.disabled) {
    const first = (rowsNow()[0] || [])[1];
    one.click();
    for (let t = 0; t < 40; t++) { await wait(250); const l = rowsNow(); if (l.length && (!first || l[0][1].sku !== first.sku)) break; }
  }
  for (;;) {
    const list = rowsNow();
    if (!list.length) { problems.push("no product rows - is the picker open?"); break; }
    pages++;
    for (const [tr, p] of list) {
      if (seen.has(p.sku)) continue;
      seen.add(p.sku);
      const subs = (p.subproducts && p.subproducts.nodes) || [];
      const btns = [...tr.querySelectorAll("button")].filter((b) => /เพิ่ม/.test(b.innerText));
      if (!subs.length) { problems.push(`${p.sku}: no options`); continue; }
      if (btns.length !== subs.length) problems.push(`${p.sku}: ${btns.length} buttons for ${subs.length} options`);
      const read = [];
      subs.forEach((s, i) => {
        let b = btns[i];
        if (b && subs.length > 1 && label(b) !== String(s.name).trim()) b = btns.find((x) => label(x) === String(s.name).trim());
        if (!b) { problems.push(`${s.sku}: no button "${s.name}"`); return; }
        const f = fib(b), dis = !!(f && f.return && f.return.memoizedProps && f.return.memoizedProps.disabled);
        const state = dis || /pointer-events-none/.test(b.className) ? 0 : 1;
        if (state !== (s.available > 0 ? 1 : 0)) disagree.push(`${s.sku} button ${state} available ${s.available}`);
        read.push([s.sku, state, Number.isFinite(s.available) ? s.available : -1]);
      });
      products.push({ sku: p.sku, read });
    }
    const next = pagerBtn("chevron_right");
    if (!next || next.disabled) break;
    const first = list[0][1].sku;
    next.click();
    let moved = false;
    for (let t = 0; t < 40 && !moved; t++) { await wait(250); const l = rowsNow(); moved = l.length > 0 && l[0][1].sku !== first; }
    if (!moved) { problems.push(`page ${pages + 1} did not load`); break; }
    if (pages > 50) { problems.push("more than 50 pages - stopped"); break; }
  }
  // Compact form (the tool output is cut near 1,000 characters): "SKU:0101" when the options are SKU-1..SKU-n in order,
  // else "SKU:01@CODE|CODE". scripts/order-entry-stock.js decodes it.
  const compact = products.map(({ sku, read }) => {
    const bits = read.map(([, s]) => s).join("");
    const seq = read.every(([c], i) => c === `${sku}-${i + 1}`);
    return seq ? `${sku}:${bits}` : `${sku}:${bits}@${read.map(([c]) => c).join("|")}`;
  }).join(",");
  window.__oeCompact = compact;
  // B5 step 1 (owner 26/10 "Start B5 step 1"): the same rows' `available` counts (= inventory − reserved; -1 = missing),
  // same shape with dots — "SKU:21.0.29" or "SKU:21.0@CODE|CODE". Logged only (scripts/stock-count-log.js); the site
  // still takes nothing but the button states above.
  const counts = products.map(({ sku, read }) => {
    const nums = read.map(([, , n]) => n).join(".");
    const seq = read.every(([c], i) => c === `${sku}-${i + 1}`);
    return seq ? `${sku}:${nums}` : `${sku}:${nums}@${read.map(([c]) => c).join("|")}`;
  }).join(",");
  window.__oeCounts = counts;
  return JSON.stringify({ pages, products: products.length, options: products.reduce((n, p) => n + p.read.length, 0), problems, disagree, compactLength: compact.length, countsLength: counts.length });
})();
