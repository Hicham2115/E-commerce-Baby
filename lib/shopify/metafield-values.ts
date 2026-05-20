/** Parse Shopify metafield value (single select or list of values). */
export function parseMetafieldValues(value: string | null | undefined): string[] {
  if (!value?.trim()) return [];

  const trimmed = value.trim();

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Single value, not JSON
  }

  return [trimmed];
}

export function normalizeFilterValue(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
