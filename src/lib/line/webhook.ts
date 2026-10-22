import "server-only";
import { getDb } from "@/lib/db/client";
import { ACCEPTED_IMAGE_TYPES, MAX_IMAGE_BYTES } from "@/lib/staff/easyslip";
import { checkSlip } from "@/lib/staff/slip-verify";
import { getMessageContent, replyText } from "./client";
import { recordJoin, recordLeave, roleOf } from "./groups";
import { formatSlipReply } from "./messages";

/**
 * What the alert bot does with the events LINE sends it (cart round 22/10). Deliberately narrow:
 *   - join / leave of a GROUP → remember / forget the group (staff assign it on /staff);
 *   - an IMAGE posted in the group marked "slip" → check it like the staff page does and reply with the verdict
 *     (a reply costs no message quota);
 *   - everything else (text, stickers, 1:1 chats, rooms, the order group, an unassigned group) → ignored, no answer.
 * Message text is never read or stored.
 */

interface LineSource {
  type?: string;
  groupId?: string;
}

export interface LineEvent {
  type?: string;
  replyToken?: string;
  source?: LineSource;
  message?: { type?: string; id?: string };
}

async function handleSlipImage(event: LineEvent): Promise<void> {
  const messageId = event.message?.id;
  const replyToken = event.replyToken;
  if (!messageId || !replyToken) return;
  const content = await getMessageContent(messageId, MAX_IMAGE_BYTES);
  if (!content || !(ACCEPTED_IMAGE_TYPES as readonly string[]).includes(content.type)) {
    await replyText(replyToken, "⚠️ เปิดรูปนี้ไม่ได้ หรือรูปใหญ่เกิน 4 MB — ลองส่งรูปแคปสลิปจากแอปธนาคาร");
    return;
  }
  const result = await checkSlip({ bytes: content.bytes, type: content.type, fileName: `line-${messageId}`, expected: null, withQuota: false });
  const attached = result.ok
    ? (getDb()
        .prepare(
          `SELECT o.order_number FROM order_payment_submissions s JOIN orders o ON o.id = s.order_id
           WHERE s.slip_trans_ref = ? ORDER BY s.id LIMIT 1`
        )
        .get(result.slip.transRef) as { order_number: string } | undefined)
    : undefined;
  const sent = await replyText(replyToken, formatSlipReply(result, attached?.order_number ?? null));
  if (!sent.ok) console.error(`[line] slip reply failed (${sent.status ?? "network"})`);
}

export async function handleEvents(events: LineEvent[]): Promise<void> {
  for (const event of events) {
    try {
      const groupId = event.source?.type === "group" ? event.source.groupId : undefined;
      if (!groupId) continue;
      if (event.type === "join") {
        recordJoin(groupId);
        console.info("[line] bot joined a group — assign it on /staff");
      } else if (event.type === "leave") {
        recordLeave(groupId);
      } else if (event.type === "message" && event.message?.type === "image" && roleOf(groupId) === "slip") {
        await handleSlipImage(event);
      }
    } catch (err) {
      console.error(`[line] event ${event.type ?? "?"} threw — ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}
