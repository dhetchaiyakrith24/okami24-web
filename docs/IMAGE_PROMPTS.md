# OKami24 — image prompts (the one home of the prompt wording for AI product photos)

The method and the pass rules = `docs/IMAGE_SPEC.md` §0 item 8 (studio re-shoot). This file holds only the WORDS sent to
the image model. Owner 07/10: keep 2–3 versions — **1 in use + at most 2 backups** — so a future change can be compared
with what worked; a version that failed or has not been used for a long time is deleted (git keeps every old one).
Each version says: what it is for · what came out · how it differs from the one before. A new version = add it on top,
mark the old "in use" as backup, delete the oldest if that makes 4. Who uses it: the image chat (Higgsfield through
Chrome, Nano Banana Pro 2K 1:1, Unlimited ON). Who edits it: any chat, in a PR like any other file.

How to fill a prompt: one product + one colour/flavour per generation, 2 renders per item. **Pick the version by the
reference photo first:** site photo was a FLAT graphic (recoloured, no real light — e.g. KOKO v2) → v2 with that photo
(`_incoming/look-pilot/prep.js` → `in-<id>.png`) · site photo was ALREADY AI-relit (e.g. Drag S3/X3 v2, 02/10 remakes —
check the map's `aiRender` / note) → v3 with the REAL maker/retailer photo (`_incoming/look-batch/prep-orig.js` →
`orig-<id>.png`), because an already-lit reference makes "keep exactly" copy its old light (Drag S3 07/10: v2 gave
mean luma 100→96, the owner failed the set as "no different"). Always test ONE colour before a full set.
`{COLOUR}` = the colour/flavour in plain words · list every logo, word and number visible on the device.

## v3 — IN USE for already-AI-relit references (07/10, Drag S3 redo — owner picked render blue-S2)

For: products whose site photo was already AI-relit. Image 1 = the real photo only, no image 2. Short identity sentence,
the rest describes the light — no "keep the reference's light/colours" lines. Came out: Drag S3 blue-S2 = the most
contrast of 9 tests (darker right side, raked leather, crisp tank highlights); owner 07/10 "สวยไปอีกแบบ ยกเว้นให้ Drag"
= accepted for Drag below the G5 bar (matte leather takes little light) — other products still need G5. S1 came out
mirrored (side panel on the left) → the "seen from slightly to the right" line was added for the set.
Differs from v2: real photo instead of the site photo · light written out, identity cut to one sentence.

