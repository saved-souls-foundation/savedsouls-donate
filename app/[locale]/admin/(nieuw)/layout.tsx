import { createClient } from "@/lib/supabase/server";
import AdminLayoutClient from "./AdminLayoutClient";

export default async function AdminNieuwLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
