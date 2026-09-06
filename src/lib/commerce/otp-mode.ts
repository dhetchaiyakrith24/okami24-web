import "server-only";

/**
 * OTP verification switch — **owner decision 2026-09-06**: "OTP: ปิดชั่วคราวตอนเปิดขาย ไม่ต้องต่อ SMS
 * … เปิดใหม่ได้ทีหลังถ้าเจอออเดอร์ผี" (docs/BUSINESS_SOURCE_OF_TRUTH.md §9).
 *
 * Why a flag and not deleted code: no SMS provider exists yet (BSOT §19), so the OTP step could
 * only ever log a code to the server console — a step that costs the customer a screen and proves
 * nothing. The whole verification path (hash+salt, expiry, attempt cap, rate limit in
 * `./auth.ts`) is left intact and untouched so turning it back on is this one line, not a rebuild.
 *
 * **To turn phone verification back on: set this to `true`.** Nothing else needs to change —
 * `auth.ts` starts issuing codes again, the checkout form shows the code step again, and the
 * how-to-order page's step 3 text switches back with it (see `src/i18n/service-pages/`).
 *
 * What is LOST while this is false: a phone number entered at checkout is not proved to belong to
 * the person entering it. Anyone can type any Thai mobile number and place an order under it. The
 * shop's protection against that is the manual payment check that already exists ("จ่ายแล้ว ≠
 * ยืนยัน" — admin verifies the money actually arrived before anything ships).
 */
export const OTP_VERIFICATION_ENABLED = false;
