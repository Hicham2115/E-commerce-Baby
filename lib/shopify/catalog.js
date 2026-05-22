import { normalizeFilterValue, parseMetafieldValues } from "@/lib/shopify/metafield-values";
import { storefrontFetch } from "@/lib/shopify/storefront";

export function extractGenresFromOptions(options) {
  if (!options?.length) return [];
  const genreOption = options.find(
    (opt) => normalizeFilterValue(opt.name) === "genre",
  );
  if (!genreOption?.values?.length) return [];
  const seen = new Set();
  return genreOption.values
    .map((v) => v.trim())
    .filter((v) => {
      const key = normalizeFilterValue(v);
      if (!v || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

const CATALOG_QUERY = `
  query CatalogProducts(
    $first: Int!
    $sortKey: ProductSortKeys
    $reverse: Boolean
    $query: String
  ) {
    products(
      first: $first
      sortKey: $sortKey
      reverse: $reverse
      query: $query
    ) {
      edges {
        node {
          id
          title
          handle
          availableForSale
          productType
          tags
          category {
            name
          }
          featuredImage {
            url
            altText
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
            }
          }
          options {
            name
            values
          }
          tailleMetafield: metafield(namespace: "custom", key: "taille") {
            value
            type
          }
        }
      }
    }
  }
`;

function mapProduct(node) {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAtPrice = compareRaw ? parseFloat(compareRaw) : null;

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    availableForSale: node.availableForSale,
    productType: node.productType,
    tags: node.tags,
    imageUrl: node.featuredImage?.url ?? null,
    imageAlt: node.featuredImage?.altText ?? node.title,
    price,
    compareAtPrice:
      compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    isNew: node.tags.some((t) => {
      const tag = t.toLowerCase();
      return tag === "nouveau" || tag === "new" || tag === "nouveauté";
    }),
    genres: extractGenresFromOptions(node.options),
    sizes: parseMetafieldValues(node.tailleMetafield?.value),
    categoryName: node.category?.name?.trim() || null,
  };
}

function getSortConfig(sort) {
  const option = sort ?? "newest";

  switch (option) {
    case "price-asc":
      return { sortKey: "PRICE", reverse: false, collectionSortKey: "PRICE" };
    case "price-desc":
      return { sortKey: "PRICE", reverse: true, collectionSortKey: "PRICE" };
    case "title":
      return { sortKey: "TITLE", reverse: false, collectionSortKey: "TITLE" };
    case "best-selling":
      return {
        sortKey: "BEST_SELLING",
        reverse: false,
        collectionSortKey: "BEST_SELLING",
      };
    case "newest":
    default:
      return {
        sortKey: "CREATED_AT",
        reverse: true,
        collectionSortKey: "CREATED",
      };
  }
}

export function isShopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN &&
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

export async function fetchCatalog(params = {}) {
  if (!isShopifyConfigured()) {
    return {
      products: [],
      error: "Shopify non configuré",
    };
  }

  try {
    const { sortKey, reverse } = getSortConfig(params.sort);
    const data = await storefrontFetch(CATALOG_QUERY, {
      first: 48,
      sortKey,
      reverse,
      query: undefined,
    });

    const products = data.products.edges.map((e) => mapProduct(e.node));

    return {
      products,
      error: null,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Shopify";
    return {
      products: [],
      error: message,
    };
  }
}

export function formatPrice(amount, currencyCode) {
  if (currencyCode === "MAD") {
    return `${Math.round(amount)} dh`;
  }
  return new Intl.NumberFormat("fr-MA", {
    style: "currency",
    currency: currencyCode,
  }).format(amount);
}

export function getDiscountLabel(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  const pct = Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
  return `-${pct}%`;
}
