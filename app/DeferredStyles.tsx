"use client";

import { useEffect } from "react";

/**
 * Laadt niet-kritieke animatie-CSS na first paint om render-blocking te verminderen (Lighthouse).
 */
export function DeferredStyles() {
  useEffect(() => {
    import("./animations.css");
  }, []);
  return null;
}
