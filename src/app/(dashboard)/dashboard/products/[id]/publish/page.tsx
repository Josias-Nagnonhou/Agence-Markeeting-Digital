import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getProductForUser } from "@/modules/product/product.service";
import { getExistingPageForProduct } from "@/modules/page-builder/page.service";
import { getHostingInfo } from "@/modules/hosting/hosting.service";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { PublishStep } from "@/components/wizard/publish-step";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PublishPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const product = await getProductForUser(session!.user.id, id);
  if (!product) notFound();

  const page = await getExistingPageForProduct(session!.user.id, id);

  const steps: WizardStep[] = [
    { key: "product", label: "Produit", status: "done" },
    { key: "offer", label: "Offre", status: "done" },
    { key: "copy", label: "Copy", status: "done" },
    { key: "design", label: "Design", status: page?.templateId ? "done" : "current" },
    { key: "checkout", label: "Checkout", status: "done" },
    { key: "publish", label: "Publication", status: "current" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <p className="mt-1 text-sm text-gray-500">Publication</p>
      </div>

      <Stepper steps={steps} />

      {!page ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <h2 className="font-semibold">Génère d&apos;abord ta page de vente</h2>
          <Link href={`/dashboard/products/${product.id}/copy`}>
            <Button>Retour à l&apos;étape Copy</Button>
          </Link>
        </Card>
      ) : (
        <PublishStepLoader userId={session!.user.id} pageId={page.id} />
      )}
    </div>
  );
}

async function PublishStepLoader({ userId, pageId }: { userId: string; pageId: string }) {
  const info = await getHostingInfo(userId, pageId);

  return (
    <PublishStep
      pageId={pageId}
      initialStatus={info.status}
      publicUrl={info.publicUrl}
      isReady={info.isReady}
      trialEndsAt={info.subscription?.currentPeriodEnd?.toISOString() ?? null}
    />
  );
}
