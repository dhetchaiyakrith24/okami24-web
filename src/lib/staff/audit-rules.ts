/**
 * The words "ใครทำอะไร" uses for each recorded action (src/lib/staff/audit.ts). Pure, so the contract test can check every action
 * the code records has a word here. Keys are stored in `staff_audit.action`, so a key is never renamed — add a new one instead.
 */
export const AUDIT_ACTIONS = {
  "sign-in": "เข้าระบบ",
  "sign-out": "ออกจากระบบ",
  "team-add": "เพิ่มแอดมิน",
  "team-rename": "เปลี่ยนชื่อแอดมิน",
  "team-disable": "ปิดบัญชีแอดมิน",
  "team-enable": "เปิดบัญชีแอดมินอีกครั้ง",
  "shared-password-off": "ปิดรหัสร่วม",
  "shared-password-on": "เปิดรหัสร่วม",
} as const;

export type AuditAction = keyof typeof AUDIT_ACTIONS;

export const auditLabel = (action: string): string => (AUDIT_ACTIONS as Record<string, string>)[action] ?? action;
