import { create } from "zustand";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/actions/cart";

export const useCartStore = create((set) => ({
  cart: null,
  isOpen: false,
  isLoading: true,
  isPending: false,

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),

  refreshCart: async () => {
    try {
      const cart = await getCartAction();
      set({ cart });
    } catch {
      set({ cart: null });
    }
  },

  addItem: async (variantId, quantity = 1) => {
    set({ isPending: true });
    try {
      const cart = await addToCartAction(variantId, quantity);
      set({ cart, isOpen: true });
    } finally {
      set({ isPending: false });
    }
  },

  updateLine: async (lineId, quantity) => {
    set({ isPending: true });
    try {
      const cart = await updateCartLineAction(lineId, quantity);
      set({ cart });
    } finally {
      set({ isPending: false });
    }
  },

  removeLine: async (lineId) => {
    set({ isPending: true });
    try {
      const cart = await removeCartLineAction(lineId);
      set({ cart });
    } finally {
      set({ isPending: false });
    }
  },
}));

/** Selector hook — same API as the former Context hook */
export function useCart() {
  return useCartStore();
}
