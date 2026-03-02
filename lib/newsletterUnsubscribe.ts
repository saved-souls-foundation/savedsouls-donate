import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Unsubscribe by token: set actief = false, uitgeschreven_op = now().
 * Returns { done: true } if a row was updated, { done: false } if token not found.
 */
export async function unsubscribeByToken(token: string | null): Promise<{ done: boolean }> {
  if (!token || typeof token !== "string" || !token.trim()) return { done: false };
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ actief: false, uitgeschreven_op: new Date().toISOString() })
    .eq("unsubscribe_token", token.trim())
    .select("id")
    .maybeSingle();
  if (error) {
    console.error("[newsletter] unsubscribeByToken error:", error);
    return { done: false };
  }
  return { done: !!data };
}
