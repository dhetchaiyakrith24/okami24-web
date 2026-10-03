// Batch 1b: G4 · G4 mini · G4 Classic → the G5 template (stage story, cover, UWELL posters, maker-verified spec rows). CRLF kept.
// node _incoming/sitewide-template/1b/edit-data.js   (posters: prep.js · sizes: sizes.json · text: story-copy.ts via edit-copy.js)
const fs = require("fs");
const F = "src/data/products/uwell.ts";
const SZ = JSON.parse(fs.readFileSync("_incoming/sitewide-template/1b/sizes.json", "utf8"));
let whole = fs.readFileSync(F, "utf8").replace(/\r\n/g, "\n");
const B = "https://files.myuwell.com/uwell/product";

function section(slug, next) {
  const a = whole.indexOf(`    slug: "${slug}",`), z = whole.indexOf(`    slug: "${next}",`);
  if (a < 0 || z < 0) throw new Error("section " + slug);
  return [a, z];
}
function edit(slug, next, fn) {
  const [a, z] = section(slug, next);
  let s = whole.slice(a, z);
  const rep = (x, y) => { if (s.split(x).length !== 2) throw new Error(`${slug} not unique: ` + x.slice(0, 90)); s = s.replace(x, y); };
  fn(rep);
  whole = whole.slice(0, a) + s + whole.slice(z);
}
const img = (slug, file, alt, url, transparent) => {
  const [w, h] = SZ[`public/assets/products/${slug}/${file}`];
  return `{ src: "/assets/products/${slug}/${file}", alt: "${alt}", sourceName: "UWELL", sourceUrl: "${url}", width: ${w}, height: ${h}${transparent ? ", transparent: true" : ""} }`;
};
const feat = (slug, url, id, title, description, subline, file, alt, transparent) => `      {
        id: "${id}",
        title: "${title}",
        description: "${description}",
        subline: "${subline}",
        image: ${img(slug, file, alt, url, transparent)},
      },`;
const row = (key, label, value, url) => `      { key: "${key}", label: "${label}", value: "${value}", sourceStatus: "verified", sourceUrl: "${url}" },`;
const story = (slug, url, coverAlt, note) => `    // Site-wide template round, batch 1b (03/10): the G5 template (docs/PRODUCT_PAGE_TEMPLATE.md) — UWELL's own page
    // (${url}) told one poster per block; text in src/i18n/story-copy.ts, article in src/data/product-articles.ts.
    // ${note} Posters: _incoming/sitewide-template/1b/prep.js.
    storyDetails: true,
    storyLayout: "stage",
    storyCover: ${img(slug, "story-cover.webp", coverAlt, url, false)},
`;

