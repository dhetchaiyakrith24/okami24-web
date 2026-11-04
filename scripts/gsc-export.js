/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// gsc-export.js — read Google Search Console data, read-only, for chats that cannot log in to Google (round C topic 5,
// owner 2026-09-27: "the cloud reads GSC · Friday never holds or sees the key").
// Where it runs: ONLY in the GitHub Actions job .github/workflows/gsc-export.yml, which holds the key as a secret of the
// GitHub environment "gsc" (limited to main). The job writes plain data (no key) to the branch `gsc-data`; any chat
// (computer or cloud) reads it with `git fetch origin gsc-data` + `git show origin/gsc-data:gsc/latest/<file>`.
//   node scripts/gsc-export.js <out dir>
// Env: GSC_SERVICE_ACCOUNT_JSON (the service account key, JSON text — never printed, never written) · GSC_SITE (the
//      property exactly as GSC names it: "sc-domain:okami24.store" or "https://okami24.store/")
//      GSC_TOKEN_URL / GSC_API_BASE / GSC_INSPECT_BASE / GSC_SITEMAP_URL / GSC_INSPECT_CALL_MS (tests only: local stand-ins)
// Scope = webmasters.readonly: this key can read reports, never change the property. The service account is added in
// GSC as a "Restricted" user (docs/GSC_SETUP.md).
// Output (dates in UTC; GSC data lags ~2-3 days): last28-query.json · last28-page.json · last28-query-page.json ·
// last28-device.json · last28-country.json · last90-date.json · inspection.json · meta.json (site, date ranges, row counts,
// inspection summary, run time).
// inspection.json (owner 05/11, "when did Google last read each page"): URL Inspection API (urlInspection.index.inspect,
// same read-only scope) for every URL on the live sitemap: url · lastCrawl · verdict · coverage · indexing · pageFetch ·
// googleCanonical · crawledAs. Limit 2,000 a day and 600 a minute per site (developers.google.com/webmaster-tools/limits):
// INSPECT_MAX stays under the day, 4 at a time stays under the minute. An inspection failure never loses the reports above:
// each call has a timeout and the whole pass a deadline, so a silent Google cannot run the job into its own time limit. A URL
// the pass did not reach gets a row with `error`, so "not checked" is never read as "Google has never read it".
// Read it against the sitemap dates with scripts/gsc-unread.ts.
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const TOKEN_URL = process.env.GSC_TOKEN_URL || "https://oauth2.googleapis.com/token";
const API_BASE = process.env.GSC_API_BASE || "https://searchconsole.googleapis.com/webmasters/v3";
const INSPECT_BASE = process.env.GSC_INSPECT_BASE || "https://searchconsole.googleapis.com/v1";
const SITEMAP_URL = process.env.GSC_SITEMAP_URL || "https://okami24.store/sitemap.xml";
const INSPECT_MAX = 1900;
const INSPECT_AT_ONCE = 4;
const INSPECT_CALL_MS = Number(process.env.GSC_INSPECT_CALL_MS) || 30000;
const INSPECT_PASS_MS = 12 * 60000;
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

async function sitemapUrls() {
  const res = await fetch(SITEMAP_URL, { headers: { "user-agent": "okami24-gsc-export" }, signal: AbortSignal.timeout(INSPECT_CALL_MS) });
  if (!res.ok) throw new Error(`sitemap HTTP ${res.status}`);
  const urls = [...(await res.text()).matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]);
  if (urls.length === 0) throw new Error("sitemap has no <loc>");
  return urls;
}

