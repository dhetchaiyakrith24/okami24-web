// Batch 1b images (owner 03/10: set-1 UWELL colours re-tilted to the G5 standard): every colour = the FRONT device of UWELL's own
// per-colour render (G4 pc/2–9 579x1418, G4 mini pc/1–12 523x1123 — front + back pairs with a clean alpha gap between them; the
// colour ↔ file pairs are the 28/09 ones in scripts/process-images.map.json), turned 12° in 2D, on a square canvas where the
// device fills 84 % of the height like the G5 colour files. Card = the card colour UPRIGHT on 4:5, device 94 %. No AI, no upscale.
// node _incoming/sitewide-template/1b/tilt.js  → _incoming/sitewide-template/1b/tilt/<slug>/
const sharp = require("sharp");
const fs = require("fs");
const D = "_incoming/sitewide-template/1b";
const G4 = ["seashell-white", "glacier-blue", "karst-grey", "flamingo-red", "twilight-silver", "gunmetal-grey", "sahara-gold", "polar-black"];
const MINI = ["slate-grey", "night-black", "light-silver", "bright-pink", "lake-blue", "grass-green", "coast-gold", "peafowl-emerald", "dusty-indigo", "paddy-green", "phoenix-purple", "champagne-gold"];
const SETS = [
  { slug: "caliburn-g4", card: "seashell-white", files: G4.map((id, i) => [id, `${D}/src/caliburn-g4/pc-${i + 2}.webp`]), labelCut: 0.94 },
  { slug: "caliburn-g4-mini", card: "slate-grey", files: MINI.map((id, i) => [id, `${D}/src/caliburn-g4-mini/pc-${i + 1}.webp`]), labelCut: 1 },
];
const webp = (img) => img.webp({ quality: 88, alphaQuality: 100, effort: 6 });
const clear = { r: 0, g: 0, b: 0, alpha: 0 };
(async () => {
  for (const set of SETS) {
    fs.mkdirSync(`${D}/tilt/${set.slug}`, { recursive: true });
    for (const [id, file] of set.files) {
      const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      const H = Math.floor(info.height * set.labelCut);
      // front device = columns from the left up to the first empty column (the alpha gap before the back device)
      let right = 0, seen = false;
      for (let x = 0; x < info.width; x++) {
        let n = 0; for (let y = 0; y < H; y++) if (data[(y * info.width + x) * 4 + 3] > 8) n++;
        if (n > 0) seen = true; else if (seen) { right = x; break; }
      }
      if (!right || right > info.width * 0.6) throw new Error(`${set.slug} ${id}: no gap (${right})`);
      const up = await sharp(file).extract({ left: 0, top: 0, width: right, height: H }).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
      const rot = await sharp(up.data).rotate(12, { background: clear }).png().toBuffer();
      const rt = await sharp(rot).trim({ threshold: 1 }).png().toBuffer({ resolveWithObject: true });
      const S = Math.round(rt.info.height / 0.84);
      await webp(sharp({ create: { width: S, height: S, channels: 4, background: clear } })
        .composite([{ input: rt.data, left: Math.round((S - rt.info.width) / 2), top: Math.round((S - rt.info.height) / 2) }]))
        .toFile(`${D}/tilt/${set.slug}/variant-${id}-v2.webp`);
      if (id === set.card) {
        const CH = Math.round(up.info.height / 0.94), CW = Math.round(CH * 0.8);
        await webp(sharp({ create: { width: CW, height: CH, channels: 4, background: clear } })
          .composite([{ input: up.data, left: Math.round((CW - up.info.width) / 2), top: Math.round((CH - up.info.height) / 2) }]))
          .toFile(`${D}/tilt/${set.slug}/card-v2.webp`);
        console.log(set.slug, "card", `${CW}x${CH}`);
      }
      console.log(set.slug, id, `front ${up.info.width}x${up.info.height}`, `canvas ${S}`);
    }
  }
})();
