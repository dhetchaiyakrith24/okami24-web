/* eslint-disable */
// Recipe kept from _incoming/image-sitewide/b-edge/choke.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// Clean the rim Higgsfield's image_background_remover leaves (owner 01/10, Drag 6 brown: "รอยป่ะ ไม่คม ขอบขาว"): its
// matte keeps a 5-8 px band of the studio-grey background (alpha 0.05-0.97, background RGB) round the device, which
// reads as a white outline on the dark site. Re-keying that band by colour (defringe.js) leaves a dotted edge on
// grainy renders and eats real silver bevels, so this shrinks the matte instead, colour-blind: binary matte (alpha >=
// 128) -> gaussian blur -> threshold high, which moves a straight edge in by E px and stays smooth on curves, with a
// ~1.5 px anti-aliased ramp. Pixels inside are untouched; alpha only goes down. At the site's 840 px box E = 5 px of a
// 4800 px render is < 1 display px.
// node choke.js <in.png> <out.png> [E=5]
const sharp = require("sharp");
(async () => {
  const [inp, out, e0] = process.argv.slice(2);
  const E = +(e0 || 5), SIG = Math.max(2, E * 0.8);
  const img = sharp(inp).ensureAlpha();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const bin = Buffer.alloc(N); for (let p = 0; p < N; p++) bin[p] = data[p * 4 + 3] >= 128 ? 255 : 0;
  const bl = await sharp(bin, { raw: { width: W, height: H, channels: 1 } }).blur(SIG).extractChannel(0).raw().toBuffer();
  // erf-based shift: a straight edge blurred by SIG crosses level t at x = SIG * z(t); want z(t) = E / SIG
  const z = E / SIG, phi = (x) => 0.5 * (1 + Math.tanh(0.7978845608 * (x + 0.044715 * x ** 3)));
  const t = phi(z) * 255, lo = phi(z - 0.75 / SIG * 1.5) * 255, hi = phi(z + 0.75 / SIG * 1.5) * 255;
  let cut = 0;
  for (let p = 0; p < N; p++) {
    const a = data[p * 4 + 3]; if (!a) continue;
    const v = bl[p], k = v <= lo ? 0 : v >= hi ? 1 : (v - lo) / (hi - lo);
    const na = Math.min(a, Math.round(k * 255));
    if (na < a) { data[p * 4 + 3] = na; cut++; }
  }
  void t;
  await sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toFile(out);
  console.log(out, "E", E, "sigma", SIG, "px lowered", cut);
})();
