import Link from "next/link";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { fetchCatalog } from "@/lib/shopify/catalog";

export default async function FeaturedProducts() {
  const { products, error } = await fetchCatalog({ sort: "newest" });
  const featured = products.slice(0, 4);

  return (
    <section id="products" className="bg-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase">
            Vous allez ❤ ça
          </p>
          <h2 className="font-heading mt-3 text-3xl font-medium text-[#001B36] md:text-4xl">
            Nos coups de cœur naissance
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#5C5C5C] md:text-base">
            Une sélection de vêtements bébé naissance, grenouillères, ensembles
            et accessoires que les jeunes parents adorent — qualité Chahrazad
            Baby, livrés partout au Maroc.
          </p>
        </div>

        {featured.length > 0 ? (
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-2 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#D4D0C8] bg-[#F9F8F6] px-6 py-16 text-center">
            <p className="font-heading text-xl text-[#001B36]">
              Aucun produit disponible
            </p>
            <p className="mx-auto mt-3 max-w-sm text-sm text-[#5C5C5C]">
              Ajoutez des produits dans Shopify pour les afficher ici.
            </p>
            {error ? (
              <p className="mt-4 text-xs text-[#9B4D44]">{error}</p>
            ) : null}
          </div>
        )}

        <div className="mt-10 flex justify-center md:mt-12">
          <Button
            asChild
            className="h-12 rounded-full bg-[#001B36] px-8 text-sm font-medium hover:bg-[#001B36]/90"
          >
            <Link href="/products">Découvrir tous les produits</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
