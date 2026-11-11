/**
 * Who may do what with a saved address (T2-03 + T2-15; owner approved the plan 11/11: "อนุมัติ"). Pure — the contract test
 * runs it under plain tsx; the DB side = src/lib/commerce/addresses.ts, the columns = migrations/0030_address_owner.sql.
 *
 * The checkout phone step opens a session from a typed number with no code (owner 23/10), so a phone session proves nothing
 * about who is typing. Only a LINE / Google member session does (src/lib/members/session.ts). So:
 *   - list / edit / delete saved addresses = a signed-in member, their own rows only (member_id);
 *   - a phone-only session lists nothing: it types the address, and may use what it typed for its own order only
 *     (session_id, member_id NULL) — never listed again, never attached to a member later (we cannot prove who typed it);
 *   - typed while signed in as a member = saved to that member.
 * Every address id that arrives from a form or the address bar goes through `orderScope` / `editScope` — never trusted alone.
 */

export interface AddressViewer {
  /** The checkout phone session's own row id. */
  sessionId: number;
  /** The signed-in LINE / Google member, or null. */
  memberId: number | null;
}

export interface Scope {
  sql: string;
  args: number[];
}

/** The rows the address step may LIST. null = list nothing (a phone-only session). */
export function listScope(v: AddressViewer): Scope | null {
  return v.memberId === null ? null : { sql: "member_id = ?", args: [v.memberId] };
}

/** The rows a session may USE for its order (review step, place order): the member's own, plus what this very session typed
 *  without a member. */
export function orderScope(v: AddressViewer): Scope {
  return v.memberId === null
    ? { sql: "(member_id IS NULL AND session_id = ?)", args: [v.sessionId] }
    : { sql: "(member_id = ? OR (member_id IS NULL AND session_id = ?))", args: [v.memberId, v.sessionId] };
}

/** The rows a session may EDIT or DELETE. null = none (a phone-only session has no saved addresses to manage). */
export function editScope(v: AddressViewer): Scope | null {
  return listScope(v);
}

/** Who owns a row this session saves now. */
export function newRowOwner(v: AddressViewer): { memberId: number | null; sessionId: number } {
  return { memberId: v.memberId, sessionId: v.sessionId };
}
