/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper, CommonJS on purpose */
// Pre-merge pack: builds _incoming/<round>/owner-table.md — the one table Cowork and the owner read before a merge.
// Procedure and who decides what: skill .claude/skills/merge-pack. This script only assembles evidence the round
// already produced; it never decides a row.
//
//   node scripts/merge-pack.js --out <owner-table.md> --round "<round name>"
//        [--visible <visible-text diff dir>]          what a visitor reads, before → after (scripts/visible-text.js diff)
//        [--head <head-audit before dir> <after dir>] title · description · H1 · og:title per page (scripts/head-audit.js)
//        [--extras <extras.md>]                        work beyond the brief (13.10 #1) — copied as is, keep/undo per row
//        [--confirm <file.md>]                         claims the round instruction says to have confirmed
//        [--verify <dir>]                              every *.log in it: path + its last non-empty line
//        [--no-site-change]                            nothing a customer sees changed (`self-merge-check.js --base <round base>` = PASS, round-close step 1 item 0) — said instead of the two ★ scans
//
// ★ table: one row per distinct visible change. The three languages of the same block (same page, width, DOM path)
// sit on one row; rows with identical text on several pages or at both widths are merged, pages listed.
const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
};
const out = opt("--out");
const round = opt("--round") || "(round)";
if (!out) {
  console.error("usage: node scripts/merge-pack.js --out <owner-table.md> --round <name> [--visible dir] [--head before after] [--extras f] [--confirm f] [--verify dir]");
  process.exit(2);
}
// No pack while a checker result is still a placeholder (doc-keeper may start with the checker — scripts/pending-check.js)
{
  const extra = [opt("--extras"), opt("--confirm")].filter(Boolean);
  try {
    const cp = require("child_process"), root = path.join(__dirname, "..");
    cp.execFileSync("node", [path.join(__dirname, "pending-check.js")], { cwd: root, stdio: "inherit" }); // doc-keeper's files
    if (extra.length) cp.execFileSync("node", [path.join(__dirname, "pending-check.js"), ...extra], { cwd: root, stdio: "inherit" });
  } catch {
    console.error("merge-pack: refused — a checker slot is still pending (see above)");
    process.exit(1);
  }
}
const cell = (t) => (t == null || t === "" ? "—" : String(t).length > 160 ? String(t).slice(0, 157) + "…" : String(t)).replace(/\|/g, "\\|").replace(/\r?\n/g, " ");
const md = [];
md.push(`# ${round} — ชุดก่อน merge (owner-table)`, "");
md.push("อ่านคู่กับรายงาน 4 หัวข้อ (`docs/TEMPLATES.md` (ข)) · ★ = ลูกค้าเห็นแล้วเปลี่ยน · ใครเคาะอะไร เมื่อไหร่ = `.claude/TEAM_RULES.md` 13.4 · งานนอกคำสั่ง = 13.10 #1", "");

// ---- ★ visible changes ----------------------------------------------------------------------------------------
let starRows = 0;
const visible = opt("--visible");
if (visible) {
  const data = JSON.parse(fs.readFileSync(path.join(visible, "changes.json"), "utf8"));
  const blocks = new Map(); // page|width|path → { th, en, zh }
  for (const c of data.changes) {
    const k = [c.page, c.width, c.path].join("|");
    if (!blocks.has(k)) blocks.set(k, { page: c.page, width: c.width, kind: c.kind, byLoc: {} });
    blocks.get(k).byLoc[c.locale] = { before: c.before, after: c.after };
  }
  const rows = new Map(); // identical content → pages + widths
  for (const b of blocks.values()) {
    const content = ["th", "en", "zh"].map((l) => (b.byLoc[l] ? `${b.byLoc[l].before ?? ""}→${b.byLoc[l].after ?? ""}` : "")).join("¦");
    if (!rows.has(content)) rows.set(content, { byLoc: b.byLoc, pages: new Set(), widths: new Set() });
    rows.get(content).pages.add(b.page);
    rows.get(content).widths.add(b.width);
  }
  const loc = (r, l) => (r.byLoc[l] ? `${cell(r.byLoc[l].before)} → ${cell(r.byLoc[l].after)}` : "(ไม่เปลี่ยน)");
  md.push(`## ★ ข้อความที่ลูกค้าเห็นเปลี่ยน — ${rows.size} แถว`, "");
  md.push(`หลักฐาน: \`${path.join(visible, "changes.md")}\` (ทุกจุด ทุกหน้า) · ภาพ = ไฟล์ s###-*.png ในโฟลเดอร์เดียวกัน (รายการใน shots.md)`, "");
  if (rows.size) md.push("| ★ | หน้า | กว้าง | ไทย ก่อน → หลัง | EN ก่อน → หลัง | ZH ก่อน → หลัง | เคาะ |", "|---|---|---|---|---|---|---|");
  else md.push(`ไม่มี — ${data.pagesCompared} ไฟล์ (หน้า × ภาษา × ความกว้าง) เทียบแล้ว ข้อความที่ลูกค้าเห็นไม่เปลี่ยนเลย`);
  let n = 0;
  for (const r of rows.values()) {
    const pages = [...r.pages];
    md.push(`| ★${++n} | ${pages.length > 4 ? `${pages.slice(0, 4).join(" ")} +${pages.length - 4}` : pages.join(" ")} | ${[...r.widths].sort((a, b) => a - b).join("+")} | ${loc(r, "th")} | ${loc(r, "en")} | ${loc(r, "zh")} | เก็บ / ถอย |`);
  }
  starRows += rows.size;
  if (data.onlyOne?.length) md.push("", `หน้าที่มีฝั่งเดียว (เพิ่ม/หาย/สแกนพลาด): ${data.onlyOne.length} — ดู changes.md`);
  md.push("");
}

