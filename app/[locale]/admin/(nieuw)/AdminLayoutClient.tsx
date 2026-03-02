"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Users, Mail, Heart, Building, Inbox } from "lucide-react";

const ADM_BG = "#f1f5f9";
const ADM_SIDEBAR = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

const nav = [
  { href: "/admin/dashboard", labelKey: "dashboardLabel", icon: "📊" },
  { href: "/admin/adoptanten", labelKey: "adoptanten", icon: "🐾" },
  { href: "/admin/vrijwilligers", labelKey: "vrijwilligers", icon: "🤝" },
  { href: "/admin/documenten", labelKey: "documenten", icon: "📄" },
];

function NavLink({
  href,
  icon,
  label,
  isActive,
  locale,
  onClick,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  locale: string;
  onClick: () => void;
  badge?: number;
}) {
  return (
    <Link
      href={`/${locale}${href}`}
      onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
      style={{
        background: isActive ? "rgba(42,157,143,.15)" : "transparent",
        color: isActive ? ADM_ACCENT : ADM_MUTED,
      }}
    >
      <span className="flex-shrink-0 w-5 flex items-center justify-center">{icon}</span>
      <span className="flex-1 min-w-0">{label}</span>
      {badge != null && badge > 0 && (
        <span
          className="flex-shrink-0 min-w-[1.25rem] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center text-white"
          style={{ background: "#dc2626" }}
        >
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      className="px-3 pt-4 pb-1 text-xs font-semibold uppercase tracking-wider"
      style={{ color: ADM_MUTED }}
    >
      {label}
    </p>
  );
}

export default function AdminLayoutClient({
  children,
  pendingEmailsCount = 0,
}: {
  children: React.ReactNode;
  pendingEmailsCount?: number;
}) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLogin = pathname?.endsWith("/admin/login") ?? false;

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}/admin/login`);
    router.refresh();
  }

  if (isLogin) {
    return <>{children}</>;
  }

  const sidebar = (
    <>
      <div className="p-4 border-b" style={{ borderColor: ADM_BORDER }}>
        <div className="flex items-center gap-2">
          <img src="/savedsouls-logo-darkgreen.png" alt="" className="h-8 w-8 object-contain" />
          <span className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: ADM_ACCENT }}>
            {t("brandName")}
          </span>
        </div>
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1" style={{ background: "rgba(42,157,143,.2)", color: ADM_ACCENT }}>
          {t("adminPanelTitle")}
        </span>
        <p className="text-xs mt-1" style={{ color: ADM_MUTED }}>
          {t("subtitle")}
        </p>
      </div>
      <nav className="p-2 flex-1">
        {nav.map((item) => {
          const isActive = pathname?.includes(item.href.slice(1));
          return (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors"
              style={{
                background: isActive ? "rgba(42,157,143,.15)" : "transparent",
                color: isActive ? ADM_ACCENT : ADM_MUTED,
              }}
            >
              <span>{item.icon}</span>
              {t(item.labelKey)}
            </Link>
          );
        })}
        <SectionLabel label={t("sidebarSectionPeople")} />
        <NavLink
          href="/admin/leden"
          icon={<Users className="w-[18px] h-[18px]" />}
          label={t("members.title")}
          isActive={pathname?.includes("admin/leden") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
        <NavLink
          href="/admin/nieuwsbrief"
          icon={<Mail className="w-[18px] h-[18px]" />}
          label={t("newsletter.title")}
          isActive={pathname?.includes("admin/nieuwsbrief") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
        <SectionLabel label={t("sidebarSectionFinance")} />
        <NavLink
          href="/admin/donateurs"
          icon={<Heart className="w-[18px] h-[18px]" />}
          label={t("donors.title")}
          isActive={pathname?.includes("admin/donateurs") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
        <NavLink
          href="/admin/sponsoren"
          icon={<Building className="w-[18px] h-[18px]" />}
          label={t("sponsors.title")}
          isActive={pathname?.includes("admin/sponsoren") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
        <SectionLabel label={t("sidebarSectionCommunication")} />
        <NavLink
          href="/admin/emails"
          icon={<Inbox className="w-[18px] h-[18px]" />}
          label={t("emails.title")}
          isActive={pathname?.includes("admin/emails") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
          badge={pendingEmailsCount}
        />
      </nav>
      <div className="p-2 border-t" style={{ borderColor: ADM_BORDER }}>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ color: ADM_MUTED }}
        >
          {t("logout")}
        </button>
      </div>
    </>
  );

  return (
    <div
      className="min-h-screen flex"
      style={{
        background: ADM_BG,
        color: ADM_TEXT,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=DM+Sans:wght@400;500;600&display=swap');
      `}</style>
      <aside
        className="w-56 shrink-0 border-r hidden md:flex flex-col"
        style={{ background: ADM_SIDEBAR, borderColor: ADM_BORDER }}
      >
        {sidebar}
      </aside>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          style={{ background: "rgba(0,0,0,.5)" }}
          onClick={() => setMobileOpen(false)}
        >
          <aside
            className="absolute left-0 top-0 bottom-0 w-56 flex flex-col border-r"
            style={{ background: ADM_SIDEBAR, borderColor: ADM_BORDER }}
            onClick={(e) => e.stopPropagation()}
          >
            {sidebar}
          </aside>
        </div>
      )}
      <header className="md:hidden flex items-center justify-between p-3 border-b" style={{ borderColor: ADM_BORDER, background: ADM_SIDEBAR }}>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded"
          style={{ color: ADM_TEXT }}
          aria-label={t("menuOpen")}
        >
          <span className="text-xl">☰</span>
        </button>
        <div className="flex items-center gap-2">
          <img src="/savedsouls-logo-darkgreen.png" alt="" className="h-7 w-7 object-contain" />
          <span className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: ADM_ACCENT }}>
            {t("adminPanelTitle")}
          </span>
        </div>
        <div className="w-10" />
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
