"use client";

import CartDrawer from "@/components/cart/CartDrawer";
import FavoritesDrawer from "@/components/favorites/FavoritesDrawer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import StoreHydration from "@/components/providers/StoreHydration";

export default function AppProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SmoothScroll>
      <StoreHydration />
      {children}
      <CartDrawer />
      <FavoritesDrawer />
    </SmoothScroll>
  );
}
