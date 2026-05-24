import { storefrontFetch } from "@/lib/shopify/storefront";

// ─── Utilities ────────────────────────────────────────────────────────────────

export function parseMetafieldValues(value) {
  if (!value?.trim()) return [];
  const trimmed = value.trim();
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed.filter((i) => typeof i === "string").map((i) => i.trim()).filter(Boolean);
    }
  } catch {}
  return [trimmed];
}

export function normalizeFilterValue(s) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

// ─── Category metafields ──────────────────────────────────────────────────────

const CATEGORY_METAFIELD_KEYS = [
  "fabric", "material", "fabric-composition", "color-pattern", "pattern",
  "target-gender", "age-group", "care-instructions", "clothing-features",
  "baby-toddler-clothing-features", "baby-toddler-clothing-style",
  "baby-toddler-top-style", "baby-toddler-bottom-style",
  "baby-toddler-outerwear-style", "baby-toddler-sleepwear-style",
  "baby-toddler-swimwear-style", "baby-toddler-hosiery-style",
  "baby-toddler-hat-style", "baby-toddler-accessory-style",
  "baby-toddler-bedding-features", "baby-toddler-blanket-features",
  "baby-toddler-shoe-features", "baby-toddler-diaper-style",
  "sleeve-length-type", "neckline", "fit", "occasion-style",
  "shoe-features", "shoe-size", "blanket-type", "bedding-size",
  "activity", "sustainability-features", "certifications-standards",
  "specialized-features", "product-benefits", "allergens",
];

function getCategoryMetafieldIdentifiers() {
  return CATEGORY_METAFIELD_KEYS.map((key) => ({ namespace: "shopify", key }));
}

function parseCategoryMetafields(metafields) {
  const attributes = [];
  const seen = new Set();

  for (const metafield of metafields ?? []) {
    if (!metafield?.key) continue;

    const labels =
      metafield.references?.nodes
        ?.map((node) => node.fields.find((f) => f.key === "label")?.value?.trim())
        .filter(Boolean) ??
      (() => {
        const trimmed = metafield.value?.trim();
        if (!trimmed || trimmed.startsWith("gid://") || trimmed.startsWith("[")) return [];
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.filter((i) => typeof i === "string").map((i) => i.trim()).filter(Boolean);
        } catch {}
        return [trimmed];
      })();

    for (const label of labels) {
      const key = `${metafield.key}:${label.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
      attributes.push({ key: metafield.key, label });
    }
  }

  return attributes;
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

export function extractGenresFromOptions(options) {
  if (!options?.length) return [];
  const genreOption = options.find((opt) => normalizeFilterValue(opt.name) === "genre");
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

export function isShopifyConfigured() {
  return Boolean(
    process.env.SHOPIFY_STORE_DOMAIN && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
  );
}

function getSortConfig(sort) {
  switch (sort ?? "newest") {
    case "price-asc":  return { sortKey: "PRICE", reverse: false };
    case "price-desc": return { sortKey: "PRICE", reverse: true };
    case "title":      return { sortKey: "TITLE", reverse: false };
    case "best-selling": return { sortKey: "BEST_SELLING", reverse: false };
    default:           return { sortKey: "CREATED_AT", reverse: true };
  }
}

const CATALOG_QUERY = `
  query CatalogProducts($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      edges {
        node {
          id title handle availableForSale productType tags
          category { name }
          featuredImage { url altText }
          priceRange { minVariantPrice { amount currencyCode } }
          compareAtPriceRange { minVariantPrice { amount } }
          options { name values }
          tailleMetafield: metafield(namespace: "custom", key: "taille") { value type }
        }
      }
    }
  }
`;

function mapCatalogProduct(node) {
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
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    isNew: node.tags.some((t) => ["nouveau", "new", "nouveauté"].includes(t.toLowerCase())),
    genres: extractGenresFromOptions(node.options),
    sizes: parseMetafieldValues(node.tailleMetafield?.value),
    categoryName: node.category?.name?.trim() || null,
  };
}

export async function fetchCatalog(params = {}) {
  if (!isShopifyConfigured()) return { products: [], error: "Shopify non configuré" };

  try {
    const { sortKey, reverse } = getSortConfig(params.sort);
    const data = await storefrontFetch(CATALOG_QUERY, { first: 48, sortKey, reverse, query: undefined });
    return { products: data.products.edges.map((e) => mapCatalogProduct(e.node)), error: null };
  } catch (err) {
    return { products: [], error: err instanceof Error ? err.message : "Erreur Shopify" };
  }
}

export function formatPrice(amount, currencyCode) {
  if (currencyCode === "MAD") return `${Math.round(amount)} dh`;
  return new Intl.NumberFormat("fr-MA", { style: "currency", currency: currencyCode }).format(amount);
}

export function getDiscountLabel(price, compareAtPrice) {
  if (!compareAtPrice || compareAtPrice <= price) return null;
  return `-${Math.round(((compareAtPrice - price) / compareAtPrice) * 100)}%`;
}

// ─── Product detail ───────────────────────────────────────────────────────────

export function findVariantBySelections(variants, selections) {
  if (variants.length === 0) return undefined;
  if (variants.length === 1) return variants[0];

  const match = variants.find((variant) => {
    if (selections.genre) {
      const hasGenre = variant.selectedOptions.some(
        (opt) => normalizeFilterValue(opt.name) === "genre" && normalizeFilterValue(opt.value) === normalizeFilterValue(selections.genre),
      );
      if (!hasGenre) return false;
    }
    if (selections.size) {
      const hasSize = variant.selectedOptions.some(
        (opt) => ["taille", "size"].includes(normalizeFilterValue(opt.name)) && normalizeFilterValue(opt.value) === normalizeFilterValue(selections.size),
      );
      if (!hasSize) return false;
    }
    return true;
  });

  return match ?? variants[0];
}

export function productHasVariantSizes(sizes) {
  return sizes.some((s) => s.variantId !== null);
}

const PRODUCT_QUERY = `
  query ProductByHandle($handle: String!, $categoryMetafieldIdentifiers: [HasMetafieldsIdentifier!]!) {
    product(handle: $handle) {
      id title handle description descriptionHtml availableForSale productType tags
      category { name }
      options { name values }
      featuredImage { url altText }
      images(first: 10) { edges { node { url altText } } }
      variants(first: 20) {
        edges {
          node {
            id title availableForSale
            selectedOptions { name value }
            price { amount currencyCode }
            compareAtPrice { amount }
          }
        }
      }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount } }
      metafields(identifiers: $categoryMetafieldIdentifiers) {
        key type value
        references(first: 10) {
          nodes {
            ... on Metaobject { fields { key value } }
          }
        }
      }
    }
  }
