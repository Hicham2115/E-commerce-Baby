import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import product1 from "@/app/assets/Products/natracare-aMca3BHUvmU-unsplash.jpg";
import product2 from "@/app/assets/Products/photo-1690844623570-b5304dceae3b.avif";
import product3 from "@/app/assets/Products/photo-1695998575453-f155392a95ba.avif";
import product4 from "@/app/assets/Products/photo-1734599406023-80b2212b713b.avif";

const products: {
  name: string;
  price: string;
  oldPrice: string | null;
  discount: string;
  image: StaticImageData;
  href: string;
}[] = [
  {
    name: "Ensemble Garçon Chic avec Bretelles",
    price: "199",
    oldPrice: "269",
    discount: "-26%",
    image: product1,
    href: "https://chahrazadbaby.com/",
  },
  {
    name: "Ensemble pyjama Maman & Bébé matchy matchy",
    price: "379",
    oldPrice: "499",
    discount: "-24%",
    image: product2,
    href: "https://chahrazadbaby.com/",
  },
  {
    name: "Bonnet naissance 100% coton — maternité",
    price: "29",
    oldPrice: "69",
    discount: "-58%",
    image: product3,
    href: "https://chahrazadbaby.com/",
  },
  {
    name: "Pack grenouillères bébé 100% coton",
    price: "199",
    oldPrice: null,
    discount: "Pack 2 à 6 pcs",
    image: product4,
    href: "https://chahrazadbaby.com/",
  },
];

export default function FeaturedProducts() {
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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.name}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#E8E4DC] bg-[#F9F8F6] transition-all duration-300 hover:-translate-y-1 hover:border-[#9B4D44]/25 hover:shadow-[0_16px_40px_-12px_rgba(0,27,54,0.12)]"
              href={product.href}
              rel="noopener noreferrer"
              target="_blank"
            >
              <div className="relative aspect-square overflow-hidden bg-white">
                <Image
                  alt={product.name}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 100vw, 25vw"
                  src={product.image}
                />
                <span className="absolute top-3 left-3 rounded-full bg-[#9B4D44] px-2.5 py-0.5 text-[10px] font-semibold text-white uppercase">
                  {product.discount}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <h3 className="line-clamp-2 text-sm font-medium leading-snug text-[#001B36] group-hover:text-[#9B4D44]">
                  {product.name}
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-lg font-medium text-[#001B36]">
                    {product.price} dh
                  </span>
                  {product.oldPrice ? (
                    <span className="text-xs text-[#5C5C5C] line-through">
                      {product.oldPrice} dh
                    </span>
                  ) : null}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center md:mt-12">
          <Button
            asChild
            className="h-12 rounded-full bg-[#001B36] px-8 text-sm font-medium hover:bg-[#001B36]/90"
          >
            <Link
              href="https://chahrazadbaby.com/"
              rel="noopener noreferrer"
              target="_blank"
            >
              Découvrir tous les produits
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
