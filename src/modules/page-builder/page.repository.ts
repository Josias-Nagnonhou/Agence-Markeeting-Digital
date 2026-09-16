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
    include: { sections: { orderBy: { position: "asc" } } },
  });
}

export function findPageOwnedByUser(userId: string, pageId: string) {
  return prisma.page.findFirst({
    where: { id: pageId, product: { userId } },
    include: { sections: { orderBy: { position: "asc" } } },
  });
}

export async function createDraftPage(productId: string, title: string, offerAngleId: string) {
  const baseSlug = slugify(title) || "page";
  const slug = `${baseSlug}-${nanoid(6).toLowerCase()}`;

  return prisma.page.create({
    data: { productId, offerAngleId, slug, title },
    include: { sections: { orderBy: { position: "asc" } } },
  });
}

export function updatePageOfferAngle(pageId: string, offerAngleId: string) {
  return prisma.page.update({ where: { id: pageId }, data: { offerAngleId } });
}
