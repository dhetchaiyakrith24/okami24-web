/**
 * Hand-picked models to offer on a page the warehouse cannot fill (round popular models 07/11, owner: bring the visitor in
 * first, then point them at something like it that we have). Each entry names the closest models we carry, closest first;
 * `src/lib/similar-in-stock.ts` keeps only those a customer can buy today and fills the rest by kind of device.
 * Reasons for each pick live in the round's evidence file, not here.
 */
export const IN_STOCK_ALTERNATIVES: Record<string, string[]> = {
  "caliburn-g3": ["zero-pro", "relx-creator", "vazer-one-pod"],
  "caliburn-g3-lite": ["relx-creator", "zero-pro", "vazer-one-pod"],
  "drag-x": ["zero-pro", "next-pro-2-beyond", "relx-creator"],
  "smok-nord-5": ["zero-pro", "next-pro-2-beyond", "relx-creator"],
  "smok-rpm-5": ["next-pro-2-beyond", "zero-pro", "relx-creator"],
  "nexas-booster-16k": ["esko-bar-20k", "infy-20k", "foli-bar-15k", "m-bar-9k"],
  "relx-diva-30k": ["relx-lumi-18k", "relx-smash-go-12k", "sup-zero-22k"],
  "relx-sparta-20k": ["relx-lumi-18k", "sup-zero-22k", "relx-smash-go-12k"],
  "relx-novo-14k": ["relx-smash-go-12k", "relx-lumi-18k", "sup-zero-22k"],
  "drag-x2": ["zero-pro", "next-pro-2-beyond", "relx-creator"],
  "relx-artisan-plus": ["relx-infinity-2-plus", "relx-essential-2", "relx-creator", "vazer-one-pod"],
  "relx-ultra-kit": ["relx-essential-2", "relx-infinity-2-plus", "relx-creator", "vazer-one-pod"],
  "relx-pod": ["relx-infinity-pro-2-pod", "relx-creator-pod-20k", "relx-lumi-18k", "relx-smash-go-12k"],
  "relx-pod-pro": ["relx-infinity-pro-2-pod", "relx-creator-pod-20k", "relx-lumi-18k", "relx-smash-go-12k"],
  "relx-ultra-pod": ["relx-infinity-pro-2-pod", "relx-creator-pod-20k", "relx-lumi-18k", "relx-smash-go-12k"],
  "nexpod-15k": ["next-pro-2-beyond", "vazer-one-pod", "zero-pro"],
  "vazer-reload-15k": ["m-switch-kit", "foli-bar-15k", "esko-bar-20k", "m-bar-9k"],
  "86-bar-20k": ["esko-bar-20k", "infy-20k", "mq-bar-22k", "m-bar-9k"],
};

/** The "เทียบแท้" (lookalike) products (owner 27/10, docs/HANDOFF.md §18). Their own pages stay, but they are never a shop pick,
 *  never on the home page (its rails and the new-arrivals row), noindex and out of the sitemap — so they do not compete with
 *  the genuine model's page in search (outside test T2-08, owner "ตามแนะนำ" 10/11). */
export const LOOKALIKES: ReadonlySet<string> = new Set(["marbo-10k-clone"]);

/** BSOT §15 "Not recommended" + the one lookalike (owner 27/10, HANDOFF §18): never offered as a suggestion or a shop pick. */
export const NEVER_SUGGEST = new Set(["muro-space-15k", "marbo-10k-clone"]);

/** HANDOFF §18: the lookalike and the genuine model it copies are never linked, either way. NEVER_SUGGEST keeps the lookalike
 *  off the genuine page; this keeps the genuine model off the lookalike's page and off a cart holding it. */
export const NEVER_BESIDE: Readonly<Record<string, string>> = { "marbo-10k-clone": "m-bar-10k" };
