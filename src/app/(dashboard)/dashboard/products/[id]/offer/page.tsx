import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { OfferStep } from "@/components/wizard/offer-step";

export default async function OfferAnglePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: "current" },
    { key: "copy", label: "Copy", status: "upcoming" },
    { key: "design", label: "Design", status: "upcoming" },
    { key: "checkout", label: "Checkout", status: "upcoming" },
    { key: "publish", label: "Publication", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Positionnement d&apos;offre</p>
      </div>

      <Stepper steps={steps} />

      <OfferStep productId={product.id} initialAngles={product.offerAngles} />
    </div>
  );
}
