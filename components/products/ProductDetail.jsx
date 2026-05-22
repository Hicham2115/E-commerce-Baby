"use client";

import { useMemo, useState } from "react";
import {
  Feather,
  Loader2,
  RotateCcw,
  Star,
  Tag,
  Truck,
  WashingMachine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/stores/cart-store";
import FavoriteToggle from "@/components/favorites/FavoriteToggle";
import {
  findVariantBySelections,
  formatPrice,
  getDiscountLabel,
  productHasVariantSizes,
} from "@/lib/shopify/product";

function StarRating({ rating = 4.5, reviewCount = 48 }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            aria-hidden
            className={`size-3.5 ${
              i < Math.floor(rating)
                ? "fill-[#C9A227] text-[#C9A227]"
                : i < rating
                  ? "fill-[#C9A227]/50 text-[#C9A227]"
                  : "fill-none text-[#D4D0C8]"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-[#5C5C5C]">({reviewCount} avis)</span>
    </div>
  );
}

export default function ProductDetail({ product }) {
  const { addItem, isPending } = useCart();
  const [selectedGenre, setSelectedGenre] = useState(product.genres[0] ?? "");
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.label ?? "");
  const [error, setError] = useState(null);

  const showGenrePicker = product.genres.length > 0;
  const showSizePicker = productHasVariantSizes(product.sizes);

  const selectedVariant = useMemo(
    () =>
      findVariantBySelections(product.variants, {
        genre: showGenrePicker ? selectedGenre : undefined,
        size: showSizePicker ? selectedSize : undefined,
      }) ?? product.variants[0],
    [
      product.variants,
      selectedGenre,
      selectedSize,
      showGenrePicker,
      showSizePicker,
    ],
  );

  const price = selectedVariant?.price ?? product.price;
  const compareAtPrice =
    selectedVariant?.compareAtPrice ?? product.compareAtPrice;
  const currencyCode = selectedVariant?.currencyCode ?? product.currencyCode;
  const discount = getDiscountLabel(price, compareAtPrice);

  const canAddToCart =
    selectedVariant?.availableForSale &&
    product.availableForSale &&
    Boolean(selectedVariant?.id);

  const plainDescription =
    product.description ||
    "Conçu pour le confort de bébé, ce vêtement allie douceur, respirabilité et finitions soignées — idéal pour les peaux sensibles.";

  async function handleAddToCart() {
    if (!selectedVariant?.id) {
      setError("Veuillez choisir une option.");
      return;
    }
    setError(null);
    try {
      await addItem(selectedVariant.id, 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible d'ajouter au panier.",
      );
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap items-center gap-3">
        {product.collectionLabel ? (
          <span className="rounded-full bg-[#D6E4EE] px-3 py-1 text-[11px] font-semibold tracking-wide text-[#001B36]">
            {product.collectionLabel}
          </span>
        ) : null}
        {product.isNew ? (
          <span className="rounded-full bg-[#9B4D44] px-3 py-1 text-[11px] font-semibold tracking-wide text-white">
            Nouveau
          </span>
        ) : null}
        <StarRating />
      </div>

      <div className="mt-4 flex items-start justify-between gap-4">
        <h1 className="font-heading text-3xl font-medium leading-tight text-[#001B36] md:text-4xl lg:text-[2.75rem]">
          {product.title}
        </h1>
        <FavoriteToggle
          className="shrink-0 shadow-md"
          product={{
            handle: product.handle,
            title: product.title,
            imageUrl: product.images[0]?.url ?? null,
            imageAlt: product.images[0]?.altText ?? product.title,
            price: product.price,
            currencyCode: product.currencyCode,
            availableForSale: product.availableForSale,
          }}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-baseline gap-3">
        <span className="font-heading text-2xl text-[#9B4D44] md:text-3xl">
          {formatPrice(price, currencyCode)}
        </span>
        {compareAtPrice ? (
          <span className="text-base text-[#5C5C5C] line-through">
            {formatPrice(compareAtPrice, currencyCode)}
          </span>
        ) : null}
        {discount ? (
          <span className="rounded-full bg-[#9B4D44] px-2.5 py-0.5 text-xs font-semibold text-white">
            {discount}
          </span>
        ) : null}
      </div>

      <p className="mt-6 text-sm leading-relaxed text-[#5C5C5C] md:text-[15px]">
        {plainDescription}
      </p>

      {product.categoryAttributes.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          {product.categoryAttributes.map((attribute) => (
            <span
              key={`${attribute.key}-${attribute.label}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4D0C8] bg-white px-3 py-1.5 text-xs text-[#001B36]"
            >
              <Tag aria-hidden className="size-3.5 text-[#9B4D44]" />
              {attribute.label}
            </span>
          ))}
        </div>
      ) : null}

      {showGenrePicker ? (
        <div className="mt-8">
          <span className="mb-3 block text-sm font-medium text-[#001B36]">
            Choisir le genre
          </span>
          <div className="flex flex-wrap gap-2">
            {product.genres.map((genre) => (
              <button
                key={genre}
                className={`min-w-[5.5rem] rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  selectedGenre === genre
                    ? "border-[#001B36] bg-[#001B36] text-white"
                    : "border-[#D4D0C8] bg-white text-[#001B36] hover:border-[#001B36]/40"
                }`}
                onClick={() => setSelectedGenre(genre)}
                type="button"
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {showSizePicker ? (
        <div className={showGenrePicker ? "mt-6" : "mt-8"}>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-[#001B36]">
              Choisir la taille
            </span>
            <button
              className="text-xs text-[#5C5C5C] underline underline-offset-2 hover:text-[#001B36]"
              type="button"
            >
              Guide des tailles
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size.label}
                className={`min-w-[5.5rem] rounded-xl border px-4 py-2.5 text-sm transition-colors ${
                  selectedSize === size.label
                    ? "border-[#001B36] bg-[#001B36] text-white"
                    : "border-[#D4D0C8] bg-white text-[#001B36] hover:border-[#001B36]/40"
                }`}
                onClick={() => setSelectedSize(size.label)}
                type="button"
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <Button
        className="mt-8 h-14 w-full rounded-2xl bg-[#001B36] text-base font-semibold hover:bg-[#001B36]/90 disabled:opacity-60"
        disabled={!canAddToCart || isPending}
        onClick={handleAddToCart}
        type="button"
      >
        {isPending ? (
          <>
            <Loader2 aria-hidden className="mr-2 size-5 animate-spin" />
            Ajout en cours…
          </>
        ) : canAddToCart ? (
          "Ajouter au Panier"
        ) : (
          "Indisponible"
        )}
      </Button>

      {error ? (
        <p className="mt-2 text-sm text-[#9B4D44]" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#5C5C5C]">
        <span className="inline-flex items-center gap-2">
          <Truck aria-hidden className="size-4 text-[#001B36]" />
          Livraison offerte dès 80€
        </span>
        <span className="inline-flex items-center gap-2">
          <RotateCcw aria-hidden className="size-4 text-[#001B36]" />
          Retours 30 jours
        </span>
      </div>

      <div className="mt-10 border-t border-[#E8E4DC] pt-8">
        <h2 className="font-heading text-xl font-medium text-[#001B36] md:text-2xl">
          Conseils de Soin
        </h2>
        <ul className="mt-5 space-y-4">
          <li className="flex gap-3">
            <WashingMachine
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-[#001B36]"
            />
            <div>
              <p className="text-sm font-semibold text-[#001B36]">
                Lavage en machine à 30°C
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#5C5C5C]">
                Programme délicat, avec des lessives douces sans agents
                blanchissants.
              </p>
            </div>
          </li>
          <li className="flex gap-3">
            <Feather
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-[#001B36]"
            />
            <div>
              <p className="text-sm font-semibold text-[#001B36]">
                Séchage à l&apos;air libre
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#5C5C5C]">
                Évitez le sèche-linge pour préserver la douceur du coton bio.
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
