"use client";

import { useEffect } from "react";

export default function SmoothScrollHandler() {
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#") || href === "#") return;

      const targetId = href.slice(1);
      // Support fallback if targetId is cta, plan, or why
      const targetElement =
        document.getElementById(targetId) ||
        (targetId === "cta" ? document.getElementById("plan") : null) ||
        (targetId === "plan" ? document.getElementById("cta") : null) ||
        (targetId === "why"
          ? document.getElementById("discover") ||
            document.getElementById("story")
          : null);

      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
      } else if (targetId === "top" || targetId === "hero") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", `#${targetId}`);
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return null;
}
