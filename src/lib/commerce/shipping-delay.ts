/**
 * Temporary shipping delay (owner 06/11): the warehouse is behind, so the cart reopens with a notice the customer must accept
 * before an order exists. It ends by itself after the date below, with no deploy. To end it sooner: set the date to the past.
 * To remove it: delete this file, src/i18n/shipping-delay-copy.ts, ShippingDelayNotice.tsx and their uses.
 * Pure, no I/O: the client components import it.
 */
export const SHIPPING_DELAY_UNTIL = "2026-11-11T23:59:59+07:00";

export function shippingDelayActive(now: number = Date.now()): boolean {
  return now <= new Date(SHIPPING_DELAY_UNTIL).getTime();
}
