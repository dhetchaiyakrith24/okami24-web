import type { ReactNode } from "react";
import type { ImageDisplayInfo } from "@/lib/media-quality";

/**
 * Owner 22/10 ("the picture is very big when I open the product and shrinks when I pick a colour or flavour"): an
 * option photo is a square canvas with the product's long side at 84% (scripts/process-images.ts, IMAGE_SPEC), so in
 * a frame its product's long side is 84% of the frame's shorter side. A card is written differently (4:5 canvas, 94%),
 * so the card drew its product up to ~28% larger than the options and the device shrank on the first pick. This box
 * draws the card so ITS product's long side is also 84% of the frame's shorter side — sized from the card file's
 * real product box (`productLong`, measured on the server) — centred, so switching never changes the size.
 * Without a measured product box the card renders as before.
 */
const OPTION_PRODUCT_SHARE = 0.84;

/** Height of the card's canvas as a share of the frame's shorter side, or null when it cannot be matched. */
export function optionScale(info: ImageDisplayInfo | null | undefined): number | null {
  return info?.productLong ? (info.height * OPTION_PRODUCT_SHARE) / info.productLong : null;
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
