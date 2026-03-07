import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseAdminConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || token !== cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 500 }
    );
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startStr = startOfMonth.toISOString();

  try {
    const admin = createAdminClient();
    const { data: rows, error } = await admin
      .from("ai_usage_log")
      .select("model, task, input_tokens, output_tokens, estimated_cost_usd")
      .gte("created_at", startStr);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    const list = rows ?? [];
    let totalTokens = 0;
    let totalCostUsd = 0;
    const byModel: Record<string, { tokens: number; cost_usd: number }> = {};
    const byTask: Record<string, { tokens: number; cost_usd: number }> = {};

    for (const row of list) {
      const input = Number(row.input_tokens) || 0;
      const output = Number(row.output_tokens) || 0;
      const tokens = input + output;
      const cost = Number(row.estimated_cost_usd) || 0;

      totalTokens += tokens;
      totalCostUsd += cost;

      const model = row.model ?? "unknown";
      if (!byModel[model]) byModel[model] = { tokens: 0, cost_usd: 0 };
      byModel[model].tokens += tokens;
      byModel[model].cost_usd += cost;

      const task = row.task ?? "(geen)";
      if (!byTask[task]) byTask[task] = { tokens: 0, cost_usd: 0 };
      byTask[task].tokens += tokens;
      byTask[task].cost_usd += cost;
    }

    return NextResponse.json({
      total_tokens_this_month: totalTokens,
      total_cost_usd_this_month: totalCostUsd,
      by_model: byModel,
      by_task: byTask,
    });
  } catch (e) {
    console.error("[api/ai/usage]", e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 }
    );
  }
}
