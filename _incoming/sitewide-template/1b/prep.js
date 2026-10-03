// Batch 1b posters → public/ (run from the repo root: node _incoming/sitewide-template/1b/prep.js). UWELL's own files only
// (files.myuwell.com/uwell/product/caliburn-g4*/…), resized with Lanczos, no AI. Two G4 / one G4 mini posters are stills from
// UWELL's own product-page films (air1/air2.mp4 — the page shows the airflow and the vapour only as film; frames in vid/).
// The U² block = UWELL's two cut-away renders side by side on UWELL's own card grey (#f6f5f8, the G4 page's poster cards), as UWELL
// itself pairs them on the G4 Classic page (pc/spe8-4) — the renders fade to white at the top, so they cannot float on the dark site.
const sharp = require("sharp");
const fs = require("fs");
const S = "_incoming/sitewide-template/1b";
const P = (slug) => `public/assets/products/${slug}`;
const webp = (img, alpha) => img.webp(alpha ? { quality: 86, alphaQuality: 100, effort: 6 } : { quality: 82, effort: 6 });
const fit = (f, w) => sharp(`${S}/${f}`).resize({ width: w, withoutEnlargement: true, kernel: "lanczos3" });

async function pair(a, b, out) {
  const A = await sharp(`${S}/${a}`).toBuffer({ resolveWithObject: true });
  const B = await sharp(`${S}/${b}`).toBuffer({ resolveWithObject: true });
  const pad = Math.round(A.info.width * 0.05), H = Math.max(A.info.height, B.info.height);
  await webp(sharp({ create: { width: A.info.width + B.info.width + pad * 3, height: H + pad, channels: 3, background: { r: 246, g: 245, b: 248 } } })
    .composite([{ input: A.data, left: pad, top: H - A.info.height }, { input: B.data, left: A.info.width + pad * 2, top: H - B.info.height }]), false).toFile(out);
}

(async () => {
  const G4 = "src/caliburn-g4", MI = "src/caliburn-g4-mini", CL = "src/caliburn-g4-classic";
  const jobs = [
    // G4
    [webp(fit(`${G4}/pc-banner.webp`, 1920), false), `${P("caliburn-g4")}/story-cover.webp`],
    [webp(fit("vid/caliburn-g4-air2-0.95.png", 900), false), `${P("caliburn-g4")}/story-taste.webp`],
    [webp(fit(`${G4}/pc-three.webp`, 908), true), `${P("caliburn-g4")}/story-modes.webp`],
    [webp(fit(`${G4}/pc-significant-l.webp`, 1803), true), `${P("caliburn-g4")}/story-button.webp`],
    [webp(fit("vid/caliburn-g4-air1-0.95.png", 900), false), `${P("caliburn-g4")}/story-airflow.webp`],
    [webp(fit(`${G4}/pc-smoke-bomb.webp`, 1800), true), `${P("caliburn-g4")}/story-pods.webp`],
    // G4 mini
    [webp(fit(`${MI}/pc-banner.webp`, 1920), false), `${P("caliburn-g4-mini")}/story-cover.webp`],
    [webp(fit(`${MI}/pc-hand.webp`, 1400), true), `${P("caliburn-g4-mini")}/story-minimal.webp`],
    [webp(fit(`${MI}/pc-drawing.webp`, 1296), true), `${P("caliburn-g4-mini")}/story-taste.webp`],
    [webp(fit("vid/mini-air1-end.png", 900), false), `${P("caliburn-g4-mini")}/story-airflow.webp`],
    [webp(fit(`${MI}/pc-oiling.webp`, 920), true), `${P("caliburn-g4-mini")}/story-pods.webp`],
    // G4 Classic
    [webp(fit(`${CL}/pc-banner.webp`, 1920), false), `${P("caliburn-g4-classic")}/story-cover.webp`],
    [webp(sharp(`${S}/${CL}/pc-spe10.webp`).extract({ left: 0, top: 0, width: 1470, height: 1059 }).trim({ threshold: 1 }), true), `${P("caliburn-g4-classic")}/story-craft.webp`],
    [webp(fit(`${CL}/pc-spe5.webp`, 2400), false), `${P("caliburn-g4-classic")}/story-twin-sensor.webp`],
    [webp(sharp(`${S}/${CL}/pc-spe9.webp`).extract({ left: 880, top: 780, width: 1720, height: 746 }).trim({ threshold: 1 }), true), `${P("caliburn-g4-classic")}/story-rgb-light.webp`],
    [webp(sharp(`${S}/${CL}/pc-spe9.webp`).extract({ left: 3500, top: 780, width: 850, height: 746 }).trim({ threshold: 1 }), true), `${P("caliburn-g4-classic")}/story-dual-control.webp`],
    [webp(fit(`${CL}/pc-spe8-2.webp`, 1162), true), `${P("caliburn-g4-classic")}/story-pods.webp`],
    [webp(fit(`${CL}/pc-spe8-3.webp`, 896), true), `${P("caliburn-g4-classic")}/story-pro-focs.webp`],
  ];
  for (const [img, out] of jobs) await img.toFile(out);
  // checker round 1 (03/10): the mini cover (40 transparent rows at the bottom) and the mini sketch (a vignette with holes) are
  // flattened on white — fix-checker.js writes those two files after this script.
  await pair(`${G4}/pc-ultrasonic-welding.webp`, `${G4}/pc-channel-design.webp`, `${P("caliburn-g4")}/story-anti-leak.webp`);
  await pair(`${MI}/pc-ultrasonic-welding.webp`, `${MI}/pc-channel-design.webp`, `${P("caliburn-g4-mini")}/story-anti-leak.webp`);
  const outs = [...jobs.map((j) => j[1]), `${P("caliburn-g4")}/story-anti-leak.webp`, `${P("caliburn-g4-mini")}/story-anti-leak.webp`];
  const sizes = {};
  for (const out of outs) { const m = await sharp(out).metadata(); sizes[out] = [m.width, m.height]; console.log(out, `${m.width}x${m.height}`, fs.statSync(out).size); }
  fs.writeFileSync(`${S}/sizes.json`, JSON.stringify(sizes, null, 1));
})();
