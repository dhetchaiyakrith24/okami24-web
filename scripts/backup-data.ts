/**
 * Manual backup of `.data/okami24.db` (+ `.env*` if present) to the local backup folder.
 *
 *   npm run backup:data            → backs up to OKAMI24_BACKUP_DIR or <home>/OKami24-backups
 *
 * The same code runs automatically inside the server (src/instrumentation.ts); this is the
 * on-demand button. Exit code 1 only on a real failure (a missing DB just prints a notice).
 */
import { defaultBackupDir, listBackups, runBackup } from "../src/lib/backup/data-backup";

async function main(): Promise<void> {
  const r = await runBackup();
  if (!r.ok) {
    const missing = /nothing to back up/.test(r.reason);
    console.log(`${missing ? "SKIP" : "FAIL"}  ${r.reason}`);
    process.exit(missing ? 0 : 1);
  }
  console.log(`OK    ${r.file}`);
  console.log(`      ${r.bytes} bytes · integrity=${r.integrity} · orders=${r.orders ?? "n/a"} · env files=${r.envFiles.join(", ") || "none"} · pruned=${r.pruned.length}`);
  console.log(`      folder: ${r.destDir} (now holds ${listBackups(defaultBackupDir()).length} copies)`);
}

void main();
