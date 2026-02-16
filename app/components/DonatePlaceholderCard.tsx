"use client";

import { useState } from "react";

function PlaceholderHeart({
  delay,
  top,
  size,
  duration,
}: {
  delay: number;
  top: string;
  size: number;
  duration: number;
}) {
  return (
    <span
      className="absolute animate-placeholder-heart drop-shadow-[0_1px_3px_rgba(0,0,0,0.3)] pointer-events-none"
      style={{
        top,
        left: "100%",
        fontSize: size,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      💚
    </span>
  );
}

export default function DonatePlaceholderCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-lg transition-all duration-300 ${className} ${isHovered ? "!bg-stone-200/90 dark:!bg-stone-600/90" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hearts - only visible on hover, bounded by overflow-hidden */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{ opacity: isHovered ? 1 : 0 }}
      >
        <PlaceholderHeart delay={0} top="10%" size={22} duration={3} />
        <PlaceholderHeart delay={0.5} top="35%" size={28} duration={3.5} />
        <PlaceholderHeart delay={1} top="60%" size={20} duration={3.2} />
        <PlaceholderHeart delay={1.5} top="85%" size={24} duration={3.8} />
        <PlaceholderHeart delay={2} top="20%" size={18} duration={3.3} />
        <PlaceholderHeart delay={2.5} top="50%" size={26} duration={3.6} />
        <PlaceholderHeart delay={3} top="75%" size={20} duration={3.4} />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
