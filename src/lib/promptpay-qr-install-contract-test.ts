/**
 * Contract test for src/lib/promptpay-qr-install.ts — throwaway folders in the OS temp dir, never
 * the real data folder or the real QR. Discovered by scripts/verify-catalog.ts.
 *
 * Proves the guard rails that matter on a live shop: an existing QR is never overwritten, only a
 * real PNG is ever written, "installed" means read back from the disk, a disk that cannot be
 * written is reported rather than thrown, and every outcome names the path — a customer trying to
 * pay must never meet a broken image, a bad paste must never take the server down, and a missing
 * QR must never again go unnoticed for a day (2026-09-06).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { installPromptpayQrIfMissing, QR_SECRET_FILE_NAME } from "./promptpay-qr-install";

interface CheckResult {
  name: string;
  passed: boolean;
  detail: string;
}

// The smallest possible real PNG (1x1), so the test proves PNG detection with genuine bytes.
const TINY_PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

function main(): void {
  const results: CheckResult[] = [];
  const check = (name: string, condition: boolean, detail: string) => results.push({ name, passed: condition, detail });

  const root = fs.mkdtempSync(path.join(os.tmpdir(), "okami24-qr-test-"));
  const savedDataDir = process.env.OKAMI24_DATA_DIR;
  const savedEnvQr = process.env.OKAMI24_PROMPTPAY_QR_BASE64;

  try {
    const dataDir = path.join(root, "disk", "app-data");
    process.env.OKAMI24_DATA_DIR = dataDir;
    delete process.env.OKAMI24_PROMPTPAY_QR_BASE64;
    const projectRoot = path.join(root, "project");
    fs.mkdirSync(projectRoot, { recursive: true });
    const target = path.join(dataDir, "private", "promptpay-qr.png");

    const nothing = installPromptpayQrIfMissing(projectRoot);
    check(
      "nothing pasted anywhere → nothing written, reported as no-source WITH the path it looked at",
      nothing.status === "no-source" && nothing.path === target && !fs.existsSync(target),
      JSON.stringify(nothing)
    );

    // --- environment variable route ---
    process.env.OKAMI24_PROMPTPAY_QR_BASE64 = TINY_PNG.toString("base64");
    const installed = installPromptpayQrIfMissing(projectRoot);
    check(
      "a QR pasted as an environment variable is written to the data disk, under private/, and read back",
      installed.status === "installed" &&
        installed.from === "env" &&
        installed.bytes === TINY_PNG.length &&
        fs.existsSync(target) &&
        fs.readFileSync(target).equals(TINY_PNG),
      JSON.stringify(installed)
    );

    // --- never overwrite: the disk always wins ---
    const ownersNewerQr = Buffer.concat([TINY_PNG, Buffer.from("newer")]);
    fs.writeFileSync(target, ownersNewerQr);
    const second = installPromptpayQrIfMissing(projectRoot);
    check(
      "a QR already on the disk is never overwritten by the pasted copy on the next deploy, and its size is reported",
      second.status === "already-present" && second.bytes === ownersNewerQr.length && fs.readFileSync(target).equals(ownersNewerQr),
      JSON.stringify(second)
    );

    // --- rejection: anything that is not a PNG never reaches the disk ---
    fs.rmSync(target);
    process.env.OKAMI24_PROMPTPAY_QR_BASE64 = Buffer.from("this is a text file, not an image").toString("base64");
    const notPng = installPromptpayQrIfMissing(projectRoot);
    check("something that is not a PNG is rejected, not written", notPng.status === "rejected" && !fs.existsSync(target), JSON.stringify(notPng));

    process.env.OKAMI24_PROMPTPAY_QR_BASE64 = "!!!! not base64 at all !!!!";
    const junk = installPromptpayQrIfMissing(projectRoot);
    check("a mangled paste is rejected without throwing", junk.status === "rejected" && !fs.existsSync(target), JSON.stringify(junk));

    // --- a disk that will not take the file: reported, never thrown ---
    // `private` exists as a FILE, so the folder cannot be created — the closest portable stand-in
    // for a read-only or missing mount.
    const blockedDataDir = path.join(root, "blocked", "app-data");
    fs.mkdirSync(blockedDataDir, { recursive: true });
    fs.writeFileSync(path.join(blockedDataDir, "private"), "not a folder");
    process.env.OKAMI24_DATA_DIR = blockedDataDir;
    process.env.OKAMI24_PROMPTPAY_QR_BASE64 = TINY_PNG.toString("base64");
    let blocked: ReturnType<typeof installPromptpayQrIfMissing> | null = null;
    let threw = false;
    try {
      blocked = installPromptpayQrIfMissing(projectRoot);
    } catch {
      threw = true;
    }
    check(
      "a real PNG that the disk will not take is reported as write-failed with a reason and the path, and nothing throws",
      !threw && blocked?.status === "write-failed" && blocked.reason.length > 0 && blocked.path === path.join(blockedDataDir, "private", "promptpay-qr.png"),
      threw ? "threw" : JSON.stringify(blocked)
    );
    process.env.OKAMI24_DATA_DIR = dataDir;

    // --- secret-file route, and the two things a real paste picks up ---
    delete process.env.OKAMI24_PROMPTPAY_QR_BASE64;
    const wrapped = `data:image/png;base64,${TINY_PNG.toString("base64").replace(/(.{20})/g, "$1\n")}\n`;
    fs.writeFileSync(path.join(projectRoot, QR_SECRET_FILE_NAME), wrapped, "utf8");
    const fromFile = installPromptpayQrIfMissing(projectRoot);
    check(
      "a QR pasted as a secret file works too, tolerating line breaks and a data: prefix",
      fromFile.status === "installed" && fromFile.from === "secret-file" && fs.readFileSync(target).equals(TINY_PNG),
      JSON.stringify(fromFile)
    );
  } finally {
    if (savedDataDir === undefined) delete process.env.OKAMI24_DATA_DIR;
    else process.env.OKAMI24_DATA_DIR = savedDataDir;
    if (savedEnvQr === undefined) delete process.env.OKAMI24_PROMPTPAY_QR_BASE64;
    else process.env.OKAMI24_PROMPTPAY_QR_BASE64 = savedEnvQr;
    fs.rmSync(root, { recursive: true, force: true });
  }

  for (const r of results) console.log(`${r.passed ? "PASS" : "FAIL"}  ${r.name}${r.passed ? "" : `\n      ${r.detail}`}`);
  const failed = results.filter((r) => !r.passed);
  if (failed.length > 0) {
    console.error(`\n${failed.length} of ${results.length} QR install checks failed.`);
    process.exit(1);
  }
  console.log(`\nAll ${results.length} QR install checks passed.`);
}

main();
