"use client";

import { useState, useRef, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import {
  ChevronDown,
  BookOpen,
  HandHeart,
  HeartHandshake,
  Megaphone,
  ShoppingBag,
  Baby,
  LayoutGrid,
  Dog,
  Cat,
  Mail,
  type LucideIcon,
} from "lucide-react";

export type NavDropdownItem = {
  href: string;
  label: string;
};

const ITEM_ICONS: Record<string, LucideIcon> = {
  "/get-involved": HandHeart,
  "/gidsen": BookOpen,
  "/volunteer": HeartHandshake,
  "/influencers": Megaphone,
  "/shop": ShoppingBag,
  "/kids": Baby,
  "/adopt": LayoutGrid,
  "/adopt?type=dog": Dog,
  "/adopt?type=cat": Cat,
  "/adopt-inquiry": Mail,
};

type NavDropdownProps = {
  label: string;
  items: NavDropdownItem[];
  buttonClassName: string;
  buttonStyle?: React.CSSProperties;
  onItemClick?: () => void;
  /** right = uitlijnen rechts (voorkomt overlap met dropdown links ervan) */
  align?: "left" | "right";
};

export default function NavDropdown({
  label,
  items,
  buttonClassName,
  buttonStyle,
  onItemClick,
  align = "left",
}: NavDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative group">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onMouseEnter={() => setOpen(true)}
        className={`flex items-center gap-1 ${buttonClassName}`}
        style={buttonStyle}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span>{label}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden />
      </button>
      {open && (
        <div
          className={`absolute top-full mt-1.5 py-1.5 min-w-[200px] rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 shadow-lg z-[120] ${align === "right" ? "right-0" : "left-0"}`}
          onMouseLeave={() => setOpen(false)}
        >
          {items.map((item) => {
            const Icon = ITEM_ICONS[item.href];
            return (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => {
                  setOpen(false);
                  onItemClick?.();
                }}
                className="nav-dropdown-item flex items-center gap-3 px-3 py-2.5 text-sm text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-700/80 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
              >
                {Icon && <Icon className="w-4 h-4 shrink-0 text-stone-400 dark:text-stone-500" aria-hidden />}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
