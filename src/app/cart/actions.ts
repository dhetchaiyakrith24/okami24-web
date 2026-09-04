"use server";

import { revalidatePath } from "next/cache";
import { addToCart, setCartItemQuantity, removeCartItem } from "@/lib/commerce/cart";
import type { ProductRef } from "@/lib/commerce/catalog-resolver";

function readVariantId(formData: FormData): string | null {
  const raw = formData.get("variantId");
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

export async function addToCartAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");
  const ref: ProductRef = { origin: "product-master", slug, variantId: readVariantId(formData) };
  const quantity = Number(formData.get("quantity") ?? "1") || 1;
  await addToCart(ref, quantity);
  revalidatePath("/cart");
}

export async function updateQuantityAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");
  const variantId = readVariantId(formData);
  const quantity = Number(formData.get("quantity") ?? "0") || 0;
  await setCartItemQuantity(slug, variantId, quantity);
  revalidatePath("/cart");
}

export async function removeItemAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "");
  const variantId = readVariantId(formData);
  await removeCartItem(slug, variantId);
  revalidatePath("/cart");
}
