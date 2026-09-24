import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { monthlyLimit } = await req.json();
  if (typeof monthlyLimit !== "number" || monthlyLimit < 0) {
    return NextResponse.json({ error: "Budget invalide." }, { status: 400 });
  }

  const { error } = await supabase
    .from("betting_budgets")
    .upsert({ user_id: user.id, monthly_limit: monthlyLimit, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 502 });

  return NextResponse.json({ ok: true });
}
