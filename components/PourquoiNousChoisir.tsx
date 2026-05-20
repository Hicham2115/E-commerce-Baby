import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const STORE_URL = "https://chahrazadbaby.com/";

const features = [
  {
    number: "02",
    title: "Artisans qualifiés",
    description:
      "De la conception des modèles au contrôle des produits finis, nous maîtrisons chaque étape avec des couturiers rigoureux.",
  },
  {
    number: "03",
    title: "À l'écoute des parents",
    description:
      "Tissus attrayants et de haute qualité, choisis pour répondre aux besoins réels des jeunes mamans et papas.",
  },
] as const;

export default function PourquoiNousChoisir() {
  return (
    <section id="about" className="bg-white px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative pb-16 sm:pb-20">
          <div className="group relative aspect-[4/5] overflow-hidden rounded-3xl sm:aspect-[3/4]">
            <Image
              alt="Layette et vêtements bébé naissance en coton doux"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="https://images.unsplash.com/photo-1740342580395-1a342317f174?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>

          <article className="group/card absolute right-0 -bottom-6 z-10 w-[min(100%,320px)] rounded-2xl border border-[#E8E4DC]/60 bg-white p-6 shadow-[0_16px_40px_-12px_rgba(0,27,54,0.12)] transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_48px_-12px_rgba(0,27,54,0.18)] sm:right-4 md:-bottom-8 md:p-8">
            <p className="text-xs font-semibold tracking-[0.15em] text-[#9B4D44] uppercase">
              01. Notre collection
            </p>
            <h3 className="font-heading mt-2 text-2xl font-medium text-[#001B36] md:text-[1.75rem]">
              100% coton doux
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#5C5C5C] md:text-base">
              Grenouillères, bonnets maternité, parures de lit et serviettes de
              bain — pensés pour la peau délicate du nouveau-né.
            </p>
          </article>
        </div>

        <div className="flex flex-col gap-10 lg:gap-12">
          <div className="lg:pt-4">
            <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase">
              Chahrazad baby collection
            </p>
            <h2 className="font-heading mt-4 max-w-xl text-3xl leading-tight font-medium text-[#001B36] md:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
              Le bien-être des tout-petits, le plaisir des mamans
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#5C5C5C] md:text-base">
              Le désir d&apos;améliorer tant le bien-être des tout-petits que le
              plaisir des mamans à en prendre soin nous a conduits à développer
              notre propre collection{" "}
              <strong className="font-medium text-[#001B36]">
                CHAHRAZAD BABY
              </strong>
              . Boutique vêtements bébé naissance, au service des familles
              marocaines depuis 2014.
            </p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2 sm:gap-6">
              {features.map((feature) => (
                <div
                  key={feature.number}
                  className="group/feature border-l border-[#E8E4DC] pl-6 transition-colors duration-300 hover:border-[#9B4D44]"
                >
                  <span className="text-sm font-semibold tracking-wider text-[#9B4D44] transition-transform duration-300 group-hover/feature:translate-x-0.5">
                    {feature.number}
                  </span>
                  <h3 className="font-heading mt-2 text-xl font-medium text-[#001B36]">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#5C5C5C]">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <Link
              className="mt-8 inline-block text-sm font-medium text-[#9B4D44] underline-offset-4 hover:text-[#001B36] hover:underline"
              href={STORE_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Découvrir notre boutique →
            </Link>
          </div>

          <div className="relative mt-4 lg:mt-auto">
            <div
              className="group relative aspect-[16/10] overflow-hidden shadow-sm sm:aspect-[5/3]"
              style={{ borderRadius: "8rem 1.5rem 1.5rem 1.5rem" }}
            >
              <Image
                alt="Ensemble bébé et produits de soin naissance"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                src="https://images.unsplash.com/photo-1743437997229-1c64f0643edf?q=80&w=776&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              />
            </div>

            <div
              className={cn(
                "absolute -top-4 left-4 z-10 flex size-28 items-center justify-center rounded-full bg-[#D6E4EE] p-4 text-center shadow-md sm:-left-6 sm:size-32",
                "animate-[float_4s_ease-in-out_infinite]",
              )}
            >
              <p className="font-heading text-sm leading-snug font-medium text-[#001B36] italic sm:text-base">
                Livraison gratuite dès 400 dh
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
