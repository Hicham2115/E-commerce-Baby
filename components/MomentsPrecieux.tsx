import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const STORE_URL = "https://chahrazadbaby.com/";

type Tile =
  | {
      href: string;
      label: string;
      title: string;
      description: string;
      image: string;
      alt: string;
      className: string;
      isQuote?: false;
    }
  | {
      href: string;
      label: string;
      title: string;
      description: string;
      image: null;
      alt: string;
      className: string;
      isQuote: true;
    };

const tiles: Tile[] = [
  {
    href: STORE_URL,
    label: "Bébé fille & garçon",
    title: "Grenouillères & pyjamas",
    description: "Packs 2, 4 ou 6 pièces — 100% coton, dès la naissance.",
    image:
      "https://images.unsplash.com/photo-1650651154134-601a04c2ede2?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Grenouillères et pyjamas bébé en coton",
    className:
      "md:col-span-7 md:row-span-2 min-h-[280px] md:min-h-[420px]",
  },
  {
    href: STORE_URL,
    label: "Pack clinique",
    title: "Sortie de maternité",
    description: "Ensembles prêts pour les premiers jours à la clinique.",
    image:
      "https://images.unsplash.com/photo-1635874714425-c342060a4c58?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Pack clinique et layette naissance",
    className: "md:col-span-5 min-h-[200px]",
  },
  {
    href: STORE_URL,
    label: "Idée cadeaux",
    title: "Coffrets & accessoires",
    description: "Sacs, couvertures, produits de soin et ensembles cadeaux.",
    image:
      "https://images.unsplash.com/photo-1701614902634-08ae596571c1?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Idées cadeaux naissance Chahrazad Baby",
    className: "md:col-span-5 min-h-[200px]",
  },
  {
    href: STORE_URL,
    label: "Boutique",
    title: "Parures de lit & sortie de bain",
    description:
      "Tour de lit 100% coton, serviettes à capuche — confort quotidien.",
    image: null,
    alt: "",
    className: "md:col-span-12 min-h-[140px]",
    isQuote: true,
  },
];

const marqueeItems = [
  "Pack clinique",
  "Grenouillères",
  "Sortie de bain",
  "Baptême & fêtes",
  "Produits de soin",
  "Ensembles",
  "Idée cadeaux",
  "100% coton",
];

export default function MomentsPrecieux() {
  return (
    <section className="relative overflow-hidden bg-[#F9F8F6] px-4 py-16 md:px-8 md:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-0 h-72 w-72 rounded-full bg-[#D6E4EE]/50 blur-3xl md:h-96 md:w-96"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase">
              Nos catégories
            </p>
            <h2 className="font-heading mt-4 text-4xl leading-[1.1] font-medium text-[#001B36] md:text-5xl lg:text-[3.5rem]">
              Tout pour la layette de{" "}
              <span className="text-[#9B4D44] italic">votre bébé</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-[#5C5C5C] md:text-right md:text-base">
            Comme sur notre boutique : bébé fille, bébé garçon, accessoires,
            baptême, couvertures et promotions — livrés partout au Maroc.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
          {tiles.map((tile) =>
            tile.isQuote ? (
              <Link
                key={tile.title}
                className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#E8E4DC] bg-white p-6 shadow-[0_16px_40px_-12px_rgba(0,27,54,0.08)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#9B4D44]/30 hover:shadow-[0_24px_48px_-12px_rgba(0,27,54,0.12)] md:rounded-3xl md:p-8 ${tile.className}`}
                href={tile.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.15em] text-[#9B4D44] uppercase">
                      {tile.label}
                    </p>
                    <h3 className="font-heading mt-2 text-2xl font-medium text-[#001B36] md:text-3xl">
                      {tile.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-[#5C5C5C]">
                      {tile.description}
                    </p>
                  </div>
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#E8E4DC] text-[#001B36] transition-all duration-300 group-hover:border-[#9B4D44] group-hover:bg-[#9B4D44] group-hover:text-white">
                    <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-12" />
                  </span>
                </div>
              </Link>
            ) : (
              <Link
                key={tile.title}
                className={`group relative overflow-hidden rounded-2xl shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_40px_-12px_rgba(0,27,54,0.2)] md:rounded-3xl ${tile.className}`}
                href={tile.href}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Image
                  alt={tile.alt}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  src={tile.image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001B36]/75 via-[#001B36]/25 to-transparent transition-opacity duration-500 group-hover:from-[#001B36]/85" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-6">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-white/80 uppercase md:text-xs">
                    {tile.label}
                  </p>
                  <h3 className="font-heading mt-1 text-xl font-medium text-white md:text-2xl">
                    {tile.title}
                  </h3>
                  <p className="mt-1 max-h-0 overflow-hidden text-sm text-white/90 opacity-0 transition-all duration-500 group-hover:max-h-12 group-hover:opacity-100">
                    {tile.description}
                  </p>
                </div>
                <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/90 text-[#001B36] opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            ),
          )}
        </div>

        <div className="relative mt-14 overflow-hidden border-t border-[#E8E4DC] pt-10 md:mt-20">
          <div className="flex w-max animate-[marquee_35s_linear_infinite] gap-10 hover:[animation-play-state:paused]">
            {[...marqueeItems, ...marqueeItems].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex shrink-0 items-center gap-10 text-sm font-medium tracking-[0.12em] text-[#001B36]/35 uppercase md:text-base"
              >
                {item}
                <span
                  aria-hidden
                  className="size-1.5 rounded-full bg-[#9B4D44]"
                />
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
