import { create } from "zustand";
import { toast } from "sonner";
import { addToCartAction } from "@/app/actions/cart";
import { getQueryClient } from "@/lib/query-client";
import { CART_QUERY_KEY } from "@/hooks/use-cart";

export const useCartStore = create((set) => ({
  isOpen: false,
  isPending: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  /** Invalidates the TanStack cart query so all consumers re-fetch. */
  refreshCart: () => getQueryClient().invalidateQueries({ queryKey: CART_QUERY_KEY }),

  /** Used by ProductDetail and FavoritesDrawer to add items. */
  addItem: async (variantId, quantity = 1) => {
    set({ isPending: true });
    try {
      const cart = await addToCartAction(variantId, quantity);
      getQueryClient().setQueryData(CART_QUERY_KEY, cart);
      set({ isOpen: true });
    } catch {
      toast.error("Impossible d'ajouter l'article au panier. Veuillez réessayer.");
    } finally {
      set({ isPending: false });
    }
  },
}));

/** Selector hook — same API as the former Context hook */
export function useCart() {
  return useCartStore();
}
