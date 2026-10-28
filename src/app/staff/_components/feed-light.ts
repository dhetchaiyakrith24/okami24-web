import type { FeedState } from "@/lib/woo/watch-rules";

/** The Shipnity stock light's words and colours on the staff pages (owner 28/10) — the staff colour rule: green done,
 *  yellow waiting, red no (HANDOFF §18 "Red for no"). */
export const FEED_LIGHT: Record<FeedState, { short: string; long: string; text: string; dot: string }> = {
  ok: { short: "ทำงาน", long: "ทำงาน", text: "text-verified", dot: "bg-verified" },
  quiet: { short: "เงียบ", long: "เงียบนาน", text: "text-unverified", dot: "bg-unverified" },
  down: { short: "หยุด", long: "ไม่ทำงาน", text: "text-danger", dot: "bg-danger" },
};
