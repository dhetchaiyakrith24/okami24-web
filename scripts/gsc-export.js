/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// gsc-export.js — read Google Search Console data, read-only, for chats that cannot log in to Google (round C topic 5,
// owner 2026-09-27: "the cloud reads GSC · Friday never holds or sees the key").
// Where it runs: ONLY in the GitHub Actions job .github/workflows/gsc-export.yml, which holds the key as a secret of the
// GitHub environment "gsc" (limited to main). The job writes plain data (no key) to the branch `gsc-data`; any chat
// (computer or cloud) reads it with `git fetch origin gsc-data` + `git show origin/gsc-data:gsc/latest/<file>`.
//   node scripts/gsc-export.js <out dir>
// Env: GSC_SERVICE_ACCOUNT_JSON (the service account key, JSON text — never printed, never written) · GSC_SITE (the
//      property exactly as GSC names it: "sc-domain:okami24.store" or "https://okami24.store/")
//      GSC_TOKEN_URL / GSC_API_BASE (tests only: a local stand-in for Google)
// Scope = webmasters.readonly: this key can read reports, never change the property. The service account is added in
// GSC as a "Restricted" user (docs/GSC_SETUP.md).
// Output (dates in UTC; GSC data lags ~2-3 days): last28-query.json · last28-page.json · last28-query-page.json ·
// last28-device.json · last28-country.json · last90-date.json · meta.json (site, date ranges, row counts, run time).
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const TOKEN_URL = process.env.GSC_TOKEN_URL || "https://oauth2.googleapis.com/token";
const API_BASE = process.env.GSC_API_BASE || "https://searchconsole.googleapis.com/webmasters/v3";
const SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

const b64url = (buf) => Buffer.from(buf).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");

async function accessToken(key) {
  const now = Math.floor(Date.now() / 1000);
  const head = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claim = b64url(JSON.stringify({ iss: key.client_email, scope: SCOPE, aud: TOKEN_URL, iat: now, exp: now + 3600 }));
  const sig = b64url(crypto.sign("RSA-SHA256", Buffer.from(`${head}.${claim}`), key.private_key));
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${head}.${claim}.${sig}` }),
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.access_token) throw new Error(`token request failed: HTTP ${res.status} ${body.error || ""} ${body.error_description || ""}`.trim());
  return body.access_token;
}

async function query(token, site, body) {
  const rows = [];
  for (let startRow = 0; ; startRow += 25000) {
    const res = await fetch(`${API_BASE}/sites/${encodeURIComponent(site)}/searchAnalytics/query`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ ...body, rowLimit: 25000, startRow }),
    });
    const j = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`searchAnalytics.query failed: HTTP ${res.status} ${(j.error && j.error.message) || ""}`.trim());
    const got = j.rows || [];
    rows.push(...got);
    if (got.length < 25000) return rows;
  }
}

const day = (d) => d.toISOString().slice(0, 10);
function range(days) {
  const end = new Date(Date.now() - 2 * 86400000); // GSC data lags ~2 days
  return { startDate: day(new Date(end.getTime() - (days - 1) * 86400000)), endDate: day(end) };
}

async function main() {
  const out = process.argv[2];
  if (!out) throw new Error("usage: node scripts/gsc-export.js <out dir>");
  const raw = process.env.GSC_SERVICE_ACCOUNT_JSON || "";
  const site = process.env.GSC_SITE || "";
  if (!raw || !site) throw new Error("GSC_SERVICE_ACCOUNT_JSON and GSC_SITE must be set (GitHub environment \"gsc\" — docs/GSC_SETUP.md)");
  let key;
  try {
    key = JSON.parse(raw);
  } catch {
    throw new Error("GSC_SERVICE_ACCOUNT_JSON is not valid JSON (paste the whole key file)"); // never echo the value
  }
  if (!key.client_email || !key.private_key) throw new Error("the key JSON has no client_email/private_key");
  const token = await accessToken(key);
  const r28 = range(28);
  const r90 = range(90);
  const sets = {
    "last28-query": { ...r28, dimensions: ["query"] },
    "last28-page": { ...r28, dimensions: ["page"] },
    "last28-query-page": { ...r28, dimensions: ["query", "page"] },
    "last28-device": { ...r28, dimensions: ["device"] },
    "last28-country": { ...r28, dimensions: ["country"] },
    "last90-date": { ...r90, dimensions: ["date"] },
  };
  fs.mkdirSync(out, { recursive: true });
  const meta = { site, account: key.client_email.replace(/^[^@]+/, "…"), ranges: { last28: r28, last90: r90 }, rows: {}, ranAt: new Date().toISOString() };
  for (const [name, body] of Object.entries(sets)) {
    const rows = await query(token, site, body);
    fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify({ request: body, rows }, null, 1) + "\n");
    meta.rows[name] = rows.length;
    console.log(`gsc-export: ${name} ${rows.length} rows`);
  }
  fs.writeFileSync(path.join(out, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  console.log(`gsc-export: OK ${site} ${r28.startDate}..${r28.endDate}`);
}

main().catch((e) => {
  console.log(`gsc-export: FAIL ${e.message}`);
  process.exit(1);
});
