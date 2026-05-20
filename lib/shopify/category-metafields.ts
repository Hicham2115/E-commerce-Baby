/**
 * Shopify Category metafield keys (namespace: "shopify").
 * These are taxonomy attributes assigned when a product category is set in Admin.
 * @see https://help.shopify.com/en/manual/custom-data/metafields/category-metafields
 */
export const CATEGORY_METAFIELD_KEYS = [
  "fabric",
  "material",
  "fabric-composition",
  "color-pattern",
  "pattern",
  "target-gender",
  "age-group",
  "care-instructions",
  "clothing-features",
  "baby-toddler-clothing-features",
  "baby-toddler-clothing-style",
  "baby-toddler-top-style",
  "baby-toddler-bottom-style",
  "baby-toddler-outerwear-style",
  "baby-toddler-sleepwear-style",
  "baby-toddler-swimwear-style",
  "baby-toddler-hosiery-style",
  "baby-toddler-hat-style",
  "baby-toddler-accessory-style",
  "baby-toddler-bedding-features",
  "baby-toddler-blanket-features",
  "baby-toddler-shoe-features",
  "baby-toddler-diaper-style",
  "sleeve-length-type",
  "neckline",
  "fit",
  "occasion-style",
  "shoe-features",
  "shoe-size",
  "blanket-type",
  "bedding-size",
  "activity",
  "sustainability-features",
  "certifications-standards",
  "specialized-features",
  "product-benefits",
  "allergens",
] as const;

export type CategoryAttribute = {
  key: string;
  label: string;
};

export type CategoryMetafieldNode = {
  key: string;
  type: string;
  value: string;
  references?: {
    nodes: {
      fields: { key: string; value: string }[];
    }[];
  } | null;
};

export function getCategoryMetafieldIdentifiers() {
  return CATEGORY_METAFIELD_KEYS.map((key) => ({
    namespace: "shopify",
    key,
  }));
}

function extractLabelsFromMetaobject(fields: { key: string; value: string }[]) {
  const label = fields.find((field) => field.key === "label")?.value?.trim();
  return label || null;
}

function parsePlainValue(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed || trimmed.startsWith("gid://") || trimmed.startsWith("[")) {
    return [];
  }

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  } catch {
    // Not JSON — use raw string
  }

  return [trimmed];
}

export function parseCategoryMetafields(
  metafields: (CategoryMetafieldNode | null)[] | null | undefined,
): CategoryAttribute[] {
  const attributes: CategoryAttribute[] = [];
  const seen = new Set<string>();

  for (const metafield of metafields ?? []) {
    if (!metafield?.key) continue;

    const labels =
      metafield.references?.nodes
        ?.map((node) => extractLabelsFromMetaobject(node.fields))
        .filter((label): label is string => Boolean(label)) ??
      parsePlainValue(metafield.value);

    for (const label of labels) {
      const dedupeKey = `${metafield.key}:${label.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);
      attributes.push({ key: metafield.key, label });
    }
  }

  return attributes;
}
