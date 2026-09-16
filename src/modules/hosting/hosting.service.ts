import { getOwnedPage } from "@/modules/page-builder/page.service";
import {
  updatePageStatus,
  findSubscriptionByPageId,
  createTrialSubscription,
} from "@/modules/hosting/hosting.repository";

export class PageNotReadyError extends Error {
  constructor() {
    super("Génère le copywriting et choisis une direction visuelle avant de publier.");
  }
}

export class PageNotPublishedError extends Error {
  constructor() {
    super("Cette page n'est pas encore publiée.");
  }
}

function buildPublicUrl(slug: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${baseUrl}/p/${slug}`;
}

export async function publishPage(userId: string, pageId: string) {
  const page = await getOwnedPage(userId, pageId);
  if (page.sections.length === 0 || !page.templateId) throw new PageNotReadyError();

  const existingSubscription = await findSubscriptionByPageId(pageId);
  if (!existingSubscription) {
    await createTrialSubscription(pageId);
  }

  const updated = await updatePageStatus(pageId, "PUBLISHED", page.publishedAt ?? new Date());
  return { page: updated, publicUrl: buildPublicUrl(updated.slug) };
}

export async function pausePage(userId: string, pageId: string) {
  const page = await getOwnedPage(userId, pageId);
  if (page.status !== "PUBLISHED") throw new PageNotPublishedError();

  const updated = await updatePageStatus(pageId, "PAUSED");
  return { page: updated, publicUrl: buildPublicUrl(updated.slug) };
}

export async function resumePage(userId: string, pageId: string) {
  const page = await getOwnedPage(userId, pageId);
  if (page.status !== "PAUSED") throw new PageNotPublishedError();

  const updated = await updatePageStatus(pageId, "PUBLISHED");
  return { page: updated, publicUrl: buildPublicUrl(updated.slug) };
}

export async function getHostingInfo(userId: string, pageId: string) {
  const page = await getOwnedPage(userId, pageId);
  const subscription = await findSubscriptionByPageId(pageId);

  return {
    status: page.status,
    publicUrl: buildPublicUrl(page.slug),
    subscription,
    isReady: page.sections.length > 0 && Boolean(page.templateId),
  };
}
