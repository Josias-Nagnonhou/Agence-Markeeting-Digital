import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { PlanId } from "@/lib/types";
import { FOUNDER_TOTAL_SEATS, VIP_TOTAL_SEATS } from "@/lib/data/pricing";

const VALID_PLANS: PlanId[] = ["gratuit", "semaine", "mois", "trimestre", "an", "vip"];

export async function POST(req: NextRequest) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isAdmin) return NextResponse.json({ error: "forbidden" }, { status: 403 });

  const { userId, plan, isFounder } = await req.json();
  if (!userId || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: "Paramètres invalides." }, { status: 400 });
  }

  if (isFounder) {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_founder", true)
      .neq("id", userId);
    if ((count ?? 0) >= FOUNDER_TOTAL_SEATS) {
      return NextResponse.json({ error: "Les 100 places fondateur sont déjà prises." }, { status: 409 });
    }
  }

  if (plan === "vip") {
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "vip")
      .neq("id", userId);
    if ((count ?? 0) >= VIP_TOTAL_SEATS) {
      return NextResponse.json({ error: "Les 200 places VIP sont déjà prises." }, { status: 409 });
    }
  }

  const { error } = await supabase
    .from("profiles")
    .update({ plan, is_founder: !!isFounder })
    .eq("id", userId);
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}
