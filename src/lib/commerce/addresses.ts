import "server-only";
import { getDb } from "@/lib/db/client";
import { requireCustomer } from "./session";
import { checkPostcodePlace } from "./thai-postcodes";
import { getMember } from "@/lib/members/session";
import { editScope, listScope, newRowOwner, orderScope, type AddressViewer } from "./address-owner";

/** Who is asking (T2-03): the checkout phone session (required, as before) and the signed-in member, if any. The rules of
 *  what each may see = src/lib/commerce/address-owner.ts. */
async function viewer(): Promise<AddressViewer & { customerId: number }> {
  const [customer, member] = await Promise.all([requireCustomer(), getMember()]);
  return { customerId: customer.id, sessionId: customer.sessionId, memberId: member?.id ?? null };
}

export interface AddressInput {
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
}

export interface AddressRecord extends AddressInput {
  id: number;
  isDefault: boolean;
}

interface AddressRow {
  id: number;
  recipient_name: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postal_code: string;
  is_default: number;
}

function fromRow(row: AddressRow): AddressRecord {
  return {
    id: row.id,
    recipientName: row.recipient_name,
    phone: row.phone,
    line1: row.line1,
    subdistrict: row.subdistrict,
    district: row.district,
    province: row.province,
    postalCode: row.postal_code,
    isDefault: row.is_default === 1,
  };
}

/** Why an address was refused — the address step shows the matching dictionary line (`dict.checkout.addressError*`).
 *  Was an English sentence passed through the URL (cart-ready round 24/10). */
export type AddressError = "missing" | "phone" | "houseNumber" | "postal";

/** A Thai or Latin letter — a place name has at least one. */
const HAS_LETTER = /[ก-ฮะ-๎a-zA-Z]/;

/** `{ error }` = refused (why); otherwise the input with the place in the data's own spelling (thai-postcodes.ts). */
export function validateAddress(input: AddressInput): { error: AddressError } | { input: AddressInput } {
  const required = [input.recipientName, input.phone, input.line1, input.subdistrict, input.district, input.province];
  if (required.some((v) => !v.trim())) return { error: "missing" };
  // A number the courier can call: 9–10 digits starting with 0 (mobile or landline), dashes and spaces allowed.
  // Owner 02/11 ("เบอร์ขาด 1 ตัว" must not go through): one 9–10 digit rule let a mobile one digit short pass as a landline,
  // so a mobile (06/08/09) needs 10 digits and a landline (02–07) 9.
  const phone = input.phone.replace(/[\s-]/g, "");
  if (!/^0[689][0-9]{8}$/.test(phone) && !/^0[2-7][0-9]{7}$/.test(phone)) return { error: "phone" };
  // A hand-typed sub-district or district is allowed (owner 03/11, confirmed 11/11 "พิมพ์เองได้เหมือนเดิม") but must name a
  // place: "-", "." or digits alone carry no letter (outside tester T2-21: "- ต.- อ.-" went through to the warehouse).
  if (!HAS_LETTER.test(input.subdistrict) || !HAS_LETTER.test(input.district)) return { error: "missing" };
  // The courier needs a house number (owner 02/11): the address line must carry at least one digit, Arabic or Thai.
  if (!/[0-9๐-๙]/.test(input.line1)) return { error: "houseNumber" };
  // The postcode must be real and serve the province given (owner 02/11: a wrong postcode stops the order); the sub-district
  // and district may be typed by hand (owner 03/11) — kept in the data's spelling where they match it (thai-postcodes.ts).
  const checked = checkPostcodePlace(input.postalCode, input);
  if (checked.kind === "wrong") return { error: "postal" };
  return { input: { ...input, ...checked.place, postalCode: input.postalCode.trim() } };
}

/**
 * Which saved address a returning customer most likely wants (cart UX batch C, owner 24/10 "preselect the last-used saved
 * address and go straight to review"): the saved address that matches the shipping address of their latest order; else the
 * first of `listAddresses()` (default first, then newest). null = no saved address. Read-only; the customer can still change
 * it from the review step.
 */
export async function lastUsedAddressId(addresses: AddressRecord[]): Promise<number | null> {
  if (addresses.length === 0) return null;
  const customer = await requireCustomer();
  const last = getDb()
    .prepare(
      `SELECT s.recipient_name, s.phone, s.line1, s.subdistrict, s.district, s.province, s.postal_code
       FROM orders o JOIN order_shipping_addresses s ON s.order_id = o.id
       WHERE o.customer_id = ? ORDER BY o.id DESC LIMIT 1`
    )
    .get(customer.id) as Omit<AddressRow, "id" | "is_default"> | undefined;
  if (last) {
    const match = addresses.find(
      (a) =>
        a.recipientName === last.recipient_name &&
        a.phone === last.phone &&
        a.line1 === last.line1 &&
        a.subdistrict === last.subdistrict &&
        a.district === last.district &&
        a.province === last.province &&
        a.postalCode === last.postal_code
    );
    if (match) return match.id;
  }
  return addresses[0].id;
}

