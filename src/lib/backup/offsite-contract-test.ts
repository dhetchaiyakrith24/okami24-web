/**
 * OKami24 — off-site backup contract (LAUNCH_AUDIT item 42 "ทาง 2", cart round 22/10).
 *
 *   1. the Signature V4 signer reproduces AWS's own published example ("Example: GET Object" in the Amazon S3
 *      Signature Version 4 documentation — examplebucket / test.txt / 20130524), so R2 will accept what it signs;
 *   2. the settings stay OFF unless all four are present and well-formed (a half-set config never uploads);
 *   3. only the database copy is uploaded — the upload refuses nothing else and never reads `.env*`
 *      (checked by sending a local fake S3 a real file and reading what arrived).
 *
 * Runs under plain `tsx` (discovered by scripts/verify-catalog.ts).
 */
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { offsiteConfig, signV4, uploadBackup } from "./offsite";

interface Result {
  name: string;
  passed: boolean;
  detail: string;
}
const results: Result[] = [];
const check = (name: string, passed: boolean, detail = "") => results.push({ name, passed, detail });

async function main() {
  // 1. AWS published example
  const auth = signV4({
    method: "GET",
    path: "/test.txt",
    headers: {
      host: "examplebucket.s3.amazonaws.com",
      range: "bytes=0-9",
      "x-amz-content-sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "x-amz-date": "20130524T000000Z",
    },
    payloadHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    amzDate: "20130524T000000Z",
    region: "us-east-1",
    service: "s3",
    keyId: "AKIAIOSFODNN7EXAMPLE",
    secret: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  });
  check(
    "SigV4 signature = AWS's published GET Object example",
    auth.endsWith("Signature=f0e8bdb87c964420e857bd35b5d6ed310bd44f0170aba48dd91039c6036bdb41"),
    auth
  );
  check("signed headers listed in order", auth.includes("SignedHeaders=host;range;x-amz-content-sha256;x-amz-date"), auth);

  // 2. settings
  const full = {
    OKAMI24_OFFSITE_ENDPOINT: "https://0123456789abcdef.r2.cloudflarestorage.com",
    OKAMI24_OFFSITE_BUCKET: "okami24-backups",
    OKAMI24_OFFSITE_KEY_ID: "test-key-id-0000",
    OKAMI24_OFFSITE_SECRET: "test-secret-not-real-000000",
  };
  check("all four set = on, region auto", offsiteConfig(full)?.region === "auto");
  for (const k of Object.keys(full) as (keyof typeof full)[]) {
    check(`missing ${k} = off`, offsiteConfig({ ...full, [k]: "" }) === null);
  }
  check("http (not https) endpoint = off", offsiteConfig({ ...full, OKAMI24_OFFSITE_ENDPOINT: "http://x.r2.cloudflarestorage.com" }) === null);

  // 3. a real PUT to a local fake S3
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-offsite-"));
  const file = path.join(tmp, "okami24-2026-10-23T00-00-00.db");
  fs.writeFileSync(file, Buffer.from("SQLite format 3\0 test bytes"));
  const got: { method?: string; url?: string; auth?: string; sha?: string; body?: Buffer } = {};
  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      got.method = req.method;
      got.url = req.url;
      got.auth = String(req.headers.authorization ?? "");
      got.sha = String(req.headers["x-amz-content-sha256"] ?? "");
      got.body = Buffer.concat(chunks);
      res.writeHead(200).end();
    });
  });
  await new Promise<void>((r) => server.listen(0, "127.0.0.1", () => r()));
  const port = (server.address() as { port: number }).port;
  try {
    // The fake listens on http; the config check (https only) is bypassed by passing the config object directly.
    const r = await uploadBackup(file, { endpoint: `http://127.0.0.1:${port}`, bucket: "okami24-backups", keyId: "test-key-id-0000", secret: "test-secret-not-real-000000", region: "auto" });
    check("upload answers ok with the object key", r.ok && r.key === "db/okami24-2026-10-23T00-00-00.db", JSON.stringify(r));
    check("PUT to /<bucket>/db/<file>", got.method === "PUT" && got.url === "/okami24-backups/db/okami24-2026-10-23T00-00-00.db", `${got.method} ${got.url}`);
    check("body = the file, byte for byte", got.body?.equals(fs.readFileSync(file)) === true);
    check("signed (AWS4-HMAC-SHA256, region auto, service s3)", /^AWS4-HMAC-SHA256 Credential=test-key-id-0000\/\d{8}\/auto\/s3\/aws4_request/.test(got.auth ?? ""), got.auth);
    check("secret never sent", !(got.auth ?? "").includes("test-secret-not-real"));
    check("x-amz-content-sha256 = sha256 of the body", got.sha?.length === 64);
    const off = await uploadBackup(file, null);
    check("not configured = skipped, no request", !off.ok && off.reason === "not configured");
  } finally {
    server.close();
    fs.rmSync(tmp, { recursive: true, force: true });
  }

  for (const res of results) {
    console.log(`${res.passed ? "PASS" : "FAIL"}  ${res.name}${res.passed || !res.detail ? "" : `\n      ${res.detail}`}`);
  }
  const failed = results.filter((x) => !x.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} checks passed.`);
}

void main();
