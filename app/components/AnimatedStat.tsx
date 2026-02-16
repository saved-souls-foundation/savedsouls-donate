"use client";

import { useState, useEffect, useRef } from "react";

const ACCENT_GREEN = "#2aa348";

type AnimatedStatProps = {
  prefix?: string;
  target: number;
  from?: number;
  suffix?: string;
  duration?: number;
  startOnView?: boolean;
  format?: (n: number) => string;
};

function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

export function AnimatedStat({
  prefix = "",
  target,
  from = 0,
  suffix = "",
  duration = 2000,
  startOnView = true,
  format = (n) => Math.round(n).toString(),
}: AnimatedStatProps) {
  const [value, setValue] = useState(from);
  const [hasStarted, setHasStarted] = useState(!startOnView);
  const ref = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!startOnView) {
      setHasStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const isInView = entries[0]?.isIntersecting ?? false;
        setHasStarted(isInView);
        if (!isInView) setValue(from);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [startOnView]);

  useEffect(() => {
    if (!hasStarted) return;

    const range = target - from;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setValue(from + range * eased);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    startTimeRef.current = null;
    const id = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(id);
  }, [hasStarted, target, from, duration]);

  const displayValue = hasStarted ? format(value) : format(from);

  return (
    <p ref={ref} className="text-3xl md:text-4xl font-bold" style={{ color: ACCENT_GREEN }}>
      {prefix}
      {displayValue}
      {suffix}
    </p>
  );
}
