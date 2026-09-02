/**
 * OKami24 — one-command ProductMaster readiness gate.
 *
 * Bundles the exact verification sequence that was run BY HAND, repeatedly, across the full
 * catalog + variant-media mission (2026-09-02): typecheck → lint → every contract/validation
 * script under src/ → (optionally) a real production build + start + publication-leakage check.
 * Nothing here is new logic — it orchestrates the same checks that already existed, so a future
 * session runs one command instead of re-typing nine `npx tsx` invocations from memory.
 *
 * Usage:
 *   npx tsx scripts/verify-catalog.ts            # typecheck + lint + all contract tests (~seconds)
 *   npx tsx scripts/verify-catalog.ts --full      # ...plus a real `next build` + `next start` +
 *                                                  #    publication-leakage check (~minutes)
 *
 * Or via package.json: `npm run verify:catalog` / `npm run verify:catalog -- --full`.
 *
 * Exit code is non-zero if any step fails — safe to use as a pre-commit/CI gate.
 */

import { spawnSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const SRC_DIR = path.join(process.cwd(), "src");
const FULL = process.argv.includes("--full");

interface StepResult {
  name: string;
  ok: boolean;
  durationMs: number;
  output?: string;
}

const results: StepResult[] = [];

function runStep(name: string, cmd: string, args: string[]): boolean {
  const start = Date.now();
  process.stdout.write(`\n→ ${name} ...\n`);
  // shell:true is required on Windows to resolve npx.cmd; every arg here is a static string or a
  // repo-internal file path from readdirSync, never external/user input, so this is safe.
  const res = spawnSync(cmd, args, { stdio: "pipe", shell: process.platform === "win32", encoding: "utf-8" });
  const ok = res.status === 0;
  const durationMs = Date.now() - start;
  results.push({ name, ok, durationMs, output: ok ? undefined : `${res.stdout ?? ""}\n${res.stderr ?? ""}` });
  console.log(ok ? `  OK (${durationMs}ms)` : `  FAILED (${durationMs}ms)`);
  if (!ok) {
    console.log((res.stdout ?? "").slice(-4000));
    console.log((res.stderr ?? "").slice(-4000));
  }
  return ok;
}

/** Every `*-contract-test.ts` and `validate-*.ts` script under src/ — discovered, not hardcoded,
 *  so a future session's new contract test is picked up automatically without editing this file. */
function findVerificationScripts(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...findVerificationScripts(full));
    } else if (/(-contract-test|^validate-.*)\.ts$/.test(entry) && !entry.endsWith(".d.ts")) {
      out.push(full);
    }
  }
  return out;
}

async function waitForServer(url: string, timeoutMs: number): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return true;
    } catch {
      // not up yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
}

/** Real production build + start + a data-driven leakage check: every genuinely
 *  `publicationStatus:"published"` slug must 200, and a sample of still-unpublished/DEV-only
 *  slugs must 404 — the exact check this project's mission reports ran by hand via curl after
 *  every publish/media change. Reads ground truth from the actual data modules, never a
 *  hardcoded slug list, so it stays correct as the catalog grows. */
