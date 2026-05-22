import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { addWishlistItemToCartAction } from "@/app/actions/wishlist";
import { useCartStore } from "@/stores/cart-store";

const FAVORITES_STORAGE_KEY = "chahrazad_favorites";

export function productToFavorite(product) {
  return {
    handle: product.handle,
    title: product.title,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    price: product.price,
    currencyCode: product.currencyCode,
    availableForSale: product.availableForSale,
  };
}

export const useFavoritesStore = create()(
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
