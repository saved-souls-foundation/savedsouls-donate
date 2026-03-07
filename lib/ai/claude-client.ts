import Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

const SYSTEM_PROMPT =
  "Je bent de AI-assistent van Saved Souls Foundation, een dierenopvang in Thailand (Ban Khok Ngam). Wij redden zwerfhonden en katten. Toon altijd warmte, empathie en professionaliteit. Schrijf in de taal van de ontvanger. Houd antwoorden beknopt.";

const MODEL_IDS = {
  haiku: "claude-3-haiku-20240307",
  sonnet: "claude-3-5-sonnet-20241022",
} as const;

const COST_PER_TOKEN = {
  haiku: { input: 0.0000008, output: 0.000004 },
  sonnet: { input: 0.000003, output: 0.000015 },
} as const;

export type ClaudeModelOption = "haiku" | "sonnet";

export async function callClaude(
  userPrompt: string,
  options?: {
    model?: ClaudeModelOption;
    maxTokens?: number;
    taskName?: string;
    systemExtra?: string;
  }
): Promise<string> {
  const modelKey = options?.model ?? "haiku";
  const maxTokens = options?.maxTokens ?? 500;
  const taskName = options?.taskName ?? undefined;
  const systemExtra = options?.systemExtra ?? "";

  const modelId = MODEL_IDS[modelKey];
  const systemPrompt = systemExtra
    ? `${SYSTEM_PROMPT}\n\n${systemExtra}`
    : SYSTEM_PROMPT;

  const client = new Anthropic();
  const message = await client.messages.create({
    model: modelId,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const output = textBlock && textBlock.type === "text" ? textBlock.text : "";

  const inputTokens = message.usage.input_tokens;
  const outputTokens = message.usage.output_tokens;

  const cost = COST_PER_TOKEN[modelKey];
  const estimatedCostUsd =
    inputTokens * cost.input + outputTokens * cost.output;

  if (isSupabaseAdminConfigured()) {
    try {
      const admin = createAdminClient();
      await admin.from("ai_usage_log").insert({
        model: modelId,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        task: taskName ?? null,
        estimated_cost_usd: estimatedCostUsd,
      });
    } catch (err) {
      console.error("[ai_usage_log] Supabase log error:", err);
    }
  }

  return output;
}

export async function getMonthlyUsage(): Promise<number> {
  if (!isSupabaseAdminConfigured()) return 0;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startStr = startOfMonth.toISOString();

  try {
    const admin = createAdminClient();
    const { data, error } = await admin
      .from("ai_usage_log")
      .select("estimated_cost_usd")
      .gte("created_at", startStr);

    if (error) {
      console.error("[getMonthlyUsage] Supabase error:", error);
      return 0;
    }

    const total = (data ?? []).reduce(
      (sum, row) => sum + Number(row.estimated_cost_usd ?? 0),
      0
    );
    return total;
  } catch (err) {
    console.error("[getMonthlyUsage] error:", err);
    return 0;
  }
}
