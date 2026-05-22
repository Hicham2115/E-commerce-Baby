"use client";

import { useEffect } from "react";
import { Toaster } from "sonner";
import CartDrawer from "@/components/cart/CartDrawer";
import FavoritesDrawer from "@/components/favorites/FavoritesDrawer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { useCartStore } from "@/stores/cart-store";
import { useFavoritesStore } from "@/stores/favorites-store";

function StoreHydration() {
  const refreshCart = useCartStore((s) => s.refreshCart);

  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
    refreshCart().finally(() => useCartStore.setState({ isLoading: false }));
  }, [refreshCart]);

  return null;
}

export default function AppProviders({ children }) {
  return (
    <SmoothScroll>
      <StoreHydration />
      {children}
      <CartDrawer />
      <FavoritesDrawer />
      <Toaster position="bottom-right" richColors />
    </SmoothScroll>
  );
}
