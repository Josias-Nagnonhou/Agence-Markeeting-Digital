import Link from "next/link";
import { auth } from "@/lib/auth/auth";
import { getProductsForUser } from "@/modules/product/product.service";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const statusLabels: Record<string, string> = {
  DRAFT: "Brouillon",
  PUBLISHED: "Publiée",
  PAUSED: "En pause",
};

export default async function DashboardPage() {
  const session = await auth();
  const products = await getProductsForUser(session!.user.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Mes produits</h1>
          <p className="text-sm text-gray-500">
            Gère tes produits et leurs pages de vente depuis un seul endroit.
          </p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>Nouveau produit</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-gray-600">Tu n&apos;as pas encore de produit.</p>
          <Link href="/dashboard/products/new">
            <Button>Créer mon premier produit</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {products.map((product) => (
            <Link key={product.id} href={`/dashboard/products/${product.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <h2 className="font-semibold">{product.name}</h2>
                <p className="mt-1 text-sm text-gray-500">
                  {product.price.toString()} {product.currency}
                </p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs">
                  {product.pages.length === 0 ? (
                    <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-500">
                      Pas encore de page
                    </span>
                  ) : (
                    product.pages.map((page) => (
                      <span key={page.id} className="rounded-full bg-gray-100 px-2 py-1 text-gray-600">
                        {statusLabels[page.status] ?? page.status}
                      </span>
                    ))
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
