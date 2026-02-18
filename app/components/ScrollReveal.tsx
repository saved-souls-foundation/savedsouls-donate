"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "fade";
};

export default function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const translateMap = {
    up: "translate-y-12",
    down: "-translate-y-12",
    left: "translate-x-12",
    right: "-translate-x-12",
    fade: "",
  };
  const translateVisibleMap = {
    up: "translate-y-0",
    down: "translate-y-0",
    left: "translate-x-0",
    right: "translate-x-0",
    fade: "",
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        visible
          ? `opacity-100 ${translateVisibleMap[direction]}`
          : `opacity-0 ${translateMap[direction]}`
      } ${className}`}
    >
      {children}
    </div>
  );
}