// ---------------------------------------------------------------- Caliburn G4
{
  const slug = "caliburn-g4", url = "https://www.myuwell.com/caliburn/caliburn-g4", spec = `${B}/caliburn-g4/pc/specifications.webp`;
  edit(slug, "caliburn-g4-mini", (rep) => {
    rep(`      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    colorVariants: [`, `      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
${story(slug, url, "Official UWELL banner — the Caliburn G4", "Cover = UWELL's banner pc/banner.webp. \"taste\" and \"airflow\" = stills from UWELL's own airflow films (air2 / air1.mp4).")}    colorVariants: [`);
    rep(`      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (FeCrAl meshed 0.4Ω and 0.9Ω in the box)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
    ],
    features: [
      {
        id: "power-modes",
        title: "Selectable power modes",
        description: "A colour screen exposes multiple output presets, adding control the screen-free Mini doesn't offer.",
      },
    ],`, `      // Batch 1b (03/10): the in-box pods differ by market version (UWELL's spec sheet) — "0.4Ω and 0.9Ω" was the INT kit only.
      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods, previous and upgraded; refill without removing the pod", sourceStatus: "verified", sourceUrl: "${url}" },
${row("included-pod", "Included pod", "FeCrAl meshed, by market version: INT 0.4Ω + 0.9Ω, FDA 0.6Ω + 0.9Ω (side refill); TPD & CRC 0.4Ω + 0.6Ω (top refill)", spec)}
      { key: "output", label: "Max output", value: "35W", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4/pc/specifications.webp" },
${row("flavor-tech", "Flavor system", "Pro-FOCS 4.0 with upgraded GPP pods: up to 35% longer cartridge life and 35% more flavour satisfaction (UWELL lab tests)", url)}
${row("airflow", "Airflow", "Airflow slider + reversible pod, usable together", url)}
${row("control", "Control system", "One multi-function button: 1 click screen on · 2 lock/unlock button firing · 3 adjust wattage · 4 menu · 5 on/off", `${B}/caliburn-g4/pc/significant-l.webp`)}
${row("anti-leak", "Anti-leak system", "U²: ultrasonic welding + U-shaped channel", url)}
${row("pod", "Pod capacity", "3mL (INT & FDA) / 2mL (TPD & CRC)", spec)}
${row("materials", "Materials", "PCTG, ABS, aluminium alloy ADC12", spec)}
${row("dimensions", "Dimensions", "26 × 15.65 × 114.98 mm (INT & FDA) / 111.98 mm long (TPD & CRC)", spec)}
${row("weight", "Weight", "Approx. 54.7g", spec)}
    ],
    features: [
${feat(slug, url, "taste", "Taste above everything", "UWELL built the G4 around flavour: the upgraded pods and its flavour tech work together.", "Upgraded GPP pods on PRO-FOCS 4.0.", "story-taste.webp", "Still from UWELL's Caliburn G4 film — vapour rising from the pod", false)}
${feat(slug, url, "modes", "Storm or Waves", "Storm hits fast, like a roller coaster. Waves stays smooth and steady, like the London Eye.", "Two modes, picked on a 0.85-inch colour screen.", "story-modes.webp", "Official UWELL render — three Caliburn G4s with different screen themes", true)}
${feat(slug, url, "button", "One button for everything", "Wake the screen, lock the button, set the wattage, open the menu or switch off — without a second button.", "Count the clicks.", "story-button.webp", "Official UWELL poster — the Caliburn G4 multi-functional control button", false)}
${feat(slug, url, "airflow", "Airflow your way", "Slide the airflow valve, load the pod the other way round, or combine the two.", "Three ways to set the draw.", "story-airflow.webp", "Still from UWELL's Caliburn G4 airflow film — the airflow slider", false)}
${feat(slug, url, "pods", "Takes every GPP pod", "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.", "Old GPP pods and the upgraded ones.", "story-pods.webp", "Official UWELL chart — GPP pods, top and side refill, 0.4Ω to 1.2Ω", false)}
${feat(slug, url, "anti-leak", "Every drop stays put", "Ultrasonic welding seals the pod against leaks, and a U-shaped channel improves the airflow.", "UWELL's U² technique.", "story-anti-leak.webp", "Official UWELL renders — ultrasonic welding and the U-shaped channel inside a GPP pod", false)}
    ],`);
  });
}

