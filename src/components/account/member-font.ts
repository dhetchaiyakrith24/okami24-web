import { Noto_Serif_Thai } from "next/font/google";

/**
 * The member pages' heading face (owner 26/10: the welcome must feel "หรู พรีเมียม เหมือนได้เข้าบ้าน" — designer direction A).
 * A light Thai serif, loaded only by /account and /account/login (the page wraps itself in `.variable`), never site-wide.
 * The site's own display face (Barlow Condensed) has no Thai, so the old heading fell back to the visitor's system font.
 */
export const memberSerif = Noto_Serif_Thai({
  variable: "--font-member-serif",
  subsets: ["thai", "latin"],
  weight: ["300", "400"],
  display: "swap",
});
