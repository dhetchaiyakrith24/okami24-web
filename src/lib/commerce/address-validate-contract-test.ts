/**
 * Run: npx tsx src/lib/commerce/address-validate-contract-test.ts
 * The address rule every form shares (addresses.ts validateAddress — checkout, LINE orders, staff address edit), outside
 * tester's Test 2 T2-20 / T2-21, owner 11/11 "พิมพ์เองได้เหมือนเดิม" (hand typing stays):
 *   a hand-typed sub-district / district is accepted only with a letter in it ("-", ".", digits alone are refused);
 *   a real hand-typed name still goes through; a doubled province ("เชียงเชียงราย") cannot be stored; the phone is 10 digits
 *   (mobile) or 9 (landline), dashes allowed, nothing longer. Made-up names and numbers.
 */
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const req = createRequire(path.join(process.cwd(), "package.json"));
const stub = (id: string, exports: unknown) => {
  req.cache[req.resolve(id)] = { id, filename: id, loaded: true, exports } as never;
};
stub("server-only", {});
stub("next/headers", { cookies: async () => ({ get: () => undefined }), headers: async () => new Headers() });

const results: { name: string; ok: boolean; detail?: string }[] = [];
const check = (name: string, ok: boolean, detail?: unknown) => results.push({ name, ok, detail: ok ? undefined : JSON.stringify(detail) });

async function main(): Promise<void> {
  const { validateAddress } = await import(pathToFileURL(path.join(process.cwd(), "src/lib/commerce/addresses.ts")).href);
  const { placesForPostcode } = await import(pathToFileURL(path.join(process.cwd(), "src/lib/commerce/thai-postcodes.ts")).href);
  const real = placesForPostcode("57000")[0] as { subdistrict: string; district: string; province: string };
  const base = { recipientName: "ทดสอบ ระบบ", phone: "0812345678", line1: "99/1 หมู่ 2", postalCode: "57000", ...real };
  const v = (over: Record<string, string>) => validateAddress({ ...base, ...over });
  const err = (r: unknown) => (r as { error?: string }).error ?? null;

  check("the data has 57000", !!real?.province, real);
  check("a place picked from the data goes through", err(v({})) === null, v({}));
  for (const s of ["-", ".", "--", "123", " - "]) {
    check(`sub-district "${s}" refused (missing)`, err(v({ subdistrict: s })) === "missing", v({ subdistrict: s }));
    check(`district "${s}" refused (missing)`, err(v({ district: s })) === "missing", v({ district: s }));
  }
  const typed = v({ subdistrict: "บ้านทดสอบใหม่", district: "อ.ทดสอบ" }) as { input?: { subdistrict: string; district: string; province: string } };
  check("hand typing stays: a typed name the data lacks goes through as typed (owner 03/11, 11/11)", err(typed) === null && typed.input?.subdistrict === "บ้านทดสอบใหม่", typed);
  check("a Latin-letter name goes through too", err(v({ subdistrict: "Wiang" })) === null);
  const doubled = v({ province: `เชียง${real.province}` });
  check("a doubled province cannot be stored (T2-20)", err(doubled) === "postal", doubled);
  const pref = v({ province: `จ.${real.province}` }) as { input?: { province: string } };
  check("a prefixed province is stored in the data's spelling", pref.input?.province === real.province, pref);
  check("phone 20 digits refused", err(v({ phone: "08123456781234567890" })) === "phone");
  check("phone 11 digits refused", err(v({ phone: "08123456789" })) === "phone");
  check("phone with dashes goes through", err(v({ phone: "081-234-5678" })) === null);
  check("landline 9 digits goes through", err(v({ phone: "021234567" })) === null);
}

main()
  .then(() => {
    for (const r of results) console.log(`${r.ok ? "PASS" : "FAIL"}  ${r.name}${r.detail ? `  — ${r.detail}` : ""}`);
    const failed = results.filter((r) => !r.ok).length;
    console.log(`\n${results.length - failed}/${results.length} passed`);
    process.exit(failed ? 1 : 0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