// ---------------------------------------------------------------- Caliburn G4 mini
{
  const slug = "caliburn-g4-mini", url = "https://www.myuwell.com/caliburn/caliburn-g4-mini", spec = `${B}/caliburn-g4-mini/pc/specifications.webp`;
  edit(slug, "caliburn-g4-classic", (rep) => {
    rep(`      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
    colorVariants: [`, `      sourceName: "OKami24 composite (from UWELL's own colour renders)",
    },
${story(slug, url, "Official UWELL banner — the Caliburn G4 mini", "Cover = UWELL's banner pc/banner.webp (white studio, in its card). \"airflow\" = a still from UWELL's own airflow film (pc/air1.mp4).")}    colorVariants: [`);
    rep(`      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods (FeCrAl meshed 0.6Ω in the box)", sourceStatus: "verified", sourceUrl: "https://files.myuwell.com/uwell/product/caliburn-g4-mini/pc/specifications.webp" },
    ],
    features: [
      {
        id: "pocketable",
        title: "Built for pocketable simplicity",
        description: "Drops the screen and advanced features from the standard G4 for a smaller, lighter shell.",
      },
    ],`, `      { key: "pod-compat", label: "Pod platform", value: "UWELL GPP pods, previous and upgraded (FeCrAl meshed 0.6Ω in the box); refill without removing the pod", sourceStatus: "verified", sourceUrl: "${url}" },
${row("output", "Max output", "35W", spec)}
${row("firing", "Firing", "Auto draw", url)}
${row("flavor-tech", "Flavor system", "Pro-FOCS 4.0 with upgraded GPP pods: up to 35% more flavour satisfaction and 35% longer cartridge life (UWELL lab tests)", url)}
${row("airflow", "Airflow", "Airflow slider + reversible pod, usable together", url)}
${row("anti-leak", "Anti-leak system", "U²: ultrasonic welding + U-shaped channel", url)}
${row("pod", "Pod capacity", "3mL (INT/FDA) / 2mL (TPD/CRC)", spec)}
${row("materials", "Materials", "PCTG, PC", spec)}
${row("dimensions", "Dimensions", "24.1 × 14 × 112.7 mm (INT/FDA) / 109.7 mm long (TPD/CRC)", spec)}
${row("weight", "Weight", "Approx. 46g", spec)}
    ],
    features: [
${feat(slug, url, "minimal", "Minimal design", "A slim, simple body that sits easily in the hand and the pocket.", "Grab it. Own it.", "story-minimal.webp", "Official UWELL photo — a hand holding the Caliburn G4 mini", false)}
${feat(slug, url, "taste", "Awesome taste", "PRO-FOCS 4.0 keeps the true taste of your e-liquid.", "Savour every puff.", "story-taste.webp", "Official UWELL illustration from the Caliburn G4 mini page — a long exhale", true)}
${feat(slug, url, "airflow", "Airflow your way", "Slide the airflow valve, load the pod the other way round, or combine the two.", "Three ways to set the draw.", "story-airflow.webp", "Still from UWELL's Caliburn G4 mini airflow film — the airflow slider", false)}
${feat(slug, url, "pods", "Takes every GPP pod", "The upgraded pods also fit the G3 series, and their mouthpiece is reshaped to sit better on the lips.", "Old GPP pods and the upgraded ones.", "story-pods.webp", "Official UWELL render — refilling the Caliburn G4 mini without taking the pod out", false)}
${feat(slug, url, "anti-leak", "Every drop stays put", "Ultrasonic welding seals the pod against leaks, and a U-shaped channel improves the airflow.", "UWELL's U² technique.", "story-anti-leak.webp", "Official UWELL renders — ultrasonic welding and the U-shaped channel inside a GPP pod", false)}
    ],`);
  });
}

