import "server-only";
import { getDb } from "@/lib/db/client";

/** The groups the alert bot is in (migration 0009) and which one is the order group / the slip group. */

export type GroupRole = "order" | "slip";

export interface LineGroup {
  groupId: string;
  role: GroupRole | null;
  joinedAt: string;
}

export function recordJoin(groupId: string): void {
  getDb().prepare("INSERT OR IGNORE INTO line_groups (group_id) VALUES (?)").run(groupId);
}

export function recordLeave(groupId: string): void {
  getDb().prepare("DELETE FROM line_groups WHERE group_id = ?").run(groupId);
}

export function listGroups(): LineGroup[] {
  return (
    getDb().prepare("SELECT group_id, role, joined_at FROM line_groups ORDER BY joined_at DESC").all() as {
      group_id: string;
      role: GroupRole | null;
      joined_at: string;
    }[]
  ).map((r) => ({ groupId: r.group_id, role: r.role, joinedAt: r.joined_at }));
}

export function groupForRole(role: GroupRole): string | null {
  const row = getDb().prepare("SELECT group_id FROM line_groups WHERE role = ?").get(role) as { group_id: string } | undefined;
  return row?.group_id ?? null;
}

export function roleOf(groupId: string): GroupRole | null {
  const row = getDb().prepare("SELECT role FROM line_groups WHERE group_id = ?").get(groupId) as { role: GroupRole | null } | undefined;
  return row?.role ?? null;
}

/** Give `groupId` the role (taking it away from whichever group had it), or clear its role with `null`. */
export function assignRole(groupId: string, role: GroupRole | null): boolean {
  const db = getDb();
  return db.transaction(() => {
    const exists = db.prepare("SELECT 1 FROM line_groups WHERE group_id = ?").get(groupId);
    if (!exists) return false;
    if (role) db.prepare("UPDATE line_groups SET role = NULL WHERE role = ?").run(role);
    db.prepare("UPDATE line_groups SET role = ? WHERE group_id = ?").run(role, groupId);
    return true;
  })();
}
