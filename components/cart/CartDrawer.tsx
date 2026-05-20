"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/shopify/catalog";
import { useCart } from "@/components/cart/CartProvider";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, isPending, updateLine, removeLine } =
    useCart();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const lines = cart?.lines ?? [];

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        aria-label="Fermer le panier"
        className="absolute inset-0 bg-[#001B36]/40 backdrop-blur-[2px]"
        onClick={closeCart}
        type="button"
      />

      <aside
        aria-labelledby="cart-title"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#F9F8F6] shadow-2xl"
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[#E8E4DC] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag aria-hidden className="size-5 text-[#001B36]" />
            <h2
              className="font-heading text-xl font-medium text-[#001B36]"
              id="cart-title"
            >
              Votre panier
            </h2>
            {cart && cart.totalQuantity > 0 ? (
              <span className="rounded-full bg-[#9B4D44] px-2 py-0.5 text-xs font-semibold text-white">
                {cart.totalQuantity}
              </span>
            ) : null}
          </div>
          <button
            aria-label="Fermer"
            className="rounded-full p-2 text-[#001B36] transition-colors hover:bg-[#001B36]/5"
            onClick={closeCart}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <ShoppingBag
                aria-hidden
                className="size-12 text-[#D4D0C8]"
                strokeWidth={1.25}
              />
              <p className="font-heading mt-4 text-lg text-[#001B36]">
                Votre panier est vide
              </p>
              <p className="mt-2 text-sm text-[#5C5C5C]">
                Parcourez la boutique et ajoutez vos coups de cœur.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-[#001B36] px-6 hover:bg-[#001B36]/90"
                onClick={closeCart}
              >
                <Link href="/products">Voir la boutique</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {lines.map((line) => (
                <li
                  key={line.id}
                  className="flex gap-4 border-b border-[#E8E4DC] pb-5 last:border-0"
                >
                  <Link
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#EDEAE6]"
                    href={`/products/${line.handle}`}
                    onClick={closeCart}
                  >
                    {line.imageUrl ? (
                      <Image
                        alt={line.imageAlt ?? line.title}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={line.imageUrl}
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      className="line-clamp-2 text-sm font-medium text-[#001B36] hover:text-[#9B4D44]"
                      href={`/products/${line.handle}`}
                      onClick={closeCart}
                    >
                      {line.title}
                    </Link>
                    {line.optionLabel ? (
                      <p className="mt-0.5 text-xs text-[#5C5C5C]">
                        {line.optionLabel}
                      </p>
                    ) : null}
                    <p className="mt-1 text-sm font-semibold text-[#9B4D44]">
                      {formatPrice(line.price, line.currencyCode)}
                    </p>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg border border-[#D4D0C8] bg-white">
                        <button
                          aria-label="Diminuer la quantité"
                          className="px-2.5 py-1.5 text-[#001B36] disabled:opacity-40"
                          disabled={isPending}
                          onClick={() =>
                            updateLine(line.id, line.quantity - 1)
                          }
                          type="button"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-medium text-[#001B36]">
                          {line.quantity}
                        </span>
                        <button
                          aria-label="Augmenter la quantité"
                          className="px-2.5 py-1.5 text-[#001B36] disabled:opacity-40"
                          disabled={isPending}
                          onClick={() =>
                            updateLine(line.id, line.quantity + 1)
                          }
                          type="button"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <button
                        className="text-xs text-[#5C5C5C] underline-offset-2 hover:text-[#9B4D44] hover:underline disabled:opacity-40"
                        disabled={isPending}
                        onClick={() => removeLine(line.id)}
                        type="button"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && cart ? (
          <div className="border-t border-[#E8E4DC] bg-white px-5 py-5">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-[#5C5C5C]">Sous-total</span>
              <span className="font-heading text-lg font-medium text-[#001B36]">
                {formatPrice(cart.subtotal, cart.currencyCode)}
              </span>
            </div>
            <Button
              asChild
              className="h-12 w-full rounded-2xl bg-[#001B36] text-base font-semibold hover:bg-[#001B36]/90"
            >
              <a href={cart.checkoutUrl}>Commander</a>
            </Button>
            <p className="mt-3 text-center text-xs text-[#5C5C5C]">
              Paiement sécurisé via Shopify
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