// ---------------------------------------------------------------- Caliburn G4 Classic
{
  const slug = "caliburn-g4-classic", url = "https://www.myuwell.com/caliburn/caliburn-g4-classic", spec = `${B}/caliburn-g4-classic/pc/spe10.webp`;
  edit(slug, "caliburn-g3-pro", (rep) => {
    // UWELL's spec sheet (pc/spe10.webp): 1400 mAh, and the page: 14 RGB LEDs, no screen — the old 1300 / colour screen was the G4's.
    // Only the two wrong values change; no new hero stat is added (HANDOFF §17: ProductHero stats = data round).
    rep(`      batteryMah: 1300,
      screenType: "color-display",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",`, `      batteryMah: 1400,
      screenType: "led-indicator",
      drawStyle: "MTL/RDL",
      portability: "compact",
      beginnerFriendly: true,
      chargingType: "USB-C",`);
    rep(`    openOnCardPhoto: true,
    lineupImage: {`, `${story(slug, url, "Official UWELL banner — the Caliburn G4 Classic and its light", "Cover = UWELL's banner pc/banner.webp. \"craft\" = the photo half of UWELL's spec image (pc/spe10); \"rgb-light\" / \"dual-control\" = two panels of UWELL's photo strip (pc/spe9).")}    openOnCardPhoto: true,
    lineupImage: {`);
    rep(`      { key: "battery", label: "Battery", value: "Treated as equivalent to the standard G4 (1300mAh) — not independently confirmed for this specific edition", sourceStatus: "unverified" },
      { key: "variant", label: "Variant", value: "Classic-finish edition of the Caliburn G4", sourceStatus: "unverified" },
    ],
    features: [
      {
        id: "classic-finish",
        title: "Classic finish",
        description: "A distinct finish/colourway on the G4 shell rather than a separate hardware platform.",
      },
    ],`, `      // Batch 1b (03/10): every row from UWELL's G4 Classic page and spec sheet — it is its own body (aluminium, no screen, 1400 mAh),
      // not a finish of the G4; the two old unverified rows ("same as G4 1300mAh", "classic-finish edition") are gone.
${row("battery", "Battery", "1400mAh built-in", spec)}
${row("output", "Max output", "35W", spec)}
${row("screen", "Status indicator", "14 RGB LEDs, no screen; battery shown green (high) · blue (medium) · red (low)", url)}
${row("firing", "Firing", "Twin sensors (draw) or button (approx. 255gf); UWELL LAB: 300%+ auto-draw lifespan, 99.999%+ trigger accuracy", url)}
${row("control", "Control system", "5 clicks on/off · 2 clicks lock/unlock button firing · 1 click fire / show battery", url)}
${row("airflow", "Airflow", "Stepless damping airflow control + reversible pod", url)}
${row("flavor-tech", "Flavor system", "Pro-FOCS 4.0", url)}
${row("anti-leak", "Anti-leak system", "U² anti-leak", url)}
${row("pod-compat", "Pod platform", "UWELL GPP pods; refill without removing the pod; clear e-liquid window", url)}
${row("pod", "Pod capacity", "3mL (INT & FDA) / 2mL (TPD & CRC)", spec)}
${row("included-pod", "Included pod", "FeCrAl meshed, by market version: INT & FDA 0.4Ω + 0.6Ω (side refill); TPD 0.4Ω + 0.9Ω, CRC 0.4Ω + 0.6Ω (top refill)", spec)}
${row("materials", "Materials", "PC, aluminium alloy, PCTG", spec)}
${row("dimensions", "Dimensions", "29 × 16.6 × 115.9 mm (INT & FDA) / 112.8 mm long (TPD & CRC)", spec)}
${row("charging", "Charging", "USB-C, 5V/2A", spec)}
    ],
    features: [
${feat(slug, url, "craft", "Crafted the classic way", "Countless micro CNC passes leave a zirconia-smooth finish, and the one-piece winged shape sits smoothly in the hand.", "A decade of UWELL craftsmanship.", "story-craft.webp", "Official UWELL photo — the Caliburn G4 Classic in its four colours", false)}
${feat(slug, url, "twin-sensor", "Twin sensors", "Two sensors work together, so every puff is caught.", "A main sensor and a backup, in sync.", "story-twin-sensor.webp", "Official UWELL render — the Caliburn G4 Classic in green with a puff of vapour", false)}
${feat(slug, url, "rgb-light", "Light that breathes", "The base glows in shifting colours as you puff — the glow of classic e-cigarettes, with a modern twist.", "14 mini RGB LEDs.", "story-rgb-light.webp", "Official UWELL photo — the light at the base of the Caliburn G4 Classic", false)}
${feat(slug, url, "dual-control", "Two ways for air, two ways to fire", "Turn the airflow without steps or flip the pod; fire with a light press of the button or simply draw.", "Set it the way you vape.", "story-dual-control.webp", "Official UWELL photo — the airflow window of the Caliburn G4 Classic", false)}
${feat(slug, url, "pods", "Takes GPP pods", "A clear window shows how much e-liquid is left.", "Refill without taking the pod out.", "story-pods.webp", "Official UWELL render — refilling the Caliburn G4 Classic without taking the pod out", false)}
${feat(slug, url, "pro-focs", "PRO-FOCS 4.0", "Paired with U² anti-leak, so the taste stays clean and the e-liquid stays in the pod.", "UWELL's flavour technology.", "story-pro-focs.webp", "Official UWELL artwork — PRO-FOCS", false)}
    ],`);
    rep(`      "Vapers who want the G4's control layout in a classic-styled finish.",`, `      "Vapers who want a metal-bodied Caliburn with no screen, where light shows the battery.",`);
  });
}

fs.writeFileSync(F, whole.replace(/\n/g, "\r\n"));
console.log("ok");
