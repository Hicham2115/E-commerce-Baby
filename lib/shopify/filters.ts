import type { CatalogSearchParams, ShopifyProduct } from "@/lib/shopify/types";

export const GENRE_OPTIONS = [
  { value: "fille", label: "Fille" },
  { value: "garcon", label: "Garçon" },
  { value: "unisexe", label: "Unisexe" },
] as const;

export const CATEGORY_OPTIONS = [
  { value: "grenouilleres", label: "Grenouillères" },
  { value: "ensembles", label: "Ensembles" },
  { value: "accessoires", label: "Accessoires" },
] as const;

export const SIZE_OPTIONS = ["0M", "1M", "3M", "6M", "9M", "12M"] as const;

export const PRICE_MAX = 1500;

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesTag(product: ShopifyProduct, needle: string) {
  const n = normalize(needle);
  return product.tags.some((t) => normalize(t).includes(n));
}

export function matchesCategory(product: ShopifyProduct, category: string) {
  const n = normalize(category);
  const type = normalize(product.productType);
  const title = normalize(product.title);
  if (type.includes(n) || title.includes(n)) return true;
  return matchesTag(product, n);
}

export function filterProducts(
  products: ShopifyProduct[],
  params: CatalogSearchParams,
): ShopifyProduct[] {
  let result = [...products];

  if (params.genre) {
    result = result.filter((p) => matchesTag(p, params.genre!));
  }

  if (params.category) {
    result = result.filter((p) => matchesCategory(p, params.category!));
  }

  if (params.size) {
    result = result.filter(
      (p) =>
        matchesTag(p, params.size!) ||
        p.tags.some((t) => normalize(t) === normalize(params.size!)),
    );
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
