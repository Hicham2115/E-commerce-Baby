"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

/** Loads Shopify cart once on app mount. */
export default function StoreHydration() {
  const refreshCart = useCartStore((s) => s.refreshCart);
  const setLoading = useCartStore.setState;

  useEffect(() => {
    refreshCart().finally(() => setLoading({ isLoading: false }));
  }, [refreshCart]);

  return null;
}
