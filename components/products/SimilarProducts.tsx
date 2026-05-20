import ProductCard from "@/components/products/ProductCard";
import type { ShopifyProduct } from "@/lib/shopify/types";

type SimilarProductsProps = {
  products: ShopifyProduct[];
};

export default function SimilarProducts({ products }: SimilarProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="border-t border-[#E8E4DC] bg-white px-4 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-7xl">
        <h2 className="font-heading text-2xl font-medium text-[#001B36] md:text-3xl">
          Produits Similaires
        </h2>
        <p className="mt-2 text-sm text-[#5C5C5C]">
          D&apos;autres pièces sélectionnées pour compléter votre look.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