// ---- ★ head changes ---------------------------------------------------------------------------------------------
const hi = args.indexOf("--head");
if (hi >= 0) {
  const read = (d) => {
    const lines = fs.readFileSync(path.join(d, "head-audit.tsv"), "utf8").split(/\r?\n/).filter(Boolean);
    const cols = lines[0].split("\t");
    return new Map(lines.slice(1).map((l) => { const v = l.split("\t"); return [v[0], Object.fromEntries(cols.map((c, i) => [c, v[i]]))]; }));
  };
  const A = read(args[hi + 1]), B = read(args[hi + 2]);
  const fields = [["title", "title"], ["desc", "description"], ["h1", "H1"], ["ogTitle", "og:title"]];
  const rows = [];
  for (const p of [...new Set([...A.keys(), ...B.keys()])].sort()) {
    const a = A.get(p), b = B.get(p);
    if (!a || !b) { rows.push(`| ${p} | (หน้า) | ${a ? "มี" : "—"} | ${b ? "มี" : "—"} | เก็บ / ถอย |`); continue; }
    for (const [k, label] of fields) if ((a[k] || "") !== (b[k] || "")) rows.push(`| ${p} | ${label} | ${cell(a[k])} | ${cell(b[k])} | เก็บ / ถอย |`);
  }
  md.push(`## ★ หัวหน้าเว็บ (title · description · H1 · og:title) เปลี่ยน — ${rows.length} แถว`, "");
  md.push(`หลักฐาน: \`${args[hi + 1]}/head-audit.tsv\` → \`${args[hi + 2]}/head-audit.tsv\` (ภาษาไทย = ภาษาที่ server ส่ง)`, "");
  if (rows.length) md.push("| หน้า | ช่อง | ก่อน | หลัง | เคาะ |", "|---|---|---|---|---|", ...rows);
  else md.push("ไม่มีหน้าไหนเปลี่ยน");
  starRows += rows.length;
  md.push("");
}

// an input left out is said out loud, never silently dropped
if (!visible || hi < 0) {
  const why = args.includes("--no-site-change")
    ? "รอบนี้ไม่แตะของที่ลูกค้าเห็น (`node scripts/self-merge-check.js --base <ฐานรอบ>` = PASS · round-close ขั้น 1 ข้อ 0) → ข้อความและหัวหน้าเว็บเปลี่ยนไม่ได้"
    : "**[ยังไม่มีข้อมูล]** — ไม่ได้แนบผลสแกน";
  if (!visible) md.push("## ★ ข้อความที่ลูกค้าเห็นเปลี่ยน", "", why, "");
  if (hi < 0) md.push("## ★ หัวหน้าเว็บ (title · description · H1 · og:title) เปลี่ยน", "", why, "");
}

// ---- confirm rows (claims to have confirmed) -------------------------------------------------------------------
const confirm = opt("--confirm");
if (confirm) {
  md.push("## ★ ยืนยัน — ข้อที่มาจากบันทึก ไม่มีหลักฐานในรีโป", "");
  md.push(fs.readFileSync(confirm, "utf8").trim(), "");
}

// ---- 4-5-6 ----------------------------------------------------------------------------------------------------
const extras = opt("--extras");
md.push("## งานนอกคำสั่ง (4-5-6) — เคาะ เก็บ / ถอย", "");
if (extras && fs.existsSync(extras)) md.push(`ที่มา: \`${extras}\``, "", fs.readFileSync(extras, "utf8").trim(), "");
else md.push("ไม่มี", "");

// ---- verify set -----------------------------------------------------------------------------------------------
const verify = opt("--verify");
md.push("## ผล verify ชุดเต็ม (ชุด = skill round-close ขั้น 3) — Cowork อ่านก่อน merge", "");
if (verify && fs.existsSync(verify)) {
  const logs = fs.readdirSync(verify).filter((f) => f.endsWith(".log")).sort();
  // exit codes, when the run recorded them as "<log name> exit=<n>" lines in exit-codes.txt (a silent tool = empty log)
  const exits = new Map();
  const exitFile = path.join(verify, "exit-codes.txt");
  if (fs.existsSync(exitFile))
    for (const l of fs.readFileSync(exitFile, "utf8").split(/\r?\n/)) { const m = l.match(/^(\S+) exit=(\d+)/); if (m) exits.set(m[1], m[2]); }
  md.push("| log | exit | บรรทัดท้าย |", "|---|---|---|");
  for (const f of logs) {
    const last = fs.readFileSync(path.join(verify, f), "utf8").split(/\r?\n/).map((s) => s.trim()).filter(Boolean).pop() || "(log ว่าง — ดูช่อง exit)";
    md.push(`| \`${path.join(verify, f)}\` | ${exits.get(f.replace(/\.log$/, "")) ?? "—"} | ${cell(last)} |`);
  }
  if (!logs.length) md.push("| — | ไม่พบ log ในโฟลเดอร์นี้ |");
} else md.push("**[ยังไม่มีข้อมูล]** — ยังไม่ได้แนบโฟลเดอร์ log");
md.push("");

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, md.join("\n"));
console.log(`merge-pack: ${out} · ★ rows ${starRows}${confirm ? " + confirm block" : ""}${extras && fs.existsSync(extras) ? " + extras" : ""}${verify ? " + verify logs" : ""}`);
