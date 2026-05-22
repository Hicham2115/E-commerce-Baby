/** Parse Shopify metafield value (single select or list of values). */
export function parseMetafieldValues(value) {
  if (!value?.trim()) return [];

  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Single value, not JSON
  }

  return [trimmed];
}

export function normalizeFilterValue(s) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}
