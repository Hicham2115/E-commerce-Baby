import axios from "axios";

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

function getStorefrontClient() {
  const { storefrontEndpoint } = getShopifyConfig();
  const token = requireEnv("SHOPIFY_STOREFRONT_ACCESS_TOKEN");

  return axios.create({
    baseURL: storefrontEndpoint,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
  });
}

function parseGraphQLResponse(data) {
  if (data.errors?.length) {
    throw new Error(data.errors.map((e) => e.message).join(", "));
  }
  if (!data.data) {
    throw new Error("Shopify Storefront API returned no data");
  }
  return data.data;
}

/**
 * Call Shopify Storefront API (GraphQL).
 * Use from Server Components, Route Handlers, or Server Actions only.
 */
export async function storefrontFetch(query, variables) {
  const client = getStorefrontClient();
  const { data } = await client.post("", { query, variables });
  return parseGraphQLResponse(data);
}

/** Mutations (cart, checkout) — never cached. */
export async function storefrontMutate(query, variables) {
  const client = getStorefrontClient();
  const { data } = await client.post("", { query, variables });
  return parseGraphQLResponse(data);
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
