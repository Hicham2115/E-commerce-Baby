import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
// import heroImage from "@/app/assets/hero-nursery.jpg";

export default function Hero() {
  return (
    <section id="hero" className="bg-[#F9F8F6] px-4 py-12 md:px-8 md:py-16 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Left column */}
        <div className="flex flex-col gap-6 lg:gap-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase md:text-sm">
            Vêtements bébé naissance — depuis 2014
          </p>

          <h1 className="font-heading text-4xl leading-[1.15] font-medium text-[#001B36] md:text-5xl lg:text-[3.25rem] lg:leading-[1.12]">
            La collection Chahrazad Baby pour vos tout-petits
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-[#5C5C5C] md:text-lg">
            Grenouillères, packs clinique, ensembles, sorties de bain et idées
            cadeaux en coton doux — conçus et contrôlés par nos artisans pour le
            bien-être de bébé et le plaisir des mamans.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Button
              asChild
              className="h-12 rounded-full bg-[#001B36] px-8 text-sm font-medium text-white hover:bg-[#001B36]/90"
            >
              <Link
                href="https://chahrazadbaby.com/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Découvrir la boutique
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-12 rounded-full border-[#D4D0C8] bg-white px-8 text-sm font-medium text-[#001B36] hover:bg-white/80"
            >
              <Link href="/#promotions">Offres spéciales</Link>
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
          {/* Decorative blob */}
          <div
            aria-hidden
            className="absolute -top-6 -right-4 h-56 w-56 rounded-full bg-[#D6E4EE]/70 blur-sm md:-top-10 md:-right-8 md:h-72 md:w-72 lg:h-80 lg:w-80"
          />

          {/* Image frame */}
          <div
            className="relative aspect-[4/5] overflow-hidden border-4 border-white shadow-[0_20px_50px_-12px_rgba(0,27,54,0.15)]"
            style={{ borderRadius: "2.5rem 9.5rem 2.5rem 9.5rem" }}
          >
            <Image
              alt="Vêtements et layette bébé Chahrazad Baby"
              className="object-cover"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              src="https://images.unsplash.com/photo-1643991248793-26dd97e84545?q=80&w=822&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </div>

          {/* Testimonial card */}
          <div className="absolute -bottom-4 left-4 z-10 max-w-[260px] rounded-2xl border border-white/80 bg-white p-4 shadow-lg md:-bottom-6 md:left-6 md:max-w-[280px] md:p-5">
            <div className="mb-2 flex items-center gap-1.5">
              <Star
                className="size-3.5 fill-[#9B4D44] text-[#9B4D44]"
                aria-hidden
              />
              <span className="text-[10px] font-semibold tracking-wider text-[#9B4D44] uppercase">
                Avis de nos clientes
              </span>
            </div>
            <p className="text-sm leading-snug text-[#001B36]">
              &ldquo;Des vêtements naissance magnifiques, doux et livrés
              rapidement partout au Maroc.&rdquo;
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
