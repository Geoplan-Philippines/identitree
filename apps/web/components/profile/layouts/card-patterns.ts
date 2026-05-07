import { CSSProperties } from "react";

/** Card patterns — white-tinted, for use on dark card backgrounds */
export const CARD_PATTERNS: Record<string, CSSProperties> = {
  dots: {
    backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
    backgroundSize: "18px 18px",
  },
  grid: {
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "22px 22px",
  },
  diagonal: {
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 1px, transparent 0, transparent 50%)",
    backgroundSize: "16px 16px",
  },
  waves: {
    backgroundImage:
      "repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 2px, transparent 2px, transparent 8px)",
    backgroundSize: "24px 24px",
  },
};

/** Page patterns — dark-tinted, for use on light page backgrounds */
export const PAGE_PATTERNS: Record<string, CSSProperties> = {
  dots: {
    backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)",
    backgroundSize: "20px 20px",
  },
  grid: {
    backgroundImage:
      "linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)",
    backgroundSize: "24px 24px",
  },
  diagonal: {
    backgroundImage:
      "repeating-linear-gradient(45deg, rgba(0,0,0,0.04) 0, rgba(0,0,0,0.04) 1px, transparent 0, transparent 50%)",
    backgroundSize: "18px 18px",
  },
  waves: {
    backgroundImage:
      "repeating-linear-gradient(-45deg, rgba(0,0,0,0.035) 0px, rgba(0,0,0,0.035) 2px, transparent 2px, transparent 8px)",
    backgroundSize: "24px 24px",
  },
};

/** Returns the CSS pattern style for cards (white tint) or null */
export function getCardPattern(pattern?: string): CSSProperties | null {
  if (!pattern || pattern === "none") return null;
  return CARD_PATTERNS[pattern] ?? null;
}

/** Returns the CSS pattern style for pages (dark tint) or null */
export function getPagePattern(pattern?: string): CSSProperties | null {
  if (!pattern || pattern === "none") return null;
  return PAGE_PATTERNS[pattern] ?? null;
}
