"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProductPaymentSchema,
  paymentProviderOptions,
  type UpdateProductPaymentInput,
} from "@/modules/product/product.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function CheckoutStep({
  productId,
  slug,
  defaultValues,
  confirmationUrl,
}: {
  productId: string;
  slug: string;
  defaultValues: UpdateProductPaymentInput;
  confirmationUrl: string;
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProductPaymentInput>({
    resolver: zodResolver(updateProductPaymentSchema),
    defaultValues,
  });

  const currentProvider = useWatch({ control, name: "paymentProvider" });
  const isChariow = currentProvider === "CHARIOW";

  async function onSubmit(values: UpdateProductPaymentInput) {
    setServerError(null);
    const response = await fetch(`/api/products/${productId}/checkout`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json();
    if (!response.ok) {
      setServerError(body.error ?? "Une erreur est survenue.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  const goUrl = `/p/${slug}/go`;

  return (
    <div className="space-y-6">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="font-semibold">Lien de paiement</h2>

          <div>
            <Label htmlFor="paymentProvider">Où encaisses-tu le paiement ?</Label>
            <Select id="paymentProvider" {...register("paymentProvider")}>
              {paymentProviderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="paymentLinkUrl">Lien de paiement</Label>
            <Input id="paymentLinkUrl" {...register("paymentLinkUrl")} />
            <FieldError message={errors.paymentLinkUrl?.message} />
          </div>

          {serverError && <p className="text-sm text-red-600">{serverError}</p>}

          <div className="flex items-center gap-3">
            <Button type="submit" isLoading={isSubmitting}>
              Enregistrer
            </Button>
            {saved && <span className="text-xs text-gray-400">Enregistré ✓</span>}
          </div>
        </form>
      </Card>

      <Card className="space-y-3 bg-gray-50">
        <h2 className="font-semibold">Retour après paiement</h2>
        {isChariow ? (
          <p className="text-sm text-gray-600">
            Chariow ramène automatiquement l&apos;acheteur vers ta page de confirmation après
            paiement — rien à configurer.
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Ton outil de paiement ne gère pas de retour automatique reconnu. Configure l&apos;URL
            ci-dessous comme page de redirection après paiement dans ses réglages :
          </p>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <code className="flex-1 truncate text-xs text-gray-700">{confirmationUrl}</code>
        </div>

        <a href={goUrl} target="_blank" rel="noreferrer" className="inline-block">
          <Button variant="secondary" size="sm" type="button">
            Tester le lien de paiement
          </Button>
        </a>
      </Card>

      <div className="flex justify-end">
        <Button onClick={() => router.push(`/dashboard/products/${productId}/publish`)}>
          Continuer vers la publication
        </Button>
      </div>
    </div>
  );
}
