import { normalizeFilterValue } from "@/lib/shopify/metafield-values";
import type { CatalogSearchParams, ShopifyProduct } from "@/lib/shopify/types";

/** URL slug → Shopify variant option "Genre" value */
const GENRE_SLUG_TO_SHOPIFY: Record<string, string> = {
  fille: "Fille",
  garcon: "Garçon",
  unisexe: "Unisexe",
};

export const GENRE_OPTIONS = [
  { value: "fille", label: "Fille", shopify: "Fille" },
  { value: "garcon", label: "Garçon", shopify: "Garçon" },
  { value: "unisexe", label: "Unisexe", shopify: "Unisexe" },
] as const;

/** URL slug → Shopify product category name (Standard Product Taxonomy) */
const CATEGORY_SLUG_TO_SHOPIFY: Record<string, string> = {
  "stuffed-animals": "Stuffed Animals",
  bedding: "Bedding",
  shoes: "Shoes",
  blankets: "Blankets",
};

export const CATEGORY_OPTIONS = [
  { value: "stuffed-animals", label: "Peluches", shopify: "Stuffed Animals" },
  { value: "bedding", label: "Literie", shopify: "Bedding" },
  { value: "shoes", label: "Chaussures", shopify: "Shoes" },
  { value: "blankets", label: "Couvertures", shopify: "Blankets" },
] as const;

/** Matches custom.taille list values in Shopify */
export const SIZE_OPTIONS = [
  "0-3 mois",
  "3-6 mois",
  "6-12 mois",
  "1-2 ans",
] as const;

export const PRICE_MAX = 1500;

function normalize(s: string) {
  return normalizeFilterValue(s);
}

function resolveGenreShopifyValue(slug: string): string {
  return GENRE_SLUG_TO_SHOPIFY[slug] ?? slug;
}

export function genreValueToSlug(value: string): string | undefined {
  const entry = GENRE_OPTIONS.find(
    (opt) => normalize(opt.shopify) === normalize(value),
  );
  return entry?.value;
}

function matchesGenre(product: ShopifyProduct, genreSlug: string): boolean {
  if (product.genres.length === 0) return false;
  const expected = resolveGenreShopifyValue(genreSlug);
  const n = normalize(expected);
  return product.genres.some((g) => normalize(g) === n);
}

function matchesSize(product: ShopifyProduct, size: string): boolean {
  if (product.sizes.length === 0) return false;

  const n = normalize(size);
  return product.sizes.some((s) => normalize(s) === n);
}

function resolveCategoryShopifyName(slug: string): string {
  return CATEGORY_SLUG_TO_SHOPIFY[slug] ?? slug;
}

export function matchesCategory(product: ShopifyProduct, categorySlug: string) {
  if (!product.categoryName) return false;
  const expected = resolveCategoryShopifyName(categorySlug);
  return normalize(product.categoryName) === normalize(expected);
}

export function filterProducts(
  products: ShopifyProduct[],
  params: CatalogSearchParams,
): ShopifyProduct[] {
  let result = [...products];

  if (params.genre) {
    result = result.filter((p) => matchesGenre(p, params.genre!));
  }

  if (params.category) {
    result = result.filter((p) => matchesCategory(p, params.category!));
  }

  if (params.size) {
    result = result.filter((p) => matchesSize(p, params.size!));
  }

  if (params.priceMax) {
    const max = Number(params.priceMax);
    if (!Number.isNaN(max)) {
      result = result.filter((p) => p.price <= max);
    }
  }

  return result;
}

export function buildProductsQuery(
  base: CatalogSearchParams,
  updates: Partial<CatalogSearchParams>,
): string {
  const merged = { ...base, ...updates };
  const params = new URLSearchParams();

  if (merged.sort && merged.sort !== "newest") params.set("sort", merged.sort);
  if (merged.genre) params.set("genre", merged.genre);
  if (merged.category) params.set("category", merged.category);
  if (merged.size) params.set("size", merged.size);
  if (merged.priceMax && merged.priceMax !== String(PRICE_MAX)) {
    params.set("priceMax", merged.priceMax);
  }

  const qs = params.toString();
  return qs ? `/products?${qs}` : "/products";
}
