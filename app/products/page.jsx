import { Suspense } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductsCatalog from "@/components/products/ProductsCatalog";
import { fetchCatalog } from "@/lib/shopify/catalog";

async function ProductsContent({ searchParams }) {
  const catalog = await fetchCatalog(searchParams);

  return (
    <ProductsCatalog
      error={catalog.error}
      initialParams={searchParams}
      products={catalog.products}
    />
  );
}

export default async function ProductsPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <Navbar />
      <main className="bg-[#F9F8F6] pt-8 md:pt-12">
        <Suspense
          fallback={
            <div className="mx-auto max-w-7xl px-4 py-24 text-center text-sm text-[#5C5C5C]">
              Chargement…
            </div>
          }
        >
          <ProductsContent searchParams={params} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export const metadata = {
  title: "Boutique — Chahrazad Baby",
  description: "Vêtements bébé naissance — filtrez par genre, catégorie, taille et budget.",
};
