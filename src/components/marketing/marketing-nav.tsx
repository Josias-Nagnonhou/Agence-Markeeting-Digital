import Link from "next/link";
import { Button } from "@/components/ui/button";

export function MarketingNav({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <header className="absolute inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          OfferLab
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-indigo-100 sm:flex">
          <a href="#fonctionnalites" className="transition-colors hover:text-white">
            Fonctionnalités
          </a>
          <a href="#comment-ca-marche" className="transition-colors hover:text-white">
            Comment ça marche
          </a>
        </nav>
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button variant="accent" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login" className="hidden text-sm font-medium text-indigo-100 hover:text-white sm:block">
                Se connecter
              </Link>
              <Link href="/register">
                <Button variant="accent" size="sm">
                  Créer un compte
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
