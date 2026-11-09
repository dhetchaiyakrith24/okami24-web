import "server-only";
import { getDb } from "@/lib/db/client";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { checkSlip } from "@/lib/staff/slip-verify";
import { getMessageContent, replyText } from "./client";
import { createEventGuard } from "./event-guard";
import { recordJoin, recordLeave, roleOf } from "./groups";
import { formatRefundReply, formatRestartSlipReply, formatSlipReply } from "./messages";
import { parseRefundPost, postForPicture, type SlipFact } from "@/lib/staff/refund-rules";
import { amountOf, posterHash, recordPost, settleFromPicture, slipByRef, waitingIn } from "@/lib/staff/refunds";

/**
 * What the alert bot does with the events LINE sends it (cart round 22/10). Deliberately narrow:
 *   - join / leave of a GROUP → remember / forget the group (staff assign it on /staff);
 *   - an IMAGE posted in the group marked "slip" → check it like the staff page does and reply with the verdict
 *     (a reply costs no message quota);
 *   - in the group marked "refund" (owner 10/11 "ทาง 1"): a text "แจ้งยอดโอนคืน…" → its amount is recorded (the text itself,
 *     with the customer's name and account, is never stored); the same poster's next picture → checked like a slip and the
 *     refund tied to that slip (refund-rules.ts), with one reply. Every other text or picture there is ignored, unread;
 *   - everything else (stickers, 1:1 chats, rooms, the order group, an unassigned group) → ignored, no answer.
 * Message text is read only in the refund group, and only for a refund post's amount; it is never stored.
 *
 * Restarts (03/11): running slip checks are counted, and one still running 18 s after SIGTERM is answered "send it
 * again" by reply before Render kills the old server at 30 s (event-guard.ts). An event id already handled is skipped
 * (network duplicates; dormant guard for LINE "Webhook redelivery", parked by the owner 03/11). No push fallback.
 */

const guard = createEventGuard();
const SHUTDOWN_HOOK = Symbol.for("okami24.line.shutdown-log");
const g = globalThis as { [SHUTDOWN_HOOK]?: true };
if (!g[SHUTDOWN_HOOK]) {
  g[SHUTDOWN_HOOK] = true;
  // `next start` owns SIGTERM and waits for after() work before it exits; this only starts the "send it again"
  // deadline (event-guard.ts) and logs what is still running.
  process.once("SIGTERM", () => {
    guard.beginShutdown();
    const n = guard.inFlight();
    if (n > 0) console.warn(`[line] SIGTERM with ${n} slip check(s) running — waiting for them before exit`);
  });
}

interface LineSource {
  type?: string;
  groupId?: string;
  userId?: string;
}

export interface LineEvent {
  type?: string;
  webhookEventId?: string;
  deliveryContext?: { isRedelivery?: boolean };
  replyToken?: string;
  timestamp?: number;
  source?: LineSource;
  message?: { type?: string; id?: string; text?: string };
}

const eventTime = (event: LineEvent) => new Date(typeof event.timestamp === "number" ? event.timestamp : Date.now()).toISOString();

/** A text in the refund group: a refund post is recorded (amount + the order time it names), anything else is dropped. */
function handleRefundText(event: LineEvent, groupId: string): void {
  const messageId = event.message?.id;
  const post = parseRefundPost(event.message?.text ?? "");
  if (!post || !messageId) return;
  const id = recordPost({ lineMessageId: messageId, groupId, posterHash: posterHash(event.source?.userId), post, postedAt: eventTime(event) });
  if (id === null) return;
  console.info(`[line] refund post #${id} recorded${post.amountSatang === null ? " — no single amount, left for staff" : ""}`);
  if (post.amountSatang === null && event.replyToken)
    void replyText(event.replyToken, formatRefundReply({ status: "unmatched", reason: "no-amount" }, null, null));
}

