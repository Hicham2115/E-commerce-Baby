import Image from "next/image";
import Link from "next/link";
import { productsUrlByGenre } from "@/lib/shopify/filters";
import { FadeInUp, StaggerContainer, StaggerItem } from "@/components/motion";

const categories = [
  {
    href: productsUrlByGenre("fille"),
    title: "Bébé fille",
    subtitle: "Packs clinique, grenouillères, ensembles & accessoires",
    image:
      "https://images.unsplash.com/photo-1588829237660-88c4d4886130?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Collection vêtements bébé fille Chahrazad Baby",
  },
  {
    href: productsUrlByGenre("garcon"),
    title: "Bébé garçon",
    subtitle: "Barboteuses, pyjamas, sorties de bain & baptême",
    image:
      "https://images.unsplash.com/photo-1589347528526-f832a4938213?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Collection vêtements bébé garçon Chahrazad Baby",
  },
];

export default function CategoryCards() {
  return (
    <section id="categories" className="bg-[#F9F8F6] px-4 pb-16 md:px-8 md:pb-20">
      <FadeInUp className="mx-auto mb-8 max-w-7xl text-center md:mb-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase">
          #Chahrazad-Baby
        </p>
        <h2 className="font-heading mt-2 text-2xl font-medium text-[#001B36] md:text-3xl">
          Filles & Garçons — collections naissance
        </h2>
      </FadeInUp>

      <StaggerContainer className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
        {categories.map((category) => (
          <StaggerItem key={category.title}>
            <Link
              className="group relative block aspect-[5/4] overflow-hidden rounded-2xl shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,27,54,0.25)] sm:aspect-[4/3] md:rounded-3xl"
              href={category.href}
            >
              <Image
                alt={category.alt}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                src={category.image}
              />

              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-[#001B36]/75 via-[#001B36]/25 to-transparent transition-opacity duration-500 group-hover:from-[#001B36]/85"
              />

              <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 ease-out group-hover:-translate-y-2 md:p-8">
                <h3 className="font-heading text-3xl font-medium text-white md:text-4xl">
                  {category.title}
                </h3>
                <p className="mt-1 text-sm text-white/90 md:text-base">
                  {category.subtitle}
                </p>
                <span className="relative mt-4 inline-block pb-0.5 text-sm font-medium text-white">
                  Voir la collection
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-100 bg-white/90 transition-transform duration-300 ease-out group-hover:scale-x-110"
                  />
                </span>
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeInUp delay={0.2} className="mx-auto mt-6 flex max-w-7xl justify-center">
        <Link
          className="text-sm font-medium text-[#9B4D44] underline-offset-4 transition-colors hover:text-[#001B36] hover:underline"
          href="/products"
          id="promotions"
        >
          Offre spéciale — pour partager l&apos;amour →
        </Link>
      </FadeInUp>
    </section>
  );
}
