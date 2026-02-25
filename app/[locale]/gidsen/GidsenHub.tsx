"use client";

import { useState, useMemo } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  HelpCircle,
  Heart,
  ClipboardList,
  Brain,
  Home,
  Star,
  Cat,
  MapPin,
  Search,
} from "lucide-react";
import type { GuideGroup } from "@/lib/gidsen-data";

const CATEGORY_CONFIG: Record<
  string,
  { icon: typeof HelpCircle; gradient: string; accent: string; descKey: string; badge?: boolean }
> = {
  infoPlaceholderGeneral: {
    icon: HelpCircle,
    gradient: "from-green-50 to-emerald-50",
    accent: "#2d7a3a",
    descKey: "categoryDescGeneral",
  },
  infoPlaceholderHealth: {
    icon: Heart,
    gradient: "from-red-50 to-rose-50",
    accent: "#e11d48",
    descKey: "categoryDescHealth",
  },
  infoPlaceholderPractical: {
    icon: ClipboardList,
    gradient: "from-amber-50 to-yellow-50",
    accent: "#d97706",
    descKey: "categoryDescPractical",
  },
  infoPlaceholderBehavior: {
    icon: Brain,
    gradient: "from-purple-50 to-violet-50",
    accent: "#7c3aed",
    descKey: "categoryDescBehavior",
  },
  infoPlaceholderFirstPet: {
    icon: Home,
    gradient: "from-blue-50 to-sky-50",
    accent: "#0369a1",
    descKey: "categoryDescFirstPet",
  },
  infoPlaceholderSavedSouls: {
    icon: Star,
    gradient: "from-green-100 to-emerald-100",
    accent: "#2d7a3a",
    descKey: "categoryDescSavedSouls",
    badge: true,
  },
  infoPlaceholderCats: {
    icon: Cat,
    gradient: "from-sky-50 to-blue-50",
    accent: "#0369a1",
    descKey: "categoryDescCats",
  },
  infoPlaceholderTravel: {
    icon: MapPin,
    gradient: "from-orange-50 to-amber-50",
    accent: "#d97706",
    descKey: "categoryDescTravel",
  },
};

const PILLS_VISIBLE = 4;

export default function GidsenHub({ groups }: { groups: GuideGroup[] }) {
  const t = useTranslations("gidsen");
  const tCommon = useTranslations("common");
  const tGetInvolved = useTranslations("getInvolved");
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter((g) => {
      const config = CATEGORY_CONFIG[g.placeholderKey];
      const title = tGetInvolved(g.placeholderKey).toLowerCase();
      const desc = config ? t(config.descKey).toLowerCase() : "";
      const matchesTitle = title.includes(q);
      const matchesDesc = desc.includes(q);
      const matchesLinks = g.links.some((l) => tCommon(l.labelKey).toLowerCase().includes(q));
      return matchesTitle || matchesDesc || matchesLinks;
    });
  }, [groups, search, tGetInvolved, tCommon, t]);

  return (
    <>
      {/* Search bar */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            aria-hidden
          />
          <input
            type="search"
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
            aria-label={t("searchPlaceholder")}
          />
        </div>
      </div>

      {/* Category cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto px-6">
        {filteredGroups.map((group) => {
          const config = CATEGORY_CONFIG[group.placeholderKey] ?? {
            icon: HelpCircle,
            gradient: "from-gray-50 to-gray-100",
            accent: "#6b7280",
            descKey: "categoryDescGeneral",
          };
          const Icon = config.icon;
          const isSavedSouls = group.placeholderKey === "infoPlaceholderSavedSouls";
          const visibleLinks = group.links.slice(0, PILLS_VISIBLE);
          const remainingCount = group.links.length - PILLS_VISIBLE;

          return (
            <div
              key={group.placeholderKey}
              role="button"
              tabIndex={0}
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) return;
                router.push(group.links[0]?.href ?? "/gidsen");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!(e.target as HTMLElement).closest("a")) {
                    router.push(group.links[0]?.href ?? "/gidsen");
                  }
                }
              }}
              className={`relative rounded-2xl border bg-gradient-to-br ${config.gradient} p-6 hover:shadow-lg hover:scale-[1.02] active:scale-[0.97] transition-all duration-200 cursor-pointer ${
                isSavedSouls ? "border-2 border-[#86efac]" : "border border-[#f0f0f0]"
              }`}
            >
              {config.badge && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  {t("badgeSpecialty")}
                </span>
              )}
              <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                <Icon size={32} color={config.accent} aria-hidden />
              </div>
              <h3 className="font-bold text-lg text-gray-800 mt-4">
                {tGetInvolved(group.placeholderKey)}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{t(config.descKey)}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {visibleLinks.map((link) => (
                  <Link
                    key={link.href + link.labelKey}
                    href={link.href}
                    className="inline-flex bg-white rounded-full px-3 py-1 text-sm text-gray-600 border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    {tCommon(link.labelKey)}
                  </Link>
                ))}
                {remainingCount > 0 && (
                  <span className="inline-flex bg-white rounded-full px-3 py-1 text-sm text-gray-500 border border-gray-100">
                    {t("moreGuides", { count: remainingCount })}
                  </span>
                )}
              </div>
              <Link
                href={group.links[0]?.href ?? "/gidsen"}
                className="text-sm font-medium mt-4 block hover:underline"
                style={{ color: config.accent }}
              >
                {t("guidesCount", { count: group.links.length })} →
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
