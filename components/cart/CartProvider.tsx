"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  addToCartAction,
  getCartAction,
  removeCartLineAction,
  updateCartLineAction,
} from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/cart";

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  isPending: boolean;
  openCart: () => void;
  closeCart: () => void;
  refreshCart: () => Promise<void>;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  removeLine: (lineId: string) => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const refreshCart = useCallback(async () => {
    try {
      const next = await getCartAction();
      setCart(next);
    } catch {
      setCart(null);
    }
  }, []);

  useEffect(() => {
    refreshCart().finally(() => setIsLoading(false));
  }, [refreshCart]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      startTransition(async () => {
        const next = await addToCartAction(variantId, quantity);
        setCart(next);
        setIsOpen(true);
      });
    },
    [],
  );

  const updateLine = useCallback(async (lineId: string, quantity: number) => {
    startTransition(async () => {
      const next = await updateCartLineAction(lineId, quantity);
      setCart(next);
    });
  }, []);

  const removeLine = useCallback(async (lineId: string) => {
    startTransition(async () => {
      const next = await removeCartLineAction(lineId);
      setCart(next);
    });
  }, []);

  const value = useMemo(
    () => ({
      cart,
      isOpen,
      isLoading,
      isPending,
      openCart,
      closeCart,
      refreshCart,
      addItem,
      updateLine,
      removeLine,
    }),
    [
      cart,
      isOpen,
      isLoading,
      isPending,
      openCart,
      closeCart,
      refreshCart,
      addItem,
      updateLine,
      removeLine,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }
  return ctx;
}
