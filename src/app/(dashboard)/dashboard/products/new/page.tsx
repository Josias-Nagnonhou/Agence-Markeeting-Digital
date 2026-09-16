import { Card } from "@/components/ui/card";
import { Stepper, type WizardStep } from "@/components/wizard/stepper";
import { ProductStepForm } from "@/components/wizard/product-step-form";

const steps: WizardStep[] = [
  { key: "product", label: "Produit", status: "current" },
  { key: "offer", label: "Offre", status: "upcoming" },
  { key: "copy", label: "Copy", status: "upcoming" },
  { key: "design", label: "Design", status: "upcoming" },
  { key: "checkout", label: "Checkout", status: "upcoming" },
  { key: "publish", label: "Publication", status: "upcoming" },
];

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Nouveau produit</h1>
        <p className="mt-1 text-sm text-gray-500">
          Décris ton produit : ces informations serviront de base au positionnement d&apos;offre et au copywriting générés par l&apos;IA.
        </p>
      </div>

      <Stepper steps={steps} />

      <Card className="max-w-2xl">
        <ProductStepForm />
      </Card>
    </div>
  );
}
