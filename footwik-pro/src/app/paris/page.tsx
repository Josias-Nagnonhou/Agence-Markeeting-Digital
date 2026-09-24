import { redirect } from "next/navigation";
import { LineChart } from "lucide-react";
import { getCurrentUser } from "@/lib/account";
import { createClient } from "@/lib/supabase/server";
import { FeatureGate } from "@/components/FeatureGate";
import { BetsManager } from "@/components/bets/BetsManager";
import { BetRow } from "@/lib/bets/stats";

export const dynamic = "force-dynamic";
export const metadata = { title: "Suivi de mes paris — Footwik Pro" };

export default async function ParisPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/paris");

  const supabase = createClient();
  const [{ data: bets }, { data: budget }] = await Promise.all([
    supabase
      .from("bets")
      .select("id, match_label, market, odds, stake, result, placed_at, settled_at")
      .eq("user_id", user.id)
      .order("placed_at", { ascending: false }),
    supabase.from("betting_budgets").select("monthly_limit").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-2">
        <LineChart className="text-grass" size={22} />
        <h1 className="font-display text-3xl font-bold uppercase text-ink">Suivi de mes paris</h1>
      </div>
      <p className="mt-1 text-sm text-ink-faint">
        Enregistrez vos paris pour suivre votre bilan, votre taux de
        réussite et garder le contrôle sur votre budget.
      </p>

      <div className="mt-8">
        <FeatureGate feature="bet_tracking" plan={user.plan}>
          <BetsManager
            initialBets={(bets ?? []) as BetRow[]}
            initialBudget={budget?.monthly_limit ?? null}
          />
        </FeatureGate>
      </div>
    </div>
  );
}
