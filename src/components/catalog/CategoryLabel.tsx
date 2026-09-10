import { Fragment } from "react";

/**
 * Round 30.3ข (designer finding, 2026-09-11): a category label of the form "English / ไทย" is one
 * string (`category.labelTh`, also the page <title>), and the browser broke the Thai half by its
 * own dictionary — "Disposable / พอตใช้แล้ว⏎ทิ้ง", "…คอยล์และอุปกรณ์⏎เสริม" — leaving a lone word on
 * the last line of a phone-width H1. This renders the same string with the Thai half kept whole:
 * the only break opportunity inside it is after the conjunction "และ", so the worst case is
 * "Coils & Accessories /⏎คอยล์และ⏎อุปกรณ์เสริม" instead of an orphaned "เสริม". A label without
 * " / " (English-only, e.g. the Sticks category while its Thai word is pending) renders as is.
 * Inline spans and <wbr> add no width, so a label that fits on one line (every desktop case)
 * renders exactly as before.
 *
 * The "/" is glued to the English half with a no-break space (designer, 2026-09-11): on a narrow
 * phone "Heated Tobacco Devices /" ends 6px short of the edge, and a plain space there would let
 * the slash drop down to lead the Thai line. Same width as a space — nothing moves.
 */
const NBSP = " ";

export function CategoryLabel({ label }: { label: string }) {
  const at = label.indexOf(" / ");
  if (at < 0) return <>{label}</>;
  const en = label.slice(0, at);
  const th = label.slice(at + 3);
  const segments = th.split(/(?<=และ)/u);
  return (
    <>
      {en}
      {NBSP}/{" "}
      {segments.map((seg, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          <span className="whitespace-nowrap">{seg}</span>
        </Fragment>
      ))}
    </>
  );
}
