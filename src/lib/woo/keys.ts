import "server-only";
import crypto from "node:crypto";
import { getDb } from "@/lib/db/client";
import { parseCredentials } from "@/lib/woo/credentials";

/**
 * WooCommerce-style key pairs for the warehouse's Shipnity (Shipnity link step 1, owner 27/10). Same shape as the keys
 * WooCommerce makes under Settings → Advanced → REST API — `ck_` + 40 hex and `cs_` + 40 hex — because Shipnity's
 * "เชื่อมต่อเว็บไซต์" form asks for exactly "Url · cs · ck" (blog.shipnity.com, WooCommerce connection guide).
 *
 * Only sha256 hashes are stored; the pair is returned once, by `createKey`, for staff to copy, and never again. A revoked
 * key fails at once. There is no environment variable: the key lives in the database on the data disk, made and revoked on
 * /staff/shipnity.
 */

const sha256 = (s: string) => crypto.createHash("sha256").update(s, "utf8").digest("hex");

export interface NewKey {
  id: number;
  consumerKey: string;
  consumerSecret: string;
}

export function createKey(description: string): NewKey {
  const consumerKey = `ck_${crypto.randomBytes(20).toString("hex")}`;
  const consumerSecret = `cs_${crypto.randomBytes(20).toString("hex")}`;
  const info = getDb()
    .prepare("INSERT INTO woo_api_keys (description, key_hash, key_last7, secret_hash) VALUES (?, ?, ?, ?)")
    .run(description.trim().slice(0, 80) || "Shipnity", sha256(consumerKey), consumerKey.slice(-7), sha256(consumerSecret));
  return { id: Number(info.lastInsertRowid), consumerKey, consumerSecret };
}

export function revokeKey(id: number): void {
  getDb().prepare("UPDATE woo_api_keys SET revoked_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ? AND revoked_at IS NULL").run(id);
}

export interface KeyRow {
  id: number;
  description: string;
  key_last7: string;
  created_at: string;
  last_used_at: string | null;
  revoked_at: string | null;
}

export function listKeys(): KeyRow[] {
  return getDb()
    .prepare("SELECT id, description, key_last7, created_at, last_used_at, revoked_at FROM woo_api_keys ORDER BY id DESC")
    .all() as KeyRow[];
}

/** The key id a request is signed with, or null. Checks the secret with a constant-time compare of the two hashes. */
export function authenticate(authorization: string | null, query: URLSearchParams): number | null {
  const creds = parseCredentials(authorization, query);
  if (!creds) return null;
  const db = getDb();
  const row = db
    .prepare("SELECT id, secret_hash FROM woo_api_keys WHERE key_hash = ? AND revoked_at IS NULL")
    .get(sha256(creds.key)) as { id: number; secret_hash: string } | undefined;
  if (!row) return null;
  const a = Buffer.from(sha256(creds.secret), "hex");
  const b = Buffer.from(row.secret_hash, "hex");
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  db.prepare("UPDATE woo_api_keys SET last_used_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(row.id);
  return row.id;
}
