export type FavoriteItem = {
  handle: string;
  title: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
};

export function productToFavorite(product: {
  handle: string;
  title: string;
  imageUrl: string | null;
  imageAlt: string | null;
  price: number;
  currencyCode: string;
  availableForSale: boolean;
}): FavoriteItem {
  return {
    handle: product.handle,
    title: product.title,
    imageUrl: product.imageUrl,
    imageAlt: product.imageAlt,
    price: product.price,
    currencyCode: product.currencyCode,
    availableForSale: product.availableForSale,
  };
}