async function runFullLeakageCheck(): Promise<boolean> {
  console.log("\n→ next build ...");
  const buildStart = Date.now();
  const build = spawnSync("npx", ["next", "build"], {
    stdio: "pipe",
    shell: process.platform === "win32",
    encoding: "utf-8",
    env: { ...process.env, SITE_URL: process.env.SITE_URL ?? "https://okami24.co" },
  });
  const buildOk = build.status === 0;
  results.push({ name: "next build", ok: buildOk, durationMs: Date.now() - buildStart, output: buildOk ? undefined : `${build.stdout ?? ""}\n${build.stderr ?? ""}` });
  console.log(buildOk ? `  OK (${Date.now() - buildStart}ms)` : "  FAILED");
  if (!buildOk) {
    console.log((build.stdout ?? "").slice(-4000));
    console.log((build.stderr ?? "").slice(-4000));
    return false;
  }

  const { getPublishedProducts } = await import(pathToFileURL(path.join(SRC_DIR, "data", "shipnity-seed", "storefront-bridge.ts")).href);
  const { activeCatalogSeed } = await import(pathToFileURL(path.join(SRC_DIR, "data", "shipnity-seed", "build-active-catalog.ts")).href);
  const { relationshipCoverageReport } = await import(pathToFileURL(path.join(SRC_DIR, "data", "catalog-relationships.ts")).href);
  const coverage = relationshipCoverageReport();
  console.log(
    `\n→ relationship coverage: ${coverage.liveDeviceConsumableEdges}/${coverage.deviceConsumableEdges} device-consumable edges live` +
      (coverage.darkEndpoints.length > 0 ? ` (dark: ${coverage.darkEndpoints.join(", ")})` : "")
  );
  const publishedSlugs: string[] = getPublishedProducts().map((p: { slug: string }) => p.slug);
  const publishedIds = new Set(getPublishedProducts().map((p: { shipnityProductId: string }) => p.shipnityProductId));
  const unpublishedSample: string[] = activeCatalogSeed
    .map((p: { shipnityProductId: string }) => p.shipnityProductId)
    .filter((id: string) => !publishedIds.has(id))
    .slice(0, 5)
    .map((id: string) => id.toLowerCase());

  const port = 3411;
  console.log(`\n→ next start -p ${port} ...`);
  const { spawn } = await import("node:child_process");
  const child = spawn("npx", ["next", "start", "-p", String(port)], {
    shell: process.platform === "win32",
    env: { ...process.env, SITE_URL: process.env.SITE_URL ?? "https://okami24.co" },
    stdio: "ignore",
  });

  try {
    const up = await waitForServer(`http://localhost:${port}/`, 30000);
    if (!up) {
      results.push({ name: "next start (leakage check)", ok: false, durationMs: 0, output: "server did not come up within 30s" });
      return false;
    }

    let allOk = true;
    for (const slug of publishedSlugs) {
      const res = await fetch(`http://localhost:${port}/products/${slug}`);
      const ok = res.status === 200;
      if (!ok) console.log(`  LEAK: published slug "${slug}" returned ${res.status}, expected 200`);
      allOk = allOk && ok;
    }
    for (const slug of unpublishedSample) {
      const res = await fetch(`http://localhost:${port}/products/${slug}`);
      const ok = res.status === 404;
      if (!ok) console.log(`  LEAK: unpublished slug "${slug}" returned ${res.status}, expected 404`);
      allOk = allOk && ok;
    }
    results.push({
      name: `publication leakage check (${publishedSlugs.length} published, ${unpublishedSample.length} unpublished sampled)`,
      ok: allOk,
      durationMs: 0,
    });
    console.log(allOk ? "  OK" : "  FAILED");
    return allOk;
  } finally {
    // On Windows, `child.kill()` only kills the shell wrapper spawned for npx.cmd — the actual
    // `next start` process underneath survives as an orphan (confirmed: it kept serving on its
    // port after a plain `child.kill()`). `taskkill /T` kills the whole process tree instead.
    if (process.platform === "win32" && child.pid) {
      spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], { stdio: "ignore" });
    } else {
      child.kill();
    }
  }
}

async function main() {
  runStep("typecheck (tsc --noEmit)", "npx", ["tsc", "--noEmit"]);
  runStep("lint (eslint .)", "npx", ["eslint", "."]);

  const scripts = findVerificationScripts(SRC_DIR);
  for (const script of scripts) {
    const rel = path.relative(process.cwd(), script);
    runStep(rel, "npx", ["tsx", script]);
  }

  if (FULL) {
    await runFullLeakageCheck();
  } else {
    console.log("\n(skipping next build/start/leakage check — pass --full to include it)");
  }

  console.log("\n" + "=".repeat(60));
  console.log("SUMMARY");
  console.log("=".repeat(60));
  for (const r of results) {
    console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}`);
  }
  const failed = results.filter((r) => !r.ok);
  if (failed.length > 0) {
    console.log(`\n${failed.length} of ${results.length} step(s) failed.`);
    process.exitCode = 1;
  } else {
    console.log(`\nAll ${results.length} step(s) passed.`);
  }
}

main();
