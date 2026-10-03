// Extract visible text + image URLs from a saved maker page (node extract.js <file.html>)
const fs = require("fs");
const f = process.argv[2];
let h = fs.readFileSync(f, "utf8");
const imgs = [...new Set([...h.matchAll(/https?:\/\/files\.myuwell\.com[^"'\s)]+\.(?:webp|png|jpg|jpeg|mp4|gif)/gi)].map((m) => m[0]))];
let t = h.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h\d|li|span)>/gi, "\n").replace(/<[^>]+>/g, " ")
  .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&reg;/g, "®").replace(/&trade;/g, "™");
t = t.split("\n").map((l) => l.replace(/\s+/g, " ").trim()).filter(Boolean).join("\n");
fs.writeFileSync(f.replace(/\.html$/, ".txt"), t + "\n\n--- images ---\n" + imgs.join("\n") + "\n");
console.log(f, t.length, "chars", imgs.length, "images");
