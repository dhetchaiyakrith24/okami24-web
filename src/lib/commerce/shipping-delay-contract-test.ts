import { shippingDelayActive, SHIPPING_DELAY_UNTIL } from "./shipping-delay";

// Temporary notice (owner 06/11): moved to 11–13/11 (owner 08/11): on through Friday 13/11 in Thai time, off by itself after.
let failed = 0;
const check = (name: string, ok: boolean) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
};
check("active on Friday 13/11 at 23:59 Thai time", shippingDelayActive(new Date("2026-11-13T23:59:00+07:00").getTime()));
check("off on Saturday 14/11 at 00:01 Thai time", !shippingDelayActive(new Date("2026-11-14T00:01:00+07:00").getTime()));
check("the end date carries the Thai offset", SHIPPING_DELAY_UNTIL.endsWith("+07:00"));
if (failed) process.exit(1);
console.log("All checks passed.");
