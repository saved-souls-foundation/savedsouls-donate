import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardAutoRepliesNewsletterCards } from "./DashboardAutoRepliesNewsletterCards";

const ADM_CARD = "#ffffff";
const ADM_BORDER = "#e2e8f0";
const ADM_TEXT = "#1e293b";
const ADM_MUTED = "#64748b";
const ADM_ACCENT = "#0d9488";
const ADM_GREEN = "#3D8B5E";
const ADM_YELLOW = "#B45309";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const supabase = await createClient();
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";

  const [
    { count: totalVrijwilligers },
    { count: voltooideVrijwilligers },
    { count: totalAdoptanten },
    { count: voltooideAdoptanten },
  ] = await Promise.all([
    supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }),
    supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }).eq("step", 4),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "adoptant"),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "adoptant").eq("huidige_stap", 4),
  ]);

  const { data: recentVrijwilligers } = await supabase
    .from("volunteer_onboarding")
    .select("user_id, voornaam, achternaam, email, city, step, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: recentAdoptanten } = await supabase
    .from("profiles")
    .select("id, voornaam, achternaam, email, huidige_stap, aangemeld_op")
    .eq("role", "adoptant")
    .order("aangemeld_op", { ascending: false })
    .limit(5);

  const cards = [
    { icon: "🤝", labelKey: "volunteersRegistered" as const, value: totalVrijwilligers ?? 0, href: "/admin/vrijwilligers" },
    { icon: "✈️", labelKey: "volunteersReady" as const, value: voltooideVrijwilligers ?? 0, href: "/admin/vrijwilligers?stap=4" },
    { icon: "🐾", labelKey: "adoptantsRegistered" as const, value: totalAdoptanten ?? 0, href: "/admin/adoptanten" },
    { icon: "✅", labelKey: "adoptionsComplete" as const, value: voltooideAdoptanten ?? 0, href: "/admin/adoptanten?stap=4" },
  ];

  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const [
    { count: activeMembersCount },
    { count: newsletterSubscribersCount },
    { data: donationsThisMonthData },
    { data: recurringActiveData },
    { count: activeSponsorsCount },
    { count: pendingEmailsCount },
    { data: sponsorsExpiringData },
    { data: subscribersByLanguageData },
    { count: emailTemplatesCount },
    { count: newsletterTemplatesCount },
  ] = await Promise.all([
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "actief"),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("actief", true),
    supabase.from("donations").select("bedrag").gte("donatie_datum", firstDayThisMonth),
    supabase.from("recurring_donations").select("bedrag").eq("status", "actief"),
    supabase.from("sponsors").select("*", { count: "exact", head: true }).eq("status", "actief"),
    supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling"),
    supabase.from("sponsors").select("id").gte("contract_eind", now.toISOString().slice(0, 10)).lte("contract_eind", in30Days),
    supabase.from("newsletter_subscribers").select("language").eq("actief", true),
    supabase.from("email_templates").select("*", { count: "exact", head: true }),
    supabase.from("newsletter_templates").select("*", { count: "exact", head: true }),
  ]);

  const donationsThisMonthSum = (donationsThisMonthData ?? []).reduce((acc: number, r: { bedrag: number | null }) => acc + Number(r.bedrag ?? 0), 0);
  const monthlyRecurringSum = (recurringActiveData ?? []).reduce((acc: number, r: { bedrag: number | null }) => acc + Number(r.bedrag ?? 0), 0);
  const sponsorsExpiringCount = (sponsorsExpiringData ?? []).length;

  const languageOrder = ["nl", "en", "es", "ru", "th", "de", "fr"] as const;
  const subscribersByLanguage: Record<string, number> = {};
  languageOrder.forEach((lang) => { subscribersByLanguage[lang] = 0; });
  (subscribersByLanguageData ?? []).forEach((r: { language: string | null }) => {
    const lang = (r.language ?? "nl").toLowerCase().slice(0, 2);
    if (languageOrder.includes(lang as (typeof languageOrder)[number])) {
      subscribersByLanguage[lang] = (subscribersByLanguage[lang] ?? 0) + 1;
    } else {
      subscribersByLanguage.nl = (subscribersByLanguage.nl ?? 0) + 1;
    }
  });

  const cardsRow2 = [
    { icon: "👥", labelKey: "dashboard.activeMembers" as const, value: activeMembersCount ?? 0, subtitle: null, isWarning: false, href: "/admin/leden" },
    { icon: "✉️", labelKey: "dashboard.newsletterSubscribers" as const, value: newsletterSubscribersCount ?? 0, subtitle: null, isWarning: false, href: "/admin/nieuwsbrief" },
    { icon: "€", labelKey: "dashboard.donationsThisMonth" as const, value: `€ ${donationsThisMonthSum.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subtitle: null, isWarning: false, href: "/admin/donateurs" },
    { icon: "🔄", labelKey: "dashboard.monthlyRecurring" as const, value: `€ ${monthlyRecurringSum.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, subtitle: t("dashboard.perMonth"), isWarning: false, href: "/admin/donateurs" },
    { icon: "🏢", labelKey: "dashboard.activeSponsors" as const, value: activeSponsorsCount ?? 0, subtitle: null, isWarning: false, href: "/admin/sponsoren" },
    { icon: "📥", labelKey: "dashboard.pendingEmails" as const, value: pendingEmailsCount ?? 0, subtitle: null, isWarning: true, href: "/admin/emails" },
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm" style={{ color: ADM_MUTED }}>
        {t("dashboardWelcome")}
      </p>

      {sponsorsExpiringCount > 0 && (
        <div
          className="rounded-xl border p-4 flex items-center justify-between flex-wrap gap-2"
          style={{ background: "rgba(240,192,80,.15)", borderColor: ADM_YELLOW, color: ADM_TEXT }}
        >
          <p className="text-sm font-medium">
            {t("dashboard.sponsorAlert", { count: sponsorsExpiringCount })}
          </p>
          <Link href="/admin/sponsoren" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
            {t("dashboard.viewSponsors")}
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Link
            key={c.labelKey}
            href={c.href}
            className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition block"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold mt-2" style={{ color: ADM_TEXT }}>
              {c.value}
            </p>
            <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
              {t(c.labelKey)}
            </p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cardsRow2.map((c) => (
          <Link
            key={c.labelKey}
            href={c.href}
            className="rounded-xl border p-4 cursor-pointer hover:shadow-md transition block"
            style={{
              background: c.isWarning ? "rgba(220,38,38,.08)" : ADM_CARD,
              borderColor: c.isWarning ? "#dc2626" : ADM_BORDER,
            }}
          >
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold mt-2" style={{ color: c.isWarning ? "#dc2626" : ADM_TEXT }}>
              {c.value}
            </p>
            <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
              {t(c.labelKey)}
            </p>
            {c.subtitle && (
              <p className="text-xs mt-0.5" style={{ color: ADM_MUTED }}>
                {c.subtitle}
              </p>
            )}
          </Link>
        ))}
        <DashboardAutoRepliesNewsletterCards
          initialEmailCount={emailTemplatesCount ?? 0}
          initialNewsletterCount={newsletterTemplatesCount ?? 0}
          labels={{
            autoReplies: t("dashboard.autoReplies"),
            newsletterTemplates: t("dashboard.newsletterTemplates"),
          }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
              {t("lastVolunteers")}
            </h2>
            <Link href="/admin/vrijwilligers" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
              {t("allVolunteers")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: ADM_MUTED }}>
                  <th className="text-left p-3">{t("name")}</th>
                  <th className="text-left p-3">{t("emailCol")}</th>
                  <th className="text-left p-3">{t("city")}</th>
                  <th className="text-left p-3">{t("step")}</th>
                  <th className="text-left p-3">{t("registeredAt")}</th>
                </tr>
              </thead>
              <tbody>
                {(recentVrijwilligers ?? []).map((r: { user_id: string; voornaam: string | null; achternaam: string | null; email: string | null; city: string | null; step: number; created_at: string }) => (
                  <tr key={r.user_id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {[r.voornaam, r.achternaam].filter(Boolean).join(" ") || t("noValue")}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.email ?? t("noValue")}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.city ?? t("noValue")}
                    </td>
                    <td className="p-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: r.step === 4 ? "rgba(61,139,94,.2)" : "rgba(240,192,80,.2)",
                          color: r.step === 4 ? ADM_GREEN : ADM_YELLOW,
                        }}
                      >
                        {r.step === 4 ? t("completed") : t("stepN", { n: r.step })}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>
                      {r.created_at ? new Date(r.created_at).toLocaleDateString(dateLocale, { dateStyle: "short" }) : t("noValue")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="rounded-xl border overflow-hidden"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        >
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
              {t("lastAdoptants")}
            </h2>
            <Link href="/admin/adoptanten" className="text-sm font-medium" style={{ color: ADM_ACCENT }}>
              {t("allAdoptants")}
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: ADM_MUTED }}>
                  <th className="text-left p-3">{t("name")}</th>
                  <th className="text-left p-3">{t("step")}</th>
                  <th className="text-left p-3">{t("registeredAt")}</th>
                </tr>
              </thead>
              <tbody>
                {(recentAdoptanten ?? []).map((p: { id: string; voornaam: string | null; achternaam: string | null; huidige_stap: number | null; aangemeld_op: string | null }) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: ADM_BORDER }}>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {[p.voornaam, p.achternaam].filter(Boolean).join(" ") || t("noValue")}
                    </td>
                    <td className="p-3">
                      <span
                        className="inline-block px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: (p.huidige_stap ?? 0) === 4 ? "rgba(61,139,94,.2)" : "rgba(240,192,80,.2)",
                          color: (p.huidige_stap ?? 0) === 4 ? ADM_GREEN : ADM_YELLOW,
                        }}
                      >
                        {(p.huidige_stap ?? 0) === 4 ? t("completed") : t("stepN", { n: p.huidige_stap ?? 1 })}
                      </span>
                    </td>
                    <td className="p-3" style={{ color: ADM_MUTED }}>
                      {p.aangemeld_op ? new Date(p.aangemeld_op).toLocaleDateString(dateLocale, { dateStyle: "short" }) : t("noValue")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div
          className="rounded-xl border overflow-hidden lg:col-span-2"
          style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
        >
          <div className="p-4 border-b" style={{ borderColor: ADM_BORDER }}>
            <h2 className="font-semibold" style={{ color: ADM_TEXT }}>
              {t("dashboard.subscribersByLanguage")}
            </h2>
          </div>
          <div className="p-4">
            <ul className="space-y-2 text-sm flex flex-wrap gap-x-8 gap-y-2">
              {languageOrder.map((lang) => (
                <li key={lang} className="flex justify-between items-center gap-4" style={{ color: ADM_TEXT }}>
                  <span className="font-medium uppercase">{lang}</span>
                  <span style={{ color: ADM_MUTED }}>{subscribersByLanguage[lang] ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