/** The saved addresses the address step lists: a signed-in member's own only — a phone-only session lists none (T2-03). */
export async function listAddresses(): Promise<AddressRecord[]> {
  const scope = listScope(await viewer());
  if (!scope) return [];
  const rows = getDb()
    .prepare(`SELECT * FROM addresses WHERE ${scope.sql} ORDER BY is_default DESC, id DESC`)
    .all(...scope.args) as AddressRow[];
  return rows.map(fromRow);
}

/** Saves the typed address: to the member when one is signed in, else to this phone session only (usable for its own
 *  order, never listed again — address-owner.ts). The default flag is the member's; a phone-only row is never a default. */
export async function addAddress(raw: AddressInput, makeDefault: boolean): Promise<{ ok: true; id: number } | { ok: false; error: AddressError }> {
  const checked = validateAddress(raw);
  if ("error" in checked) return { ok: false, error: checked.error };
  const input = checked.input;

  const who = await viewer();
  const owner = newRowOwner(who);
  const db = getDb();
  const isFirst =
    owner.memberId !== null && (db.prepare("SELECT COUNT(*) as n FROM addresses WHERE member_id = ?").get(owner.memberId) as { n: number }).n === 0;
  const asDefault = owner.memberId !== null && (makeDefault || isFirst);

  const insertRun = db.transaction(() => {
    if (asDefault) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE member_id = ?").run(owner.memberId);
    }
    return db
      .prepare(
        `INSERT INTO addresses (customer_id, member_id, session_id, recipient_name, phone, line1, subdistrict, district, province, postal_code, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        who.customerId,
        owner.memberId,
        owner.sessionId,
        input.recipientName.trim(),
        input.phone.trim(),
        input.line1.trim(),
        input.subdistrict.trim(),
        input.district.trim(),
        input.province.trim(),
        input.postalCode.trim(),
        asDefault ? 1 : 0
      );
  });

  const result = insertRun();
  return { ok: true, id: Number(result.lastInsertRowid) };
}

/**
 * Edit / delete a saved address (owner 03/11 "ที่อยู่ที่บันทึกไว้ ขอให้มีหัวข้อลบหรือแก้ไขได้"). Both are scoped to the
 * signed-in member's own rows (T2-15, address-owner.ts `editScope`) — an id from the form is never trusted on its own, and a
 * phone-only session has nothing to edit. Orders keep their own copy of the address (`order_shipping_addresses`), so editing
 * or deleting here never changes an order already placed.
 */
export async function updateAddress(addressId: number, raw: AddressInput): Promise<{ ok: true; id: number } | { ok: false; error: AddressError | "not-found" }> {
  const checked = validateAddress(raw);
  if ("error" in checked) return { ok: false, error: checked.error };
  const input = checked.input;
  const scope = editScope(await viewer());
  if (!scope) return { ok: false, error: "not-found" };
  const result = getDb()
    .prepare(
      `UPDATE addresses SET recipient_name = ?, phone = ?, line1 = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?
       WHERE id = ? AND ${scope.sql}`
    )
    .run(input.recipientName.trim(), input.phone.trim(), input.line1.trim(), input.subdistrict.trim(), input.district.trim(), input.province.trim(), input.postalCode.trim(), addressId, ...scope.args);
  return result.changes === 1 ? { ok: true, id: addressId } : { ok: false, error: "not-found" };
}

/** Deleting the default hands the default to the member's newest address left, so the address step still preselects one. */
export async function deleteAddress(addressId: number): Promise<boolean> {
  const scope = editScope(await viewer());
  if (!scope) return false;
  const db = getDb();
  return db.transaction(() => {
    const row = db.prepare(`SELECT is_default, member_id FROM addresses WHERE id = ? AND ${scope.sql}`).get(addressId, ...scope.args) as
      | { is_default: number; member_id: number }
      | undefined;
    if (!row) return false;
    db.prepare(`DELETE FROM addresses WHERE id = ? AND ${scope.sql}`).run(addressId, ...scope.args);
    if (row.is_default === 1) {
      db.prepare("UPDATE addresses SET is_default = 1 WHERE id = (SELECT MAX(id) FROM addresses WHERE member_id = ?)").run(row.member_id);
    }
    return true;
  })();
}

/** Fetches one address by id for the review step and the order (T2-15): the member's own, or what this very phone session
 *  typed — never trust an address id from a form field or the address bar, or one visitor could read or ship to another's
 *  address. */
export async function getOwnedAddress(addressId: number): Promise<AddressRecord | null> {
  const scope = orderScope(await viewer());
  const row = getDb()
    .prepare(`SELECT * FROM addresses WHERE id = ? AND ${scope.sql}`)
    .get(addressId, ...scope.args) as AddressRow | undefined;
  return row ? fromRow(row) : null;
}
