import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { getCopyForProduct } from "@/modules/copywriting/copywriting.service";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { CopyStep } from "@/components/wizard/copy-step";

export default async function CopyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const hasSelectedAngle = product.offerAngles.some((angle) => angle.status === "SELECTED");
  const { page, sections } = await getCopyForProduct(session!.user.id, id);

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: "done" },
    { key: "copy", label: "Copy", status: "current" },
    { key: "design", label: "Design", status: "upcoming" },
    { key: "checkout", label: "Checkout", status: "upcoming" },
    { key: "publish", label: "Publication", status: "upcoming" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Copywriting</p>
      </div>

      <Stepper steps={steps} />

      <CopyStep
        productId={product.id}
        pageId={page?.id ?? null}
        initialSections={sections}
        hasSelectedAngle={hasSelectedAngle}
      />
    </div>
  );
}
