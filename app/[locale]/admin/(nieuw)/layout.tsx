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
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("incoming_emails")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_behandeling");
    pendingEmailsCount = count ?? 0;
  } catch {
    pendingEmailsCount = 0;
  }

  return (
    <AdminLayoutClient pendingEmailsCount={pendingEmailsCount}>
      {children}
    </AdminLayoutClient>
  );
}
