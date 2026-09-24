import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { hasFeature, couponQuota } from "@/lib/entitlements";
import { PlanId } from "@/lib/types";
import { analyzeManualSelections, analyzeImage } from "@/lib/coupon/analyze";

async function getMonthlyUsage(
  supabase: ReturnType<typeof createClient>,
  userId: string,
): Promise<number> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("coupon_analyses")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());
  return count ?? 0;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .maybeSingle();
  const plan = (profile?.plan as PlanId) ?? "gratuit";

  if (!hasFeature(plan, "coupon_analysis")) {
    return NextResponse.json(
      { error: "Cette fonctionnalité nécessite le forfait Mois ou supérieur." },
      { status: 403 },
    );
  }

  const quota = couponQuota(plan);
  const used = await getMonthlyUsage(supabase, user.id);
  if (used >= quota) {
    return NextResponse.json(
      { error: "Vous avez atteint votre quota d'analyses de coupon pour ce mois." },
      { status: 403 },
    );
  }

  let body: {
    mode: "manuel" | "image";
    selections?: { matchLabel: string; market: string; odds?: number }[];
    imageBase64?: string;
    mimeType?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  try {
    const result =
      body.mode === "image" && body.imageBase64
        ? await analyzeImage(body.imageBase64, body.mimeType || "image/png")
        : await analyzeManualSelections(body.selections ?? []);

    await supabase.from("coupon_analyses").insert({
      user_id: user.id,
      source: body.mode === "image" ? "image" : "manuel",
      selections: result.selections,
      overall_risk: result.overallRisk,
      summary: result.summary,
    });

    await supabase.from("activity_log").insert({
      user_id: user.id,
      activity_type: "coupon_analyse",
      label: `Analyse d'un coupon (${result.selections.length} sélection${result.selections.length > 1 ? "s" : ""})`,
      metadata: { overallRisk: result.overallRisk },
    });

    const remaining = quota === Infinity ? null : Math.max(0, quota - used - 1);
    return NextResponse.json({ ...result, remaining });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "L'analyse a échoué." },
      { status: 502 },
    );
  }
}
