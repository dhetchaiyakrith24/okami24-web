import type { ReactNode } from "react";
import type { ImageDisplayInfo } from "@/lib/media-quality";

/**
 * Owner 22/10 ("the picture is very big when I open the product and shrinks when I pick a colour or flavour"): an
 * option photo is a square canvas with the product's long side at 84% (scripts/process-images.ts, IMAGE_SPEC), so in
 * a frame its product's long side is 84% of the frame's shorter side. A card is written differently (4:5 canvas, 94%),
 * so the card drew its product up to ~28% larger than the options and the device shrank on the first pick. This box
 * draws the card so ITS product's long side takes the same share of the frame's shorter side as the page's own option
 * photos do (`optionShare`) — sized from the card file's real product box (`productLong`, measured on the server) —
 * centred, so switching never changes the size.
 * Without a measured product box the card renders as before.
 */
const OPTION_PRODUCT_SHARE = 0.84;

/** The product's share of its option photo's canvas, as the page's own option photos have it (median) — older option
 *  files are not all at the 84% standard (some ~0.80, some ~0.92), and the card must match what this page shows.
 *  Falls back to the standard when none of them can be measured. */
export function optionShare(infos: (ImageDisplayInfo | null | undefined)[]): number | null {
  const measured = infos.filter((i): i is ImageDisplayInfo => !!i?.productLong);
  // The match assumes square option photos (the option standard). Pages whose option photos are mostly not square (the
  // IQOS Prime / ILUMA i sets are 4:5, like their card) already show card and options alike — leave them as they are.
  const square = measured.filter((i) => Math.abs(i.width / i.height - 1) < 0.02);
  if (measured.length && square.length * 2 < measured.length) return null;
  const shares = square.map((i) => i.productLong! / i.width).sort((a, b) => a - b);
  return shares.length ? shares[Math.floor(shares.length / 2)] : OPTION_PRODUCT_SHARE;
}

/** An option photo as `optionShare` should measure it: one marked `ownFloor` has its studio shadow baked in under the
 *  device, so its product is the body without that floor (`productLongBody`) — else the card is matched to device +
 *  shadow and still draws the device bigger than the options (line 1 23/10). */
export function optionPhotoInfo(info: ImageDisplayInfo | null | undefined, ownFloor?: boolean): ImageDisplayInfo | null | undefined {
  return ownFloor && info?.productLongBody ? { ...info, productLong: info.productLongBody } : info;
}

/** Height of the card's canvas as a share of the frame's shorter side, or null when it cannot be matched. */
export function optionScale(info: ImageDisplayInfo | null | undefined, share: number | null): number | null {
  return info?.productLong && share !== null ? (info.height * share) / info.productLong : null;
}

export function OptionScaledCard({ scale, aspect, children }: { scale: number; aspect: number; children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center [container-type:size]">
      <div
        className="relative flex shrink-0 items-center justify-center"
        style={{ height: `calc(min(100cqw, 100cqh) * ${scale.toFixed(4)})`, aspectRatio: aspect.toFixed(4) }}
      >
        {children}
      </div>
    </div>
  );
}
