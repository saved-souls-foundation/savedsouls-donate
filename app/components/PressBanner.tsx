"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const ACCENT_GREEN = "#2aa348";
const DARK_GREEN = "#1e7a38";
const DOG_IMAGE = "/dog-wheelchair-small.webp";

function getBannerSvg(width: number, height: number, imageDataUrl?: string): string {
  const imageEl = imageDataUrl
    ? `<image href="${imageDataUrl}" x="850" y="80" width="300" height="240" preserveAspectRatio="xMidYMid slice" opacity="0.95"/>`
    : "";
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${ACCENT_GREEN}"/>
          <stop offset="100%" style="stop-color:${DARK_GREEN}"/>
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <rect width="1200" height="400" fill="url(#bg)"/>
      ${imageEl}
      <text x="450" y="170" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" filter="url(#shadow)">Saved Souls Foundation</text>
      <text x="450" y="220" font-family="Arial, sans-serif" font-size="22" fill="white" text-anchor="middle" opacity="0.95" filter="url(#shadow)">Where Broken Souls Learn to Love Again</text>
      <text x="450" y="260" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.9" filter="url(#shadow)">Khon Kaen, Thailand</text>
      <text x="450" y="330" font-size="72" text-anchor="middle" opacity="0.12">💚</text>
    </svg>
  `.trim();
}

function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPng(svg: string, width: number, height: number, filename: string) {
  const img = document.createElement("img");
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = ACCENT_GREEN;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/png");
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function downloadJpg(svg: string, width: number, height: number, filename: string) {
  const img = document.createElement("img");
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = ACCENT_GREEN;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, "image/jpeg", 0.95);
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

function downloadWebp(svg: string, width: number, height: number, filename: string) {
  const img = document.createElement("img");
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = ACCENT_GREEN;
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
      },
      "image/webp",
      0.92
    );
  };
  img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
}

type Props = {
  title?: string;
  subtitle?: string;
  disclaimer?: string;
};

export default function PressBanner({
  title = "Download banner",
  subtitle = "Kies een formaat voor social media, websites of presentaties.",
  disclaimer = "Gebruik niet zonder toestemming a.u.b.",
}: Props) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [imageDataUrl, setImageDataUrl] = useState<string | undefined>();

  useEffect(() => {
    fetch(DOG_IMAGE)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onloadend = () => setImageDataUrl(reader.result as string);
        reader.readAsDataURL(blob);
      })
      .catch(() => {});
  }, []);

  const handleDownload = async (
    width: number,
    height: number,
    format: "png" | "jpg" | "svg" | "webp",
    label: string
  ) => {
    setDownloading(label);
    const svg = getBannerSvg(width, height, imageDataUrl);
    const baseName = `saved-souls-banner-${width}x${height}`;
    try {
      if (format === "svg") {
        downloadSvg(svg, `${baseName}.svg`);
      } else if (format === "png") {
        downloadPng(svg, width, height, `${baseName}.png`);
      } else if (format === "webp") {
        downloadWebp(svg, width, height, `${baseName}.webp`);
      } else {
        downloadJpg(svg, width, height, `${baseName}.jpg`);
      }
    } finally {
      setTimeout(() => setDownloading(null), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-stone-800 dark:text-stone-100 mb-1">{title}</h3>
        <p className="text-base text-stone-500 dark:text-stone-400">{subtitle}</p>
      </div>

      {/* Preview - geanimeerd met hond in rolstoel */}
      <div className="rounded-xl overflow-hidden border-2 border-stone-200 dark:border-stone-700 shadow-lg aspect-[3/1] bg-stone-200 dark:bg-stone-800 animate-banner-glow relative">
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(135deg, ${ACCENT_GREEN} 0%, ${DARK_GREEN} 100%)`,
          }}
        />
        <div className="absolute inset-0 flex items-center">
          <div className="flex-1 min-w-0 flex flex-col items-center justify-center px-8 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">Saved Souls Foundation</h3>
            <p className="text-sm md:text-base text-white/95 mt-1">Where Broken Souls Learn to Love Again</p>
            <p className="text-sm md:text-base text-white/85 mt-1">Khon Kaen, Thailand</p>
            <span className="text-5xl md:text-6xl mt-2 animate-banner-heart opacity-20">💚</span>
          </div>
          <div className="w-full md:w-1/3 min-w-0 md:min-w-[200px] h-full relative flex items-center justify-center pr-4">
            <div className="relative w-full max-w-[220px] aspect-square rounded-2xl overflow-hidden border-4 border-white/30 shadow-2xl">
              <Image
                src={DOG_IMAGE}
                alt="Hond in rolstoel"
                fill
                className="object-cover"
                sizes="220px"
              />
            </div>
          </div>
        </div>
      </div>

      {disclaimer && (
        <p className="text-base text-stone-500 dark:text-stone-400 italic">
          {disclaimer}
        </p>
      )}

      {/* Download in diverse formaten: PNG, JPG, WebP, SVG */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => handleDownload(1200, 400, "png", "PNG")}
          disabled={!!downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {downloading === "PNG" ? "..." : "Download PNG"}
        </button>
        <button
          onClick={() => handleDownload(1200, 400, "jpg", "JPG")}
          disabled={!!downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {downloading === "JPG" ? "..." : "Download JPG"}
        </button>
        <button
          onClick={() => handleDownload(1200, 400, "webp", "WebP")}
          disabled={!!downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {downloading === "WebP" ? "..." : "Download WebP"}
        </button>
        <button
          onClick={() => handleDownload(1200, 400, "svg", "SVG")}
          disabled={!!downloading}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
          style={{ backgroundColor: ACCENT_GREEN }}
        >
          {downloading === "SVG" ? "..." : "Download SVG"}
        </button>
      </div>
    </div>
  );
}
