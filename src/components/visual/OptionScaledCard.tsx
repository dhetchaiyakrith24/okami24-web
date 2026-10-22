import type { ReactNode } from "react";
import type { ImageDisplayInfo } from "@/lib/media-quality";

/**
 * Owner 22/10 ("the picture is very big when I open the product and shrinks when I pick a colour or flavour"): a card
 * photo is written on a 4:5 canvas with the product at 94% of its height, an option photo on a square canvas at 84%
 * (scripts/process-images.ts, IMAGE_SPEC). In the same product-page frame the card therefore drew its product
 * ~11% (square or 4:3 frame) to ~28% (the 4:5 frame) taller than every option photo, so the device shrank on the
 * first pick. This box draws the card at the height where its product is exactly as tall as a square option
 * photo's in the same frame — 0.84 / 0.94 of the frame's shorter side, centred — so switching never changes the size.
 * Only for a standard card (4:5 file); anything else renders as before.
 */
const CARD_TO_OPTION_SCALE = 0.84 / 0.94;

export function isStandardCard(info: ImageDisplayInfo | null | undefined): boolean {
  return !!info && Math.abs(info.width / info.height - 0.8) < 0.02;
}

export function OptionScaledCard({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full w-full items-center justify-center [container-type:size]">
      <div
        className="relative flex items-center justify-center"
        style={{ height: `calc(min(100cqw, 100cqh) * ${CARD_TO_OPTION_SCALE})`, aspectRatio: "4 / 5" }}
      >
        {children}
      </div>
    </div>
  );
}
