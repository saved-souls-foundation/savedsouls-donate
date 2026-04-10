import { createClient } from "@/lib/supabase/server";
import { setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { AdminsBeheerClient } from "./AdminsBeheerClient";

export const metadata = {
  title: "Admins beheren",
  robots: { index: false, follow: false },
};

export default async function AdminsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) {
    redirect(`/${locale}/admin/dashboard`);
  }

  return <AdminsBeheerClient />;
}
