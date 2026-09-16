"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label, FieldError } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis."),
});
type LoginInput = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setServerError(null);
    const result = await signIn("credentials", { ...values, redirect: false });

    if (result?.error) {
      setServerError("E-mail ou mot de passe incorrect.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h1 className="text-lg font-semibold">Connexion</h1>

      <div>
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" type="email" placeholder="vous@exemple.com" {...register("email")} />
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" type="password" {...register("password")} />
        <FieldError message={errors.password?.message} />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Se connecter
      </Button>

      <p className="text-center text-sm text-gray-500">
        Pas encore de compte ?{" "}
        <a href="/register" className="font-medium text-gray-900 underline">
          Créer un compte
        </a>
      </p>
    </form>
  );
}
