import { normalizeFilterValue } from "@/lib/shopify/metafield-values";
import type { ProductVariant } from "@/lib/shopify/product";

function normalizeOptionName(name: string) {
  return normalizeFilterValue(name);
}

export type VariantSelections = {
  genre?: string;
  size?: string;
};

export function findVariantBySelections(
  variants: ProductVariant[],
  selections: VariantSelections,
): ProductVariant | undefined {
  if (variants.length === 0) return undefined;
  if (variants.length === 1) return variants[0];

  const match = variants.find((variant) => {
    if (selections.genre) {
      const hasGenre = variant.selectedOptions.some(
        (opt) =>
          normalizeOptionName(opt.name) === "genre" &&
          normalizeFilterValue(opt.value) ===
            normalizeFilterValue(selections.genre!),
      );
      if (!hasGenre) return false;
    }

    if (selections.size) {
      const hasSize = variant.selectedOptions.some(
        (opt) =>
          (normalizeOptionName(opt.name) === "taille" ||
            normalizeOptionName(opt.name) === "size") &&
          normalizeFilterValue(opt.value) ===
            normalizeFilterValue(selections.size!),
      );
      if (!hasSize) return false;
    }

    return true;
  });

  return match ?? variants[0];
}

export function productHasVariantSizes(
  sizes: { label: string; variantId: string | null }[],
): boolean {
  return sizes.some((s) => s.variantId !== null);
}
