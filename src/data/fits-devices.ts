/**
 * T2-31 (outside tester 10/11: "หัวพอตไม่บอกว่าใช้กับเครื่องไหน") — the devices a pod head / cartridge / coil fits that the shop
 * does NOT sell, so they cannot be an edge in catalog-relationships.ts (an edge needs two catalog products). Shown as plain
 * names in the "ใช้กับเครื่อง" line under the price, after the linked devices the shop does sell (getCompatibleDevices).
 *
 * Same bar as an edge: only what the maker's own page states, read in a real browser on the date given. Nothing confirmed =
 * no row = no line (never a guess from the name). Names are the maker's model names, written exactly as the maker writes them
 * (English on every language page — THAI_STYLE layer 1). Devices only: the line reads "fits device", so a tank the maker
 * also names (UFORCE-X Tank, dotTank) stays out. Checked by src/data/fits-devices-contract-test.ts.
 *
 * Not written (11/11, researcher + Chrome): zero-cartridge · relx-ultra-pod · muro-3ml · muro-connector-20k · vazer-one-pod ·
 * coil-89 · pod-154 · nexswitch-16k-pod · relx-creator-pod-20k · nexbar-switch-15k-pod · dude-pod-3ml (no maker statement found) ·
 * coil-1 / voopoo-vinci-coil-5pack (VOOPOO states the fit for its VM and TW coils only; these pages also carry DW / TR / C1
 * options the statement does not cover) · coil-38 / coil-87 / coil-55 / coil-74 (retailers only) · coil-54 (store.nevoks.com
 * did not load).
 */
export interface FitsDevicesRow {
  /** Model names as the maker writes them. */
  names: string[];
  /** What the maker's page says, close to its words. */
  evidence: string;
  sourceUrl: string;
  /** The day the page was read (yyyy-mm-dd). */
  read: string;
}

export const FITS_DEVICES: Readonly<Record<string, FitsDevicesRow>> = {
  // VOOPOO PnP X coils: "For Drag X2/S2, Drag X3/S3, Drag 5/6, Argus Pro 2, UFORCE-X Tank" — the ones the shop sells are edges.
  "coil-92": {
    names: ["Drag S2", "Drag 5", "Argus Pro 2"],
    evidence: "PnP coils page, PnP X series: \"For Drag X2/S2, Drag X3/S3, Drag 5/6, Argus Pro 2, UFORCE-X Tank.\"",
    sourceUrl: "https://shop.voopoo.com/products/pnp-coils",
    read: "2026-11-11",
  },
  "voopoo-pnp-x-coil-5pack": {
    names: ["Drag S2", "Drag 5", "Argus Pro 2"],
    evidence: "The same PnP X 0.15Ω coil, boxed by 5 — PnP coils page, PnP X series: \"For Drag X2/S2, Drag X3/S3, Drag 5/6, Argus Pro 2, UFORCE-X Tank.\"",
    sourceUrl: "https://shop.voopoo.com/products/pnp-coils",
    read: "2026-11-11",
  },
  "coil-56": {
    names: ["Drag S2"],
    evidence: "PnP X Cartridge page (Thai store page): compatible device \"VOOPOO Drag S2/X2 Kit\" (DTL with every PnP X coil; MTL with PnP X 0.3Ω or 0.6Ω).",
    sourceUrl: "https://shop.voopoo.com/products/pnp-x-cartridge",
    read: "2026-11-11",
  },
  "coil-83": {
    names: ["Argus Pod", "Argus P1", "Argus G", "Argus Z"],
    evidence: "Argus Pod Cartridge page (Thai store page): for the Argus Pod Kit, Argus P1 Kit, Argus G Kit and Argus Z Kit.",
    sourceUrl: "https://shop.voopoo.com/products/argus-pod-cartridge",
    read: "2026-11-11",
  },
  "coil-68": {
    names: ["Drag Q"],
    evidence: "ITO-X Pod page title: \"VOOPOO ITO-X Pod 3.5ml Fit Drag Q\".",
    sourceUrl: "https://shop.voopoo.com/products/ito-x-pod-cartridge",
    read: "2026-11-11",
  },
  "coil-70": {
    names: ["dotAIO V2", "dotAIO V2 Lite", "dotAIO V3"],
    evidence: "dotCoils page, compatibility: dotAIO V2 · dotAIO V2 Lite · dotTank 25mm · dotAIO V3 Tank · dotTank Max · dotAMP · dotApollo · dotAIO V3 (dotStick Revo / Revo V1.5 / dotPod Max: not the 0.15Ω coil — left out here).",
    sourceUrl: "https://dotmod.com/products/dotcoils",
    read: "2026-11-11",
  },
};

/** The plain names for a consumable's line, minus any the linked devices already show (compared without case/spaces). */
export function fitsDeviceNames(slug: string, linkedNames: string[]): string[] {
  const key = (s: string) => s.toLowerCase().replace(/[s-]+/g, "");
  const shown = new Set(linkedNames.map(key));
  return (FITS_DEVICES[slug]?.names ?? []).filter((n) => !shown.has(key(n)));
}
