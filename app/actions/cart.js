"use server";

import { cookies } from "next/headers";

const CART_COOKIE_NAME = "shopify_cart_id";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

import {
  addToCart,
  createCart,
  getCart,
  removeCartLine,
  updateCartLine,
} from "@/lib/shopify/cart";

async function getCartIdFromCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE_NAME)?.value;
}

async function saveCartId(cartId) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE_NAME, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
}

async function ensureCart() {
  const existingId = await getCartIdFromCookie();

  if (existingId) {
    const cart = await getCart(existingId);
    if (cart) return cart;
  }

  const cart = await createCart();
  await saveCartId(cart.id);
  return cart;
}

export async function getCartAction() {
  return ensureCart();
}

export async function addToCartAction(variantId, quantity = 1) {
  const cart = await ensureCart();
  const updated = await addToCart(cart.id, [
    { merchandiseId: variantId, quantity },
  ]);
  await saveCartId(updated.id);
  return updated;
}

export async function updateCartLineAction(lineId, quantity) {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return ensureCart();

  if (quantity < 1) {
    return removeCartLineAction(lineId);
  }

  const updated = await updateCartLine(cartId, lineId, quantity);
  await saveCartId(updated.id);
  return updated;
}

export async function removeCartLineAction(lineId) {
  const cartId = await getCartIdFromCookie();
  if (!cartId) return ensureCart();

  const updated = await removeCartLine(cartId, [lineId]);
  await saveCartId(updated.id);
  return updated;
}
