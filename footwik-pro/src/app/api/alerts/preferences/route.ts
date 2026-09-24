import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { competitions } = await req.json();
  if (!Array.isArray(competitions)) {
    return NextResponse.json({ error: "competitions doit être un tableau." }, { status: 400 });
  }

  await supabase.from("followed_competitions").delete().eq("user_id", user.id);
  if (competitions.length > 0) {
    const { error } = await supabase
      .from("followed_competitions")
      .insert(competitions.map((competition: string) => ({ user_id: user.id, competition })));
    if (error) return NextResponse.json({ error: error.message }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
