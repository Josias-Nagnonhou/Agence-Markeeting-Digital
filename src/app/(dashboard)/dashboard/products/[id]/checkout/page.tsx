import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { getCopyForProduct } from "@/modules/copywriting/copywriting.service";
import { buildConfirmationUrl } from "@/modules/checkout/checkout.service";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { CheckoutStep } from "@/components/wizard/checkout-step";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const { page } = await getCopyForProduct(session!.user.id, id);

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: "done" },
    { key: "copy", label: "Copy", status: "done" },
    { key: "design", label: "Design", status: page?.templateId ? "done" : "current" },
    { key: "checkout", label: "Checkout", status: "current" },
    { key: "publish", label: "Publication", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Checkout</p>
      </div>

      <Stepper steps={steps} />

      {!page ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <h2 className="font-semibold">Génère d&apos;abord ta page de vente</h2>
          <p className="max-w-md text-sm text-gray-500">
            Le lien de checkout redirige depuis ta page de vente une fois qu&apos;elle existe.
          </p>
          <Link href={`/dashboard/products/${product.id}/copy`}>
            <Button>Retour à l&apos;étape Copy</Button>
          </Link>
        </Card>
      ) : (
        <CheckoutStep
          productId={product.id}
          slug={page.slug}
          defaultValues={{
            paymentProvider: product.paymentProvider,
            paymentLinkUrl: product.paymentLinkUrl,
          }}
          confirmationUrl={buildConfirmationUrl(page.slug)}
        />
      )}
    </div>
  );
}
