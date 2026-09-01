import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "OKami24",
    short_name: "OKami24",
    description: "ร้านอุปกรณ์พอดซิสเต็ม ดิสโพส และน้ำยา ของแท้ ราคาตรง บริการจริง",
    start_url: "/",
    display: "standalone",
    background_color: "#0e0e10",
    theme_color: "#0e0e10",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
