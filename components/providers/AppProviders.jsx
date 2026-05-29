"use client";

import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import CartDrawer from "@/components/cart/CartDrawer";
import FavoritesDrawer from "@/components/favorites/FavoritesDrawer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { getQueryClient } from "@/lib/query-client";
import { useFavoritesStore } from "@/stores/favorites-store";

function StoreHydration() {
  useEffect(() => {
    useFavoritesStore.persist.rehydrate();
  }, []);

  return null;
}

export default function AppProviders({ children }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll>
        <StoreHydration />
        {children}
        <CartDrawer />
        <FavoritesDrawer />
        <Toaster position="bottom-right" richColors />
      </SmoothScroll>
    </QueryClientProvider>
  );
}
