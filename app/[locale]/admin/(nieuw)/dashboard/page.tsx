import { createAdminClient } from "@/lib/supabase/admin";
import { getTranslations } from "next-intl/server";
import { DashboardClient } from "./DashboardClient";
import { DashboardAutoRepliesNewsletterCards } from "./DashboardAutoRepliesNewsletterCards";

export default async function AdminDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations("admin");
  const supabase = createAdminClient();
  const dateLocale = locale === "en" ? "en-GB" : "nl-NL";
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);

  const [
    { count: volunteersCount },
    { count: adoptantsCount },
    { count: activeMembersCount },
    { count: newsletterCount },
    { data: donationsThisMonthData },
    { count: activeSponsorsCount },
    { count: pendingEmailsCount },
    { count: volunteersStep12Count },
    { count: expiredSponsorsCount },
    { data: recentVolunteersData },
    { data: recentDonationsData },
    { count: emailTemplatesCount },
    { count: newsletterTemplatesCount },
  ] = await Promise.all([
    supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }),
    supabase.from("adoption_applications").select("*", { count: "exact", head: true }),
    supabase.from("members").select("*", { count: "exact", head: true }).eq("status", "actief"),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }).eq("actief", true),
    supabase.from("donations").select("bedrag").gte("donatie_datum", firstDayThisMonth).eq("status", "voltooid"),
    supabase.from("sponsors").select("*", { count: "exact", head: true }).eq("status", "actief"),
    supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling"),
    supabase.from("volunteer_onboarding").select("*", { count: "exact", head: true }).lte("step", 2),
    supabase.from("sponsors").select("*", { count: "exact", head: true }).eq("status", "actief").lt("contract_eind", today),
    supabase
      .from("volunteer_onboarding")
      .select("voornaam, achternaam, step, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("donations")
      .select("bedrag, donatie_datum, donors(voornaam, achternaam, email)")
      .order("donatie_datum", { ascending: false })
      .limit(3),
    supabase.from("email_templates").select("*", { count: "exact", head: true }).eq("actief", true),
    supabase.from("newsletter_templates").select("*", { count: "exact", head: true }),
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

  return (
    <>
      <DashboardClient
        locale={locale}
        dateLocale={dateLocale}
        overview={{
          volunteers: volunteersCount ?? 0,
          adoptants: adoptantsCount ?? 0,
          activeMembers: activeMembersCount ?? 0,
          newsletter: newsletterCount ?? 0,
          donationsThisMonth: donationsThisMonthSum,
          activeSponsors: activeSponsorsCount ?? 0,
        }}
        attention={{
          pendingEmails: pendingEmailsCount ?? 0,
          volunteersStep12: volunteersStep12Count ?? 0,
          expiredSponsors: expiredSponsorsCount ?? 0,
        }}
        recentVolunteers={recentVolunteers}
        recentDonations={recentDonations}
      />
      <DashboardAutoRepliesNewsletterCards
        initialEmailCount={emailTemplatesCount ?? 0}
        initialNewsletterCount={newsletterTemplatesCount ?? 0}
        labels={{
          autoReplies: t("dashboard.autoReplies"),
          newsletterTemplates: t("dashboard.newsletterTemplates"),
        }}
      />
    </>
  );
}
