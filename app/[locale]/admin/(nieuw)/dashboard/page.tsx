import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";

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
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "vrijwilliger"),
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
    { icon: "🤝", labelKey: "volunteersRegistered" as const, value: totalVrijwilligers ?? 0 },
    { icon: "✈️", labelKey: "volunteersReady" as const, value: voltooideVrijwilligers ?? 0 },
    { icon: "🐾", labelKey: "adoptantsRegistered" as const, value: totalAdoptanten ?? 0 },
    { icon: "✅", labelKey: "adoptionsComplete" as const, value: voltooideAdoptanten ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <p className="text-sm" style={{ color: ADM_MUTED }}>
        {t("dashboardWelcome")}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div
            key={c.labelKey}
            className="rounded-xl border p-4"
            style={{ background: ADM_CARD, borderColor: ADM_BORDER }}
          >
            <span className="text-2xl">{c.icon}</span>
            <p className="text-2xl font-bold mt-2" style={{ color: ADM_TEXT }}>
              {c.value}
            </p>
            <p className="text-sm mt-1" style={{ color: ADM_MUTED }}>
              {t(c.labelKey)}
            </p>
          </div>
        ))}
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
                      {[r.voornaam, r.achternaam].filter(Boolean).join(" ") || "—"}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.email ?? "—"}
                    </td>
                    <td className="p-3" style={{ color: ADM_TEXT }}>
                      {r.city ?? "—"}
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
                      {r.created_at ? new Date(r.created_at).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
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
                      {[p.voornaam, p.achternaam].filter(Boolean).join(" ") || "—"}
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
                      {p.aangemeld_op ? new Date(p.aangemeld_op).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
