"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerInputSchema, type RegisterInput } from "@/modules/auth/auth.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({ resolver: zodResolver(registerInputSchema) });

  async function onSubmit(values: RegisterInput) {
    setServerError(null);
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setServerError(body.error ?? "Une erreur est survenue.");
      return;
    }

    const signInResult = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInResult?.error) {
      setServerError("Compte créé, mais la connexion automatique a échoué. Connecte-toi manuellement.");
      router.push("/login");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold">Créer un compte</h1>

      <div>
        <Label htmlFor="name">Nom</Label>
        <Input id="name" placeholder="Aïcha Koné" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="vous@exemple.com" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" placeholder="Au moins 8 caractères" {...register("password")} />
        <FieldError message={errors.password?.message} />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Créer mon compte
      </Button>

      <p className="text-center text-sm text-gray-500">
        Déjà inscrit ?{" "}
        <a href="/login" className="font-medium text-gray-900 underline">
          Se connecter
        </a>
      </p>
    </form>
  );
}
