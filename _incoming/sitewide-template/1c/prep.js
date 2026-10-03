// Batch 1c posters → public/ (run from the repo root: node _incoming/sitewide-template/1c/prep.js). UWELL's own files only
// (files.myuwell.com/uwell/product/caliburn-g4-pro*/…), Lanczos resize, no AI. Film stills = frames of UWELL's own product-page films
// (G4 Pro video/theme.mp4 · video/4.mp4 · video/7.mp4 · KOKO pc/Customize.mp4 · pc/7.mp4), taken with ffmpeg into mk/theme + mk/fr.
const sharp = require("sharp");
const fs = require("fs");
const S = "_incoming/sitewide-template/1c/mk";
const P = (slug) => `public/assets/products/${slug}`;
const webp = (img, alpha) => img.webp(alpha ? { quality: 86, alphaQuality: 100, effort: 6 } : { quality: 82, effort: 6 });
const fit = (f, w) => sharp(`${S}/${f}`).resize({ width: w, withoutEnlargement: true, kernel: "lanczos3" });
const GP = "caliburn-g4-pro", KO = "caliburn-g4-pro-koko";
(async () => {
  const jobs = [
    [webp(fit("g4pro/pc_banner.webp", 1920), false), `${P(GP)}/story-cover.webp`],
    [webp(fit("theme/t11.png", 1600), false), `${P(GP)}/story-one-tap.webp`],
    [webp(fit("fr/th-16.2.png", 1600), false), `${P(GP)}/story-themes.webp`],
    [webp(fit("fr/th-24.0.png", 1600), false), `${P(GP)}/story-settings.webp`],
    [webp(fit("fr/v7-2.9.png", 1200), false), `${P(GP)}/story-custom-mode.webp`],
    [webp(fit("fr/v4-2.6.png", 1800), false), `${P(GP)}/story-battery.webp`],
    [webp(fit("g4pro/pc_yandan.webp", 1800), true), `${P(GP)}/story-pods.webp`],
    [webp(fit("koko/pc_banner.webp", 1920), false), `${P(KO)}/story-cover.webp`],
    [webp(fit("koko/pc_p6.webp", 1360), true), `${P(KO)}/story-blind-draw.webp`],
    [webp(fit("koko/pc_p1.webp", 1584), true), `${P(KO)}/story-one-tap.webp`],
    [webp(fit("koko/pc_p3.png", 1040), true), `${P(KO)}/story-screen.webp`],
    [webp(fit("koko/pc_p2.png", 1121), true), `${P(KO)}/story-battery.webp`],
    [webp(fit("fr/kc-1.5.png", 1920), false), `${P(KO)}/story-naming.webp`],
    [webp(fit("fr/k7-1.5.png", 1200), false), `${P(KO)}/story-modes.webp`],
    [webp(fit("koko/pc_spe10-yandan.png", 1800), true), `${P(KO)}/story-pods.webp`],
  ];
  const sizes = {};
  for (const [img, out] of jobs) {
    await img.toFile(out);
    const m = await sharp(out).metadata();
    sizes[out] = [m.width, m.height, m.hasAlpha];
    console.log(out, `${m.width}x${m.height}`, m.hasAlpha ? "alpha" : "", fs.statSync(out).size);
  }
  fs.writeFileSync("_incoming/sitewide-template/1c/sizes.json", JSON.stringify(sizes, null, 1));
})();
