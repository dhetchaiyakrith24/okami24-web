/**
 * The checkout's double-submit key (`placeOrder`) — the review page mints one `crypto.randomUUID()` per visit. Checker note
 * (#811, fixed N6 26/10): any string used to be accepted, so an empty or guessable key would be SHARED by every customer
 * who sent it, and a replay of a shared key answers with the order it first created. A key must therefore look like a
 * minted one; `placeOrder` also only replays an order that belongs to the same customer.
 */
const KEY = /^[A-Za-z0-9_-]{16,128}$/;

export function isIdempotencyKey(key: unknown): key is string {
  return typeof key === "string" && KEY.test(key);
}
