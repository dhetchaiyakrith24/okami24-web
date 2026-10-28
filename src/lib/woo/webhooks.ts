import "server-only";
import { getDb } from "@/lib/db/client";
import type { WebhookInput, WebhookView } from "@/lib/woo/api";

/** The webhooks Shipnity registers through /wp-json (table woo_webhooks, migration 0020). */

interface Row {
  id: number;
  name: string;
  topic: string;
  delivery_url: string;
  secret: string;
  status: string;
  created_at: string;
  approved_at: string | null;
}

const view = (r: Row): WebhookView => ({
  id: r.id,
  name: r.name,
  topic: r.topic,
  deliveryUrl: r.delivery_url,
  status: r.status,
  createdAt: r.created_at,
});

export function listWebhooks(): WebhookView[] {
  return (getDb().prepare("SELECT * FROM woo_webhooks WHERE deleted_at IS NULL ORDER BY id").all() as Row[]).map(view);
}

export function getWebhook(id: number): WebhookView | null {
  const r = getDb().prepare("SELECT * FROM woo_webhooks WHERE id = ? AND deleted_at IS NULL").get(id) as Row | undefined;
  return r ? view(r) : null;
}

/** A second registration of the same topic + URL updates the first (a reconnect must not double every order). */
export function createWebhook(keyId: number, w: WebhookInput): WebhookView {
  const db = getDb();
  const same = db
    .prepare("SELECT * FROM woo_webhooks WHERE topic = ? AND delivery_url = ? AND deleted_at IS NULL ORDER BY id LIMIT 1")
    .get(w.topic, w.deliveryUrl) as Row | undefined;
  if (same) {
    db.prepare("UPDATE woo_webhooks SET name = ?, secret = ?, status = ? WHERE id = ?").run(w.name, w.secret, w.status, same.id);
    return getWebhook(same.id)!;
  }
  const info = db
    .prepare("INSERT INTO woo_webhooks (key_id, name, topic, delivery_url, secret, status) VALUES (?, ?, ?, ?, ?, ?)")
    .run(keyId, w.name, w.topic, w.deliveryUrl, w.secret, w.status);
  return getWebhook(Number(info.lastInsertRowid))!;
}

export function updateWebhook(id: number, patch: Partial<WebhookInput>): WebhookView | null {
  const cur = getDb().prepare("SELECT * FROM woo_webhooks WHERE id = ? AND deleted_at IS NULL").get(id) as Row | undefined;
  if (!cur) return null;
  // A new delivery URL is a new place for customer data → it needs staff approval again.
  const urlChanged = patch.deliveryUrl !== undefined && patch.deliveryUrl !== cur.delivery_url;
  getDb()
    .prepare("UPDATE woo_webhooks SET name = ?, topic = ?, delivery_url = ?, secret = ?, status = ?, approved_at = ? WHERE id = ?")
    .run(
      patch.name ?? cur.name,
      patch.topic ?? cur.topic,
      patch.deliveryUrl ?? cur.delivery_url,
      patch.secret ?? cur.secret,
      patch.status ?? cur.status,
      urlChanged ? null : cur.approved_at,
      id
    );
  return getWebhook(id);
}

export function deleteWebhook(id: number): WebhookView | null {
  const w = getWebhook(id);
  if (w) getDb().prepare("UPDATE woo_webhooks SET deleted_at = strftime('%Y-%m-%dT%H:%M:%fZ','now') WHERE id = ?").run(id);
  return w;
}

/** For /staff/shipnity: every live webhook with its approval state (never the secret). */
export function webhooksForStaff(): (WebhookView & { approvedAt: string | null })[] {
  return (getDb().prepare("SELECT * FROM woo_webhooks WHERE deleted_at IS NULL ORDER BY id").all() as Row[]).map((r) => ({
    ...view(r),
    approvedAt: r.approved_at,
  }));
}

export function setApproval(id: number, approved: boolean): void {
  getDb()
    .prepare("UPDATE woo_webhooks SET approved_at = CASE WHEN ? THEN strftime('%Y-%m-%dT%H:%M:%fZ','now') ELSE NULL END WHERE id = ? AND deleted_at IS NULL")
    .run(approved ? 1 : 0, id);
}

/** The approved, active order.created hooks — where a new order is sent (secret included, server side only). */
export function orderCreatedTargets(): { id: number; deliveryUrl: string; secret: string }[] {
  return (
    getDb()
      .prepare(
        "SELECT id, delivery_url, secret FROM woo_webhooks WHERE topic = 'order.created' AND status = 'active' AND approved_at IS NOT NULL AND deleted_at IS NULL ORDER BY id"
      )
      .all() as { id: number; delivery_url: string; secret: string }[]
  ).map((r) => ({ id: r.id, deliveryUrl: r.delivery_url, secret: r.secret }));
}
