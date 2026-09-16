import {
  createProductInputSchema,
  updateProductPaymentSchema,
  type CreateProductInput,
  type UpdateProductPaymentInput,
} from "@/modules/product/product.types";
import {
  createProductRecord,
  listProductsByUser,
  findProductByIdForUser,
  updateProductPaymentRecord,
} from "@/modules/product/product.repository";

export async function createProduct(userId: string, input: CreateProductInput) {
  const data = createProductInputSchema.parse(input);
  return createProductRecord(userId, data);
}

export function getProductsForUser(userId: string) {
  return listProductsByUser(userId);
}

export function getProductForUser(userId: string, productId: string) {
  return findProductByIdForUser(userId, productId);
}

export class ProductNotFoundError extends Error {
  constructor() {
    super("Produit introuvable.");
  }
}

/**
 * Vérifie que le produit existe et appartient bien à l'utilisateur, pour
 * les modules qui opèrent sur un produit (offer-engine, copywriting,
 * page-builder...). Centralise cette vérification pour éviter qu'un
 * utilisateur agisse sur le produit d'un autre vendeur.
 */
export async function getOwnedProduct(userId: string, productId: string) {
  const product = await findProductByIdForUser(userId, productId);
  if (!product) throw new ProductNotFoundError();
  return product;
}

export async function updateProductPayment(
  userId: string,
  productId: string,
  input: UpdateProductPaymentInput,
) {
  await getOwnedProduct(userId, productId);
  const data = updateProductPaymentSchema.parse(input);
  return updateProductPaymentRecord(productId, data);
}
