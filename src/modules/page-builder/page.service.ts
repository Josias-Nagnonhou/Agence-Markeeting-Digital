import { getOwnedProduct } from "@/modules/product/product.service";
import {
  findPageByProductId,
  findPageOwnedByUser,
  createDraftPage,
  updatePageOfferAngle,
  listTemplates,
  findTemplateById,
  updatePageTemplate,
  findPageBySlug,
} from "@/modules/page-builder/page.repository";

export class PageNotFoundError extends Error {
  constructor() {
    super("Page introuvable.");
  }
}

export class NoSelectedOfferAngleError extends Error {
  constructor() {
    super("Choisis d'abord un angle d'offre avant de générer le copywriting.");
  }
}

export class TemplateNotFoundError extends Error {
  constructor() {
    super("Direction visuelle introuvable.");
  }
}

export async function getOwnedPage(userId: string, pageId: string) {
  const page = await findPageOwnedByUser(userId, pageId);
  if (!page) throw new PageNotFoundError();
  return page;
}

/**
 * Récupère la page de vente brouillon d'un produit, ou la crée si elle
 * n'existe pas encore. Nécessite qu'un angle d'offre ait été sélectionné
 * (1.2), puisque la page s'appuie sur cet angle pour le copywriting (1.3).
 */
export async function getOrCreateDraftPageForProduct(userId: string, productId: string) {
  const product = await getOwnedProduct(userId, productId);

  const selectedAngle = product.offerAngles.find((angle) => angle.status === "SELECTED");
  if (!selectedAngle) throw new NoSelectedOfferAngleError();

  const existingPage = await findPageByProductId(productId);
  if (existingPage) {
    if (existingPage.offerAngleId !== selectedAngle.id) {
      await updatePageOfferAngle(existingPage.id, selectedAngle.id);
    }
    return { page: existingPage, product, selectedAngle };
  }

  const [defaultTemplate] = await listTemplates();
  const page = await createDraftPage(productId, product.name, selectedAngle.id, defaultTemplate?.id);
  return { page, product, selectedAngle };
}

export async function getAvailableTemplates() {
  return listTemplates();
}

export async function selectTemplateForPage(userId: string, pageId: string, templateId: string) {
  await getOwnedPage(userId, pageId);
  const template = await findTemplateById(templateId);
  if (!template) throw new TemplateNotFoundError();

  return updatePageTemplate(pageId, templateId);
}

/**
 * Lecture seule : renvoie la page existante d'un produit sans en créer une
 * si elle n'existe pas encore (contrairement à `getOrCreateDraftPageForProduct`).
 */
export async function getExistingPageForProduct(userId: string, productId: string) {
  await getOwnedProduct(userId, productId);
  return findPageByProductId(productId);
}

/**
 * Accès public (sans authentification) : utilisé par la page publique et
 * la redirection checkout, qui s'adressent à l'acheteur, pas au vendeur.
 */
export async function getPageBySlug(slug: string) {
  const page = await findPageBySlug(slug);
  if (!page) throw new PageNotFoundError();
  return page;
}
