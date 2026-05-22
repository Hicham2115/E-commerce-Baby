"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/products/ProductCard";
import {
  buildProductsQuery,
  CATEGORY_OPTIONS,
  filterProducts,
  GENRE_OPTIONS,
  PRICE_MAX,
  SIZE_OPTIONS,
} from "@/lib/shopify/filters";

const SORT_OPTIONS = [
  { value: "newest", label: "Nouveautés" },
  { value: "best-selling", label: "Meilleures ventes" },
  { value: "price-asc", label: "Prix croissant" },
  { value: "price-desc", label: "Prix décroissant" },
  { value: "title", label: "Nom A–Z" },
];

function FilterSection({ title, children }) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold tracking-wider text-[#001B36] uppercase">
        {title}
      </h3>
      {children}
    </div>
  );
}

function CheckboxFilter({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-1.5">
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-[#001B36] bg-[#001B36]"
            : "border-[#C5C0B8] bg-white"
        }`}
      >
        {checked ? (
          <svg
            aria-hidden
            className="size-2.5 text-white"
            fill="none"
            viewBox="0 0 12 12"
          >
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          </svg>
        ) : null}
      </span>
      <input
        checked={checked}
        className="sr-only"
        onChange={onChange}
        type="checkbox"
      />
      <span className="text-sm text-[#001B36]">{label}</span>
    </label>
  );
}

export default function ProductsCatalog({
  products,
  error,
  initialParams,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const current = useMemo(
    () => ({
      sort: searchParams.get("sort") ?? "newest",
      genre: searchParams.get("genre") ?? undefined,
      category: searchParams.get("category") ?? undefined,
      size: searchParams.get("size") ?? undefined,
      priceMax: searchParams.get("priceMax") ?? String(PRICE_MAX),
    }),
    [searchParams],
  );

  const priceMaxValue = Number(current.priceMax ?? PRICE_MAX);

  const navigate = useCallback(
    (updates) => {
      router.push(buildProductsQuery(current, updates));
      setMobileFiltersOpen(false);
    },
    [router, current],
  );

  const filteredProducts = useMemo(
    () => filterProducts(products, current),
    [products, current],
  );

  const hasActiveFilters = Boolean(
    current.genre ||
      current.category ||
      current.size ||
      (current.priceMax && Number(current.priceMax) < PRICE_MAX),
  );

  const filterSidebar = (
    <div className="space-y-10">
      <FilterSection title="Genre">
        <div className="space-y-0.5">
          {GENRE_OPTIONS.map((opt) => (
            <CheckboxFilter
              key={opt.value}
              checked={current.genre === opt.value}
              label={opt.label}
              onChange={() =>
                navigate({
                  genre: current.genre === opt.value ? undefined : opt.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Catégories">
        <div className="space-y-0.5">
          {CATEGORY_OPTIONS.map((opt) => (
            <CheckboxFilter
              key={opt.value}
              checked={current.category === opt.value}
              label={opt.label}
              onChange={() =>
                navigate({
                  category:
                    current.category === opt.value ? undefined : opt.value,
                })
              }
            />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Taille">
        <div className="grid grid-cols-2 gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              className={`rounded-lg border px-2 py-2.5 text-xs transition-colors sm:text-sm ${
                current.size === size
                  ? "border-[#001B36] bg-[#001B36] text-white"
                  : "border-[#D4D0C8] bg-white text-[#001B36] hover:border-[#001B36]/40"
              }`}
              onClick={() =>
                navigate({
                  size: current.size === size ? undefined : size,
                })
              }
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Budget">
        <div className="px-1">
          <input
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#D4D0C8] accent-[#001B36]"
            max={PRICE_MAX}
            min={0}
            onChange={(e) => navigate({ priceMax: e.target.value })}
            step={10}
            type="range"
            value={priceMaxValue}
          />
          <div className="mt-3 flex justify-between text-sm text-[#5C5C5C]">
            <span>0 DH</span>
            <span>{PRICE_MAX} DH</span>
          </div>
        </div>
      </FilterSection>

      {hasActiveFilters ? (
        <Link
          className="text-sm font-medium text-[#9B4D44] hover:underline"
          href="/products"
        >
          Réinitialiser les filtres
        </Link>
      ) : null}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 md:px-8">
      <div className="flex gap-8 lg:gap-12">
        {/* Sidebar — desktop */}
        <aside className="hidden w-[220px] shrink-0 lg:block">
          <div className="sticky top-28">{filterSidebar}</div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Toolbar */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                className="gap-2 border-[#D4D0C8] bg-white text-[#001B36] lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
                type="button"
                variant="outline"
              >
                <SlidersHorizontal className="size-4" />
                Filtres
              </Button>
              <p className="text-sm text-[#5C5C5C]">
                Affichage de{" "}
                <span className="font-medium text-[#001B36]">
                  {filteredProducts.length}
                </span>{" "}
                sur{" "}
                <span className="font-medium text-[#001B36]">
                  {products.length}
                </span>{" "}
                produits
              </p>
            </div>

            <label className="flex items-center gap-2 text-sm text-[#001B36]">
              Trier par :
              <span className="relative">
                <select
                  className="appearance-none rounded-lg border border-[#D4D0C8] bg-white py-2.5 pr-9 pl-4 text-sm text-[#001B36] outline-none focus:border-[#001B36]"
                  onChange={(e) => navigate({ sort: e.target.value })}
                  value={current.sort ?? "newest"}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-[#5C5C5C]"
                />
              </span>
            </label>
          </div>

          {/* Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#D4D0C8] bg-white/60 px-6 py-20 text-center">
              <p className="font-heading text-xl text-[#001B36]">
                Aucun produit trouvé
              </p>
              <p className="mx-auto mt-3 max-w-sm text-sm text-[#5C5C5C]">
                Modifiez vos filtres ou configurez les variantes Genre, la
                metafield Taille et la Catégorie produit dans Shopify.
              </p>
              {error ? (
                <p className="mt-4 text-xs text-[#9B4D44]">{error}</p>
              ) : null}
              <Link
                className="mt-6 inline-block text-sm font-medium text-[#9B4D44] hover:underline"
                href="/products"
              >
                Réinitialiser les filtres
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters drawer */}
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Fermer"
            className="absolute inset-0 bg-[#001B36]/30"
            onClick={() => setMobileFiltersOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-0 left-0 w-[min(100%,300px)] overflow-y-auto bg-[#F9F8F6] p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-sm font-bold tracking-wider text-[#001B36] uppercase">
                Filtres
              </h2>
              <button
                aria-label="Fermer"
                onClick={() => setMobileFiltersOpen(false)}
                type="button"
              >
                <X className="size-5 text-[#001B36]" />
              </button>
            </div>
            {filterSidebar}
          </div>
        </div>
      ) : null}
    </div>
  );
}
