"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/historique", label: "Historique" },
  { href: "/coupon", label: "Mon coupon" },
  { href: "/paris", label: "Mes paris" },
  { href: "/alertes", label: "Alertes" },
  { href: "/vip", label: "VIP" },
  { href: "/abonnement", label: "Abonnement" },
  { href: "/assistant", label: "Assistant IA" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-pitch-600 bg-pitch-900/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-grass text-pitch-950">
            <ShieldCheck size={18} strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl font-bold uppercase tracking-wide text-ink">
            Footwik <span className="text-gold">Pro</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-ink-muted transition hover:text-grass"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/connexion"
            className="text-sm font-medium text-ink-muted transition hover:text-ink"
          >
            Connexion
          </Link>
          <Link
            href="/abonnement"
            className="rounded-lg bg-grass px-4 py-2 text-sm font-semibold text-pitch-950 transition hover:bg-grass-light"
          >
            S&apos;abonner
          </Link>
        </div>

        <button
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Ouvrir le menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-pitch-600 md:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
        style={{ transition: "max-height 0.25s ease" }}
      >
        <div className="flex flex-col gap-1 px-4 py-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-ink-muted hover:bg-pitch-600 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/connexion"
            onClick={() => setOpen(false)}
            className="rounded-md px-2 py-2 text-sm font-medium text-ink-muted hover:bg-pitch-600 hover:text-ink"
          >
            Connexion
          </Link>
          <Link
            href="/abonnement"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-grass px-4 py-2 text-center text-sm font-semibold text-pitch-950"
          >
            S&apos;abonner
          </Link>
        </div>
      </div>
    </header>
  );
}
