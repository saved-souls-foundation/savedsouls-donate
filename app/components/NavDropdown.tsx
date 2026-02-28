"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronRight, Heart, type LucideIcon } from "lucide-react";

export type NavDropdownItem = {
  href: string;
  label: string;
  description?: string;
  icon?: LucideIcon;
  /** Override icon background (default: #f0faf0 green) */
  iconBg?: string;
  /** Highlight as featured (e.g. Influencers with purple styling) */
  highlight?: boolean;
  /** Gele button-stijl + badge (e.g. Gidsen met "Informatief") */
  highlightYellow?: boolean;
  /** Badge-tekst (bijv. "Nieuw" of "Informatief") */
  badgeLabel?: string;
};

type BottomCta = {
  href: string;
  label: string;
  subtext: string;
  /** When provided, renders as button with onClick instead of Link */
  onClick?: () => void;
};

type NavDropdownProps = {
  label: string;
  items: NavDropdownItem[];
  buttonClassName: string;
  buttonStyle?: React.CSSProperties;
  onItemClick?: () => void;
  align?: "left" | "right";
  /** Layout: "adopt" = 2-col grid cards, "involved" = single column list */
  layout?: "adopt" | "involved";
  /** Optional CTA block at bottom (e.g. Donate) */
  bottomCta?: BottomCta;
  /** Controlled open (parent ensures only one dropdown open) */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

const ICON_GREEN = "#2d7a3a";
const ICON_PURPLE = "#7c3aed";
const CHEVRON_GRAY = "#d1d5db";
const ICON_BG = "#f0faf0";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);
  return isMobile;
}

export default function NavDropdown({
  label,
  items,
  buttonClassName,
  buttonStyle,
  onItemClick,
  align = "left",
  layout = "involved",
  bottomCta,
  open: controlledOpen,
  onOpenChange,
}: NavDropdownProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = useCallback(
    (value: boolean) => {
      if (isControlled) onOpenChange?.(value);
      else setInternalOpen(value);
    },
    [isControlled, onOpenChange]
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setOpen]);

  const handleTriggerMouseEnter = useCallback(() => {
    if (isMobile) return;
    setOpen(true);
  }, [isMobile, setOpen]);

  const handlePanelMouseLeave = useCallback(() => {
    if (isMobile) return;
    setOpen(false);
  }, [isMobile, setOpen]);

  const handleTriggerClick = useCallback(() => {
    if (isMobile) {
      setOpen(!open);
    } else {
      setOpen(false);
    }
  }, [isMobile, open, setOpen]);

  const handleItemClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    onItemClick?.();
    setOpen(false);
    router.push(href);
  };

  const dropdownClass = `absolute top-full mt-2 min-w-[280px] rounded-2xl bg-white p-3 shadow-xl shadow-black/10 border border-[#f0f0f0] z-[120] animate-dropdown-open origin-top ${
    align === "right" ? "right-0" : "left-0"
  }`;

  return (
    <div ref={containerRef} className="relative group">
      <button
        type="button"
        onClick={handleTriggerClick}
        onMouseEnter={handleTriggerMouseEnter}
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
          className={dropdownClass}
          onMouseLeave={handlePanelMouseLeave}
        >
          {layout === "adopt" ? (
            /* ADOPT: 2-column grid of mini-cards */
            <div className="grid grid-cols-2 gap-3">
              {items.slice(0, 2).map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.href)}
                    className="rounded-2xl border border-gray-100 shadow-sm bg-white p-4 flex flex-col items-center gap-2 hover:shadow-md hover:scale-[1.02] transition-all duration-200"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.iconBg ?? "#fff7ed" }}
                    >
                      {Icon && <Icon size={28} color={ICON_GREEN} aria-hidden />}
                    </div>
                    <span className="font-semibold text-sm text-gray-800 text-center">{item.label}</span>
                    <span className="text-xs text-gray-400 text-center">{item.description ?? ""}</span>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* INVOLVED: Single column list with icon + title + subtitle; eerste item (Doe mee → /get-involved) als overzicht benadrukt */
            <div className="flex flex-col gap-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const isHighlight = item.highlight ?? item.href === "/influencers";
                const isOverview = item.href === "/get-involved";
                const isYellow = item.highlightYellow ?? item.href === "/gidsen";
                const badge = item.badgeLabel ?? (isHighlight ? t("menuNewBadge") : isYellow ? t("menuInformativeBadge") : null);
                return (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={(e) => handleItemClick(e, item.href)}
                    className={`relative flex items-center gap-3 rounded-xl transition-colors duration-100 ${
                      isHighlight
                        ? "min-h-[64px] px-3 py-3 bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200"
                        : isYellow
                          ? "min-h-[56px] px-3 py-2.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 rounded-xl"
                          : isOverview
                            ? "px-3 py-2.5 bg-green-50/70 hover:bg-green-50 border border-green-100/80"
                            : "px-3 py-2.5 hover:bg-gray-50"
                    }`}
                  >
                    {badge && (
                      <span
                        className={`absolute top-2 right-3 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                          isHighlight ? "bg-purple-500 text-white" : isYellow ? "bg-amber-500 text-white" : ""
                        }`}
                      >
                        {badge}
                      </span>
                    )}
                    {Icon && (
                      <div
                        className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                          isHighlight ? "bg-purple-100" : isYellow ? "bg-amber-100" : "bg-green-50"
                        }`}
                      >
                        <Icon size={16} color={isHighlight ? ICON_PURPLE : isYellow ? "#b45309" : ICON_GREEN} aria-hidden />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 pr-8">
                      <div
                        className={`font-medium text-sm ${isHighlight ? "text-[#6d28d9]" : isYellow ? "text-amber-900" : "text-gray-800"}`}
                        style={isHighlight ? { fontWeight: 600 } : undefined}
                      >
                        {item.label}
                      </div>
                      {item.description && (
                        <div className={`text-xs ${isHighlight ? "text-purple-400" : isYellow ? "text-amber-700" : "text-gray-400"}`}>
                          {item.description}
                        </div>
                      )}
                    </div>
                    <ChevronRight size={14} className="text-gray-300 shrink-0" aria-hidden />
                  </Link>
                );
              })}
            </div>
          )}

          {bottomCta && (
            <div className="border-t border-gray-100 mt-2 pt-2">
              {bottomCta.onClick ? (
                <button
                  type="button"
                  onClick={() => {
                    bottomCta.onClick?.();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100/80 transition-colors duration-100 text-left"
                >
                  <Heart size={16} fill="#E53E3E" color="#E53E3E" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-red-600">{bottomCta.label}</div>
                    <div className="text-xs text-red-400">{bottomCta.subtext}</div>
                  </div>
                </button>
              ) : (
                <Link
                  href={bottomCta.href}
                  onClick={(e) => handleItemClick(e, bottomCta.href)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-50 hover:bg-red-100/80 transition-colors duration-100"
                >
                  <Heart size={16} fill="#E53E3E" color="#E53E3E" aria-hidden />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-red-600">{bottomCta.label}</div>
                    <div className="text-xs text-red-400">{bottomCta.subtext}</div>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
