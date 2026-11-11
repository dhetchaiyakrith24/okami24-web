/**
 * Run: npx tsx src/lib/staff/line-order-edit-contract-test.ts
 * Adding items to a keyed LINE order before it goes to the warehouse (line-order-edit-rules.ts): when it is allowed, what
 * may change once money is in, and which slip may pay the difference. Made-up figures.
 */
import { addedUnits, checkMoney, itemsNotEditable, onlyAdds } from "./line-order-edit-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

const base = { status: "approved", channel: "line" as const, sentToWarehouse: false, hasStockIssue: false };
check("editable: paid LINE order not yet sent", itemsNotEditable(base) === null);
check("editable: waiting for the money", itemsNotEditable({ ...base, status: "awaiting_verification" }) === null);
check("not editable: a web order", itemsNotEditable({ ...base, channel: "web" }) === "not-line");
check("not editable: sent to the warehouse", itemsNotEditable({ ...base, sentToWarehouse: true }) === "sent");
check("not editable: processing (handed over by hand)", itemsNotEditable({ ...base, status: "processing" }) === "status");
check("not editable: cancelled", itemsNotEditable({ ...base, status: "cancelled" }) === "status");
check("not editable: an out-of-stock problem on it", itemsNotEditable({ ...base, hasStockIssue: true }) === "stock");

const old = [{ slug: "a", variantId: "x", quantity: 2 }];
check("only adds: raise a line", onlyAdds(old, [{ slug: "a", variantId: "x", quantity: 3 }]));
check("only adds: add a new line", onlyAdds(old, [...old, { slug: "b", variantId: null, quantity: 1 }]));
check("only adds: lowering is not", !onlyAdds(old, [{ slug: "a", variantId: "x", quantity: 1 }]));
check("only adds: swapping the option is not", !onlyAdds(old, [{ slug: "a", variantId: "y", quantity: 2 }]));
check(
  "added units: only what is new",
  JSON.stringify(addedUnits(old, [{ slug: "a", variantId: "x", quantity: 3 }, { slug: "b", variantId: null, quantity: 2 }])) ===
    JSON.stringify([{ slug: "a", variantId: "x", quantity: 1 }, { slug: "b", variantId: null, quantity: 2 }])
);

// Paid 500 (one slip), adds 150 of goods: 650 + 35 shipping = 685 → the customer transfers 185.
const paid = { status: "approved" as const, linkedSatang: 50_000, oldTotal: 500, newTotal: 685, handConfirmed: false };
check("2nd slip of exactly the difference: ok, stays paid", JSON.stringify(checkMoney({ ...paid, slipSatang: 18_500 })) === JSON.stringify({ ok: true, confirm: false }));
check("2nd slip of the whole new total refused (already paid once)", JSON.stringify(checkMoney({ ...paid, slipSatang: 68_500 })) === JSON.stringify({ ok: false, error: "slip-amount" }));
check("paid order, no slip, no tick: refused", JSON.stringify(checkMoney({ ...paid, slipSatang: null })) === JSON.stringify({ ok: false, error: "hand-confirm" }));
check("paid order, no slip, ticked: ok", checkMoney({ ...paid, slipSatang: null, handConfirmed: true }).ok);
check("same total: nothing to save", JSON.stringify(checkMoney({ ...paid, newTotal: 500, slipSatang: null })) === JSON.stringify({ ok: false, error: "no-change" }));

// Waiting, nothing linked (cash or the check was down).
const waiting = { status: "awaiting_verification" as const, linkedSatang: 0, oldTotal: 500, newTotal: 685, handConfirmed: false };
check("waiting, no slip: ok, still waiting", JSON.stringify(checkMoney({ ...waiting, slipSatang: null })) === JSON.stringify({ ok: true, confirm: false }));
check("waiting, one slip of the whole new total: confirms", JSON.stringify(checkMoney({ ...waiting, slipSatang: 68_500 })) === JSON.stringify({ ok: true, confirm: true }));
check("waiting, slip of the difference only: ok, still waiting (first payment checked by hand)", JSON.stringify(checkMoney({ ...waiting, slipSatang: 18_500 })) === JSON.stringify({ ok: true, confirm: false }));
check("waiting, slip of another amount: refused", !checkMoney({ ...waiting, slipSatang: 20_000 }).ok);
check("lowering before money is in: ok with no slip", checkMoney({ ...waiting, newTotal: 300, slipSatang: null }).ok);
check("lowering: a slip cannot pay a negative difference", !checkMoney({ ...waiting, linkedSatang: 50_000, newTotal: 300, slipSatang: 0 }).ok);

console.log(failed === 0 ? "line-order-edit contract: PASS" : `line-order-edit contract: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
