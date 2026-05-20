import { fetchCatalog, formatPrice, getDiscountLabel } from "@/lib/shopify/catalog";
import {
  getCategoryMetafieldIdentifiers,
  parseCategoryMetafields,
  type CategoryAttribute,
  type CategoryMetafieldNode,
} from "@/lib/shopify/category-metafields";
import { matchesCategory } from "@/lib/shopify/filters";
import { storefrontFetch } from "@/lib/shopify/storefront";
import type { ShopifyProduct } from "@/lib/shopify/types";

export type ProductImage = {
  url: string;
  altText: string | null;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  selectedOptions: { name: string; value: string }[];
};

export type ShopifyProductDetail = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  isNew: boolean;
  sizes: { label: string; variantId: string | null }[];
  genre: string | null;
  category: string | null;
  collectionLabel: string | null;
  categoryAttributes: CategoryAttribute[];
};

type ProductNode = {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  images: { edges: { node: ProductImage }[] };
  variants: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        selectedOptions: { name: string; value: string }[];
        price: { amount: string; currencyCode: string };
        compareAtPrice: { amount: string } | null;
      };
    }[];
  };
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: {
    minVariantPrice: { amount: string } | null;
  } | null;
  metafields: (CategoryMetafieldNode | null)[];
};

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

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectGenre(tags: string[]): string | null {
  for (const tag of tags) {
    const n = normalize(tag);
    if (n.includes("garcon") || n.includes("garçon")) return "Bébé Garçon";
    if (n.includes("fille")) return "Bébé Fille";
    if (n.includes("unisexe")) return "Unisexe";
  }
  return null;
}

function detectCategory(productType: string, tags: string[]): string | null {
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

function detectCollectionLabel(tags: string[]): string | null {
  for (const tag of tags) {
    const n = normalize(tag);
    if (n.includes("signature")) return "Collection Signature";
    if (n.includes("premium")) return "Collection Premium";
    if (n === "nouveau" || n === "new" || n === "nouveaute") return "Nouveauté";
  }
  return "Collection Signature";
}

function extractSizes(
  variants: ProductVariant[],
): { label: string; variantId: string | null }[] {
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
    .filter((item): item is { label: string; variantId: string } => item !== null);

  if (fromVariants.length > 0) {
    const seen = new Set<string>();
    return fromVariants.filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });
  }

  return DEFAULT_SIZES.map((label) => ({ label, variantId: null }));
}

function mapProductDetail(node: ProductNode): ShopifyProductDetail {
  const price = parseFloat(node.priceRange.minVariantPrice.amount);
  const compareRaw = node.compareAtPriceRange?.minVariantPrice?.amount;
  const compareAtPrice = compareRaw ? parseFloat(compareRaw) : null;

  const variants: ProductVariant[] = node.variants.edges.map(({ node: v }) => {
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
    genre: detectGenre(node.tags),
    category: detectCategory(node.productType, node.tags),
    collectionLabel: detectCollectionLabel(node.tags),
    categoryAttributes: parseCategoryMetafields(node.metafields),
  };
}

type RecommendationNode = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  compareAtPriceRange: {
    minVariantPrice: { amount: string } | null;
  } | null;
};

function mapRecommendationNode(node: RecommendationNode): ShopifyProduct {
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
  };
}

export async function fetchProductByHandle(handle: string) {
  const data = await storefrontFetch<{ product: ProductNode | null }>(
    PRODUCT_QUERY,
    {
      handle,
      categoryMetafieldIdentifiers: getCategoryMetafieldIdentifiers(),
    },
  );

  if (!data.product) return null;
  return mapProductDetail(data.product);
}

export async function fetchSimilarProducts(
  product: ShopifyProductDetail,
  limit = 4,
): Promise<ShopifyProduct[]> {
  try {
    const data = await storefrontFetch<{
      productRecommendations: RecommendationNode[] | null;
    }>(RECOMMENDATIONS_QUERY, { productId: product.id });

    const recommendations = (data.productRecommendations ?? [])
      .filter((p) => p.handle !== product.handle)
      .slice(0, limit)
      .map(mapRecommendationNode);

    if (recommendations.length >= limit) return recommendations;
  } catch {
    // Fall through to catalog filtering
  }

  const catalog = await fetchCatalog();
  const categoryKey = product.category
    ? normalize(product.category).replace(/s$/, "")
    : normalize(product.productType);

  return catalog.products
    .filter(
      (p) =>
        p.handle !== product.handle &&
        (p.productType === product.productType ||
          matchesCategory(p, categoryKey) ||
          p.tags.some((tag) =>
            product.tags.some(
              (t) => normalize(t) === normalize(tag) && t.length > 2,
            ),
          )),
    )
    .slice(0, limit);
}

export { formatPrice, getDiscountLabel };
