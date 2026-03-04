"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Users, Mail, Heart, Building, Inbox, Share2, Calendar } from "lucide-react";
import GlobalSearch from "./components/GlobalSearch";

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
        color: isActive ? ADM_ACCENT : ADM_TEXT,
      }}
    >
      <span className="flex-shrink-0 w-5 flex items-center justify-center opacity-100">{icon}</span>
      <span className="flex-1 min-w-0 truncate">{label}</span>
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
      style={{ color: ADM_TEXT }}
    >
      {label}
    </p>
  );
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m geleden`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}u geleden`;
  return `${Math.floor(hrs / 24)}d geleden`;
}

type UnreadEmail = { id: string; onderwerp: string | null; van_email: string | null; van_naam: string | null; ontvangen_op: string };

function NotificationBell({ locale, count, recentUnread }: { locale: string; count: number; recentUnread: UnreadEmail[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center md:min-h-0 md:min-w-0"
        aria-label="Notificaties"
      >
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-72 bg-white shadow-xl rounded-xl border border-gray-200 z-50 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <span className="text-sm font-semibold text-gray-900">Notificaties</span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {recentUnread.length > 0 ? (
              recentUnread.map((mail) => (
                <Link
                  key={mail.id}
                  href={`/${locale}/admin/emails/${mail.id}`}
                  className="flex items-start gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 block"
                  onClick={() => setOpen(false)}
                >
                  <span className="text-lg flex-shrink-0">📧</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-900 truncate">
                      {mail.van_naam || mail.van_email || "Onbekend"}
                    </p>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{mail.onderwerp ?? "—"}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{timeAgo(mail.ontvangen_op)}</p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                Geen ongelezen e-mails
              </div>
            )}
          </div>
          <div className="p-2 border-t border-gray-100">
            <Link
              href={`/${locale}/admin/emails`}
              className="block w-full text-xs font-medium text-gray-500 hover:text-[#2aa348] py-2 text-center"
              onClick={() => setOpen(false)}
            >
              Alle e-mails bekijken →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayoutClient({
  children,
  pendingEmailsCount = 0,
  recentUnreadEmails = [],
}: {
  children: React.ReactNode;
  pendingEmailsCount?: number;
  recentUnreadEmails?: { id: string; onderwerp: string | null; van_email: string | null; van_naam: string | null; ontvangen_op: string }[];
}) {
  const t = useTranslations("admin");
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isLogin = pathname?.endsWith("/admin/login") ?? false;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
    <div className="flex flex-col h-full" style={{ background: ADM_SIDEBAR, color: ADM_TEXT }}>
      <div className="p-4 border-b shrink-0" style={{ borderColor: ADM_BORDER }}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <img src="/savedsouls-logo-darkgreen.png" alt="" className="h-8 w-8 object-contain" />
            <span className="font-bold text-sm" style={{ fontFamily: "'Playfair Display', serif", color: ADM_ACCENT }}>
              {t("brandName")}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm text-gray-500 border border-gray-200"
            >
              <span>🔍</span>
              <span className="hidden lg:inline text-xs">Zoeken</span>
              <kbd className="hidden lg:inline text-xs bg-white px-1.5 py-0.5 rounded border border-gray-300 font-mono">
                ⌘K
              </kbd>
            </button>
            <NotificationBell locale={locale} count={pendingEmailsCount} recentUnread={recentUnreadEmails} />
          </div>
        </div>
        <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded mt-1" style={{ background: "rgba(42,157,143,.2)", color: ADM_ACCENT }}>
          {t("adminPanelTitle")}
        </span>
        <p className="text-xs mt-1" style={{ color: ADM_MUTED }}>
          {t("subtitle")}
        </p>
      </div>
      <nav className="p-2 flex-1 overflow-y-auto min-h-0">
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
                color: isActive ? ADM_ACCENT : ADM_TEXT,
              }}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="truncate">{t(item.labelKey)}</span>
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
        <SectionLabel label={t("sidebarSectionPlanning")} />
        <NavLink
          href="/admin/agenda"
          icon={<Calendar className="w-[18px] h-[18px]" />}
          label={t("agenda.title")}
          isActive={pathname?.includes("admin/agenda") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
        <NavLink
          href="/admin/rooster"
          icon={<Users className="w-[18px] h-[18px]" />}
          label={t("rooster.title")}
          isActive={pathname?.includes("admin/rooster") ?? false}
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
        <NavLink
          href="/admin/sociale-media"
          icon={<Share2 className="w-[18px] h-[18px]" />}
          label={t("socialeMedia.title")}
          isActive={pathname?.includes("admin/sociale-media") ?? false}
          locale={locale}
          onClick={() => setMobileOpen(false)}
        />
      </nav>
      <div className="p-2 border-t shrink-0" style={{ borderColor: ADM_BORDER }}>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ color: ADM_TEXT }}
        >
          {t("logout")}
        </button>
      </div>
    </div>
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
            className="absolute left-0 top-0 bottom-0 w-64 max-w-[85vw] flex flex-col border-r shadow-xl"
            style={{ background: ADM_SIDEBAR, borderColor: ADM_BORDER, color: ADM_TEXT }}
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
          className="p-3 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
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
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Zoeken"
          >
            <span className="text-lg">🔍</span>
          </button>
          <NotificationBell locale={locale} count={pendingEmailsCount} recentUnread={recentUnreadEmails} />
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8 pb-16 md:pb-8">
        {children}
      </main>
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
        <div className="grid grid-cols-5 h-16">
          {[
            { icon: "🏠", label: "Home", href: `/${locale}/admin/dashboard` },
            { icon: "🐾", label: "Dieren", href: `/${locale}/admin/adoptanten` },
            { icon: "📧", label: "Email", href: `/${locale}/admin/emails` },
            { icon: "💰", label: "Donateurs", href: `/${locale}/admin/donateurs` },
            { icon: "📅", label: "Agenda", href: `/${locale}/admin/agenda` },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center gap-1 text-gray-400 hover:text-[#2aa348] transition-colors active:scale-95"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
