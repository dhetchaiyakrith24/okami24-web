import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import {
  decideRefund,
  PICTURE_WINDOW_MS,
  type Decision,
  type MatchedBy,
  type RefundPost,
  type RefundReason,
  type RefundStatus,
  type SlipFact,
  type WaitingPost,
} from "@/lib/staff/refund-rules";

/** The refund records (migration 0027). Rules = refund-rules.ts. No text of a post, no name, no account is stored here. */

export const posterHash = (userId: string | undefined) =>
  userId ? crypto.createHash("sha256").update(userId).digest("hex").slice(0, 16) : null;

interface SlipRow {
  trans_ref: string;
  amount_satang: number;
  transferred_at: string;
  receiver_status: string;
}
const toFact = (r: SlipRow): SlipFact => ({ transRef: r.trans_ref, amountSatang: r.amount_satang, transferredAt: r.transferred_at, receiverStatus: r.receiver_status });

/** A post older than the picture window that never got its picture is "no picture" from then on. */
function closeStale(): void {
  const before = new Date(Date.now() - PICTURE_WINDOW_MS).toISOString();
  getDb().prepare("UPDATE slip_refunds SET status = 'unmatched', reason = 'no-picture' WHERE status = 'waiting' AND posted_at < ?").run(before);
}

/** One refund post read in the group. Null = this LINE message was recorded before (an event sent twice). */
export function recordPost(input: { lineMessageId: string; groupId: string; posterHash: string | null; post: RefundPost; postedAt: string }): number | null {
  const { post } = input;
  const status: RefundStatus = post.amountSatang === null ? "unmatched" : "waiting";
  const info = getDb()
    .prepare(
      `INSERT OR IGNORE INTO slip_refunds (source, line_message_id, group_id, poster_hash, amount_satang, hint_at, posted_at, status, reason)
       VALUES ('line', ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(input.lineMessageId, input.groupId, input.posterHash, post.amountSatang, post.hintAt, input.postedAt, status, post.amountSatang === null ? "no-amount" : null);
  return info.changes === 1 ? Number(info.lastInsertRowid) : null;
}

export function waitingIn(groupId: string): WaitingPost[] {
  closeStale();
  return (
    getDb().prepare("SELECT id, poster_hash, posted_at FROM slip_refunds WHERE status = 'waiting' AND group_id = ?").all(groupId) as {
      id: number;
      poster_hash: string | null;
      posted_at: string;
    }[]
  ).map((r) => ({ id: r.id, posterHash: r.poster_hash, postedAt: r.posted_at }));
}

function matchedOnRef(transRef: string, exceptId?: number): number[] {
  return (
    getDb()
      .prepare("SELECT amount_satang AS a FROM slip_refunds WHERE status = 'matched' AND trans_ref = ? AND id != ?")
      .all(transRef, exceptId ?? -1) as { a: number }[]
  ).map((r) => r.a);
}

/** Shop slips near a time, for the amount + time fallback. transferred_at carries the bank's offset, so the window is read
 *  wide on our own first_checked_at and narrowed in refund-rules.ts. */
function candidatesNear(hintAt: string | null): SlipFact[] {
  if (!hintAt) return [];
  const t = Date.parse(hintAt);
  if (Number.isNaN(t)) return [];
  const rows = getDb()
    .prepare("SELECT trans_ref, amount_satang, transferred_at, receiver_status FROM slip_checks WHERE first_checked_at BETWEEN ? AND ?")
    .all(new Date(t - 2 * 86_400_000).toISOString(), new Date(t + 7 * 86_400_000).toISOString()) as SlipRow[];
  return rows.map(toFact);
}

export function slipByRef(transRef: string): SlipFact | null {
  const row = getDb().prepare("SELECT trans_ref, amount_satang, transferred_at, receiver_status FROM slip_checks WHERE trans_ref = ?").get(transRef) as
    | SlipRow
    | undefined;
  return row ? toFact(row) : null;
}

/** A slip by the end of its reference, as /staff/sales prints it ("…F00221"). Unique within 120 days, or none. */
export function slipByRefTail(tail: string): { slip: SlipFact } | { error: "short" | "none" | "many" } {
  const clean = tail.replace(/[^0-9A-Za-z]/g, "");
  if (clean.length < 6) return { error: "short" };
  const since = new Date(Date.now() - 120 * 86_400_000).toISOString();
  const rows = getDb()
    .prepare("SELECT trans_ref, amount_satang, transferred_at, receiver_status FROM slip_checks WHERE trans_ref LIKE ? AND first_checked_at >= ? LIMIT 3")
    .all(`%${clean}`, since) as SlipRow[];
  if (rows.length === 0) return { error: "none" };
  if (rows.length > 1) return { error: "many" };
  return { slip: toFact(rows[0]) };
}

function save(id: number, d: Decision, by?: MatchedBy): Decision {
  getDb()
    .prepare("UPDATE slip_refunds SET status = ?, reason = ?, trans_ref = ?, matched_by = ?, matched_at = ? WHERE id = ?")
    .run(
      d.status,
      d.status === "unmatched" ? d.reason : null,
      d.transRef ?? null,
      d.status === "matched" ? (by ?? d.matchedBy) : null,
      d.status === "matched" ? new Date().toISOString() : null,
      id
    );
  return d;
}

export function amountOf(id: number): { amount: number | null; hintAt: string | null } | null {
  const row = getDb().prepare("SELECT amount_satang, hint_at FROM slip_refunds WHERE id = ?").get(id) as { amount_satang: number | null; hint_at: string | null } | undefined;
  return row ? { amount: row.amount_satang, hintAt: row.hint_at } : null;
}

/** The bot read (or failed to read) the post's picture: decide and store. */
export function settleFromPicture(id: number, slip: SlipFact | null): Decision | null {
  const post = amountOf(id);
  if (!post) return null;
  const d = decideRefund({
    amountSatang: post.amount,
    hintAt: post.hintAt,
    slip,
    matchedOnRef: (ref) => matchedOnRef(ref, id),
    candidates: slip ? [] : candidatesNear(post.hintAt),
  });
  return save(id, d);
}

/** Staff tie a refund to a slip by the end of its reference (also how an old refund is entered). */
export function staffMatch(id: number, refTail: string): Decision | { status: "error"; reason: "short" | "none" | "many" } {
  const found = slipByRefTail(refTail);
  if ("error" in found) return { status: "error", reason: found.error };
  const post = amountOf(id);
  if (!post) return { status: "error", reason: "none" };
  const d = decideRefund({ amountSatang: post.amount, hintAt: post.hintAt, slip: found.slip, matchedOnRef: (ref) => matchedOnRef(ref, id), candidates: [], by: "staff" });
  return save(id, d, "staff");
}

/** A refund staff enter by hand: amount + the slip it belongs to. Goes through the same decision as the bot's. */
export function staffAdd(amountSatang: number, refTail: string): Decision | { status: "error"; reason: "short" | "none" | "many" | "no-amount" } {
  if (!Number.isInteger(amountSatang) || amountSatang <= 0) return { status: "error", reason: "no-amount" };
  const found = slipByRefTail(refTail);
  if ("error" in found) return { status: "error", reason: found.error };
  const info = getDb()
    .prepare("INSERT INTO slip_refunds (source, amount_satang, posted_at, status) VALUES ('staff', ?, ?, 'waiting')")
    .run(amountSatang, new Date().toISOString());
  const id = Number(info.lastInsertRowid);
  const d = decideRefund({ amountSatang, hintAt: null, slip: found.slip, matchedOnRef: (ref) => matchedOnRef(ref, id), candidates: [], by: "staff" });
  return save(id, d, "staff");
}

export function undoRefund(id: number): boolean {
  return getDb().prepare("UPDATE slip_refunds SET status = 'undone' WHERE id = ? AND status IN ('matched', 'duplicate')").run(id).changes === 1;
}

/** Matched refunds per slip, for the sales readers. */
export function refundedByRef(): Map<string, number> {
  const rows = getDb().prepare("SELECT trans_ref AS ref, SUM(amount_satang) AS s FROM slip_refunds WHERE status = 'matched' GROUP BY trans_ref").all() as {
    ref: string;
    s: number;
  }[];
  return new Map(rows.map((r) => [r.ref, r.s]));
}

export interface RefundRow {
  id: number;
  source: "line" | "staff";
  amountSatang: number | null;
  postedAt: string;
  status: RefundStatus;
  reason: RefundReason | null;
  matchedBy: MatchedBy | null;
  slip: SlipFact | null;
}

export function listRefunds(limit = 40): RefundRow[] {
  closeStale();
  const rows = getDb()
    .prepare(
      `SELECT r.id, r.source, r.amount_satang, r.posted_at, r.status, r.reason, r.matched_by,
              c.trans_ref, c.amount_satang AS slip_amount, c.transferred_at, c.receiver_status
         FROM slip_refunds r LEFT JOIN slip_checks c ON c.trans_ref = r.trans_ref
        ORDER BY r.posted_at DESC, r.id DESC LIMIT ?`
    )
    .all(limit) as {
    id: number;
    source: "line" | "staff";
    amount_satang: number | null;
    posted_at: string;
    status: RefundStatus;
    reason: RefundReason | null;
    matched_by: MatchedBy | null;
    trans_ref: string | null;
    slip_amount: number | null;
    transferred_at: string | null;
    receiver_status: string | null;
  }[];
  return rows.map((r) => ({
    id: r.id,
    source: r.source,
    amountSatang: r.amount_satang,
    postedAt: r.posted_at,
    status: r.status,
    reason: r.reason,
    matchedBy: r.matched_by,
    slip: r.trans_ref ? { transRef: r.trans_ref, amountSatang: r.slip_amount ?? 0, transferredAt: r.transferred_at ?? "", receiverStatus: r.receiver_status ?? "" } : null,
  }));
}
