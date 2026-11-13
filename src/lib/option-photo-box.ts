import boxes from "@/data/option-photo-box.json";

/**
 * Where the device sits inside an option photo — [top, bottom, left, right] as shares of the canvas (0–1) + the canvas's
 * width / height. Measured from the photo's alpha by `node scripts/option-photo-box.js` into src/data/option-photo-box.json
 * (owner 13/11, checker #1446: in a desktop colour tile the slim device on its square canvas read as a ~15px sliver).
 * The product page (server) passes only ITS colours' boxes down, so the browser never gets the whole table; a photo with
 * no box keeps the plain whole-photo view.
 */
export type PhotoBox = readonly [top: number, bottom: number, left: number, right: number, aspect: number];

const TABLE = boxes as unknown as Record<string, PhotoBox>;

/** The boxes of these photos (missing ones are simply absent). */
export function photoBoxesFor(srcs: readonly (string | undefined)[]): Record<string, PhotoBox> {
  const out: Record<string, PhotoBox> = {};
  for (const s of srcs) if (s && TABLE[s]) out[s] = TABLE[s];
  return out;
}
