import Link from "next/link";
import { auth, signOut } from "@/lib/auth/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider>
      <div className="flex min-h-screen flex-col bg-gray-50">
        <header className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-lg font-semibold tracking-tight">
                OfferLab
              </Link>
              <nav className="flex items-center gap-4 text-sm text-gray-600">
                <Link href="/dashboard" className="hover:text-gray-900">
                  Mes produits
                </Link>
                <Link href="/dashboard/diagnostic" className="hover:text-gray-900">
                  Diagnostic
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{session.user.email}</span>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/login" });
                }}
              >
                <button type="submit" className="font-medium text-gray-900 underline">
                  Se déconnecter
                </button>
              </form>
            </div>
          </div>
        </header>
        <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
