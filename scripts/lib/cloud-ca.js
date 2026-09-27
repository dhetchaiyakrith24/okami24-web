/* eslint-disable @typescript-eslint/no-require-imports -- plain Node CLI helper */
// cloud-ca.js — let the cloud's Chromium open the live site (round C topic 4; owner allowed it 2026-09-27).
// Why: the claude.ai/code cloud sends HTTPS through an egress proxy that re-signs every site with its own CA. curl and
// node trust that CA (the machine's CA bundle), Chromium does not (its NSS store is empty) → "Your connection is not
// private" on okami24.store (docs/cloud-results/mobile-round.md batch 3).
// What: Chromium is told to trust exactly the one CA the machine ALREADY trusts for this connection — never "ignore all
// certificate errors":
//   1 learn   node opens a TLS connection to the site (through the proxy when HTTPS_PROXY is set) with normal
//             verification ON; only if node accepts the chain, the chain's top certificate (the proxy's CA) is taken.
//   2 trust   its public-key hash (SPKI sha256, base64) goes to Chromium as --ignore-certificate-errors-spki-list
//             (scripts/lib/chrome.js adds it in the cloud only) · and, when `certutil` exists, the CA is also added to
//             Chromium's own store ~/.pki/nssdb as a CA for sites only ("C,,").
//   Result cached in ~/.cache/okami24-cloud-ca.json (the machine's home, never the repo).
//   node scripts/lib/cloud-ca.js --learn [host]   run by prepare-clone.js in the cloud; prints one line, exit 1 on failure
//   node scripts/lib/cloud-ca.js                  prints what is cached
// Risk: if the proxy CA were hostile, node and curl on this machine already trust it; Chromium gains nothing beyond that.
"use strict";
const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const os = require("os");
const path = require("path");
const tls = require("tls");
const { spawnSync } = require("child_process");

const CACHE = process.env.OKAMI24_CLOUD_CA_CACHE || path.join(os.homedir(), ".cache", "okami24-cloud-ca.json"); // env = tests

function cached() {
  try {
    return JSON.parse(fs.readFileSync(CACHE, "utf8"));
  } catch {
    return null;
  }
}

// Open host:443 (or host:port) through the proxy (CONNECT) when one is set, else directly; resolve the verified socket.
function connect(target) {
  const [host, port = "443"] = target.split(":");
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy || "";
  const opts = { servername: host, rejectUnauthorized: true };
  return new Promise((resolve, reject) => {
    const done = (sock) => {
      sock.once("secureConnect", () => resolve(sock));
      sock.once("error", reject);
    };
    if (!proxy) return done(tls.connect({ ...opts, host, port: Number(port) }));
    const u = new URL(proxy);
    const headers = { Host: `${host}:${port}` };
    if (u.username) headers["Proxy-Authorization"] = `Basic ${Buffer.from(`${decodeURIComponent(u.username)}:${decodeURIComponent(u.password)}`).toString("base64")}`;
    const req = http.request({ host: u.hostname, port: u.port || 80, method: "CONNECT", path: `${host}:${port}`, headers });
    req.setTimeout(15000, () => req.destroy(new Error("proxy CONNECT timed out")));
    req.once("connect", (res, socket) => {
      if (res.statusCode !== 200) return reject(new Error(`proxy CONNECT answered ${res.statusCode}`));
      done(tls.connect({ ...opts, socket }));
    });
    req.once("error", reject);
    req.end();
  });
}

async function learn(host = "okami24.store") {
  const sock = await connect(host);
  let c = sock.getPeerCertificate(true);
  sock.end();
  if (!c || !c.raw) throw new Error("no certificate chain");
  while (c.issuerCertificate && c.issuerCertificate !== c && c.issuerCertificate.raw && !c.issuerCertificate.raw.equals(c.raw)) {
    c = c.issuerCertificate;
  }
  const x = new crypto.X509Certificate(c.raw);
  const spki = crypto.createHash("sha256").update(x.publicKey.export({ type: "spki", format: "der" })).digest("base64");
  const rec = { host, spki, subject: x.subject.replace(/\n/g, ", "), fingerprint256: x.fingerprint256, learnedAt: new Date().toISOString(), nss: "" };
  // Chromium's own store too, when the tool is there (belt and braces: some Chromium builds ignore the SPKI flag)
  // Linux only: Windows has an unrelated tool of the same name
  if (process.platform === "linux" && spawnSync("which", ["certutil"], { encoding: "utf8" }).status === 0) {
    const db = path.join(os.homedir(), ".pki", "nssdb");
    fs.mkdirSync(db, { recursive: true });
    const pem = path.join(os.tmpdir(), "okami24-cloud-ca.pem");
    fs.writeFileSync(pem, x.toString());
    if (!fs.existsSync(path.join(db, "cert9.db"))) spawnSync("certutil", ["-N", "-d", `sql:${db}`, "--empty-password"]);
    const r = spawnSync("certutil", ["-A", "-d", `sql:${db}`, "-t", "C,,", "-n", "okami24-cloud-egress-ca", "-i", pem], { encoding: "utf8" });
    rec.nss = r.status === 0 ? "added" : `certutil failed: ${(r.stderr || "").trim().split("\n")[0]}`;
  } else {
    rec.nss = "no certutil (SPKI flag only)";
  }
  fs.mkdirSync(path.dirname(CACHE), { recursive: true });
  fs.writeFileSync(CACHE, JSON.stringify(rec, null, 2) + "\n");
  return rec;
}

module.exports = { cached, learn, CACHE };

if (require.main === module) {
  const i = process.argv.indexOf("--learn");
  if (i === -1) {
    console.log(JSON.stringify(cached()));
  } else {
    learn(process.argv[i + 1] || undefined).then(
      (r) => console.log(`cloud-ca: OK ${r.subject} · spki ${r.spki} · nss: ${r.nss}`),
      (e) => {
        console.log(`cloud-ca: FAIL ${e.message}`);
        process.exit(1);
      },
    );
  }
}
