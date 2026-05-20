"use server";

import { addToCartAction } from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/cart";
import { fetchProductByHandle } from "@/lib/shopify/product";
import { productHasVariantSizes } from "@/lib/shopify/variant-utils";

export type AddWishlistToCartResult =
  | { success: true; cart: Cart }
  | {
      success: false;
      needsOptions: boolean;
      handle: string;
      message: string;
    };

export async function addWishlistItemToCartAction(
  handle: string,
): Promise<AddWishlistToCartResult> {
  try {
    const product = await fetchProductByHandle(handle);
    if (!product) {
      return {
        success: false,
        needsOptions: false,
        handle,
        message: "Produit introuvable.",
      };
    }

    const availableVariants = product.variants.filter(
      (v) => v.availableForSale,
    );

    if (availableVariants.length === 0) {
      return {
        success: false,
        needsOptions: false,
        handle,
        message: "Ce produit est indisponible.",
      };
    }

    const needsOptions =
      product.genres.length > 1 || productHasVariantSizes(product.sizes);

    if (needsOptions) {
      return {
        success: false,
        needsOptions: true,
        handle,
        message: "Choisissez le genre ou la taille sur la fiche produit.",
      };
    }

    const variantId = availableVariants[0].id;
    const cart = await addToCartAction(variantId, 1);

    return { success: true, cart };
  } catch (err) {
    return {
      success: false,
      needsOptions: false,
      handle,
      message:
        err instanceof Error ? err.message : "Impossible d'ajouter au panier.",
    };
  }
}
