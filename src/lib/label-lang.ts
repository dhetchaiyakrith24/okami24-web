// Round 30.4ค batch 8 (LAUNCH_AUDIT 36, owner 2026-09-15).
//
// globals.css gives every `.label-mono` the Thai treatment — sans face, no tracking, no uppercase,
// weight 500 — while the visitor reads Thai (`html:lang(th) .label-mono:not(:lang(en))`). A label
// whose text carries no Thai at all — a brand mark ("UWELL"), a category name, a spec stat
// ("1600mAh"), the "TH" switcher — is not the problem that rule fixes, and should keep the
// mono/tracked/uppercase look a Thai visitor already sees today. Marking it lang="en" opts it out
// (and is the truthful language tag for it). Components whose label text can be either script
// (a stat that is "10,000 พัฟ" in Thai but "1600mAh" for every locale) decide at render time.
const THAI = /\p{Script=Thai}/u;

/** `"en"` when the text has no Thai in it, otherwise `undefined` (inherits the page language). */
export function labelLang(text: string | number | null | undefined): "en" | undefined {
  return text != null && String(text).trim() !== "" && !THAI.test(String(text)) ? "en" : undefined;
}
