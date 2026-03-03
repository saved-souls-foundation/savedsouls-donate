"use client";

import { useState, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";

type Overview = {
  volunteers: number;
  adoptants: number;
  activeMembers: number;
  newsletter: number;
  donationsThisMonth: number;
  activeSponsors: number;
};

type Attention = {
  pendingEmails: number;
  volunteersStep12: number;
  expiredSponsors: number;
};

type RecentVolunteer = { name: string | null; step: number; date: string | null };
type RecentDonation = { name: string | null; amount: number; date: string | null };

type Props = {
  locale: string;
  dateLocale: string;
  overview: Overview;
  attention: Attention;
  recentVolunteers: RecentVolunteer[];
  recentDonations: RecentDonation[];
};

function AnimatedNumber({ value, format = "number" }: { value: number; format?: "number" | "currency" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 500;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      setDisplay(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [value]);
  if (format === "currency") {
    return <>{`€ ${display.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</>;
  }
  return <>{display}</>;
}

export function DashboardClient({
  locale,
  dateLocale,
  overview,
  attention,
  recentVolunteers,
  recentDonations,
}: Props) {
  const t = useTranslations("admin");
  const attentionTotal = attention.pendingEmails + attention.volunteersStep12 + attention.expiredSponsors;
  const showAttentionSection = attentionTotal > 0;

  const overviewCards: { icon: string; labelKey: string; value: number; valueFormatted?: string; href: string }[] = [
    { icon: "🤝", labelKey: "volunteersRegistered", value: overview.volunteers, href: "/admin/vrijwilligers" },
    { icon: "🐾", labelKey: "adoptantsRegistered", value: overview.adoptants, href: "/admin/adoptanten" },
    { icon: "👥", labelKey: "dashboard.activeMembers", value: overview.activeMembers, href: "/admin/leden" },
    { icon: "✉️", labelKey: "dashboard.newsletterSubscribers", value: overview.newsletter, href: "/admin/nieuwsbrief" },
    {
      icon: "€",
      labelKey: "dashboard.donationsThisMonth",
      value: overview.donationsThisMonth,
      valueFormatted: `€ ${overview.donationsThisMonth.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      href: "/admin/donateurs",
    },
    { icon: "🏢", labelKey: "dashboard.activeSponsors", value: overview.activeSponsors, href: "/admin/sponsoren" },
  ];

  const attentionItems: { icon: string; label: string; count: number; href: string }[] = [
    { icon: "📬", label: "Openstaande e-mails", count: attention.pendingEmails, href: "/admin/emails" },
    { icon: "⏳", label: "Vrijwilligers in stap 1-2", count: attention.volunteersStep12, href: "/admin/vrijwilligers" },
    { icon: "⚠️", label: "Verlopen sponsoren", count: attention.expiredSponsors, href: "/admin/sponsoren" },
  ];

  return (
    <div className="space-y-8">
      {/* Sectie 1 — Overzicht */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: ADM_MUTED }}>
          Overzicht
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {overviewCards.map((card) => (
            <Link
              key={card.labelKey}
              href={card.href}
              className="rounded-xl border p-4 block cursor-pointer hover:shadow-md transition"
              style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
            >
              <span className="text-2xl">{card.icon}</span>
              <p className="text-2xl font-bold mt-2" style={{ color: ADM_TEXT }}>
                {card.valueFormatted != null ? (
                  card.valueFormatted
                ) : (
                  <AnimatedNumber value={card.value} format="number" />
                )}
              </p>
              <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
                {t(card.labelKey)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sectie 2 — Aandacht vereist */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: ADM_MUTED }}>
          Aandacht vereist
        </h2>
        {showAttentionSection ? (
          <div
            className="rounded-xl border p-4 flex flex-wrap items-center gap-4"
            style={{
              background: "rgba(254, 215, 170, 0.3)",
              borderColor: "#ea580c",
            }}
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            {attentionItems
              .filter((item) => item.count > 0)
              .map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm hover:shadow transition"
                  style={{ borderColor: "#ea580c", color: ADM_TEXT, background: ADM_CARD }}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  <span className="font-bold" style={{ color: "#dc2626" }}>
                    {item.count}
                  </span>
                </Link>
              ))}
          </div>
        ) : (
          <div
            className="rounded-xl border p-4 flex items-center gap-2"
            style={{ background: "rgba(61, 139, 94, 0.15)", borderColor: "#22c55e", color: "#166534" }}
          >
            <span className="text-lg">✓</span>
            <span className="font-medium">Alles in orde ✓</span>
          </div>
        )}
      </section>

      {/* Sectie 3 — Laatste activiteit */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: ADM_MUTED }}>
          Laatste activiteit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
              <h3 className="font-semibold" style={{ color: ADM_TEXT }}>
                {t("lastVolunteers")}
              </h3>
              <Link href="/admin/vrijwilligers" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
                {t("allVolunteers")}
              </Link>
            </div>
            <ul className="divide-y" style={{ borderColor: ADM_BORDER }}>
              {recentVolunteers.length === 0 ? (
                <li className="p-4 text-sm" style={{ color: ADM_MUTED }}>
                  {t("noValue")}
                </li>
              ) : (
                recentVolunteers.map((v, i) => (
                  <li key={i} className="p-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium" style={{ color: ADM_TEXT }}>
                      {v.name ?? t("noValue")}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(13,148,136,.15)", color: ADM_ACCENT }}>
                      {t("stepN", { n: v.step })}
                    </span>
                    <span className="ml-auto text-xs" style={{ color: ADM_MUTED }}>
                      {v.date ? new Date(v.date).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div
            className="rounded-xl border overflow-hidden"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
              <h3 className="font-semibold" style={{ color: ADM_TEXT }}>
                Recente donaties
              </h3>
              <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
                Donateurs →
              </Link>
            </div>
            <ul className="divide-y" style={{ borderColor: ADM_BORDER }}>
              {recentDonations.length === 0 ? (
                <li className="p-4 text-sm" style={{ color: ADM_MUTED }}>
                  Nog geen donaties
                </li>
              ) : (
                recentDonations.map((d, i) => (
                  <li key={i} className="p-4 flex flex-wrap items-center gap-2 text-sm">
                    <span className="font-medium" style={{ color: ADM_TEXT }}>
                      {d.name ?? t("noValue")}
                    </span>
                    <span className="font-medium ml-auto" style={{ color: ADM_TEXT }}>
                      € {d.amount.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs" style={{ color: ADM_MUTED }}>
                      {d.date ? new Date(d.date).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
