import {
  createProductInputSchema,
  type CreateProductInput,
} from "@/modules/product/product.types";
import {
  createProductRecord,
  listProductsByUser,
  findProductByIdForUser,
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
