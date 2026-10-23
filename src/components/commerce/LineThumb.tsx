import Image from "next/image";
import type { LineImage } from "@/lib/commerce/line-image";

/**
 * The small product photo beside a cart / review / order line (cart UX batch A, owner 24/10: "modest size").
 * Same tile look as the product cards (object-contain on the raised surface), 64 px so the name stays the line's lead.
 * No photo = an empty tile of the same size, so the lines stay aligned.
 */
export function LineThumb({ image }: { image: LineImage | null }) {
  return (
    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-surface-border-soft bg-surface-2">
      {image && <Image src={image.src} alt={image.alt} fill sizes="64px" className="object-contain p-1" />}
    </div>
  );
}
