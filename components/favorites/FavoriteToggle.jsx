"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { productToFavorite, useFavorites, useFavoritesHydrated } from "@/stores/favorites-store";

export default function FavoriteToggle({
  product,
  className,
  size = "md",
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const hydrated = useFavoritesHydrated();
  const active = hydrated && isFavorite(product.handle);

  const iconSize = size === "sm" ? "size-4" : "size-5";

  return (
    <button
      aria-label={
        active ? "Retirer des favoris" : "Ajouter aux favoris"
      }
      aria-pressed={active}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 text-[#001B36] shadow-sm transition-colors hover:bg-white hover:text-[#9B4D44]",
        size === "sm" ? "size-8" : "size-9",
        className,
      )}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
      }}
      type="button"
    >
      <Heart
        className={cn(
          iconSize,
          active && "fill-[#9B4D44] text-[#9B4D44]",
        )}
        strokeWidth={1.75}
      />
    </button>
  );
}
