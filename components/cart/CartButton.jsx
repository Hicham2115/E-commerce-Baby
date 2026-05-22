"use client";

import { Handbag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart-store";

export default function CartButton() {
  const { cart, isLoading, openCart } = useCart();
  const count = cart?.totalQuantity ?? 0;

  return (
    <Button
      aria-label={`Panier${count > 0 ? `, ${count} article${count > 1 ? "s" : ""}` : ""}`}
      className="relative size-10 text-[#001B36] hover:bg-[#001B36]/5 hover:text-[#9B4D44]"
      onClick={openCart}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Handbag className="size-5" strokeWidth={1.75} />
      {!isLoading && count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#9B4D44] text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Button>
  );
}
