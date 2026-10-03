// English whoIsThisFor[0] of G4 / G4 mini / G4 Classic = the same meaning as the Thai line thai-copy wrote (CRLF kept)
const fs = require("fs"); const F = "src/data/products/uwell.ts"; let s = fs.readFileSync(F, "utf8");
const R = [["Vapers who want a screen and mode selection without stepping up to a touchscreen model.", "Vapers who want a screen and a daily choice between a hard Storm hit and a smooth Waves draw."],
  ["Vapers who want a small, simple device whose GPP pods still fit the G4 and G5.", "Vapers who like a small device with no screen to watch: pick it up and vape."],
  ["Vapers who want a metal-bodied Caliburn with no screen, where light shows the battery.", "Vapers happy to read the battery from a light instead of a screen, who want a finely made aluminium body."]];
for (const [a, b] of R) { if (s.split(a).length !== 2) throw new Error(a); s = s.replace(a, b); }
fs.writeFileSync(F, s); console.log("ok");
