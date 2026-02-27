"use client";

import { useEffect, useRef } from "react";

const WIDGET_URL =
  "https://tpwgt.com/content?currency=eur&promo_id=3411&campaign_id=111&form_background_color=FFFFFF&results_background_color=FFFFFF&primary_color=4CAF50&limit=4&powered_by=true&locale=en&shmarker=706883.https%3A%2F%2Fwwwsavedsouls-foundationcom%2Fen%2Fvolunteer&trs=503044";

/**
 * Laadt het tpwgt-widget door het script binnen de container te injecteren,
 * zodat de widget hier rendert (veel widgets injecteren in script.parentNode).
 */
export default function TpwgtWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = WIDGET_URL;
    script.async = true;
    script.charset = "utf-8";
    container.appendChild(script);

    return () => {
      if (script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      id="tpwgt-volunteer-widget"
      ref={containerRef}
      className="my-4 min-h-[80px] w-full max-w-md mx-auto scale-[0.85] origin-top"
      aria-label="Donation widget"
    />
  );
}
