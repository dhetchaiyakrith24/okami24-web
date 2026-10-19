import { CONTACT } from "@/data/contact";

/** LINE's ready-message link: opens the shop's OA chat with `text` already typed (the customer only taps send). */
export const LINE_OA_MESSAGE_BASE = `https://line.me/R/oaMessage/${CONTACT.lineBasicId}/`;

export function lineOaMessageUrl(text: string): string {
  return `${LINE_OA_MESSAGE_BASE}?${encodeURIComponent(text)}`;
}

/** The message the shop receives: what, which option, a code the admin can look up, and the page. One fact per line. */
export function lineOrderMessage(parts: {
  lead: string;
  productName: string;
  optionLabel: string;
  option: string | null;
  codeLabel: string;
  code: string;
  url: string;
}): string {
  return [
    `${parts.lead} ${parts.productName}`,
    parts.option ? `${parts.optionLabel}: ${parts.option}` : null,
    `${parts.codeLabel}: ${parts.code}`,
    parts.url,
  ]
    .filter(Boolean)
    .join("\n");
}
