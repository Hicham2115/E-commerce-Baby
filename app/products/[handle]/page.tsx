import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductDetail from "@/components/products/ProductDetail";
import ProductGallery from "@/components/products/ProductGallery";
import SimilarProducts from "@/components/products/SimilarProducts";
import {
  fetchProductByHandle,
  fetchSimilarProducts,
} from "@/lib/shopify/product";

type PageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { handle } = await params;

  try {
    const product = await fetchProductByHandle(handle);
    if (!product) return { title: "Produit introuvable" };

    return {
      title: `${product.title} — Chahrazad Baby`,
      description: product.description.slice(0, 160),
    };
  } catch {
    return { title: "Produit — Chahrazad Baby" };
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { handle } = await params;

  try {
    const product = await fetchProductByHandle(handle);
    if (!product) notFound();

    const similarProducts = await fetchSimilarProducts(product);

    const breadcrumbs = [
      { label: "Accueil", href: "/" },
      ...(product.genre
        ? [{ label: product.genre, href: "/products" }]
        : [{ label: "Boutique", href: "/products" }]),
      { label: product.title, href: null },
    ] as const;

    return (
      <>
        <Navbar />
        <main className="bg-[#F9F8F6]">
          <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 md:py-12">
            <nav
              aria-label="Fil d'Ariane"
              className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-[#5C5C5C] md:mb-10 md:text-sm"
            >
              {breadcrumbs.map((crumb, index) => (
                <span key={crumb.label} className="inline-flex items-center gap-1.5">
                  {index > 0 ? (
                    <span aria-hidden className="text-[#D4D0C8]">
                      /
                    </span>
                  ) : null}
                  {crumb.href ? (
                    <Link
                      className="transition-colors hover:text-[#001B36]"
                      href={crumb.href}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-[#001B36]">{crumb.label}</span>
                  )}
                </span>
              ))}
            </nav>

            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
              <ProductGallery images={product.images} title={product.title} />
              <ProductDetail product={product} />
            </div>
          </div>

          <SimilarProducts products={similarProducts} />
        </main>
        <Footer />
      </>
    );
  } catch {
    notFound();
  }
}
