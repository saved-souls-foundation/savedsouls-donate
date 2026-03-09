import { createAdminClient } from "@/lib/supabase/admin";
import { setRequestLocale } from "next-intl/server";
import AdminLayoutClient from "./AdminLayoutClient";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminNieuwLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  let pendingEmailsCount = 0;
  let aantalDieren = 0;
  let recentUnreadEmails: { id: string; onderwerp: string | null; van_email: string | null; van_naam: string | null; ontvangen_op: string }[] = [];
  try {
    const admin = createAdminClient();
    try {
      const { count } = await admin.from("dieren").select("*", { count: "exact", head: true }).eq("status", "in_opvang");
      aantalDieren = count ?? 0;
    } catch {
      aantalDieren = 0;
    }
    // Zelfde definitie als Onbeantwoord-tab: in_behandeling, nog niet beantwoord, niet door AI verstuurd
    const onbeantwoordCount = admin.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false");
    const onbeantwoordList = admin.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false").order("ontvangen_op", { ascending: false }).limit(3);
    const [countRes, listRes] = await Promise.all([onbeantwoordCount, onbeantwoordList]);
    if (!countRes.error && !listRes.error) {
      pendingEmailsCount = countRes.count ?? 0;
      recentUnreadEmails = (listRes.data ?? []).map((r) => ({
        id: r.id,
        onderwerp: r.onderwerp ?? null,
        van_email: r.van_email ?? null,
        van_naam: r.van_naam ?? null,
        ontvangen_op: r.ontvangen_op,
      }));
    } else {
      const { count } = await admin.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false");
      pendingEmailsCount = count ?? 0;
      const { data: rows } = await admin.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false").order("ontvangen_op", { ascending: false }).limit(3);
      recentUnreadEmails = (rows ?? []).map((r) => ({ id: r.id, onderwerp: r.onderwerp ?? null, van_email: r.van_email ?? null, van_naam: r.van_naam ?? null, ontvangen_op: r.ontvangen_op }));
    }
  } catch {
    try {
      const admin = createAdminClient();
      const { count } = await admin.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false");
      pendingEmailsCount = count ?? 0;
      const { data: rows } = await admin.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").is("beantwoord_op", null).or("ai_automatisch_verstuurd.is.null,ai_automatisch_verstuurd.eq.false").order("ontvangen_op", { ascending: false }).limit(3);
      recentUnreadEmails = (rows ?? []).map((r) => ({ id: r.id, onderwerp: r.onderwerp ?? null, van_email: r.van_email ?? null, van_naam: r.van_naam ?? null, ontvangen_op: r.ontvangen_op }));
    } catch {
      recentUnreadEmails = [];
    }
  }

  return (
    <AdminLayoutClient pendingEmailsCount={pendingEmailsCount} recentUnreadEmails={recentUnreadEmails} aantalDieren={aantalDieren}>
      {children}
    </AdminLayoutClient>
  );
}
