/**
 * The picture slot for a colour/flavour that has no photo of its own yet (owner, image-fix round 2026-09-28:
 * "กลิ่นไหนที่ไม่มีรูปของตัวเอง ต้องไม่โชว์รูปพอตของกลิ่นอื่นแทน"). Before this, such an option showed the
 * product card — which on many products is one specific flavour or colour (M Switch Pod's card is the Grape
 * Aloe pod), so a customer picking Mango Passion saw Grape Aloe. This panel says plainly that the photo is
 * missing (the owner's "[ยังไม่มีรูป]" rule, BSOT §21) and shows the option's swatch and name instead.
 */
export function NoOptionPhoto({ name, swatchHex, note }: { name: string; swatchHex?: string; note: string }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-2xl p-6 text-center lg:gap-5">
      {swatchHex && (
        <span
          aria-hidden
          className="h-16 w-16 rounded-full border border-surface-border lg:h-28 lg:w-28"
          style={{ backgroundColor: swatchHex, boxShadow: `0 0 80px 10px ${swatchHex}40` }}
        />
      )}
      <p className="font-display text-xl font-semibold text-foreground lg:text-3xl">{name}</p>
      <p className="text-sm text-foreground-muted lg:text-base">{note}</p>
    </div>
  );
}
