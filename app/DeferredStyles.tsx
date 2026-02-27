"use client";

import { useEffect } from "react";

/**
 * Laadt niet-kritieke animatie-CSS na first paint (Lighthouse). Hoofdbundle blijft blocking voor stabiele CLS.
 */
export function DeferredStyles() {
  useEffect(() => {
    import("./animations.css");
  }, []);
  return null;
}
