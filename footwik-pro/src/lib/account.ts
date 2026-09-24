import { createClient } from "@/lib/supabase/server";
import { PlanId } from "@/lib/types";
import { FOUNDER_TOTAL_SEATS, VIP_TOTAL_SEATS } from "@/lib/data/pricing";

export interface CurrentUser {
  id: string;
  email: string | null;
  plan: PlanId;
  isFounder: boolean;
  planExpiresAt: string | null;
  referralCode: string | null;
  telegramInviteCode: string | null;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  try {
    const supabase = createClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, is_founder, plan_expires_at, referral_code, telegram_invite_code")
      .eq("id", user.id)
      .maybeSingle();

    return {
      id: user.id,
      email: user.email ?? null,
      plan: (profile?.plan as PlanId) ?? "gratuit",
      isFounder: profile?.is_founder ?? false,
      planExpiresAt: profile?.plan_expires_at ?? null,
      referralCode: profile?.referral_code ?? null,
      telegramInviteCode: profile?.telegram_invite_code ?? null,
    };
  } catch {
    return null;
  }
}

export async function getFounderSeatsRemaining(): Promise<number> {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("is_founder", true);
    return Math.max(0, FOUNDER_TOTAL_SEATS - (count ?? 0));
  } catch {
    return FOUNDER_TOTAL_SEATS;
  }
}

export async function getVipSeatsRemaining(): Promise<number> {
  try {
    const supabase = createClient();
    const { count } = await supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("plan", "vip");
    return Math.max(0, VIP_TOTAL_SEATS - (count ?? 0));
  } catch {
    return VIP_TOTAL_SEATS;
  }
}
