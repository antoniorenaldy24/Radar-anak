/**
 * Animation tokens for Website Publik — Awwwards-Level Craft.
 * 
 * Semua easing dan duration digunakan konsisten di seluruh halaman.
 * Jangan hardcode easing string di component — selalu import dari sini.
 */

export const MOTION_EASE = {
  // Entrance utama — hero headline, section headings
  confident: "expo.out",
  confidentBezier: "cubic-bezier(0.16, 1, 0.3, 1)",

  // Snap reveals — card entrances, badge pop-ins
  snap: "power4.out",
  snapBezier: "cubic-bezier(0.25, 1, 0.5, 1)",

  // Gentle loops — floating stickers, background animations
  gentle: "sine.inOut",
  gentleBezier: "cubic-bezier(0.37, 0, 0.63, 1)",

  // Magnetic button snapback — elastic bounce
  elastic: "elastic.out(1, 0.3)",

  // Kinetic text entrance — dramatic character reveals
  dramatic: "expo.out",
  dramaticBezier: "cubic-bezier(0.16, 1, 0.3, 1)",

  // Scroll-scrubbed animations — linear (scroll controls speed)
  scrub: "none",
};

export const MOTION_DURATION = {
  micro: 0.1,     // cursor, hover state transitions
  fast: 0.15,     // micro-interactions
  base: 0.4,      // standard reveals
  slow: 0.8,      // signature moments
  dramatic: 1.2,  // hero headline, major reveals
  epic: 1.6,      // page-level transitions
};

/** Stagger presets for consistent rhythm */
export const MOTION_STAGGER = {
  char: 0.035,    // character-by-character
  word: 0.06,     // word-by-word
  line: 0.12,     // line-by-line
  card: 0.15,     // card grid entrance
  fast: 0.05,     // rapid sequential reveals
};
