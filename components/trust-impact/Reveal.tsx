"use client";

import type { CSSProperties, ReactNode } from "react";
import { useInView } from "@/hooks/useInView";

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  threshold?: number;
};

export default function Reveal({ children, className = "", style, threshold = 0.15 }: RevealProps) {
  const { ref, inView } = useInView(threshold);

  return (
    <div ref={ref} className={`ti-reveal${inView ? " ti-in" : ""} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