```
A premium flagship studio product photograph of this exact [brand + device] - [side panel material + badge], [frame
colour] metal frame, black glass front with the round mountain logo, screen showing [numbers/words], [tank colour] tank
with the [brand] logo, black drip tip; keep every logo and printed word as in the photo. Seen from slightly to the right
exactly like image 1 - the side panel on the RIGHT, never mirrored. Dramatic directional key light from the upper left,
deep falloff into shadow across the right side of the body, crisp bright specular highlights on the metal frame and the
tank, a glossy reflection streak across the screen glass, a thin bright rim light on the right edge, rich contrast and
deep blacks. Upright, front facing the camera, on a flat, even dark charcoal grey studio backdrop (#2b2e33) with a soft
contact shadow and a faint floor reflection. Photographic, sharp, no CGI look, no text added, no props.
```
(Exact text of blue-S2 = the same without the "Seen from slightly to the right" sentence, with "navy blue leather body,
light-blue metal frame … screen showing 60W and SMART, silver tank with the VOOPOO logo". Non-Drag devices: replace the
Drag part list with that device's parts.)

## v2 — IN USE for flat-graphic references (07/10, KOKO roll-out J1)

For: every device colour photo of the image-look roll-out. Came out: KOKO 8/8 colours passed the 3-point check; two
problems fixed by the two new lines — a vignette/spotlight backdrop that the matte had to work around, and a gold that
drifted pale champagne (3 renders) until the colour line + a second reference of the right tone was added.
Differs from v1: + the flat-backdrop line · + the colour-fidelity line · pose upright and front-facing for every product.

```
Re-photograph this exact [device type] as a high-end commercial studio product photo, like an official [brand]
product shot. Same camera angle, same proportions. Keep EXACTLY: the device shape, the {COLOUR} [material] body,
[every part], the [brand] logo and every printed letter and number ([list them]). Do not add, remove or redesign any
part. Keep the {COLOUR} finish exactly as in the reference — the same hue and depth, not paler, not more saturated
(a gold stays a rich warm yellow-gold, never champagne or rose gold).
Re-light it for real: a large soft key light from the upper left, a thin bright rim light along the edges, gentle
light falloff from top to bottom, no blown-out highlights, real reflections with smooth gradients, subtle glass
reflection on any screen, realistic transparency in any clear part. The device stands upright, front facing the
camera, on a seamless dark charcoal grey studio backdrop (#2b2e33) that is perfectly flat and even from edge to edge —
no vignette, no spotlight, no gradient — with a soft realistic contact shadow under its base and a faint reflection on
the floor. Photographic, sharp focus, natural micro-texture, no CGI look, no glow, no text added, no props.
```
2nd reference (image 2), two uses — say which in the first line of the prompt:
- **pose guide (use it for every colour after the first of a product):** the product's already-passed render (Drag S3:
  `_incoming/look-pilot/B-drag-2.png`) with the lead line `Image 1 is the device to re-photograph (its colours,
  textures and every detail). Image 2 is only a guide for pose, camera angle, lighting and size in frame — copy its
  upright pose and framing exactly, but not its colour or pattern.` — Drag S3 blue/brown/green 07/10: all 6 renders
  came out upright at the same angle and size as White.
- **tone guide:** an already-passed render of the same tone, colour only (KOKO desert-gold used golden-carbon-1).

## v1 — backup (07/10, the pilot #325 — owner picked B2)

For: the pilot (KOKO Glass Blue, Drag S3 White). Came out: both passed, owner picked render B2; KOKO kept the
reference's pose; Drag S3 came out upright instead of tilted (owner OK) with the tiny EVEREST LAB mark loosely drawn.
The v2 text without its two new lines and without "upright, front facing" (the pose followed the reference).

## Per-product fill-ins (v2) — [device type] · [every part] · logos

| slug | fill-in for "Keep EXACTLY" |
|---|---|
| caliburn-g4-pro-koko | UWELL Caliburn G4 Pro KOKO pod system · the clear pod with its red ring · the G4 PRO engraving · the screen: ⚡100% · STORM · 35W · 0.4Ω · 00000 and the KOKO artwork |
| drag-s3 | VOOPOO DRAG S3 pod mod · the {COLOUR} body with its engraved pattern · black front panel · round mountain logo · screen 60W, SMART · up/down buttons · USB-C port · silver tank with the VOOPOO logo and air slot · black drip tip |
| drag-x3 | VOOPOO DRAG X3 pod mod · the {COLOUR} body and back panel · round mountain logo · colour screen with every number and icon as shown · buttons · USB-C port · tank with the VOOPOO logo · drip tip |
| vinci-s | VOOPOO VINCI S pod system · the {COLOUR} body · textured grip panel · light strip · side port · VOOPOO logo at the bottom · clear pod with its mouthpiece |
| relx-creator | RELX Creator device body · rectangular block · the {COLOUR} finish · vertical RELX logo · pixel-dot face display on the lower block · contacts on top (their colours as shown) |
| argus-g4-mini | VOOPOO ARGUS G4 mini pod system · slim body · the {COLOUR} body (its gradient exactly as in the reference) · small logo and indicator dots on the front · ARGUS lettering at the bottom · clear pod |
| zero-cartridge | SALTHUB ZERO prefilled pod cartridge · clear cartridge · the M logo inside · the coloured flavour band with "{FLAVOUR NAME AS PRINTED}" and the ZERO lettering, every letter exactly as printed · the base colour |
