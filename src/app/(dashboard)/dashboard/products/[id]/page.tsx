import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { productCategoryOptions } from "@/modules/product/product.types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const categoryLabel =
    productCategoryOptions.find((option) => option.value === product.category)?.label ??
    product.category;

  const selectedAngle = product.offerAngles.find((angle) => angle.status === "SELECTED");

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: selectedAngle ? "done" : "current" },
    { key: "copy", label: "Copy", status: "upcoming" },
    { key: "design", label: "Design", status: "upcoming" },
    { key: "checkout", label: "Checkout", status: "upcoming" },
    { key: "publish", label: "Publication", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">{categoryLabel}</p>
      </div>

      <Stepper steps={steps} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <h2 className="mb-3 font-semibold">Récapitulatif produit</h2>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-gray-500">Cible</dt>
              <dd>{product.targetAudience}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Problème résolu</dt>
              <dd>{product.problemSolved}</dd>
            </div>
            <div>
              <dt className="text-gray-500">Prix</dt>
              <dd>
                {product.price.toString()} {product.currency}
              </dd>
            </div>
            <div>
              <dt className="text-gray-500">Lien de paiement ({product.paymentProvider})</dt>
              <dd className="truncate">
                <a href={product.paymentLinkUrl} className="text-gray-900 underline" target="_blank" rel="noreferrer">
                  {product.paymentLinkUrl}
                </a>
              </dd>
            </div>
          </dl>

          {product.images.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.images.map((image) => (
                <div key={image.id} className="relative h-16 w-16 overflow-hidden rounded-lg border border-gray-200">
                  <Image src={image.url} alt="Visuel produit" fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </Card>

        {selectedAngle ? (
          <Card className="flex flex-col gap-3 bg-gray-50">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Angle d&apos;offre retenu</h2>
              <Link href={`/dashboard/products/${product.id}/offer`} className="text-xs font-medium text-gray-500 underline">
                Modifier
              </Link>
            </div>
            <p className="text-sm font-medium">{selectedAngle.promise}</p>
            <p className="text-sm text-gray-600">{selectedAngle.differentiator}</p>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedAngle.benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2">
                  <span aria-hidden>•</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card className="flex flex-col items-start justify-center gap-3 bg-gray-50">
            <h2 className="font-semibold">Étape suivante — Positionnement d&apos;offre</h2>
            <p className="text-sm text-gray-500">
              Laisse l&apos;IA reformuler ta promesse et proposer 3 angles différenciants à choisir.
            </p>
            <Link href={`/dashboard/products/${product.id}/offer`}>
              <Button>Générer le positionnement d&apos;offre</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