/** One URL. A short retry on a timeout, a rate limit or Google's own error; `stop` = the day's quota is gone, ask no more today. */
async function inspectOne(token, site, url) {
  for (let attempt = 0; ; attempt++) {
    let res;
    let j = {};
    try {
      res = await fetch(`${INSPECT_BASE}/urlInspection/index:inspect`, {
        method: "POST",
        headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({ inspectionUrl: url, siteUrl: site, languageCode: "en-US" }),
        signal: AbortSignal.timeout(INSPECT_CALL_MS),
      });
      j = await res.json().catch(() => ({}));
    } catch (e) {
      res = { ok: false, status: 0, netError: e.name };
    }
    if (res.ok) {
      const r = (j.inspectionResult && j.inspectionResult.indexStatusResult) || {};
      return {
        url,
        lastCrawl: r.lastCrawlTime || null,
        verdict: r.verdict || null,
        coverage: r.coverageState || null,
        indexing: r.indexingState || null,
        pageFetch: r.pageFetchState || null,
        googleCanonical: r.googleCanonical || null,
        crawledAs: r.crawledAs || null,
      };
    }
    const retry = res.status === 0 || res.status === 429 || res.status >= 500;
    if (retry && attempt < 2) {
      await new Promise((done) => setTimeout(done, (attempt + 1) * 20000));
      continue;
    }
    if (res.netError) return { url, error: `no answer (${res.netError})` };
    return { url, error: `HTTP ${res.status} ${(j.error && j.error.message) || ""}`.trim(), stop: res.status === 429 };
  }
}

/** Every URL, INSPECT_AT_ONCE at a time, in a stable order; stops early when the quota answers 429 for good or the
 *  pass runs out of time, and marks what it did not reach. */
async function inspectAll(token, site, urls) {
  const rows = [];
  const deadline = Date.now() + INSPECT_PASS_MS;
  let next = 0;
  let stopped = false;
  await Promise.all(Array.from({ length: INSPECT_AT_ONCE }, async () => {
    while (next < urls.length && !stopped && Date.now() < deadline) {
      const row = await inspectOne(token, site, urls[next++]);
      if (row.stop) stopped = true;
      delete row.stop;
      rows.push(row);
    }
  }));
  for (const url of urls.slice(next)) rows.push({ url, error: "not reached today" });
  return { rows: rows.sort((a, b) => (a.url < b.url ? -1 : 1)), stopped };
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
  try {
    let urlSource = "sitemap";
    let urls;
    try {
      urls = await sitemapUrls();
    } catch (e) {
      // The live sitemap can refuse a data-centre address: the pages Google already shows still deserve a read.
      const pages = JSON.parse(fs.readFileSync(path.join(out, "last28-page.json"), "utf8")).rows.map((r) => r.keys[0]);
      console.log(`gsc-export: ${e.message} — inspecting the ${pages.length} pages of last28-page instead`);
      urls = pages;
      urlSource = "last28-page";
    }
    const { rows, stopped } = await inspectAll(token, site, urls.slice(0, INSPECT_MAX));
    for (const url of urls.slice(INSPECT_MAX)) rows.push({ url, error: "not reached today" });
    fs.writeFileSync(path.join(out, "inspection.json"), JSON.stringify({ ranAt: new Date().toISOString(), site, urlSource, rows }, null, 1) + "\n");
    const failed = rows.filter((r) => r.error);
    meta.inspection = { urlSource, urls: urls.length, inspected: rows.length, withCrawlDate: rows.filter((r) => r.lastCrawl).length, failed: failed.length, stoppedByQuota: stopped };
    console.log(`gsc-export: inspection ${JSON.stringify(meta.inspection)}${failed.length ? ` first error: ${failed[0].error}` : ""}`);
    if (meta.inspection.withCrawlDate === 0) console.log("gsc-export: inspection FAIL no crawl date came back");
  } catch (e) {
    meta.inspection = { error: e.message };
    console.log(`gsc-export: inspection FAIL ${e.message}`);
  }
  fs.writeFileSync(path.join(out, "meta.json"), JSON.stringify(meta, null, 2) + "\n");
  console.log(`gsc-export: OK ${site} ${r28.startDate}..${r28.endDate}`);
}

main().catch((e) => {
  console.log(`gsc-export: FAIL ${e.message}`);
  process.exit(1);
});
