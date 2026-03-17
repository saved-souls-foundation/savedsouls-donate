import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const client = new Anthropic();
const langMap: Record<string, string> = {
  nl: "Dutch",
  en: "English",
  th: "Thai",
};

const signatures: Record<string, string> = {
  nl: "Hartelijke groeten,\nMelanie de Wit & het team van Saved Souls Foundation\nKhon Kaen, Thailand",
  en: "Kind regards,\nMelanie de Wit & the Saved Souls Foundation team\nKhon Kaen, Thailand",
  de: "Mit freundlichen Grüßen,\nMelanie de Wit & das Team der Saved Souls Foundation\nKhon Kaen, Thailand",
  ru: "С уважением,\nМелани де Вит и команда Saved Souls Foundation\nКхон Каен, Таиланд",
  es: "Saludos cordiales,\nMelanie de Wit y el equipo de Saved Souls Foundation\nKhon Kaen, Tailandia",
  th: "ด้วยความนับถือ,\nเมลานี เดอ วิท และทีมงาน Saved Souls Foundation\nขอนแก่น ประเทศไทย",
  fr: "Cordialement,\nMelanie de Wit & l'équipe de Saved Souls Foundation\nKhon Kaen, Thaïlande",
};

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), supabase: null };
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin" || profile?.is_admin === true;
  if (!isAdmin) return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }), supabase: null };
  return { error: null, supabase: createAdminClient() };
}

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  try {
    const { prompt, language, platforms } = await req.json();
    const lang = langMap[language as keyof typeof langMap] || "Dutch";
    const isBlog = Array.isArray(platforms) && platforms.includes("blog");

    const systemPrompt = `Je bent een content schrijver voor Saved Souls Foundation,
een dierenopvang sanctuary in Khon Kaen, Thailand.
Je schrijft warme, authentieke verhalen die mensen bewegen om te helpen of adopteren.
Schrijf ALTIJD in het ${lang}. Geen hashtags tenzij gevraagd.`;

    const userPrompt = isBlog
      ? `Schrijf een volledig blogbericht (300-500 woorden) over: ${prompt ?? ""}.
Begin met een pakkende openingszin. Vertel het verhaal emotioneel en authentiek.
Eindig met een duidelijke call-to-action (adopteer, doneer, of deel).
Geen markdown headers, gewone alinea's.`
      : `Schrijf een social media bericht (max 300 woorden) over: ${prompt ?? ""}.
Warm, persoonlijk, met 2-3 relevante emoji's.
Eindig met een vraag of call-to-action.`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: isBlog ? 1000 : 400,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";
    const signature = signatures[language] ?? signatures["en"];
    const textWithSignature = text.trim() ? text + "\n\n" + signature : signature;

    return NextResponse.json({ text: textWithSignature });
  } catch (e) {
    console.error("AI write-post error:", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "AI write failed" },
      { status: 500 }
    );
  }
}
