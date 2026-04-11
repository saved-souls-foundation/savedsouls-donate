"use client";

import { useState, useEffect } from "react";
import { Link, useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { StatCard, Avatar } from "../components/ui/design-system";

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

export type RecentEmailWidgetInbound = {
  kind: "inbound";
  id: string;
  subject: string | null;
  from_email: string | null;
  from_name: string | null;
  created_at: string;
  category: string | null;
};

export type RecentEmailWidgetOutbound = {
  kind: "outbound";
  id: string;
  subject: string | null;
  to_email: string | null;
  created_at: string;
  preview: string | null;
};

export type RecentEmailWidgetRij = RecentEmailWidgetInbound | RecentEmailWidgetOutbound;

export type VerlopendeSponsor = {
  id: string;
  bedrijfsnaam: string | null;
  contract_eind: string | null;
};

type Props = {
  locale: string;
  dateLocale: string;
  userName?: string;
  overview: Overview;
  attention: Attention;
  recentVolunteers: RecentVolunteer[];
  recentDonations: RecentDonation[];
  aantalDieren?: number;
  aantalVrijwilligersActief?: number;
  aantalOpenAdopties?: number;
  recenteEmails?: RecentEmailWidgetRij[];
  verlopendeSponsorcontracten?: VerlopendeSponsor[];
  groupBOverview?: ReactNode;
  groupBAttention?: ReactNode;
  groupBRecent?: ReactNode;
  groupBAutoReplies?: ReactNode;
};

function getDayPart(): "morgen" | "middag" | "avond" {
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return "morgen";
  if (h >= 12 && h < 17) return "middag";
  return "avond";
}

function weatherIcon(code: number): string {
  if (code === 0) return "☀️";
  if (code >= 1 && code <= 3) return "⛅";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "⛅";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}u`;
  return `${Math.floor(hrs / 24)}d`;
}

function MeldingRij({
  type,
  icon,
  tekst,
  actie,
  href,
}: {
  type: "danger" | "warning" | "info";
  icon: string;
  tekst: string;
  actie: string;
  href: string;
}) {
  const styles = {
    danger: "bg-red-50 border-red-200 text-red-700 hover:bg-red-100",
    warning: "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100",
    info: "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100",
  };
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${styles[type]}`}
    >
      <span className="text-base shrink-0">{icon}</span>
      <span className="flex-1 text-sm font-medium">{tekst}</span>
      <span className="shrink-0 text-xs font-bold px-2.5 py-1 bg-white rounded-lg border opacity-70 group-hover:opacity-100 whitespace-nowrap">
        {actie} →
      </span>
    </Link>
  );
}

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
  userName,
  overview,
  attention,
  recentVolunteers,
  recentDonations,
  aantalDieren = 0,
  aantalVrijwilligersActief = 0,
  aantalOpenAdopties = 0,
  recenteEmails = [],
  verlopendeSponsorcontracten = [],
  groupBOverview,
  groupBAttention,
  groupBRecent,
  groupBAutoReplies,
}: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const attentionTotal = attention.pendingEmails + attention.volunteersStep12 + attention.expiredSponsors;
  const showAttentionSection = attentionTotal > 0;

  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);
  const [tijd, setTijd] = useState({ thai: "", adam: "" });

  useEffect(() => {
    const update = () => {
      setTijd({
        thai: new Intl.DateTimeFormat("nl-NL", {
          timeZone: "Asia/Bangkok",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
        adam: new Intl.DateTimeFormat("nl-NL", {
          timeZone: "Europe/Amsterdam",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      });
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const url = "https://api.open-meteo.com/v1/forecast?latitude=16.43&longitude=102.82&current=temperature_2m,weather_code&timezone=Asia/Bangkok";
    fetch(url)
      .then((r) => r.json())
      .then((data: { current?: { temperature_2m?: number; weather_code?: number } }) => {
        const cur = data?.current;
        if (cur != null && typeof cur.temperature_2m === "number" && typeof cur.weather_code === "number") {
          setWeather({ temp: cur.temperature_2m, code: cur.weather_code });
        }
      })
      .catch(() => setWeather(null));
  }, []);

  const overviewCardsA: { icon: string; labelKey: string; value: number; valueFormatted?: string; href: string }[] = [
    { icon: "🤝", labelKey: "volunteersRegistered", value: overview.volunteers, href: "/admin/vrijwilligers" },
    { icon: "🐾", labelKey: "adoptantsRegistered", value: overview.adoptants, href: "/admin/adoptanten" },
    { icon: "👥", labelKey: "dashboard.activeMembers", value: overview.activeMembers, href: "/admin/leden" },
    { icon: "✉️", labelKey: "dashboard.newsletterSubscribers", value: overview.newsletter, href: "/admin/nieuwsbrief" },
  ];

  const attentionItemsA: { icon: string; label: string; count: number; href: string }[] = [
    { icon: "📬", label: "Openstaande e-mails", count: attention.pendingEmails, href: "/admin/emails?tab=onbeantwoord" },
  ];

  const dayPart = getDayPart();
  const greetingKey = dayPart === "morgen" ? "Goedemorgen" : dayPart === "middag" ? "Goedemiddag" : "Goedeavond";
  const greeting = userName ? `${greetingKey} ${userName} 👋` : `${greetingKey} 👋`;
  const firstAttentionHref =
    attention.pendingEmails > 0
      ? "/admin/emails?tab=onbeantwoord"
      : verlopendeSponsorcontracten.length > 0
        ? `/admin/sponsoren/${verlopendeSponsorcontracten[0].id}`
        : aantalOpenAdopties > 0
          ? "/admin/adoptanten"
          : null;

  return (
    <div className="space-y-8 w-full max-w-full min-w-0">
      {/* Compacte header met begroeting + weer */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200 rounded-t-xl">
        <div>
          <div className="text-base font-semibold text-stone-800">{greeting}</div>
          <div className="text-xs text-stone-500">
            {new Date().toLocaleDateString(dateLocale === "en-GB" ? "en-GB" : "nl-NL", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Ban Khok Ngam 🇹🇭
          </div>
          <div className="text-xs text-stone-400 mt-0.5">
            🇹🇭 {tijd.thai} · 🇳🇱 Amsterdam: {tijd.adam}
          </div>
        </div>
        <div className="text-right text-sm text-stone-600 shrink-0 max-w-[100px] md:max-w-none leading-tight">
          {weather != null ? (
            <span className="whitespace-nowrap">{weatherIcon(weather.code)} {Math.round(weather.temp)}°C</span>
          ) : (
            <span className="text-stone-400">...</span>
          )}
        </div>
      </div>

      {/* 2 — Mail (Recente emails); rijen linken naar inbox of verzonden-tab */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[60px]">
        <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-green-50 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-gray-900">📧 Recente emails</h2>
            <p className="text-xs text-gray-500 mt-0.5">Onbeantwoord bovenaan; recent verzonden</p>
          </div>
          <Link href="/admin/emails?tab=onbeantwoord" className="text-xs font-semibold text-[#2aa348] hover:underline shrink-0">
            Alles bekijken →
          </Link>
        </div>
        <div className="divide-y divide-gray-100">
          {recenteEmails.length > 0 ? (
            recenteEmails.map((email) =>
              email.kind === "inbound" ? (
                <Link
                  key={`in-${email.id}`}
                  href={`/admin/emails?tab=onbeantwoord&id=${email.id}`}
                  className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <Avatar name={email.from_name ?? email.from_email ?? "?"} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-gray-900 truncate">
                        {email.from_name ?? email.from_email ?? "–"}
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(email.created_at)}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{email.subject ?? "–"}</p>
                  </div>
                </Link>
              ) : (
                <Link
                  key={`out-${email.id}`}
                  href="/admin/emails?tab=verzonden"
                  className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50/50 transition-colors"
                >
                  <span className="text-lg shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-teal-50 text-teal-700 border border-teal-100" aria-hidden>
                    ➤
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-teal-800 bg-teal-50 border border-teal-200 rounded-full px-2 py-0.5 shrink-0">
                        Verzonden
                      </span>
                      <span className="text-xs text-gray-400 shrink-0">{timeAgo(email.created_at)}</span>
                    </div>
                    <div className="text-sm font-semibold text-gray-900 truncate mt-1">{email.to_email ?? "–"}</div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{email.subject ?? "–"}</p>
                    {email.preview ? (
                      <p className="text-xs text-gray-400 truncate mt-0.5" title={email.preview}>
                        {email.preview}
                      </p>
                    ) : null}
                  </div>
                </Link>
              )
            )
          ) : (
            <div className="px-5 py-8 text-center text-sm text-gray-400">Geen recente mailactiviteit 🎉</div>
          )}
        </div>
      </div>

      {/* 3 — Aandacht vereist; hele kaart klikbaar naar eerste item als er items zijn */}
      {firstAttentionHref ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push(firstAttentionHref)}
          onKeyDown={(e) => e.key === "Enter" && router.push(firstAttentionHref)}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[60px] cursor-pointer hover:bg-stone-50 transition-colors"
        >
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h2 className="font-extrabold text-gray-900">🚨 Aandacht vereist</h2>
            <p className="text-xs text-gray-500 mt-0.5">Items die direct actie nodig hebben</p>
          </div>
          <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            {attention.pendingEmails > 0 && (
              <MeldingRij
                type="warning"
                icon="📧"
                tekst={`${attention.pendingEmails} email${attention.pendingEmails > 1 ? "s" : ""} wacht${attention.pendingEmails === 1 ? "" : "en"} op antwoord`}
                actie="Beantwoorden"
                href="/admin/emails?tab=onbeantwoord"
              />
            )}
            {verlopendeSponsorcontracten.map((s) => (
              <MeldingRij key={s.id} type="danger" icon="📄" tekst={`${s.bedrijfsnaam ?? "Sponsor"} — contract verloopt ${s.contract_eind ? new Date(s.contract_eind).toLocaleDateString("nl-NL") : "–"}`} actie="Bekijken" href={`/admin/sponsoren/${s.id}`} />
            ))}
            {aantalOpenAdopties > 0 && (
              <MeldingRij type="info" icon="🏠" tekst={`${aantalOpenAdopties} adoptie${aantalOpenAdopties > 1 ? "s" : ""} wacht${aantalOpenAdopties === 1 ? "" : "en"} op verwerking`} actie="Bekijken" href="/admin/adoptanten" />
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden min-h-[60px]">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
            <h2 className="font-extrabold text-gray-900">🚨 Aandacht vereist</h2>
            <p className="text-xs text-gray-500 mt-0.5">Items die direct actie nodig hebben</p>
          </div>
          <div className="p-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
              <span className="text-xl">✅</span>
              <span className="text-sm font-semibold text-green-700">Alles is in orde!</span>
            </div>
          </div>
        </div>
      )}

      {/* 4 — Stat cards (geen link, alleen cijfers; Overzicht-kaarten hieronder zijn wel klikbaar) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 min-h-[60px]">
        <StatCard icon="🐾" label="Dieren in opvang" value={aantalDieren} sub="actief in shelter" />
        <StatCard
          icon="🤝"
          label="Actieve vrijwilligers"
          value={aantalVrijwilligersActief}
          sub="in Thailand"
          accentColor="blue"
        />
        <StatCard
          icon="🏠"
          label="Open adopties"
          value={aantalOpenAdopties}
          sub="in behandeling"
          accentColor="violet"
        />
        <StatCard
          icon="⚠️"
          label="Contract verloopt"
          value={verlopendeSponsorcontracten.length}
          sub="binnen 30 dagen"
          accentColor="red"
        />
      </div>

      {/* RUN 3 — Snelkoppelingen */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-0">
        {[
          { icon: "🐾", label: "Dier toevoegen", sub: "Nieuw dier registreren", href: "/admin/dieren/nieuw" },
          { icon: "📧", label: "Emails beantwoorden", sub: "Inbox bekijken", href: "/admin/emails?tab=onbeantwoord" },
          { icon: "💰", label: "Donateur toevoegen", sub: "Nieuwe donatie", href: "/admin/donateurs" },
          { icon: "🏠", label: "Adoptie verwerken", sub: "Aanvragen bekijken", href: "/admin/adoptanten" },
          { icon: "📅", label: "Rooster bekijken", sub: "Vrijwilligers plannen", href: "/admin/rooster" },
          { icon: "📝", label: "Blog schrijven", sub: "Nieuw bericht", href: "/admin/sociale-media" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-xl border border-gray-200 p-4 min-h-[60px] flex flex-col justify-center cursor-pointer hover:bg-stone-50 hover:border-[#2aa348] hover:shadow-md transition-all duration-200 group"
          >
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200 inline-block">
              {item.icon}
            </div>
            <div className="font-bold text-sm text-gray-900">{item.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{item.sub}</div>
          </Link>
        ))}
      </div>

      {/* Sectie — Overzicht (4 kaarten Groep A + 2 kaarten Groep B via slot) */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: ADM_MUTED }}>
          Overzicht
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-w-0">
          {overviewCardsA.map((card) => (
            <Link
              key={card.labelKey}
              href={card.href}
              className="rounded-xl border p-4 block min-h-[60px] cursor-pointer hover:bg-stone-50 hover:shadow-md transition"
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
          {groupBOverview}
        </div>
      </section>

      {/* Sectie 3 — Laatste activiteit (Groep B slot) */}
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: ADM_MUTED }}>
          Laatste activiteit
        </h2>
        {groupBRecent}
      </section>

      {/* Auto-replies & Nieuwsbrieven (Groep B slot) */}
      {groupBAutoReplies}
    </div>
  );
}
