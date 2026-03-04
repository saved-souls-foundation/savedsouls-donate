import { createClient } from "@/lib/supabase/server";
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
  let recentUnreadEmails: { id: string; onderwerp: string | null; van_email: string | null; van_naam: string | null; ontvangen_op: string }[] = [];
  try {
    const supabase = await createClient();
    const baseCount = supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling");
    const baseList = supabase.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").order("ontvangen_op", { ascending: false }).limit(3);
    const [countRes, listRes] = await Promise.all([baseCount.eq("gelezen", false), baseList.eq("gelezen", false)]);
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
      const { count } = await supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling");
      pendingEmailsCount = count ?? 0;
      const { data: rows } = await supabase.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").order("ontvangen_op", { ascending: false }).limit(3);
      recentUnreadEmails = (rows ?? []).map((r) => ({ id: r.id, onderwerp: r.onderwerp ?? null, van_email: r.van_email ?? null, van_naam: r.van_naam ?? null, ontvangen_op: r.ontvangen_op }));
    }
  } catch {
    try {
      const supabase = await createClient();
      const { count } = await supabase.from("incoming_emails").select("*", { count: "exact", head: true }).eq("status", "in_behandeling");
      pendingEmailsCount = count ?? 0;
      const { data: rows } = await supabase.from("incoming_emails").select("id, onderwerp, van_email, van_naam, ontvangen_op").eq("status", "in_behandeling").order("ontvangen_op", { ascending: false }).limit(3);
      recentUnreadEmails = (rows ?? []).map((r) => ({ id: r.id, onderwerp: r.onderwerp ?? null, van_email: r.van_email ?? null, van_naam: r.van_naam ?? null, ontvangen_op: r.ontvangen_op }));
    } catch {
      recentUnreadEmails = [];
    }
  }

  return (
    <AdminLayoutClient pendingEmailsCount={pendingEmailsCount} recentUnreadEmails={recentUnreadEmails}>
      {children}
    </AdminLayoutClient>
  );
}
