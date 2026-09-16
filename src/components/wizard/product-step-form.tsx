"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductInputSchema,
  productCategoryOptions,
  paymentProviderOptions,
  type CreateProductInput,
} from "@/modules/product/product.types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label, FieldError } from "@/components/ui/label";
import { ImageUploader } from "@/components/wizard/image-uploader";

export function ProductStepForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateProductInput>({
    resolver: zodResolver(createProductInputSchema),
    defaultValues: {
      currency: "XOF",
      paymentProvider: "CHARIOW",
      category: "FORMATION",
      imageUrls: [],
    },
  });

  async function onSubmit(values: CreateProductInput) {
    setServerError(null);
    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const body = await response.json();
    if (!response.ok) {
      setServerError(body.error ?? "Une erreur est survenue.");
      return;
    }

    router.push(`/dashboard/products/${body.product.id}/offer`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label htmlFor="name">Que vends-tu ?</Label>
        <Input id="name" placeholder="Ex. Formation « Vendre sur Instagram en 30 jours »" {...register("name")} />
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <Label htmlFor="category">Catégorie</Label>
        <Select id="category" {...register("category")}>
          {productCategoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FieldError message={errors.category?.message} />
      </div>

      <div>
        <Label htmlFor="targetAudience">À qui s&apos;adresse ce produit ?</Label>
        <Textarea
          id="targetAudience"
          placeholder="Ex. Coachs et formateurs indépendants qui démarrent sur les réseaux sociaux"
          {...register("targetAudience")}
        />
        <FieldError message={errors.targetAudience?.message} />
      </div>

      <div>
        <Label htmlFor="problemSolved">Quel problème résout-il ?</Label>
        <Textarea
          id="problemSolved"
          placeholder="Ex. Ils publient sans stratégie et n'arrivent pas à convertir leur audience en clients"
          {...register("problemSolved")}
        />
        <FieldError message={errors.problemSolved?.message} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Prix</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            {...register("price", { valueAsNumber: true })}
          />
          <FieldError message={errors.price?.message} />
        </div>
        <div>
          <Label htmlFor="currency">Devise</Label>
          <Select id="currency" {...register("currency")}>
            <option value="XOF">XOF (FCFA)</option>
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
          </Select>
        </div>
      </div>

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
        <Input
          id="paymentLinkUrl"
          placeholder="https://checkout.chariow.com/..."
          {...register("paymentLinkUrl")}
        />
        <FieldError message={errors.paymentLinkUrl?.message} />
        <p className="mt-1 text-xs text-gray-400">
          Chaque bouton d&apos;appel à l&apos;action de ta page redirigera vers ce lien.
        </p>
      </div>

      <div>
        <Label>Visuels du produit</Label>
        <Controller
          control={control}
          name="imageUrls"
          render={({ field }) => (
            <ImageUploader value={field.value ?? []} onChange={field.onChange} />
          )}
        />
      </div>

      {serverError && <p className="text-sm text-red-600">{serverError}</p>}
      {!serverError && Object.keys(errors).length > 0 && (
        <p className="text-sm text-red-600">
          Certains champs sont invalides, vérifie le formulaire ci-dessus.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting}>
        Continuer vers le positionnement d&apos;offre
      </Button>
    </form>
  );
}
