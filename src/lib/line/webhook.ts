import "server-only";
import { getDb } from "@/lib/db/client";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { checkSlip } from "@/lib/staff/slip-verify";
import { getMessageContent, replyText } from "./client";
import { createEventGuard } from "./event-guard";
import { recordJoin, recordLeave, roleOf } from "./groups";
import { formatRestartSlipReply, formatSlipReply } from "./messages";

/**
 * What the alert bot does with the events LINE sends it (cart round 22/10). Deliberately narrow:
 *   - join / leave of a GROUP → remember / forget the group (staff assign it on /staff);
 *   - an IMAGE posted in the group marked "slip" → check it like the staff page does and reply with the verdict
 *     (a reply costs no message quota);
 *   - everything else (text, stickers, 1:1 chats, rooms, the order group, an unassigned group) → ignored, no answer.
 * Message text is never read or stored.
 *
 * Restarts (03/11): an event id already handled is skipped (LINE "Webhook redelivery" + network duplicates), and a
 * redelivered slip is still answered by reply only — if LINE refuses its reply token the failure is logged and NO push
 * is sent (push uses the monthly quota — the owner's call). Running slip checks are counted, and one still running
 * 18 s after SIGTERM is answered "send it again" before Render kills the old server at 30 s (event-guard.ts).
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
}

export interface LineEvent {
  type?: string;
  webhookEventId?: string;
  deliveryContext?: { isRedelivery?: boolean };
  replyToken?: string;
  source?: LineSource;
  message?: { type?: string; id?: string };
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
  // A redelivered event's reply token may be refused (LINE: usable "except in certain cases") — no push fallback.
  const redelivered = event.deliveryContext?.isRedelivery === true;
  if (!sent.ok) console.error(`[line] slip reply failed (${sent.status ?? "network"})${redelivered ? " — redelivered event, no push sent" : ""}`);
  else if (redelivered) console.info("[line] slip answered from a redelivered event");
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
      } else if (event.type === "message" && event.message?.type === "image" && roleOf(groupId) === "slip") {
        await guard.track(handleSlipImage(event));
      }
    } catch (err) {
      console.error(`[line] event ${event.type ?? "?"} threw — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
