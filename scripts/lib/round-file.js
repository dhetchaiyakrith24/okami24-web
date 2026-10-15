/* eslint-disable @typescript-eslint/no-require-imports -- plain Node helper, CommonJS on purpose */
// round-file.js — the files only a round's plan may change, and "does the open round's plan allow this one?"
// (TEAM_RULES 13.7 · owner 01/10 · thai-typography.ts added 15/10). Shared by scripts/guard-tool.js (the moment of the
// write) and scripts/pre-checker-gate.js (the branch before the checker reads it), so the two can never disagree.
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..", "..");
const LOCKED = [/(^|[\\/])render\.yaml$/i, /(^|[\\/])\.env[^\\/]*$/i, /(^|[\\/])ordering-mode\.ts$/i, /(^|[\\/])thai-typography\.ts$/i];
const LOCKED_NAME = /render\.yaml|ordering-mode\.ts|thai-typography\.ts|\.env[\w.-]*/i;

// the instruction file of the round that is open now = the first docs/rounds/… path on the "OPEN" line of HANDOFF §16
function openRoundText(root = ROOT) {
  try {
    const h = fs.readFileSync(path.join(root, "docs", "HANDOFF.md"), "utf8");
    const s16 = h.slice(h.indexOf("## 16."), h.indexOf("## 17.") > 0 ? h.indexOf("## 17.") : undefined);
    const lines = s16.split(/\r?\n/);
    const open = lines.findIndex((l) => /^\s*3[a-z]?\s+OPEN\b/.test(l)); // "3 OPEN …" or a lettered item "3u OPEN ROUND …"
    if (open < 0) return "";
    const m = lines.slice(open, open + 3).join(" ").match(/docs\/rounds\/[^`\s]+/);
    return m ? fs.readFileSync(path.join(root, m[0]), "utf8") : "";
  } catch {
    return "";
  }
}

// the plan allows it = a line of the open round's file that STARTS with 【แตะได้】, is not the template placeholder
// (<…>) and carries no ไม่/ห้าม (not/never), and names the file — `.env*` on that line covers every .env file
function allowedByRound(name, text = openRoundText()) {
  const lower = name.toLowerCase();
  return text.split(/\r?\n/).some((l) => {
    const s = l.trim();
    if (!s.startsWith("【แตะได้】") || /[<>]|ไม่|ห้าม/.test(s)) return false;
    const body = s.slice("【แตะได้】".length).toLowerCase();
    if (lower.startsWith(".env") && /\.env\*/.test(body)) return true;
    return body.split(/[\s,·、]+/).some((tok) => tok.replace(/[`"'()]/g, "").split(/[\\/]/).pop() === lower);
  });
}

// "src/lib/thai-typography.ts" → "thai-typography.ts" (null = not a locked file)
function lockedName(p) {
  const base = String(p).replace(/\\/g, "/").split("/").pop().replace(/["'`]/g, "");
  return LOCKED.some((re) => re.test(base)) ? base.match(LOCKED_NAME)[0] : null;
}

module.exports = { LOCKED, LOCKED_NAME, openRoundText, allowedByRound, lockedName, ROOT };
