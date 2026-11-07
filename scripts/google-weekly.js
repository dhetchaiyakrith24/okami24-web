#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// google-weekly.js — the Google block of the owner dashboard (owner 08/11). The Search Console figures live on branch gsc-data
// (scripts/gsc-export.js, daily), not on the host, so this writes the last 12 weeks to src/data/owner/google-weekly.json and the
// numbers reach the page through a normal PR. No new setting on the host. The page prints how fresh they are.
//   git fetch origin gsc-data
//   node scripts/google-weekly.js
"use strict";
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const WEEKS = 12;
const OUT = path.join(__dirname, "..", "src", "data", "owner", "google-weekly.json");
const DAY = 86_400_000;

const raw = execFileSync("git", ["show", "origin/gsc-data:gsc/latest/last90-date.json"], { encoding: "utf8", maxBuffer: 1e8 });
const rows = JSON.parse(raw).rows.map((r) => ({ date: r.keys[0], clicks: r.clicks, impressions: r.impressions, position: r.position }));
if (rows.length === 0) throw new Error("no rows on gsc-data");
const last = rows.map((r) => r.date).sort().at(-1);
const end = Date.parse(`${last}T00:00:00Z`);
const iso = (ms) => new Date(ms).toISOString().slice(0, 10);

const weeks = [];
for (let w = WEEKS - 1; w >= 0; w--) {
  const to = iso(end - w * 7 * DAY);
  const from = iso(end - (w * 7 + 6) * DAY);
  const days = rows.filter((r) => r.date >= from && r.date <= to);
  if (days.length < 7) continue; // a part week would read as a drop
  const impressions = days.reduce((n, r) => n + r.impressions, 0);
  const seen = days.reduce((n, r) => n + r.position * r.impressions, 0);
  weeks.push({
    to,
    clicks: days.reduce((n, r) => n + r.clicks, 0),
    impressions,
    position: impressions > 0 ? Math.round((seen / impressions) * 10) / 10 : 0,
  });
}
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, `${JSON.stringify({ through: last, weeks }, null, 2)}\n`);
console.log(`google-weekly: ${weeks.length} weeks through ${last}`);
