import { z } from "zod";
import { ProductCategory, PaymentProvider } from "@/generated/prisma/enums";

// Le storage provider peut renvoyer une URL relative (disque local en dev)
// ou absolue (blob storage en prod) — les deux sont valides ici.
const imageUrlSchema = z
  .string()
  .refine((value) => value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "URL d'image invalide.",
  });

export const productCategoryOptions: { value: ProductCategory; label: string }[] = [
  { value: "FORMATION", label: "Formation" },
  { value: "EBOOK", label: "Ebook" },
  { value: "COACHING", label: "Coaching" },
  { value: "TEMPLATE", label: "Template / Canva" },
  { value: "COMMUNAUTE", label: "Communauté payante" },
  { value: "SAAS", label: "SaaS / application" },
  { value: "SERVICE", label: "Service" },
  { value: "AUTRE", label: "Autre" },
];

export const paymentProviderOptions: { value: PaymentProvider; label: string }[] = [
  { value: "CHARIOW", label: "Chariow" },
  { value: "GENERIC_LINK", label: "Autre lien de paiement" },
];

export const createProductInputSchema = z.object({
  name: z.string().min(3, "Le nom du produit doit contenir au moins 3 caractères."),
  category: z.nativeEnum(ProductCategory),
  targetAudience: z.string().min(10, "Décris ta cible en quelques mots de plus."),
  problemSolved: z.string().min(10, "Décris le problème résolu plus en détail."),
  price: z.number().positive("Le prix doit être supérieur à 0."),
  currency: z.string().min(3).max(3),
  paymentProvider: z.nativeEnum(PaymentProvider),
  paymentLinkUrl: z.string().url("Colle un lien de paiement valide (https://...)."),
  imageUrls: z.array(imageUrlSchema).max(6),
});

export type CreateProductInput = z.infer<typeof createProductInputSchema>;

export const updateProductPaymentSchema = z.object({
  paymentProvider: z.nativeEnum(PaymentProvider),
  paymentLinkUrl: z.string().url("Colle un lien de paiement valide (https://...)."),
});

export type UpdateProductPaymentInput = z.infer<typeof updateProductPaymentSchema>;
