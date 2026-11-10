/**
 * Staff accounts (owner 10/11 chat: "admin แต่ละคนมีบัญชีของตัวเอง"): who may open the back office with Google, and the words the
 * owner types when adding someone. Pure, so the contract test runs it under plain tsx (staff-accounts-contract-test.ts).
 * The DB side = src/lib/staff/accounts.ts; the session side = src/lib/staff/auth.ts.
 */

export type ActorKind = "shared" | "account" | "owner";

/** Who did it — every staff session names one. `name` is what "ใครทำอะไร" shows. */
export interface StaffActor {
  kind: ActorKind;
  accountId: number | null;
  name: string;
}

/** The owner acting in the admin view, and the shared team password (nobody in particular). */
export const OWNER_NAME = "เจ้าของ";
export const SHARED_NAME = "รหัสร่วม";

export interface AccountForSignIn {
  id: number;
  name: string;
  active: boolean;
  googleSub: string | null;
}

export interface SignInClaims {
  sub: string;
  email: string | null;
  emailVerified: boolean;
}

export type SignInDecision =
  | { ok: true; actor: StaffActor; pinSub: boolean }
  | { ok: false; reason: "unverified" | "not-listed" | "disabled" | "other-google-id" };

export const normalEmail = (email: string) => email.trim().toLowerCase();

/**
 * A Google sign-in on /staff. Google's own "verified" flag is required (an address nobody proved they own opens nothing).
 * The owner's address = the owner, acting in the admin view. Otherwise the address must belong to an active account; the
 * first sign-in pins Google's id for the person, and a later one with the same address but another id is refused.
 */
export function decideStaffSignIn(
  claims: SignInClaims,
  isOwnerAddress: (email: string) => boolean,
  account: AccountForSignIn | null
): SignInDecision {
  if (!claims.email || !claims.emailVerified) return { ok: false, reason: "unverified" };
  if (isOwnerAddress(claims.email)) return { ok: true, actor: { kind: "owner", accountId: null, name: OWNER_NAME }, pinSub: false };
  if (!account) return { ok: false, reason: "not-listed" };
  if (!account.active) return { ok: false, reason: "disabled" };
  if (account.googleSub && account.googleSub !== claims.sub) return { ok: false, reason: "other-google-id" };
  return { ok: true, actor: { kind: "account", accountId: account.id, name: account.name }, pinSub: !account.googleSub };
}

/** A plain address check: something@something.tld, no spaces, at most 254 characters (the mail standard's limit). */
const EMAIL = /^[^\s@]{1,64}@[^\s@]+\.[^\s@]{2,}$/;

export type NewAccount = { ok: true; name: string; email: string } | { ok: false; error: "name" | "email" };

/** The owner's "เพิ่มแอดมิน" form. A name the owner will recognise (1–30 characters) and a Google address. */
export function parseNewAccount(nameRaw: unknown, emailRaw: unknown): NewAccount {
  const name = typeof nameRaw === "string" ? nameRaw.trim().replace(/\s+/g, " ") : "";
  if (name.length < 1 || name.length > 30 || name === OWNER_NAME || name === SHARED_NAME) return { ok: false, error: "name" };
  const email = typeof emailRaw === "string" ? normalEmail(emailRaw) : "";
  if (email.length > 254 || !EMAIL.test(email)) return { ok: false, error: "email" };
  return { ok: true, name, email };
}

export function parseName(raw: unknown): string | null {
  const parsed = parseNewAccount(raw, "a@b.co");
  return parsed.ok ? parsed.name : null;
}
