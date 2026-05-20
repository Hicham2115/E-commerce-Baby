"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import FavoritesDrawer from "@/components/favorites/FavoritesDrawer";
import StoreHydration from "@/components/providers/StoreHydration";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <StoreHydration />
      {children}
      <CartDrawer />
      <FavoritesDrawer />
    </>
  );
}
