# OKami24 — image prompts (the one home of the prompt wording for AI product photos)

The method and the pass rules = `docs/IMAGE_SPEC.md` §0 item 8 (studio re-shoot). This file holds only the WORDS sent to
the image model. Owner 07/10: keep 2–3 versions — **1 in use + at most 2 backups** — so a future change can be compared
with what worked; a version that failed or has not been used for a long time is deleted (git keeps every old one).
Each version says: what it is for · what came out · how it differs from the one before. A new version = add it on top,
mark the old "in use" as backup, delete the oldest if that makes 4. Who uses it: the image chat (Higgsfield through
Chrome, Nano Banana Pro 2K 1:1, Unlimited ON). Who edits it: any chat, in a PR like any other file.

How to fill a prompt: one product + one colour/flavour per generation, 2 renders per item. Reference = the product's
current site photo flattened on #2b2e33 (`_incoming/look-pilot/prep.js` → `_incoming/look-batch/<slug>/in-<id>.png`).
`{COLOUR}` = the colour/flavour in plain words · list every logo, word and number visible on the device.

## v2 — IN USE (07/10, KOKO roll-out J1)

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
