import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { expiredFiles, logStockPush, logDir, thaiDay } from "@/lib/woo/stock-push-log";

let failed = 0;
const check = (name: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
};

check("Thai day turns at 17:00 UTC", thaiDay(Date.parse("2026-11-08T16:59:00Z")) === "2026-11-08" && thaiDay(Date.parse("2026-11-08T17:00:00Z")) === "2026-11-09");
check(
  "files older than the keep window expire, others and strangers stay",
  JSON.stringify(expiredFiles(["2026-10-01.jsonl", "2026-10-03.jsonl", "2026-10-04.jsonl", "2026-10-05.jsonl", "2026-11-08.jsonl", "notes.txt"], "2026-11-08", 35)) ===
    JSON.stringify(["2026-10-01.jsonl", "2026-10-03.jsonl"])
);

const root = fs.mkdtempSync(path.join(os.tmpdir(), "stock-log-"));
fs.mkdirSync(logDir(root), { recursive: true });
fs.writeFileSync(path.join(logDir(root), "2026-09-01.jsonl"), "{}\n");
const now = Date.parse("2026-11-08T05:00:00Z");
logStockPush([], now, root);
check("no writes = no file", !fs.existsSync(path.join(logDir(root), "2026-11-08.jsonl")));
logStockPush([{ sku: "Pod-1-2", quantity: 3 }, { sku: "Pod-1-3", quantity: null }], now, root);
logStockPush([{ sku: "Pod-1-2", quantity: 2 }], now + 60_000, root);
const lines = fs.readFileSync(path.join(logDir(root), "2026-11-08.jsonl"), "utf8").trim().split("\n").map((l) => JSON.parse(l));
check("one line per push, codes and numbers kept", lines.length === 2 && JSON.stringify(lines[0].w) === JSON.stringify([["Pod-1-2", 3], ["Pod-1-3", null]]) && lines[1].t === "2026-11-08T05:01:00.000Z");
check("a new day's file deletes expired days", !fs.existsSync(path.join(logDir(root), "2026-09-01.jsonl")));
fs.writeFileSync(path.join(root, "stock-pushes-blocker"), "");
let threw = false;
try {
  logStockPush([{ sku: "x", quantity: 1 }], now, path.join(root, "stock-pushes-blocker"));
} catch {
  threw = true;
}
check("a disk error never throws", !threw);
fs.rmSync(root, { recursive: true, force: true });

console.log(failed === 0 ? "\nAll stock-push-log checks passed." : `\n${failed} check(s) FAILED.`);
if (failed > 0) process.exit(1);
