"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, Loader2, ShoppingBag, X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/shopify/catalog";
import { useFavorites } from "@/stores/favorites-store";

export default function FavoritesDrawer() {
  const router = useRouter();
  const {
    favorites,
    isOpen,
    closeFavorites,
    isPending,
    removeFavorite,
    addFavoriteToCart,
  } = useFavorites();
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleAddToCart(handle) {
    const result = await addFavoriteToCart(handle);
    if (!result.ok) {
      if (result.needsOptions) {
        closeFavorites();
        router.push(`/products/${handle}`);
        return;
      }
      toast.error(result.message ?? "Erreur lors de l'ajout au panier.");
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      <button
        aria-label="Fermer les favoris"
        className="absolute inset-0 bg-[#001B36]/40 backdrop-blur-[2px]"
        onClick={closeFavorites}
        type="button"
      />

      <aside
        aria-labelledby="favorites-title"
        aria-modal="true"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#F9F8F6] shadow-2xl"
        data-lenis-prevent
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-[#E8E4DC] px-5 py-4">
          <div className="flex items-center gap-2">
            <Heart aria-hidden className="size-5 fill-[#9B4D44] text-[#9B4D44]" />
            <h2
              className="font-heading text-xl font-medium text-[#001B36]"
              id="favorites-title"
            >
              Mes favoris
            </h2>
            {favorites.length > 0 ? (
              <span className="rounded-full bg-[#9B4D44] px-2 py-0.5 text-xs font-semibold text-white">
                {favorites.length}
              </span>
            ) : null}
          </div>
          <button
            aria-label="Fermer"
            className="rounded-full p-2 text-[#001B36] transition-colors hover:bg-[#001B36]/5"
            onClick={closeFavorites}
            type="button"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {favorites.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center py-16 text-center">
              <Heart
                aria-hidden
                className="size-12 text-[#D4D0C8]"
                strokeWidth={1.25}
              />
              <p className="font-heading mt-4 text-lg text-[#001B36]">
                Aucun favori pour le moment
              </p>
              <p className="mt-2 text-sm text-[#5C5C5C]">
                Cliquez sur le cœur d&apos;un produit pour l&apos;enregistrer et
                l&apos;ajouter au panier plus tard.
              </p>
              <Button
                asChild
                className="mt-6 h-11 rounded-full bg-[#001B36] px-6 hover:bg-[#001B36]/90"
                onClick={closeFavorites}
              >
                <Link href="/products">Découvrir la boutique</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-5">
              {favorites.map((item) => (
                <li
                  key={item.handle}
                  className="flex gap-4 border-b border-[#E8E4DC] pb-5 last:border-0"
                >
                  <Link
                    className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#EDEAE6]"
                    href={`/products/${item.handle}`}
                    onClick={closeFavorites}
                  >
                    {item.imageUrl ? (
                      <Image
                        alt={item.imageAlt ?? item.title}
                        className="object-cover"
                        fill
                        sizes="80px"
                        src={item.imageUrl}
                      />
                    ) : null}
                  </Link>

                  <div className="min-w-0 flex-1">
                    <Link
                      className="line-clamp-2 text-sm font-medium text-[#001B36] hover:text-[#9B4D44]"
                      href={`/products/${item.handle}`}
                      onClick={closeFavorites}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-sm font-semibold text-[#9B4D44]">
                      {formatPrice(item.price, item.currencyCode)}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        className="h-9 rounded-full bg-[#001B36] px-4 text-xs font-semibold hover:bg-[#001B36]/90 disabled:opacity-60"
                        disabled={isPending || !item.availableForSale}
                        onClick={() => handleAddToCart(item.handle)}
                        type="button"
                      >
                        {isPending ? (
                          <Loader2
                            aria-hidden
                            className="size-3.5 animate-spin"
                          />
                        ) : (
                          <>
                            <ShoppingBag
                              aria-hidden
                              className="mr-1.5 size-3.5"
                            />
                            Ajouter au panier
                          </>
                        )}
                      </Button>
                      <button
                        className="text-xs text-[#5C5C5C] underline-offset-2 hover:text-[#9B4D44] hover:underline"
                        onClick={() => removeFavorite(item.handle)}
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

      </aside>
    </div>
  );
}
