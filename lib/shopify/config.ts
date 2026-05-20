function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

/** e.g. "test-store-btp5hfbe.myshopify.com" — no https:// or trailing slash */
export function normalizeStoreDomain(raw: string): string {
  return raw
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "");
}

export function getShopifyConfig() {
  const storeDomain = normalizeStoreDomain(requireEnv("SHOPIFY_STORE_DOMAIN"));
  const apiVersion = process.env.SHOPIFY_API_VERSION ?? "2025-01";

  return {
    storeDomain,
    apiVersion,
    storefrontEndpoint: `https://${storeDomain}/api/${apiVersion}/graphql.json`,
    adminEndpoint: `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`,
  };
}
