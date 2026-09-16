import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { getOrdersForUser, getSubscriptionsForUser } from "@/modules/billing/billing.service";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  const [orders, subscriptions] = await Promise.all([
    getOrdersForUser(session.user.id),
    getSubscriptionsForUser(session.user.id),
  ]);

  return NextResponse.json({ orders, subscriptions });
}
