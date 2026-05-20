"use server";

import { cookies } from "next/headers";
import { CART_COOKIE_MAX_AGE, CART_COOKIE_NAME } from "@/lib/cart/constants";
import {
  addToCart,
  createCart,
  getCart,
  removeCartLine,
  updateCartLine,
  type Cart,
} from "@/lib/shopify/cart";

async function getCartIdFromCookie(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

async function saveCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
}

async function ensureCart(): Promise<Cart> {
  const existingId = await getCartIdFromCookie();

  if (existingId) {
    const cart = await getCart(existingId);
    if (cart) return cart;
  }

  const cart = await createCart();
  await saveCartId(cart.id);
  return cart;
}

export async function getCartAction(): Promise<Cart> {
  return ensureCart();
}

export async function addToCartAction(
  variantId: string,
  quantity = 1,
): Promise<Cart> {
  const cart = await ensureCart();
  const updated = await addToCart(cart.id, [
    { merchandiseId: variantId, quantity },
  ]);
  await saveCartId(updated.id);
  return updated;
}

export async function updateCartLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart> {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return ensureCart();

  if (quantity < 1) {
    return removeCartLineAction(lineId);
  }

  const updated = await updateCartLine(cartId, lineId, quantity);
  await saveCartId(updated.id);
  return updated;
}

export async function removeCartLineAction(lineId: string): Promise<Cart> {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return ensureCart();

  const updated = await removeCartLine(cartId, [lineId]);
  await saveCartId(updated.id);
  return updated;
}
