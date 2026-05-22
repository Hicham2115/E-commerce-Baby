function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getShopifyConfig() {
  const storeDomain = requireEnv("SHOPIFY_STORE_DOMAIN")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-01";
  return {
    storefrontEndpoint: `https://${storeDomain}/api/${apiVersion}/graphql.json`,
  };
}

/**
 * Call Shopify Storefront API (GraphQL).
 * Use from Server Components, Route Handlers, or Server Actions only.
 */
export async function storefrontFetch(query, variables) {
  const { storefrontEndpoint } = getShopifyConfig();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const res = await fetch(storefrontEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned no data");
  }

  return json.data;
}

/** Mutations (cart, checkout) — never cached. */
export async function storefrontMutate(query, variables) {
  const { storefrontEndpoint } = getShopifyConfig();
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  if (!token) {
    throw new Error("Missing SHOPIFY_STOREFRONT_ACCESS_TOKEN");
  }

  const res = await fetch(storefrontEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Shopify Storefront API error: ${res.status}`);
  }

  const json = await res.json();

  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("Shopify Storefront API returned no data");
  }

  return json.data;
}

/** Example: fetch products for your FeaturedProducts section */
export const PRODUCTS_QUERY = `
  query FeaturedProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
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
    }
  }
`;
