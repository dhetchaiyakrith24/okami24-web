"use client";

import { useEffect } from "react";

/**
 * Look trial switch (owner 09/11 21:30 "ขอ mock-up สี / หน้าตาเว็บ ให้ลองปรับ") — DRAFT ONLY, never meant to ship as is.
 * `?look=a|b|c` on any page sets <html data-look="…"> for this browser tab (sessionStorage, so it follows the visitor
 * from page to page); `?look=0` (or any other value) clears it. With no attribute the site is exactly today's look —
 * the overrides in src/app/looks.css match only `html[data-look=…]`. Once the owner picks a direction, its values move
 * into :root in globals.css and this file and looks.css are deleted. Renders nothing.
 */
const LOOKS = ["a", "b", "c"];
const KEY = "okami24-look";

export function LookSwitch() {
  useEffect(() => {
    const root = document.documentElement;
    try {
      const asked = new URLSearchParams(window.location.search).get("look");
      if (asked !== null) {
        if (LOOKS.includes(asked)) sessionStorage.setItem(KEY, asked);
        else sessionStorage.removeItem(KEY);
      }
      const look = sessionStorage.getItem(KEY);
      if (look && LOOKS.includes(look)) root.dataset.look = look;
      else delete root.dataset.look;
    } catch {
      // Storage blocked (private mode): the URL alone still decides this page.
      const asked = new URLSearchParams(window.location.search).get("look");
      if (asked && LOOKS.includes(asked)) root.dataset.look = asked;
    }
  }, []);
  return null;
}
