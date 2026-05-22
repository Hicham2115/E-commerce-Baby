import { fetchCatalog, formatPrice, getDiscountLabel } from "@/lib/shopify/catalog";
import {
  getCategoryMetafieldIdentifiers,
  parseCategoryMetafields,
} from "@/lib/shopify/category-metafields";
import { extractGenresFromOptions } from "@/lib/shopify/catalog";
import { normalizeFilterValue } from "@/lib/shopify/metafield-values";
import { storefrontFetch } from "@/lib/shopify/storefront";

export function findVariantBySelections(variants, selections) {
  if (variants.length === 0) return undefined;
  if (variants.length === 1) return variants[0];

  const match = variants.find((variant) => {
    if (selections.genre) {
      const hasGenre = variant.selectedOptions.some(
        (opt) =>
          normalizeFilterValue(opt.name) === "genre" &&
          normalizeFilterValue(opt.value) === normalizeFilterValue(selections.genre),
      );
      if (!hasGenre) return false;
    }
    if (selections.size) {
      const hasSize = variant.selectedOptions.some(
        (opt) =>
          (normalizeFilterValue(opt.name) === "taille" ||
            normalizeFilterValue(opt.name) === "size") &&
          normalizeFilterValue(opt.value) === normalizeFilterValue(selections.size),
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
  query ProductByHandle(
    $handle: String!
    $categoryMetafieldIdentifiers: [HasMetafieldsIdentifier!]!
  ) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      availableForSale
      productType
      tags
      category {
        name
      }
      options {
        name
        values
      }
      featuredImage {
        url
        altText
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
            }
          }
        }
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
      metafields(identifiers: $categoryMetafieldIdentifiers) {
        key
        type
        value
        references(first: 10) {
          nodes {
            ... on Metaobject {
              fields {
                key
                value
              }
            }
          }
        }
      }
    }
  }
`;

const RECOMMENDATIONS_QUERY = `
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      id
      title
      handle
      availableForSale
      productType
      tags
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
    }
  }
`;

const DEFAULT_SIZES = ["Naissance", "3 Mois", "6 Mois", "12 Mois"];

function normalize(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function detectCategory(productType, tags) {
  const n = normalize(productType);
  if (n.includes("grenouillere")) return "Grenouillères";
  if (n.includes("ensemble")) return "Ensembles";
  if (n.includes("accessoire")) return "Accessoires";

  for (const tag of tags) {
    const t = normalize(tag);
    if (t.includes("grenouillere")) return "Grenouillères";
    if (t.includes("ensemble")) return "Ensembles";
    if (t.includes("accessoire")) return "Accessoires";
  }

  return productType || null;
}

function detectCollectionLabel(tags) {
  for (const tag of tags) {
    const n = normalize(tag);
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
      const sizeOption = variant.selectedOptions.find((opt) =>
        sizeOptionNames.includes(normalize(opt.name)),
      );
      return sizeOption
        ? { label: sizeOption.value, variantId: variant.id }
        : null;
    })
    .filter((item) => item !== null);

  if (fromVariants.length > 0) {
    const seen = new Set();
    return fromVariants.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  }

  return DEFAULT_SIZES.map((label) => ({ label, variantId: null }));
}

function mapProductDetail(node) {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAtPrice = compareRaw ? parseFloat(compareRaw) : null;

  const variants = node.variants.edges.map(({ node: v }) => {
    const variantPrice = parseFloat(v.price.amount);
    const variantCompareRaw = v.compareAtPrice?.amount;
    const variantCompare = variantCompareRaw
      ? parseFloat(variantCompareRaw)
      : null;

    return {
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: variantPrice,
      compareAtPrice:
        variantCompare && variantCompare > variantPrice
          ? variantCompare
          : null,
      currencyCode: v.price.currencyCode,
      selectedOptions: v.selectedOptions,
    };
  });

  const galleryImages = node.images.edges.map(({ node: img }) => img);
  const images =
    galleryImages.length > 0
      ? galleryImages
      : node.featuredImage
        ? [node.featuredImage]
        : [];

  return {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    descriptionHtml: node.descriptionHtml,
    availableForSale: node.availableForSale,
    productType: node.productType,
    tags: node.tags,
    images,
    variants,
    price,
    compareAtPrice:
      compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    currencyCode: node.priceRange.minVariantPrice.currencyCode,
    isNew: node.tags.some((t) => {
      const tag = t.toLowerCase();
      return tag === "nouveau" || tag === "new" || tag === "nouveauté";
    }),
    sizes: extractSizes(variants),
    genres: extractGenresFromOptions(node.options),
    categoryName: node.category?.name?.trim() || null,
    category:
      node.category?.name?.trim() ||
      detectCategory(node.productType, node.tags),
    collectionLabel: detectCollectionLabel(node.tags),
    categoryAttributes: parseCategoryMetafields(node.metafields),
  };
}

function mapRecommendationNode(node) {
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
    genres: [],
    sizes: [],
    categoryName: null,
  };
}

export async function fetchProductByHandle(handle) {
  const data = await storefrontFetch(
    PRODUCT_QUERY,
    {
      handle,
      categoryMetafieldIdentifiers: getCategoryMetafieldIdentifiers(),
    },
  );

  if (!data.product) return null;
  return mapProductDetail(data.product);
}

export async function fetchSimilarProducts(product, limit = 4) {
  try {
    const data = await storefrontFetch(
      RECOMMENDATIONS_QUERY, { productId: product.id });

    const recommendations = (data.productRecommendations ?? [])
      .filter((p) => p.handle !== product.handle)
      .slice(0, limit)
      .map(mapRecommendationNode);

    if (recommendations.length >= limit) return recommendations;
  } catch {
    // Fall through to catalog filtering
  }

  const catalog = await fetchCatalog();

  return catalog.products
    .filter(
      (p) =>
        p.handle !== product.handle &&
        (product.categoryName && p.categoryName
          ? normalize(p.categoryName) === normalize(product.categoryName)
          : p.productType === product.productType ||
            p.tags.some((tag) =>
              product.tags.some(
                (t) => normalize(t) === normalize(tag) && t.length > 2,
              ),
            )),
    )
    .slice(0, limit);
}

export { formatPrice, getDiscountLabel };
