"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/stores/favorites-store";

export default function FavoritesButton() {
  const { favorites, openFavorites } = useFavorites();
  const count = favorites.length;

  return (
    <Button
      aria-label={`Favoris${count > 0 ? `, ${count} produit${count > 1 ? "s" : ""}` : ""}`}
      className="relative size-10 text-[#001B36] hover:bg-[#001B36]/5 hover:text-[#9B4D44]"
      onClick={openFavorites}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Heart className="size-5" strokeWidth={1.75} />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#9B4D44] text-[10px] font-semibold text-white">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Button>
  );
}
