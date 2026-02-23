"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const HERO_PHOTOS = [
  { src: "/team-dogs.webp", alt: "Saved Souls Foundation team with rescued dogs at the sanctuary" },
  { src: "/founder-hug.webp", alt: "Gabriela Leonhard with a rescued dog at the sanctuary" },
  { src: "/woman-dog-wheelchair.webp", alt: "Volunteer with a rescued dog in a wheelchair at the sanctuary" },
];

const ROTATE_INTERVAL_MS = 4500;

export default function HeroPolaroidCarousel() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % HERO_PHOTOS.length);
        setIsAnimating(false);
      }, 350);
    }, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const photo = HERO_PHOTOS[index];

  return (
    <div className="flex-shrink-0 order-1 md:order-2 rotate-0 md:rotate-2">
      <div
        className={`relative bg-white p-3 pb-8 shadow-xl rounded-sm ${
          isAnimating ? "animate-polaroid-drop" : ""
        }`}
      >
        <div
          className="absolute -top-1 -left-1 w-12 h-4 rounded-sm opacity-80"
          style={{ backgroundColor: "#93c5fd" }}
          aria-hidden
        />
        <div className="relative w-64 md:w-80 aspect-[4/3] overflow-hidden">
          {HERO_PHOTOS.map((p, i) => (
            <Image
              key={p.src}
              src={p.src}
              alt={p.alt}
              width={320}
              height={240}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                i === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              sizes="(max-width: 768px) 256px, 320px"
              priority={i === 0}
              loading={i === 0 ? undefined : "lazy"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
