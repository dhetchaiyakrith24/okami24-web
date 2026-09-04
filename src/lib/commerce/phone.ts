/**
 * Thai mobile number normalization/validation. Deliberately narrow (10 digits, leading 0) rather
 * than a general E.164 parser — docs/BUSINESS_SOURCE_OF_TRUTH.md frames this as a Thailand-only
 * storefront (LINE OA, THB pricing, Thai shipping), and inventing broader international support
 * nobody asked for would be scope creep, not robustness.
 */
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^0-9]/g, "");
  // Accept a +66/66 prefix and rewrite it to the local 0-prefixed form so "66812345678" and
  // "0812345678" resolve to the same customer identity.
  const local = digits.startsWith("66") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
  if (!/^0[689][0-9]{8}$/.test(local)) return null;
  return local;
}
