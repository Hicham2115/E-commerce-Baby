"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useFavoritesStore } from "@/stores/favorites-store";

/** Loads Shopify cart once on app mount. */
export default function StoreHydration() {
  const refreshCart = useCartStore((s) => s.refreshCart);
  const setLoading = useCartStore.setState;

  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
    refreshCart().finally(() => setLoading({ isLoading: false }));
  }, [refreshCart]);

  return null;
}
