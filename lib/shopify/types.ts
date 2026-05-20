export type ShopifyProduct = {
  id: string;
  title: string;
  handle: string;
  availableForSale: boolean;
  productType: string;
  tags: string[];
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  compareAtPrice: number | null;
  currencyCode: string;
  isNew: boolean;
  /** Variant option "Genre" values (Fille, Garçon, Unisexe, …) */
  genres: string[];
  /** custom.taille — list of sizes (0-3 mois, 3-6 mois, …) */
  sizes: string[];
  /** Shopify Standard Product Taxonomy category name */
  categoryName: string | null;
};

export type ShopifyCollection = {
  id: string;
  title: string;
  handle: string;
};

export type ProductSortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "title"
  | "best-selling";

export type CatalogSearchParams = {
  sort?: string;
  genre?: string;
  category?: string;
  size?: string;
  priceMax?: string;
};