`;

const RECOMMENDATIONS_QUERY = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id title handle availableForSale productType tags
      featuredImage { url altText }
      priceRange { minVariantPrice { amount currencyCode } }
      compareAtPriceRange { minVariantPrice { amount } }
    }
  }
`;

const DEFAULT_SIZES = ["Naissance", "3 Mois", "6 Mois", "12 Mois"];

function detectCategory(productType, tags) {
  const n = normalizeFilterValue(productType);
  if (n.includes("grenouillere")) return "Grenouillères";
  if (n.includes("ensemble")) return "Ensembles";
  if (n.includes("accessoire")) return "Accessoires";
  for (const tag of tags) {
    const t = normalizeFilterValue(tag);
    if (t.includes("grenouillere")) return "Grenouillères";
    if (t.includes("ensemble")) return "Ensembles";
    if (t.includes("accessoire")) return "Accessoires";
  }
  return productType || null;
}

function detectCollectionLabel(tags) {
  for (const tag of tags) {
    const n = normalizeFilterValue(tag);
    if (n.includes("signature")) return "Collection Signature";
    if (n.includes("premium")) return "Collection Premium";
    if (n === "nouveau" || n === "new" || n === "nouveaute") return "Nouveauté";
  }
  return "Collection Signature";
}

function extractSizes(variants) {
  const sizeOptionNames = ["taille", "size", "pointure"];
  const fromVariants = variants
    .map((variant) => {
      const opt = variant.selectedOptions.find((o) => sizeOptionNames.includes(normalizeFilterValue(o.name)));
      return opt ? { label: opt.value, variantId: variant.id } : null;
    })
    .filter(Boolean);

  if (fromVariants.length > 0) {
    const seen = new Set();
    return fromVariants.filter(({ label }) => seen.has(label) ? false : seen.add(label));
  }

  return DEFAULT_SIZES.map((label) => ({ label, variantId: null }));
}

function mapProductDetail(node) {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAtPrice = compareRaw ? parseFloat(compareRaw) : null;

  const variants = node.variants.edges.map(({ node: v }) => {
    const variantPrice = parseFloat(v.price.amount);
    const variantCompare = v.compareAtPrice?.amount ? parseFloat(v.compareAtPrice.amount) : null;
    return {
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: variantPrice,
      compareAtPrice: variantCompare && variantCompare > variantPrice ? variantCompare : null,
      currencyCode: v.price.currencyCode,
      selectedOptions: v.selectedOptions,
    };
  });

  const galleryImages = node.images.edges.map(({ node: img }) => img);

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    productType: node.productType,
    tags: node.tags,
    images: galleryImages.length > 0 ? galleryImages : node.featuredImage ? [node.featuredImage] : [],
    variants,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    isNew: node.tags.some((t) => ["nouveau", "new", "nouveauté"].includes(t.toLowerCase())),
    sizes: extractSizes(variants),
    genres: extractGenresFromOptions(node.options),
    categoryName: node.category?.name?.trim() || null,
    category: node.category?.name?.trim() || detectCategory(node.productType, node.tags),
    collectionLabel: detectCollectionLabel(node.tags),
    categoryAttributes: parseCategoryMetafields(node.metafields),
  };
}

export async function fetchProductByHandle(handle) {
  const data = await storefrontFetch(PRODUCT_QUERY, {
    handle,
    categoryMetafieldIdentifiers: getCategoryMetafieldIdentifiers(),
  });
  if (!data.product) return null;
  return mapProductDetail(data.product);
}

export async function fetchSimilarProducts(product, limit = 4) {
  try {
    const data = await storefrontFetch(RECOMMENDATIONS_QUERY, { productId: product.id });
    const recommendations = (data.productRecommendations ?? [])
      .filter((p) => p.handle !== product.handle)
      .slice(0, limit)
      .map((node) => {
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
          compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
          currencyCode: node.priceRange.minVariantPrice.currencyCode,
          isNew: node.tags.some((t) => ["nouveau", "new", "nouveauté"].includes(t.toLowerCase())),
          genres: [],
          sizes: [],
          categoryName: null,
        };
      });

    if (recommendations.length >= limit) return recommendations;
  } catch {}

  const catalog = await fetchCatalog();
  const others = catalog.products.filter((p) => p.handle !== product.handle);
  const similar = others.filter((p) =>
    product.categoryName && p.categoryName
      ? normalizeFilterValue(p.categoryName) === normalizeFilterValue(product.categoryName)
      : p.productType === product.productType ||
        p.tags.some((tag) => product.tags.some((t) => normalizeFilterValue(t) === normalizeFilterValue(tag) && t.length > 2)),
  );

  return (similar.length > 0 ? similar : others).slice(0, limit);
}
