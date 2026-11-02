import "server-only";
import { getDb } from "@/lib/db/client";
import { requireCustomer } from "./session";
import { checkPostcodePlace } from "./thai-postcodes";

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

/** `{ error }` = refused (why); otherwise the input with the place in the data's own spelling (thai-postcodes.ts). */
function validate(input: AddressInput): { error: AddressError } | { input: AddressInput } {
  const required = [input.recipientName, input.phone, input.line1, input.subdistrict, input.district, input.province];
  if (required.some((v) => !v.trim())) return { error: "missing" };
  // A number the courier can call: 9–10 digits starting with 0 (mobile or landline), dashes and spaces allowed.
  // Owner 02/11 ("เบอร์ขาด 1 ตัว" must not go through): one 9–10 digit rule let a mobile one digit short pass as a landline,
  // so a mobile (06/08/09) needs 10 digits and a landline (02–07) 9.
  const phone = input.phone.replace(/[\s-]/g, "");
  if (!/^0[689][0-9]{8}$/.test(phone) && !/^0[2-7][0-9]{7}$/.test(phone)) return { error: "phone" };
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

export async function listAddresses(): Promise<AddressRecord[]> {
  const customer = await requireCustomer();
  const rows = getDb()
    .prepare("SELECT * FROM addresses WHERE customer_id = ? ORDER BY is_default DESC, id DESC")
    .all(customer.id) as AddressRow[];
  return rows.map(fromRow);
}

export async function addAddress(raw: AddressInput, makeDefault: boolean): Promise<{ ok: true; id: number } | { ok: false; error: AddressError }> {
  const checked = validate(raw);
  if ("error" in checked) return { ok: false, error: checked.error };
  const input = checked.input;

  const customer = await requireCustomer();
  const db = getDb();
  const isFirst = (db.prepare("SELECT COUNT(*) as n FROM addresses WHERE customer_id = ?").get(customer.id) as { n: number }).n === 0;

  const insertRun = db.transaction(() => {
    if (makeDefault || isFirst) {
      db.prepare("UPDATE addresses SET is_default = 0 WHERE customer_id = ?").run(customer.id);
    }
    return db
      .prepare(
        `INSERT INTO addresses (customer_id, recipient_name, phone, line1, subdistrict, district, province, postal_code, is_default)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        customer.id,
        input.recipientName.trim(),
        input.phone.trim(),
        input.line1.trim(),
        input.subdistrict.trim(),
        input.district.trim(),
        input.province.trim(),
        input.postalCode.trim(),
        makeDefault || isFirst ? 1 : 0
      );
  });

  const result = insertRun();
  return { ok: true, id: Number(result.lastInsertRowid) };
}

/**
 * Edit / delete a saved address (owner 03/11 "ที่อยู่ที่บันทึกไว้ ขอให้มีหัวข้อลบหรือแก้ไขได้"). Both are scoped to the
 * signed-in customer, like `getOwnedAddress` — an id from the form is never trusted on its own. Orders keep their own copy
 * of the address (`order_shipping_addresses`), so editing or deleting here never changes an order already placed.
 */
export async function updateAddress(addressId: number, raw: AddressInput): Promise<{ ok: true; id: number } | { ok: false; error: AddressError | "not-found" }> {
  const checked = validate(raw);
  if ("error" in checked) return { ok: false, error: checked.error };
  const input = checked.input;
  const customer = await requireCustomer();
  const result = getDb()
    .prepare(
      `UPDATE addresses SET recipient_name = ?, phone = ?, line1 = ?, subdistrict = ?, district = ?, province = ?, postal_code = ?
       WHERE id = ? AND customer_id = ?`
    )
    .run(input.recipientName.trim(), input.phone.trim(), input.line1.trim(), input.subdistrict.trim(), input.district.trim(), input.province.trim(), input.postalCode.trim(), addressId, customer.id);
  return result.changes === 1 ? { ok: true, id: addressId } : { ok: false, error: "not-found" };
}

/** Deleting the default hands the default to the newest address left, so the address step still preselects one. */
export async function deleteAddress(addressId: number): Promise<boolean> {
  const customer = await requireCustomer();
  const db = getDb();
  return db.transaction(() => {
    const row = db.prepare("SELECT is_default FROM addresses WHERE id = ? AND customer_id = ?").get(addressId, customer.id) as { is_default: number } | undefined;
    if (!row) return false;
    db.prepare("DELETE FROM addresses WHERE id = ? AND customer_id = ?").run(addressId, customer.id);
    if (row.is_default === 1) {
      db.prepare("UPDATE addresses SET is_default = 1 WHERE id = (SELECT MAX(id) FROM addresses WHERE customer_id = ?)").run(customer.id);
    }
    return true;
  })();
}

/** Fetches one address by id, scoped to the current customer — never trust an address id from a
 *  form field without checking ownership, or one customer could read/ship to another's address. */
export async function getOwnedAddress(addressId: number): Promise<AddressRecord | null> {
  const customer = await requireCustomer();
  const row = getDb()
    .prepare("SELECT * FROM addresses WHERE id = ? AND customer_id = ?")
    .get(addressId, customer.id) as AddressRow | undefined;
  return row ? fromRow(row) : null;
}
