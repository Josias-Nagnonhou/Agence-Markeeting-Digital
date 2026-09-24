"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Connexion en cours...");
  const [retryHref, setRetryHref] = useState("/connexion");

  useEffect(() => {
    async function run() {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const errorDescription = params.get("error_description");
      const rawNext = params.get("next");
      const next = rawNext && rawNext.startsWith("/") ? rawNext : "/compte";

      setRetryHref(`/connexion?next=${encodeURIComponent(next)}`);

      if (errorDescription) {
        setStatus("error");
        setMessage(decodeURIComponent(errorDescription));
        return;
      }

      if (!code) {
        setStatus("error");
        setMessage("Lien de connexion invalide ou déjà utilisé.");
        return;
      }

      try {
        const supabase = createClient();
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) throw error;
        setStatus("success");
        setMessage("Connexion réussie, redirection...");
        window.location.replace(next);
      } catch (e) {
        setStatus("error");
        setMessage(
          e instanceof Error ? e.message : "Ce lien a expiré ou a déjà été utilisé.",
        );
      }
    }
    run();
  }, []);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24 text-center">
      {status === "loading" && <Loader2 size={32} className="animate-spin text-grass" />}
      {status === "success" && <CheckCircle2 size={32} className="text-grass" />}
      {status === "error" && <XCircle size={32} className="text-red-300" />}
      <p className="mt-4 text-sm text-ink-muted">{message}</p>
      {status === "error" && (
        <a
          href={retryHref}
          className="mt-5 rounded-lg bg-grass px-5 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light"
        >
          Réessayer la connexion
        </a>
      )}
    </div>
  );
}
