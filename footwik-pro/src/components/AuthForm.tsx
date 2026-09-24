"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Step = "identifiant" | "code";

export function AuthForm({
  mode,
  next = "/compte",
}: {
  mode: "connexion" | "inscription";
  next?: string;
}) {
  const [step, setStep] = useState<Step>("identifiant");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function requestCode() {
    setError(null);
    setInfo(null);

    if (mode === "inscription" && !ageConfirmed) {
      setError("Vous devez confirmer avoir 18 ans ou plus pour vous inscrire.");
      return;
    }
    if (!email) {
      setError("Merci de renseigner votre email.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (otpError) throw otpError;
      setStep("code");
      setInfo(
        "Vérifiez votre boîte mail : cliquez sur le lien reçu (ou saisissez le code s'il en contient un).",
      );
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Impossible d'envoyer le code pour le moment.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode() {
    setError(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: "email",
      });
      if (verifyError) throw verifyError;
      fetch("/api/activity/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activityType: mode === "inscription" ? "inscription" : "connexion",
          label: mode === "inscription" ? "Compte créé" : "Connexion (code)",
        }),
      }).catch(() => {});
      window.location.href = next;
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Code invalide ou expiré.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl border border-pitch-600 bg-pitch-800 p-6">
      <h1 className="font-display text-2xl font-bold uppercase text-ink">
        {mode === "connexion" ? "Connexion" : "Créer un compte"}
      </h1>
      <p className="mt-1 text-sm text-ink-faint">
        {mode === "connexion"
          ? "Recevez un code à usage unique par email."
          : "Rejoignez Footwik Pro en quelques secondes."}
      </p>

      {step === "identifiant" ? (
        <>
          <input
            type="email"
            placeholder="vous@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-5 w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2.5 text-sm text-ink placeholder:text-ink-faint"
          />

          {mode === "inscription" && (
            <label className="mt-4 flex items-start gap-2 text-xs text-ink-faint">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5"
              />
              <span>
                Je confirme avoir 18 ans ou plus et j&apos;accepte les{" "}
                <a href="/conditions" className="underline hover:text-ink">
                  conditions d&apos;utilisation
                </a>{" "}
                et la{" "}
                <a href="/confidentialite" className="underline hover:text-ink">
                  politique de confidentialité
                </a>
                .
              </span>
            </label>
          )}

          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

          <button
            onClick={requestCode}
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-grass px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Recevoir le code
          </button>
        </>
      ) : (
        <>
          {info && <p className="mt-5 text-sm text-grass">{info}</p>}
          <p className="mt-2 text-xs text-ink-faint">
            Le plus simple : ouvrez l&apos;email reçu et cliquez sur le
            lien de connexion, cet écran se mettra à jour automatiquement.
            Si votre email contient plutôt un code, saisissez-le
            ci-dessous.
          </p>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Code à 6 chiffres (optionnel si vous cliquez le lien)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-3 w-full rounded-lg border border-pitch-400 bg-pitch-600/40 px-3 py-2.5 text-center text-lg tracking-[0.5em] text-ink placeholder:tracking-normal placeholder:text-ink-faint"
          />
          {error && <p className="mt-3 text-sm text-red-300">{error}</p>}
          <button
            onClick={verifyCode}
            disabled={loading || code.length < 4}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-grass px-4 py-2.5 text-sm font-semibold text-pitch-950 hover:bg-grass-light disabled:opacity-50"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Valider le code
          </button>
          <button
            onClick={() => setStep("identifiant")}
            className="mt-2 w-full text-center text-xs text-ink-faint hover:text-ink"
          >
            Modifier l&apos;email
          </button>
        </>
      )}

      <p className="mt-6 text-center text-xs text-ink-faint">
        {mode === "connexion" ? (
          <>Pas encore de compte ? <a href={`/inscription?next=${encodeURIComponent(next)}`} className="text-grass hover:underline">Inscrivez-vous</a></>
        ) : (
          <>Déjà abonné ? <a href={`/connexion?next=${encodeURIComponent(next)}`} className="text-grass hover:underline">Connectez-vous</a></>
        )}
      </p>
    </div>
  );
}
