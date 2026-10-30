/**
 * The plain marker cookie that tells the shop pages "someone logged in to /staff on this device" (owner 30/10, the "ทีมงาน"
 * button — src/components/layout/TeamShortcut.tsx). No `server-only` here on purpose: the staff login sets it (auth.ts)
 * and the browser reads it. It carries no secret and grants nothing — /staff checks its own session cookie every time.
 */
export const TEAM_MARKER_COOKIE = "okami24_team";
