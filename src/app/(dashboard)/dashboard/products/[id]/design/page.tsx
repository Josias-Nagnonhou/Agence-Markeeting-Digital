import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { getCopyForProduct } from "@/modules/copywriting/copywriting.service";
import { getAvailableTemplates } from "@/modules/page-builder/page.service";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { DesignStep } from "@/components/wizard/design-step";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DesignPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const { page, sections } = await getCopyForProduct(session!.user.id, id);
  const templates = await getAvailableTemplates();

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: "done" },
    { key: "copy", label: "Copy", status: "done" },
    { key: "design", label: "Design", status: "current" },
    { key: "checkout", label: "Checkout", status: "upcoming" },
    { key: "publish", label: "Publication", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Design</p>
      </div>

      <Stepper steps={steps} />

      {!page || sections.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <h2 className="font-semibold">Génère d&apos;abord ton copywriting</h2>
          <p className="max-w-md text-sm text-gray-500">
            La direction visuelle s&apos;applique au copy généré à l&apos;étape précédente.
          </p>
          <Link href={`/dashboard/products/${product.id}/copy`}>
            <Button>Retour à l&apos;étape Copy</Button>
          </Link>
        </Card>
      ) : (
        <DesignStep
          productId={product.id}
          pageId={page.id}
          sections={sections}
          templates={templates}
          initialTemplateId={page.templateId}
          ctaHref={product.paymentLinkUrl}
        />
      )}
    </div>
  );
}
