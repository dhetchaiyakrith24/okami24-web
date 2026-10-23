import "server-only";
import { getDb } from "@/lib/db/client";
import { requireCustomer } from "./session";

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

function validate(input: AddressInput): string | null {
  if (!input.recipientName.trim()) return "Recipient name is required.";
  if (!input.phone.trim()) return "Phone is required.";
  if (!input.line1.trim()) return "Address line is required.";
  if (!input.subdistrict.trim()) return "Subdistrict is required.";
  if (!input.district.trim()) return "District is required.";
  if (!input.province.trim()) return "Province is required.";
  if (!/^[0-9]{5}$/.test(input.postalCode.trim())) return "Postal code must be 5 digits.";
  return null;
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

export async function addAddress(input: AddressInput, makeDefault: boolean): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const error = validate(input);
  if (error) return { ok: false, error };

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

/** Fetches one address by id, scoped to the current customer — never trust an address id from a
 *  form field without checking ownership, or one customer could read/ship to another's address. */
export async function getOwnedAddress(addressId: number): Promise<AddressRecord | null> {
  const customer = await requireCustomer();
  const row = getDb()
    .prepare("SELECT * FROM addresses WHERE id = ? AND customer_id = ?")
    .get(addressId, customer.id) as AddressRow | undefined;
  return row ? fromRow(row) : null;
}
