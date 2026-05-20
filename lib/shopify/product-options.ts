import { normalizeFilterValue } from "@/lib/shopify/metafield-values";

const GENRE_OPTION_NAMES = new Set(["genre"]);

export type ProductOption = {
  name: string;
  values: string[];
};

/** Genre values from the product "Genre" variant option (Fille, Garçon, …). */
export function extractGenresFromOptions(
  options: ProductOption[] | null | undefined,
): string[] {
  if (!options?.length) return [];

  const genreOption = options.find((opt) =>
    GENRE_OPTION_NAMES.has(normalizeFilterValue(opt.name)),
  );

  if (!genreOption?.values?.length) return [];

  const seen = new Set<string>();
  return genreOption.values
    .map((v) => v.trim())
    .filter((v) => {
      const key = normalizeFilterValue(v);
      if (!v || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}
