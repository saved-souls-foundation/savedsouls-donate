"use client";

import { useEffect } from "react";

/**
 * Laadt hoofdbundle-CSS en animaties na first paint zodat ze niet render-blocking zijn (Lighthouse).
 * Critical CSS staat inline in de layout voor directe LCP.
 */
export function DeferredStyles() {
  useEffect(() => {
    import("./globals.css");
    import("./animations.css");
  }, []);
  return null;
}
