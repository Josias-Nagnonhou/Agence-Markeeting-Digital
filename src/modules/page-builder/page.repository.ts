import { nanoid } from "nanoid";
import { prisma } from "@/lib/db/prisma";

function slugify(name: string) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export function findPageByProductId(productId: string) {
  return prisma.page.findFirst({
    where: { productId },
    include: { sections: { orderBy: { position: "asc" } }, template: true },
  });
}

export function findPageOwnedByUser(userId: string, pageId: string) {
  return prisma.page.findFirst({
    where: { id: pageId, product: { userId } },
    include: { sections: { orderBy: { position: "asc" } }, template: true },
  });
}

export async function createDraftPage(
  productId: string,
  title: string,
  offerAngleId: string,
  templateId?: string,
) {
  const baseSlug = slugify(title) || "page";
  const slug = `${baseSlug}-${nanoid(6).toLowerCase()}`;

  return prisma.page.create({
    data: { productId, offerAngleId, slug, title, templateId },
    include: { sections: { orderBy: { position: "asc" } }, template: true },
  });
}

export function updatePageOfferAngle(pageId: string, offerAngleId: string) {
  return prisma.page.update({ where: { id: pageId }, data: { offerAngleId } });
}

export function listTemplates() {
  return prisma.template.findMany({ orderBy: { createdAt: "asc" } });
}

export function findTemplateById(templateId: string) {
  return prisma.template.findUnique({ where: { id: templateId } });
}

export function updatePageTemplate(pageId: string, templateId: string) {
  return prisma.page.update({
    where: { id: pageId },
    data: { templateId },
    include: { sections: { orderBy: { position: "asc" } }, template: true },
  });
}
