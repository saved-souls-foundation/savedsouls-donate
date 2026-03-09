import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Suspense } from "react";
import { DashboardClient } from "./DashboardClient";
import { DashboardAutoRepliesNewsletterCards } from "./DashboardAutoRepliesNewsletterCards";
import { Link } from "@/i18n/navigation";

export const revalidate = 60;

const withTimeout = <T,>(promise: Promise<T>, ms = 5000): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);

async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = createAdminClient();
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  // Groep A (kritisch, boven de vouw)
  let aantalDieren = 0;
  try {
    const { count } = await withTimeout(
      Promise.resolve(
        supabase.from("dieren").select("*", { count: "exact", head: true }).eq("status", "in_opvang")
      )
    );
    aantalDieren = count ?? 0;
  } catch {
    aantalDieren = 0;
  }

  let userName: string | undefined;
  try {
    const serverSupabase = await createClient();
    const { data: { user } } = await serverSupabase.auth.getUser();
    if (user?.id) {
      const { data: profile } = await serverSupabase.from("profiles").select("voornaam, achternaam").eq("id", user.id).single();
      if (profile?.voornaam || profile?.achternaam) {
        userName = [profile.voornaam, profile.achternaam].filter(Boolean).join(" ").trim() || undefined;
      }
    }
  } catch {
    userName = undefined;
  }

  const [
    { count: volunteersCount },
    { count: volunteersActiefCount },
    { count: adoptantsCount },
    { count: activeMembersCount },
    { count: newsletterCount },
    { count: pendingEmailsCount },
    { data: recenteEmailsData },
    { data: verlopendeSponsorcontractenData },
  ] = await Promise.all([
    withTimeout(Promise.resolve(supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }))),
    withTimeout(Promise.resolve(supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }).eq("step", 4))),
    withTimeout(Promise.resolve(supabase.from("adoption_applications").select("*", { count: "exact", head: true }).not("status", "eq", "afgerond"))),
    withTimeout(Promise.resolve(supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "actief"))),
    withTimeout(Promise.resolve(supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("actief", true))),
    withTimeout(
      Promise.resolve(
        supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false")
      )
    ).catch(() => ({ count: 0 })),
    withTimeout(
      Promise.resolve(
        supabase
          .from("incoming_emails")
          .select("id, onderwerp, van_email, van_naam, ontvangen_op, ai_categorie")
          .eq("status", "in_behandeling")
          .is("beantwoord_op", null)
          .or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false")
          .order("ontvangen_op", { ascending: false })
          .limit(3)
      )
    ).catch(() => ({ data: [] })),
    withTimeout(
      Promise.resolve(
        supabase
          .from("sponsors")
          .select("id, bedrijfsnaam, contract_eind")
          .not("contract_eind", "is", null)
          .lt("contract_eind", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString())
          .gt("contract_eind", new Date().toISOString())
          .limit(3)
      )
    ).catch(() => ({ data: [] })),
  ]);

  const recenteEmails = (recenteEmailsData ?? []).map(
    (r: { id: string; onderwerp: string | null; van_email: string | null; van_naam: string | null; ontvangen_op: string; ai_categorie: string | null }) => ({
      id: r.id,
      subject: r.onderwerp,
      from_email: r.van_email,
      from_name: r.van_naam,
      created_at: r.ontvangen_op,
      category: r.ai_categorie,
    })
  );
  const verlopendeSponsorcontracten = (verlopendeSponsorcontractenData ?? []).map(
    (s: { id: string; bedrijfsnaam: string | null; contract_eind: string | null }) => ({
      id: s.id,
      bedrijfsnaam: s.bedrijfsnaam,
      contract_eind: s.contract_eind,
    })
  );

  const getGroupBData = cache(async () => {
    const supabaseB = createAdminClient();
    const nowB = new Date();
    const todayB = nowB.toISOString().slice(0, 10);
    const firstDayThisMonthB = new Date(nowB.getFullYear(), nowB.getMonth(), 1).toISOString().slice(0, 10);

    const [
      { data: donationsThisMonthData },
      { count: activeSponsorsCount },
      { count: volunteersStep12Count },
      { count: expiredSponsorsCount },
      { data: recentVolunteersData },
      { data: recentDonationsData },
      { count: emailTemplatesCount },
      { count: newsletterTemplatesCount },
    ] = await Promise.all([
      withTimeout(
        Promise.resolve(
          supabaseB
            .from("donations")
            .select("bedrag")
            .gte("donatie_datum", firstDayThisMonthB)
            .eq("status", "voltooid")
        )
      ),
      withTimeout(Promise.resolve(supabaseB.from("sponsors").select("*", { count: "exact", head: true }).eq("status", "actief"))),
      withTimeout(Promise.resolve(supabaseB.from("volunteer_onboarding").select("*", { count: "exact", head: true }).lte("step", 2))),
      withTimeout(
        Promise.resolve(supabaseB.from("sponsors").select("*", { count: "exact", head: true }).eq("status", "actief").lt("contract_eind", todayB))
      ),
      withTimeout(
        Promise.resolve(
          supabaseB
            .from("volunteer_onboarding")
            .select("voornaam, achternaam, step, created_at")
            .order("created_at", { ascending: false })
            .limit(3)
        )
      ),
      withTimeout(
        Promise.resolve(
          supabaseB
            .from("donations")
            .select("bedrag, donatie_datum, donors(voornaam, achternaam, email)")
            .order("donatie_datum", { ascending: false })
            .limit(3)
        )
      ),
      withTimeout(Promise.resolve(supabaseB.from("email_templates").select("*", { count: "exact", head: true }).eq("actief", true))),
      withTimeout(Promise.resolve(supabaseB.from("newsletter_templates").select("*", { count: "exact", head: true }))),
    ]);

    const donationsThisMonthSum = (donationsThisMonthData ?? []).reduce(
      (acc: number, r: { bedrag: number | null }) => acc + Number(r.bedrag ?? 0),
      0
    );

    const recentVolunteers = (recentVolunteersData ?? []).map(
      (r: { voornaam: string | null; achternaam: string | null; step: number; created_at: string | null }) => ({
        name: [r.voornaam, r.achternaam].filter(Boolean).join(" ").trim() || null,
        step: r.step,
        date: r.created_at,
      })
    );

    const recentDonations = (recentDonationsData ?? []).map(
      (d: {
        bedrag: number | null;
        donatie_datum: string | null;
        donors: { voornaam: string | null; achternaam: string | null; email: string | null }[] | null;
      }) => {
        const donor = Array.isArray(d.donors) ? d.donors[0] ?? null : d.donors;
        const name =
          donor && [donor.voornaam, donor.achternaam].filter(Boolean).join(" ").trim()
            ? [donor.voornaam, donor.achternaam].filter(Boolean).join(" ").trim()
            : donor?.email ?? null;
        return {
          name,
          amount: Number(d.bedrag ?? 0),
          date: d.donatie_datum,
        };
      }
    );

    return {
      donationsThisMonth: donationsThisMonthSum,
      activeSponsors: activeSponsorsCount ?? 0,
      volunteersStep12: volunteersStep12Count ?? 0,
      expiredSponsors: expiredSponsorsCount ?? 0,
      recentVolunteers,
      recentDonations,
      emailTemplatesCount: emailTemplatesCount ?? 0,
      newsletterTemplatesCount: newsletterTemplatesCount ?? 0,
    };
  });

  async function DashboardGroupBOverview() {
    const b = await getGroupBData();
    const t2 = await getTranslations("admin");
    return (
      <>
        <Link
          href="/admin/donateurs"
          className="rounded-xl border p-4 block cursor-pointer hover:shadow-md transition"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <span className="text-2xl">€</span>
          <p className="text-2xl font-bold mt-2" style={{ color: "#1e293b" }}>
            € {b.donationsThisMonth.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {t2("dashboard.donationsThisMonth")}
          </p>
        </Link>
        <Link
          href="/admin/sponsoren"
          className="rounded-xl border p-4 block cursor-pointer hover:shadow-md transition"
          style={{ background: "#ffffff", borderColor: "#e2e8f0" }}
        >
          <span className="text-2xl">🏢</span>
          <p className="text-2xl font-bold mt-2" style={{ color: "#1e293b" }}>
            {b.activeSponsors}
          </p>
          <p className="text-sm mt-1" style={{ color: "#64748b" }}>
            {t2("dashboard.activeSponsors")}
          </p>
        </Link>
      </>
    );
  }

  async function DashboardGroupBAttention() {
    const b = await getGroupBData();
    const t2 = await getTranslations("admin");
    const items = [
      { icon: "⏳", label: "Vrijwilligers in stap 1-2", count: b.volunteersStep12, href: "/admin/vrijwilligers" },
      { icon: "⚠️", label: "Verlopen sponsoren", count: b.expiredSponsors, href: "/admin/sponsoren" },
    ].filter((item) => item.count > 0);
    if (items.length === 0) return null;
    return (
      <>
        {items.map((item) => (
          <Link
            key={item.href + item.label}
            href={item.href}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border font-medium text-sm hover:shadow transition"
            style={{ borderColor: "#ea580c", color: "#1e293b", background: "#ffffff" }}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
            <span className="font-bold" style={{ color: "#dc2626" }}>
              {item.count}
            </span>
          </Link>
        ))}
      </>
    );
  }

  async function DashboardGroupBRecent() {
    const b = await getGroupBData();
    const t2 = await getTranslations("admin");
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#e2e8f0" }}>
            <h3 className="font-semibold" style={{ color: "#1e293b" }}>
              {t2("lastVolunteers")}
            </h3>
            <Link href="/admin/vrijwilligers" className="text-sm font-medium" style={{ color: "#0d9488" }}>
              {t2("allVolunteers")}
            </Link>
          </div>
          <ul className="divide-y" style={{ borderColor: "#e2e8f0" }}>
            {b.recentVolunteers.length === 0 ? (
              <li className="p-4 text-sm" style={{ color: "#64748b" }}>
                {t2("noValue")}
              </li>
            ) : (
              b.recentVolunteers.map((v, i) => (
                <li key={i} className="p-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium" style={{ color: "#1e293b" }}>
                    {v.name ?? t2("noValue")}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ background: "rgba(13,148,136,.15)", color: "#0d9488" }}>
                    {t2("stepN", { n: v.step })}
                  </span>
                  <span className="ml-auto text-xs" style={{ color: "#64748b" }}>
                    {v.date ? new Date(v.date).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="rounded-xl border overflow-hidden" style={{ background: "#ffffff", borderColor: "#e2e8f0" }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "#e2e8f0" }}>
            <h3 className="font-semibold" style={{ color: "#1e293b" }}>
              Recente donaties
            </h3>
            <Link href="/admin/donateurs" className="text-sm font-medium" style={{ color: "#0d9488" }}>
              Donateurs →
            </Link>
          </div>
          <ul className="divide-y" style={{ borderColor: "#e2e8f0" }}>
            {b.recentDonations.length === 0 ? (
              <li className="p-4 text-sm" style={{ color: "#64748b" }}>
                Nog geen donaties
              </li>
            ) : (
              b.recentDonations.map((d, i) => (
                <li key={i} className="p-4 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-medium" style={{ color: "#1e293b" }}>
                    {d.name ?? t2("noValue")}
                  </span>
                  <span className="font-medium ml-auto" style={{ color: "#1e293b" }}>
                    € {d.amount.toLocaleString(locale === "en" ? "en-GB" : "nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs" style={{ color: "#64748b" }}>
                    {d.date ? new Date(d.date).toLocaleDateString(dateLocale, { dateStyle: "short" }) : "—"}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    );
  }

  async function DashboardGroupBAutoReplies() {
    const b = await getGroupBData();
    return (
      <DashboardAutoRepliesNewsletterCards
        initialEmailCount={b.emailTemplatesCount}
        initialNewsletterCount={b.newsletterTemplatesCount}
        labels={{
          autoReplies: t("dashboard.autoReplies"),
          newsletterTemplates: t("dashboard.newsletterTemplates"),
        }}
      />
    );
  }

  const groupBSkeletonCards = (
    <>
      <div className="rounded-xl border p-4 animate-pulse" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="h-6 w-12 rounded bg-gray-200" />
        <div className="h-8 w-20 mt-2 rounded bg-gray-200" />
        <div className="h-4 w-24 mt-1 rounded bg-gray-200" />
      </div>
      <div className="rounded-xl border p-4 animate-pulse" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="h-6 w-12 rounded bg-gray-200" />
        <div className="h-8 w-20 mt-2 rounded bg-gray-200" />
        <div className="h-4 w-24 mt-1 rounded bg-gray-200" />
      </div>
    </>
  );

  const groupBSkeletonRecent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-xl border p-6 animate-pulse" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="h-5 w-32 rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded bg-gray-200" />
          ))}
        </div>
      </div>
      <div className="rounded-xl border p-6 animate-pulse" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }}>
        <div className="h-5 w-32 rounded bg-gray-200 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      <DashboardClient
        locale={locale}
        dateLocale={dateLocale}
        userName={userName}
        overview={{
          volunteers: volunteersCount ?? 0,
          adoptants: adoptantsCount ?? 0,
          activeMembers: activeMembersCount ?? 0,
          newsletter: newsletterCount ?? 0,
          donationsThisMonth: 0,
          activeSponsors: 0,
        }}
        attention={{
          pendingEmails: pendingEmailsCount ?? 0,
          volunteersStep12: 0,
          expiredSponsors: 0,
        }}
        recentVolunteers={[]}
        recentDonations={[]}
        aantalDieren={aantalDieren}
        aantalVrijwilligersActief={volunteersActiefCount ?? 0}
        aantalOpenAdopties={adoptantsCount ?? 0}
        recenteEmails={recenteEmails}
        verlopendeSponsorcontracten={verlopendeSponsorcontracten}
        groupBOverview={
          <Suspense fallback={groupBSkeletonCards}>
            <DashboardGroupBOverview />
          </Suspense>
        }
        groupBAttention={
          <Suspense fallback={null}>
            <DashboardGroupBAttention />
          </Suspense>
        }
        groupBRecent={
          <Suspense fallback={groupBSkeletonRecent}>
            <DashboardGroupBRecent />
          </Suspense>
        }
        groupBAutoReplies={
          <Suspense
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border p-4 animate-pulse h-24" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
                <div className="rounded-xl border p-4 animate-pulse h-24" style={{ background: "#f8fafc", borderColor: "#e2e8f0" }} />
              </div>
            }
          >
            <DashboardGroupBAutoReplies />
          </Suspense>
        }
      />
    </>
  );
}

export default AdminDashboardPage;
