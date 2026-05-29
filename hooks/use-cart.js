"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/actions/cart";
import { useCartStore } from "@/stores/cart-store";

export const CART_QUERY_KEY = ["cart"];

export function useCartQuery() {
  return useQuery({
    queryKey: CART_QUERY_KEY,
    queryFn: getCartAction,
    staleTime: 30_000,
  });
}

export function useAddToCart() {
  const qc = useQueryClient();
  const openCart = useCartStore((s) => s.openCart);

  return useMutation({
    mutationFn: ({ variantId, quantity = 1 }) =>
      addToCartAction(variantId, quantity),
    onSuccess: (cart) => {
      qc.setQueryData(CART_QUERY_KEY, cart);
      openCart();
    },
    onError: () =>
      toast.error(
        "Impossible d'ajouter l'article au panier. Veuillez réessayer.",
      ),
  });
}

export function useUpdateCartLine() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ lineId, quantity }) =>
      updateCartLineAction(lineId, quantity),
    onSuccess: (cart) => qc.setQueryData(CART_QUERY_KEY, cart),
    onError: () =>
      toast.error(
        "Impossible de mettre à jour la quantité. Veuillez réessayer.",
      ),
  });
}

export function useRemoveCartLine() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (lineId) => removeCartLineAction(lineId),
    onSuccess: (cart) => qc.setQueryData(CART_QUERY_KEY, cart),
    onError: () =>
      toast.error("Impossible de retirer l'article. Veuillez réessayer."),
  });
}
