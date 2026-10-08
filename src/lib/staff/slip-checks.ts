import "server-only";
import { getDb } from "@/lib/db/client";
import type { ReceiverStatus } from "@/lib/staff/receiver-match";

/** The slip-check log (migration 0005). Holds no image and no names — see that file. */

export interface SlipCheckRecord {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
  receiverStatus: ReceiverStatus;
  firstCheckedAt: string;
  lastCheckedAt: string;
  checkCount: number;
}

interface Row {
  trans_ref: string;
  amount_satang: number;
  transferred_at: string;
  receiver_status: ReceiverStatus;
  first_checked_at: string;
  last_checked_at: string;
  check_count: number;
}

function toRecord(r: Row): SlipCheckRecord {
  return {
    transRef: r.trans_ref,
    amountSatang: r.amount_satang,
    transferredAt: r.transferred_at,
    receiverStatus: r.receiver_status,
    firstCheckedAt: r.first_checked_at,
    lastCheckedAt: r.last_checked_at,
    checkCount: r.check_count,
  };
}

export function findByImageHash(sha256: string): SlipCheckRecord | null {
  const row = getDb()
    .prepare(
      `SELECT c.* FROM slip_check_images i JOIN slip_checks c ON c.trans_ref = i.trans_ref WHERE i.image_sha256 = ?`
    )
    .get(sha256) as Row | undefined;
  return row ? toRecord(row) : null;
}

export function findByTransRef(transRef: string): SlipCheckRecord | null {
  const row = getDb().prepare("SELECT * FROM slip_checks WHERE trans_ref = ?").get(transRef) as Row | undefined;
  return row ? toRecord(row) : null;
}

/** Count one more look at a slip that is already in the log. `receiverStatus` = the verdict of a fresh
 *  EasySlip answer, which replaces the stored one (an "unclear" from before a fix can become a "match"). */
export function touchCheck(
  transRef: string,
  imageSha256: string | null,
  receiverStatus?: ReceiverStatus
): SlipCheckRecord | null {
  const db = getDb();
  const now = new Date().toISOString();
  db.transaction(() => {
    db.prepare(
      "UPDATE slip_checks SET last_checked_at = ?, check_count = check_count + 1, receiver_status = COALESCE(?, receiver_status) WHERE trans_ref = ?"
    ).run(now, receiverStatus ?? null, transRef);
    if (imageSha256) {
      db.prepare("INSERT OR IGNORE INTO slip_check_images (image_sha256, trans_ref) VALUES (?, ?)").run(imageSha256, transRef);
    }
  })();
  return findByTransRef(transRef);
}

export function recordFirstCheck(input: {
  transRef: string;
  amountSatang: number;
  transferredAt: string;
  receiverStatus: ReceiverStatus;
  imageSha256: string;
}): SlipCheckRecord {
  const db = getDb();
  const now = new Date().toISOString();
  db.transaction(() => {
    db.prepare(
      `INSERT INTO slip_checks (trans_ref, amount_satang, transferred_at, receiver_status, first_checked_at, last_checked_at)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT (trans_ref) DO UPDATE SET last_checked_at = excluded.last_checked_at, check_count = check_count + 1`
    ).run(input.transRef, input.amountSatang, input.transferredAt, input.receiverStatus, now, now);
    db.prepare("INSERT OR IGNORE INTO slip_check_images (image_sha256, trans_ref) VALUES (?, ?)").run(
      input.imageSha256,
      input.transRef
    );
  })();
  return findByTransRef(input.transRef)!;
}

export function recentChecks(limit = 30): SlipCheckRecord[] {
  return (getDb().prepare("SELECT * FROM slip_checks ORDER BY last_checked_at DESC LIMIT ?").all(limit) as Row[]).map(toRecord);
}
