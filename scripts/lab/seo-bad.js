 
// Recipe kept from _incoming/seo-f/b6c/bad.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Batch 6c (checker #460 round 1): line ends the word-break scanner does not flag but an eye does — a compound from this
// article's vocabulary split across two lines, or a number left alone at a line end with its unit on the next line.
// window.__bad(left, right) -> reason string or "" ; used by helpers2.js on every break of every candidate.
window.__COMPOUNDS = ["เหมือนกัน", "หายไป", "ออกไป", "เข้าไป", "ขึ้นไป", "ลงไป", "ตามไป", "กลับไป", "ออกมา", "หยิบออกมา", "ไหลออก", "เหมือนเดิม", "กันไป", "ต่างกัน", "พร้อมกัน", "ไปกับ", "อยู่ใน", "แทนที่", "ทีละ", "ทีละเรื่อง", "ออกมา", "เช่นกัน", "ด้วยกัน", "ทั้งหมด", "ไม่ได้", "ได้เลย", "ตลอดทาง", "อีกครั้ง", "ขึ้นเอง", "ประกอบขึ้น", "เดียวกัน", "ข้างบน", "ระหว่างทาง", "เข้มกว่า", "ก็ได้", "ขอดู", "ซึม", "เยิ้ม", "เกือบครึ่ง", "หยิบออก", "ติดตัว", "พกติดตัว", "ใช้จริง", "ลองเปิด", "จองไว้", "พอต", "ขั้นตอน", "อนุญาต", "ขออนุญาต", "ทางอากาศ", "อากาศ", "เปลี่ยนเครื่อง", "แวะเปลี่ยนเครื่อง", "กระเป๋า", "เครื่อง", "ประเทศ", "ระหว่าง", "น้ำยา", "ชาร์จ", "สนาม", "ตรวจ", "จุดตรวจ", "เจ้าหน้าที่", "ทั่วไป", "ลิเธียม", "สำรอง", "ก่อนบิน", "ก่อนเดินทาง", "ข้อกำหนด", "สินค้าอันตราย", "อันตราย", "สมาคม", "ขนส่ง", "คู่มือ", "ผู้โดยสาร", "ความจุ", "ภาชนะ", "ลิตร", "กรณี", "เที่ยว", "ลิ้นชัก", "ทิชชู่", "ซึมออก", "เลอะ", "ขวด", "แบต", "ล็อก", "ออกจากบ้าน", "ของเหลว", "อ่านต่อ", "หัวข้อ", "สุดท้าย", "ประตูขึ้นเครื่อง", "เจ้าหน้าที่", "ผู้โดยสาร", "ห้องโดยสาร", "ระหว่างประเทศ", "ประเทศปลายทาง", "ปลายทาง", "ต่อเครื่อง",
  "ถ่านสำรอง", "ครึ่งถัง", "กระเป๋าถือ", "กระเป๋าโหลด", "สายการบิน", "เดินทาง", "บุหรี่ไฟฟ้า", "ใต้เครื่อง", "ขึ้นเครื่อง",
  "บนเครื่อง", "ตัวเครื่อง", "เครื่องบิน", "พาวเวอร์แบงก์", "แบตลิเธียม", "ลิเธียมไอออน", "ประตูขึ้นเครื่อง", "ความกดอากาศ",
  "หัวพอต", "พอตซิสเต็ม", "พอตใช้แล้วทิ้ง", "น้ำยาขวด", "ถุงซิปล็อก", "ถุงพลาสติก", "เที่ยวบิน", "สนามบิน", "ท่าอากาศยาน",
  "ห้ามชาร์จ", "ห้ามสูบ", "ลัดวงจร", "บรรจุภัณฑ์", "ของเหลว", "ผิดปกติ", "พนักงานต้อนรับ", "ต้อนรับ", "ช่องเก็บของ",
  "เหนือศีรษะ", "อุณหภูมิ", "ทิชชู่", "เคาน์เตอร์", "เช็คอิน", "นโยบาย", "ข้อกำหนด", "ส่วนตัว", "ท้องเครื่อง", "ใต้ท้องเครื่อง",
  "ลานจอด", "แรงดันไฟ", "ความจุ", "ผู้อ่าน", "ทุกครั้ง", "ทุกกรณี", "ทุกชนิด", "ตลอดเที่ยวบิน", "ล่วงหน้า"];
window.__bad = (left, right) => {
  const L = left.replace(/[ ⁠]/g, " "), R = right.replace(/[ ⁠]/g, " ");
  if (/(\d|หนึ่ง|สอง|สาม|สี่|ห้า|สิบ)$/.test(L.trimEnd()) &&/^\s*(ก้อน|ลิตร|นาที|วัน|ชั่วโมง|คน|ตัว|ใบ|ครั้ง|mL|Wh|มวน)/.test(R)) return "num|unit";
  const a = L.replace(/\s+$/, ""), b = R.replace(/^\s+/, "");
  if (L !== a || R !== b) return ""; // the break falls on a space: never inside a word
  for (const w of window.__COMPOUNDS) {
    for (let k = 1; k < w.length; k++) {
      if (a.endsWith(w.slice(0, k)) && b.startsWith(w.slice(k))) return w.slice(0, k) + "|" + w.slice(k);
    }
  }
  return "";
};
window.__run3 = () => {
  const res = [];
  for (const [k, c] of Object.entries(window.__C)) {
    if (!c.pages.includes(location.pathname)) continue;
    const el = window.__find(c.match);
    if (!el) { res.push(k + " NOT FOUND"); continue; }
    const keep = el.innerHTML;
    const rows = c.html.map((h, i) => {
      el.innerHTML = h;
      window.__ROOT = el;
      const r = JSON.parse(eval(window.__EVAL));
      const L = window.__L(el);
      const bad = [];
      for (let j = 0; j < L.length - 1; j++) { const x = window.__bad(L[j], L[j + 1]); if (x) bad.push(x); }
      const iss = r.flatMap((x) => x.issues.map((s) => s.type.slice(0, 6) + ":" + (s.word || s.lineEnd || "")));
      const all = iss.concat(bad);
      return "  " + i + ": " + (all.join(", ") || "OK") + "  «" + L[L.length - 1].slice(-8) + "»";
    });
    el.innerHTML = keep;
    res.push(k + " (" + el.tagName + ")\n" + rows.join("\n"));
  }
  return innerWidth + " " + location.pathname + "\n" + res.join("\n");
};
// Whole page: every Thai block in main, real text, report only bad breaks.
window.__pageBad = () => {
  const els = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main button span.font-display, main summary")].filter((e) => /\p{Script=Thai}/u.test(e.textContent));
  const out = [];
  for (const e of els) {
    const L = window.__L(e);
    for (let j = 0; j < L.length - 1; j++) { const x = window.__bad(L[j], L[j + 1]); if (x) out.push(e.tagName + " " + x + " :: " + L[j].slice(-12) + " ▌ " + L[j + 1].slice(0, 12)); }
  }
  return innerWidth + " " + location.pathname + "\n" + (out.join("\n") || "no bad breaks");
};
