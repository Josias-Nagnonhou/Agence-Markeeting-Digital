import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPageBySlug, PageNotFoundError } from "@/modules/page-builder/page.service";
import { SalesPageRenderer } from "@/components/landing/sales-page-renderer";

async function getPublishedPage(slug: string) {
  const page = await getPageBySlug(slug).catch((error) => {
    if (error instanceof PageNotFoundError) return null;
    throw error;
  });
  if (!page || page.status !== "PUBLISHED") return null;
  return page;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return {};

  return {
    title: page.seoTitle ?? page.title,
    description: page.seoDescription ?? undefined,
  };
}

export default async function PublicSalesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const themeKey = (page.template?.structure as { themeKey?: string } | null)?.themeKey;

  return (
    <SalesPageRenderer
      sections={page.sections}
      themeKey={themeKey}
      ctaHref={`/p/${page.slug}/go`}
    />
  );
}
