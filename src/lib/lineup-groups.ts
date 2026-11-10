/**
 * T2-31: a product whose "all colours" picture is two images (lineupImage + lineupImage2) — which colours each image
 * shows, so the chips read "สีที่ 1–4" / "สีที่ 5–8" instead of "ทั้งหมด 1" / "ทั้งหมด 2" (tester 10/11: the chips did not
 * say what they were). The alts already state the ranges ("VOOPOO ARGUS G4, colours 1–4 of 8" / "…, colours 5–8 of 8").
 * The ranges are used only when both alts state them, they meet, and the total is the page's own colour count — the
 * chip numbers must match the colour chips beside them (SALTHUB Zero Pro's two images show 8 of its 10 colours;
 * Caliburn G4 Mini's are split by finish). Otherwise null: the chips read the numbered fallback ("ภาพรวมสี 1").
 * src/lib/lineup-groups-contract-test.ts lists which products get which.
 */
type Range = [number, number];
function parse(alt: string | undefined): [number, number, number] | null {
  const m = alt?.match(/colours (\d+)[–-](\d+) of (\d+)/);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

export function lineupGroupRanges(firstAlt: string | undefined, secondAlt: string | undefined, colourCount: number): [Range, Range] | null {
  const a = parse(firstAlt), b = parse(secondAlt);
  if (!a || !b) return null;
  const ok = a[0] === 1 && a[1] + 1 === b[0] && b[1] === b[2] && a[2] === b[2] && b[2] === colourCount;
  return ok ? [[a[0], a[1]], [b[0], b[1]]] : null;
}
