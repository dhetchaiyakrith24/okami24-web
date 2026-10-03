// §16 after the owner's answers to the batch 1c report (03/10 cloud chat) — chat moves to the computer.
const fs = require("fs");
const f = "docs/HANDOFF.md";
let s = fs.readFileSync(f, "utf8");
const cut = (from, to, text) => {
  const a = s.indexOf(from), b = s.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error("anchor: " + from.slice(0, 50));
  s = s.slice(0, a) + text + s.slice(b);
};
// item 3: NEXT
cut("  NEXT: either 1c-colours", "  G3 Pro + G3 Pro KOKO. Method that worked", [
  "  NEXT (owner 03/10, on the computer — chat moved there): in this order, each its own PR:",
  "   (a) copy fix, tier A fast path: \"ตบคอ\" (2 Thai strings in src/i18n/story-copy.ts, G4 Pro custom-mode + KOKO modes) → \"แรงถึงคอ\"",
  "       (owner: the only word that fails — he did not understand it; THAI_STYLE ก้อน 1c line).",
  "   (b) G4 mini all-colours image too small → make the devices bigger (owner: \"ภาพรวมเล็กไป ขยายใหญ่หน่อย\"; G4 mini otherwise passed).",
  "   (c) 1c-colours: G4 Pro card upright 4:5 + 8 colours tilted 12° (owner: \"ทำได้\" — Higgsfield allowed, IMAGE_SPEC §0 item 7).",
  "   (d) then batch 1d G3 Pro + G3 Pro KOKO — vary the stage arrangement a little between pages (owner 03/10, template §1 row 7).",
  "",
].join("\n"));
s = s.replace("  NEXT (owner 03/10, on the computer — chat moved there): in this order, each its own PR:\n", "  NEXT (owner 03/10, on the computer — chat moved there): in this order, each its own PR:\n");
s = s.replace("\n  G3 Pro + G3 Pro KOKO. Method that worked (1b+1c):", "\n  Method that worked (1b+1c):");
// item 4: (42) (43) (44)
cut("  (42) G4 page APPROVED", "  (39) look at the Drag S3", [
  "  (42)+(43) answered 03/10 → work items NEXT (a)(b)(d) above; G4, G4 Classic approved by the owner, G4 mini = approved except (b);",
  "       batch 1c words locked (THAI_STYLE ก้อน 1c) except \"ตบคอ\". Still to look at on live: G4 Pro + G4 Pro KOKO pages (1c) as a whole.",
  "",
].join("\n"));
s = s.replace("  Answered 03/10 (do not ask again): G5 repeats = A keep",
  "  Answered 03/10 (do not ask again): \"ultra-shatterproof\" stays OFF both G4 Pro pages (owner: Friday decides → off; UWELL's posters\n  still show it) · G5 repeats = A keep");
fs.writeFileSync(f, s);
console.log("s16 edited", Buffer.byteLength(s.slice(s.indexOf("## 16"), s.indexOf("## 17"))));
