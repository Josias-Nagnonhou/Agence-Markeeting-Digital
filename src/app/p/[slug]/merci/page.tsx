import { notFound } from "next/navigation";
import { getPageBySlug, PageNotFoundError } from "@/modules/page-builder/page.service";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await getPageBySlug(slug).catch((error) => {
    if (error instanceof PageNotFoundError) return null;
    throw error;
  });
  if (!page) notFound();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center">
      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl text-green-600">
          ✓
        </div>
        <h1 className="text-xl font-semibold">Merci pour ton achat !</h1>
        <p className="mt-2 text-sm text-gray-500">
          Ta commande pour <span className="font-medium text-gray-900">{page.product.name}</span> a
          bien été prise en compte. Tu vas recevoir un e-mail de confirmation avec les prochaines
          étapes.
        </p>
      </div>
    </main>
  );
}
