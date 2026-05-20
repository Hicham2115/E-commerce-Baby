import { Quote, Star } from "lucide-react";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  city: string;
  product: string;
  rating: number;
};

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Des vêtements naissance magnifiques, doux au toucher et livrés rapidement. Je recommande Chahrazad Baby sans hésiter.",
    name: "Loubna K.",
    city: "Fès",
    product: "Pack clinique & grenouillères",
    rating: 5,
  },
  {
    id: "2",
    quote:
      "La qualité du coton est exceptionnelle. Les grenouillères tiennent parfaitement après plusieurs lavages.",
    name: "Sarah M.",
    city: "Casablanca",
    product: "Grenouillères 100% coton",
    rating: 5,
  },
  {
    id: "3",
    quote:
      "Commande reçue en 48h à Rabat, emballage soigné. Parfait pour offrir à une jeune maman.",
    name: "Nadia B.",
    city: "Rabat",
    product: "Coffret naissance",
    rating: 5,
  },
  {
    id: "4",
    quote:
      "Enfin une marque marocaine qui comprend les besoins des parents. Tissus hypoallergéniques, bébé très à l'aise.",
    name: "Fatima E.",
    city: "Marrakech",
    product: "Ensembles bébé fille",
    rating: 5,
  },
  {
    id: "5",
    quote:
      "Service client réactif et conseils tailles précis. Je suis cliente fidèle depuis la naissance de ma fille.",
    name: "Khadija A.",
    city: "Tanger",
    product: "Layette complète",
    rating: 5,
  },
];

function StarRow({
  rating,
  size = "default",
}: {
  rating: number;
  size?: "default" | "sm";
}) {
  const starClass = size === "sm" ? "size-2.5" : "size-3.5";

  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={`${starClass} ${
            i < rating
              ? "fill-[#C9A227] text-[#C9A227]"
              : "fill-none text-[#D4D0C8]"
          }`}
        />
      ))}
    </div>
  );
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden
      className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#D6E4EE] text-sm font-semibold text-[#001B36]"
    >
      {initials}
    </span>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="group flex h-full min-h-[300px] flex-col rounded-2xl border border-[#E8E4DC] bg-white p-6 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[#9B4D44]/25 hover:shadow-[0_20px_48px_-12px_rgba(0,27,54,0.12)] md:min-h-[320px] md:rounded-3xl md:p-7">
      <Quote aria-hidden className="size-8 text-[#9B4D44]/30" />

      <StarRow rating={testimonial.rating} />

      <blockquote className="mt-4 line-clamp-5 flex-1 text-sm leading-relaxed text-[#001B36] md:text-[15px]">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <footer className="mt-6 flex items-center gap-3 border-t border-[#E8E4DC] pt-5">
        <InitialsAvatar name={testimonial.name} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#001B36]">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-[#5C5C5C]">
            {testimonial.city} · {testimonial.product}
          </p>
        </div>
      </footer>
    </article>
  );
}

export default function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative overflow-hidden bg-[#001B36] px-4 py-16 md:px-8 md:py-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#9B4D44]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 -bottom-24 h-80 w-80 rounded-full bg-[#D6E4EE]/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#9B4D44] uppercase">
            Elles nous font confiance
          </p>
          <h2 className="font-heading mt-4 text-3xl font-medium text-white md:text-4xl lg:text-5xl">
            Ce que disent les mamans
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70 md:text-base">
            Des milliers de familles au Maroc nous choisissent pour la layette,
            les grenouillères et les cadeaux naissance depuis 2014.
          </p>

          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm sm:gap-6 md:px-5">
            <div className="text-center">
              <p className="font-heading text-xl font-medium text-white">
                4,9
              </p>
              <div className="mt-0.5 flex justify-center">
                <StarRow rating={5} size="sm" />
              </div>
              <p className="mt-0.5 text-[10px] tracking-wide text-white/50 uppercase">
                Note moyenne
              </p>
            </div>
            <span aria-hidden className="hidden h-8 w-px bg-white/15 sm:block" />
            <div className="text-center">
              <p className="font-heading text-xl font-medium text-white">
                2 400+
              </p>
              <p className="mt-0.5 text-[10px] tracking-wide text-white/50 uppercase">
                Avis clients
              </p>
            </div>
            <span aria-hidden className="hidden h-8 w-px bg-white/15 sm:block" />
            <div className="text-center">
              <p className="font-heading text-xl font-medium text-white">
                98%
              </p>
              <p className="mt-0.5 text-[10px] tracking-wide text-white/50 uppercase">
                Recommandent
              </p>
            </div>
          </div>
        </div>

        <div className="grid auto-rows-fr grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs tracking-[0.15em] text-white/40 uppercase md:mt-14 md:text-sm">
          {["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir"].map(
            (city, i, arr) => (
              <span key={city} className="inline-flex items-center gap-3">
                {city}
                {i < arr.length - 1 ? (
                  <span aria-hidden className="size-1 rounded-full bg-[#9B4D44]" />
                ) : null}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
