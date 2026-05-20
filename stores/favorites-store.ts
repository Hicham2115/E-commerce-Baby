import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addWishlistItemToCartAction } from "@/app/actions/wishlist";
import { FAVORITES_STORAGE_KEY } from "@/lib/favorites/storage";
import type { FavoriteItem } from "@/lib/favorites/types";
import { productToFavorite } from "@/lib/favorites/types";
import { useCartStore } from "@/stores/cart-store";

type FavoritesStore = {
  favorites: FavoriteItem[];
  isOpen: boolean;
  isPending: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
  isFavorite: (handle: string) => boolean;
  toggleFavorite: (product: Parameters<typeof productToFavorite>[0]) => void;
  removeFavorite: (handle: string) => void;
  addFavoriteToCart: (handle: string) => Promise<{
    ok: boolean;
    message?: string;
    needsOptions?: boolean;
  }>;
};

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      isOpen: false,
      isPending: false,

      openFavorites: () => set({ isOpen: true }),
      closeFavorites: () => set({ isOpen: false }),

      isFavorite: (handle) =>
        get().favorites.some((f) => f.handle === handle),

      toggleFavorite: (product) => {
        set((state) => {
          const exists = state.favorites.some((f) => f.handle === product.handle);
          if (exists) {
            return {
              favorites: state.favorites.filter(
                (f) => f.handle !== product.handle,
              ),
            };
          }
          return {
            favorites: [productToFavorite(product), ...state.favorites],
          };
        });
      },

      removeFavorite: (handle) => {
        set((state) => ({
          favorites: state.favorites.filter((f) => f.handle !== handle),
        }));
      },

      addFavoriteToCart: async (handle) => {
        set({ isPending: true });
        try {
          const result = await addWishlistItemToCartAction(handle);
          if (result.success) {
            await useCartStore.getState().refreshCart();
            useCartStore.getState().openCart();
            return { ok: true };
          }
          return {
            ok: false,
            message: result.message,
            needsOptions: result.needsOptions,
          };
        } finally {
          set({ isPending: false });
        }
      },
    }),
    {
      name: FAVORITES_STORAGE_KEY,
      partialize: (state) => ({ favorites: state.favorites }),
      skipHydration: true,
    },
  ),
);

/** True after persisted favorites are loaded from localStorage (client only). */
export function useFavoritesHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(useFavoritesStore.persist.hasHydrated());
    return useFavoritesStore.persist.onFinishHydration(() => setHydrated(true));
  }, []);

  return hydrated;
}

/** Selector hook — same API as the former Context hook */
export function useFavorites() {
  return useFavoritesStore();
}
