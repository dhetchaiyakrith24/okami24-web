/**
 * Run: npx tsx src/lib/commerce/shop-switches-contract-test.ts
 * The owner's switches: a bad file never closes the shop, and a closed site keeps what must stay up.
 */
import fs from "node:fs";
import path from "node:path";
import { ALL_OPEN, hiddenCardsCss, hiddenProductOf, isSlug, parseSwitches, staysOpenWhileClosed } from "./shop-switches-rules";

let failed = 0;
function check(name: string, ok: boolean): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}`);
  if (!ok) failed++;
}

check("no file reads as open", JSON.stringify(parseSwitches(null)) === JSON.stringify(ALL_OPEN));
check("auto-push to the warehouse is off unless the file says exactly true", ALL_OPEN.autoToWarehouse === false && parseSwitches('{"autoToWarehouse":"yes"}').autoToWarehouse === false && parseSwitches('{"autoToWarehouse":true}').autoToWarehouse === true);
check("a broken file reads as open", !parseSwitches("{oops").siteClosed && !parseSwitches("null").cartOff && !parseSwitches("[1]").siteClosed);
check("only a real true closes anything", !parseSwitches('{"siteClosed":"true","cartOff":1}').siteClosed && !parseSwitches('{"cartOff":1}').cartOff);
check("real values read back", parseSwitches('{"siteClosed":true,"cartOff":true,"hidden":["a-1"]}').siteClosed && parseSwitches('{"hidden":["a-1","a-1"]}').hidden.length === 1);
check("a slug that could break out of CSS is dropped", parseSwitches(JSON.stringify({ hidden: ['x"]{}', "ok-1", 7] })).hidden.join() === "ok-1");
check("slugs are lower case words and dashes", isSlug("caliburn-g5") && !isSlug("../x") && !isSlug("A") && !isSlug(""));

check("order pages stay open while closed", staysOpenWhileClosed("/orders/OK-1") && staysOpenWhileClosed("/orders"));
check("sign-in stays open while closed", staysOpenWhileClosed("/account/login"));
check("shop pages do not", !staysOpenWhileClosed("/") && !staysOpenWhileClosed("/products") && !staysOpenWhileClosed("/ordersx") && !staysOpenWhileClosed("/cart"));

check("a hidden product page is found", hiddenProductOf("/products/x-1", ["x-1"]) === "x-1" && hiddenProductOf("/products/x-1/", ["x-1"]) === "x-1");
check("an encoded or upper-case address is the same product", hiddenProductOf("/products/%61-1", ["a-1"]) === "a-1" && hiddenProductOf("/products/A-1", ["a-1"]) === "a-1");
check("a broken escape is no product", hiddenProductOf("/products/%E0%A4%A", ["a-1"]) === null);
check("other pages are not", hiddenProductOf("/products/y", ["x-1"]) === null && hiddenProductOf("/products", ["x-1"]) === null && hiddenProductOf("/brands/x-1", ["x-1"]) === null);

check("no hidden products = no rule", hiddenCardsCss([]) === "");
check("the rule names each card and its list item", hiddenCardsCss(["a-1"]).includes('[data-card-slug="a-1"]') && hiddenCardsCss(["a-1"]).includes("li:has("));
check("a bad slug never reaches the rule", hiddenCardsCss(['x"]{}']) === "");

const proxy = fs.readFileSync(path.resolve(process.cwd(), "src/proxy.ts"), "utf8");
const matcher = /matcher:\s*\[([\s\S]*?)\]/.exec(proxy)?.[1] ?? "";
check("the proxy leaves /staff, /api, /wp-json and files alone", matcher.includes("api/") && matcher.includes("wp-json") && matcher.includes("staff") && matcher.includes("_next/"));

console.log(failed === 0 ? "shop switches: PASS" : `shop switches: FAIL (${failed})`);
process.exit(failed === 0 ? 0 : 1);
