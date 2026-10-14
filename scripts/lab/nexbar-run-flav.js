/* eslint-disable */
// Recipe kept from _incoming/nexbar-clear/run-flav.js (copied 2026-10-15, housekeeping) — see .claude/LESSONS.md for when it
// helped. Input/output paths inside still name that round's folder (unreferenced folders move to
// C:\Users\dhetc\OKami24-archive\_incoming\) — point them at your own files before running.
// nexBar CLEAR 18K flavour photos: Higgsfield nano_banana_pro 2k 1:1 with reference 1 = our passed front card
// (out/card-front.png, empty tank) and reference 2 = the shop poster of that flavour (src/<file>.jpg, pod789.com).
// The model changes ONLY the e-liquid colour in the tank and the small flavour label; props in the poster are
// ignored — a silhouette check against the card (scripts/ai-fidelity-sheet.js) catches anything added.
// usage (repo root): node _incoming/nexbar-clear/run-flav.js <file>=<LABEL LINE 1>[|<LINE 2>] ...
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const HF = "C:/Users/dhetc/AppData/Roaming/npm/node_modules/@higgsfield/cli/bin/higgsfield.js";
const R = "_incoming/nexbar-clear";
fs.mkdirSync(`${R}/flav-out`, { recursive: true });
for (const pair of process.argv.slice(2)) {
  const [file, label, note] = pair.split("=");
  const lines = label.split("|");
  const labelText = lines.map((l) => `"${l}"`).join(" on one line and ") + (lines.length > 1 ? " on the next line" : "");
  const prompt = `Reference 1 is the exact product and camera: the "nexBar CLEAR 18K" disposable vape, straight front view, on flat light grey. Keep EVERYTHING of reference 1 identical — the same rounded body, the same clear mouthpiece, the same metal centre tube, the same black lower band with its subtle pattern, the same white "nexBar", "CLEAR" and "18K" lettering, the same size and position in the frame, the same light.
Change ONLY two things, copied from the device in reference 2:
1. Fill the clear upper tank with e-liquid of exactly the same colour and tint as the liquid in the device of reference 2 (filled up to the same level, with the same fine bubbles along the top of the liquid), seen through the clear plastic around the metal tube.${note ? " " + note : ""}
2. Print the small flavour name on the black band directly under "CLEAR", in the same small caps font and the same colour as in reference 2: ${labelText}. Spell it exactly like that, nothing else.
Ignore everything else in reference 2: no text, no fruit, no ice, no leaves, no drops, no props, no background from it.
Background: the WHOLE image is one plain flat light grey (#E9E9EC) from edge to edge — no floor, no shadow, no gradient, so it can be cut out.
Framing: square image, product centred, the whole device visible, filling about 85% of the height.`;
  const key = file.replace(/\.jpg$/, "");
  fs.writeFileSync(`${R}/flav-out/prompt-${key}.txt`, prompt);
  try {
    const r = execFileSync(process.execPath, [HF, "generate", "create", "nano_banana_pro", "--prompt", prompt,
      "--image", `${R}/out/card-front.png`, "--image", fs.existsSync(`${R}/refs/flav/dev-${file.replace(/.jpg$/, "")}.png`) ? `${R}/refs/flav/dev-${file.replace(/.jpg$/, "")}.png` : `${R}/src/${file}`, "--resolution", "2k", "--aspect_ratio", "1:1", "--wait", "--json"],
      { encoding: "utf8", maxBuffer: 1 << 26 });
    fs.writeFileSync(`${R}/flav-out/job-${key}.json`, r);
    const j0 = JSON.parse(r); const j = Array.isArray(j0) ? j0[0] : j0;
    const png = `${R}/flav-out/${key}.png`;
    execFileSync("curl", ["-s", "-o", png, j.result_url]);
    execFileSync(process.execPath, ["scripts/flatcut.js", png, `${R}/flav-out/${key}-cut.png`]);
    console.log(new Date().toISOString(), key, "done");
  } catch (e) {
    console.log(new Date().toISOString(), key, "FAILED", String(e.message).slice(0, 300));
  }
}