/** A picture in the refund group: only the one that follows a waiting refund post of the same poster is checked. */
async function handleRefundPicture(event: LineEvent, groupId: string): Promise<void> {
  const messageId = event.message?.id;
  if (!messageId) return;
  const post = postForPicture(waitingIn(groupId), posterHash(event.source?.userId), eventTime(event));
  if (!post) return;
  const content = await getMessageContent(messageId, MAX_IMAGE_BYTES);
  let slip: SlipFact | null = null;
  if (content && (ACCEPTED_IMAGE_TYPES as readonly string[]).includes(content.type)) {
    const result = await checkSlip({ bytes: content.bytes, type: content.type, fileName: `line-refund-${messageId}`, expected: null, withQuota: false });
    if (result.ok)
      slip = { transRef: result.slip.transRef, amountSatang: Math.round(result.slip.amount * 100), transferredAt: result.slip.transferredAt, receiverStatus: result.slip.receiverStatus };
  }
  const decision = settleFromPicture(post.id, slip);
  if (!decision) return;
  console.info(`[line] refund post #${post.id} → ${decision.status}${decision.status === "unmatched" ? ` (${decision.reason})` : ""}`);
  // The amount + time path found its slip in our log, not in the picture.
  const tied = slip ?? (decision.transRef ? slipByRef(decision.transRef) : null);
  if (event.replyToken) {
    const sent = await replyText(event.replyToken, formatRefundReply(decision, amountOf(post.id)?.amount ?? null, tied));
    if (!sent.ok) console.error(`[line] refund reply failed (${sent.status ?? "network"})`);
  }
}

/** The text the slip group gets for one picture (the verdict, or why the picture could not be read). */
async function slipVerdictText(messageId: string): Promise<string> {
  const content = await getMessageContent(messageId, MAX_IMAGE_BYTES);
  if (!content || !(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(content.type))
    return "⚠️ เปิดรูปนี้ไม่ได้ หรือรูปใหญ่เกิน 4 MB — ลองส่งรูปแคปสลิปจากแอปธนาคาร";
  const result = await checkSlip({ bytes: content.bytes, type: content.type, fileName: `line-${messageId}`, expected: null, withQuota: false });
  const attached = result.ok
    ? (getDb()
        .prepare(
          `SELECT o.order_number FROM order_payment_submissions s JOIN orders o ON o.id = s.order_id
           WHERE s.slip_trans_ref = ? ORDER BY s.id LIMIT 1`
        )
        .get(result.slip.transRef) as { order_number: string } | undefined)
    : undefined;
  return formatSlipReply(result, attached?.order_number ?? null);
}

async function handleSlipImage(event: LineEvent): Promise<void> {
  const messageId = event.message?.id;
  const replyToken = event.replyToken;
  if (!messageId || !replyToken) return;
  const startedAt = new Date().toISOString();
  // A restart that would kill the check first gets a "send it again" reply while the token can still be used.
  const verdict = await guard.raceShutdown(slipVerdictText(messageId));
  if (verdict === null) console.warn("[line] slip check cut by the restart — answered 'send it again'");
  const sent = await replyText(replyToken, verdict ?? formatRestartSlipReply(startedAt));
  if (!sent.ok) console.error(`[line] slip reply failed (${sent.status ?? "network"})`);
}

export async function handleEvents(events: LineEvent[]): Promise<void> {
  for (const event of events) {
    if (!guard.firstSighting(event.webhookEventId)) {
      console.info(`[line] event ${event.type ?? "?"} already handled — duplicate skipped${event.deliveryContext?.isRedelivery ? " (redelivery)" : ""}`);
      continue;
    }
    try {
      const groupId = event.source?.type === "group" ? event.source.groupId : undefined;
      if (!groupId) continue;
      if (event.type === "join") {
        recordJoin(groupId);
        console.info("[line] bot joined a group — assign it on /staff");
      } else if (event.type === "leave") {
        recordLeave(groupId);
      } else if (event.type === "message") {
        const role = roleOf(groupId);
        if (event.message?.type === "image" && role === "slip") await guard.track(handleSlipImage(event));
        else if (event.message?.type === "text" && role === "refund") handleRefundText(event, groupId);
        else if (event.message?.type === "image" && role === "refund") await guard.track(handleRefundPicture(event, groupId));
      }
    } catch (err) {
      console.error(`[line] event ${event.type ?? "?"} threw — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
