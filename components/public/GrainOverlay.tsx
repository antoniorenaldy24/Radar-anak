"use client";

/**
 * GrainOverlay — Subtle film-grain texture overlay.
 * 
 * Uses the SVG feTurbulence filter defined in app/layout.tsx.
 * Renders a fixed overlay across the entire viewport.
 * pointer-events: none ensures it doesn't block clicks.
 * mix-blend-mode: multiply makes it blend naturally.
 * 
 * USAGE: Place once in the public layout.
 */
export default function GrainOverlay() {
  return <div className="grain-overlay" aria-hidden="true" />;
}
