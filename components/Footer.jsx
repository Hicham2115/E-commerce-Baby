"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { useLenis } from "lenis/react";

const STORE_URL = "https://chahrazadbaby.com/";

const linkColumns = [
  {
    title: "À propos",
    links: [
      { label: "Notre histoire", href: "/#about" },
      { label: "Boutique", href: "/products" },
      { label: "Avis clients", href: "/#about" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact", href: "/#contact" },
      { label: "Livraison & retours", href: "/products" },
      { label: "FAQ", href: "/products" },
    ],
  },
  {
    title: "Réseaux",
    links: [
      { label: "Instagram", href: STORE_URL },
      { label: "Facebook", href: STORE_URL },
      { label: "WhatsApp", href: "https://wa.me/212631319297" },
    ],
  },
];

function BrandMark() {
  return (
    <svg
      aria-hidden
      className="h-28 w-28 shrink-0 md:h-36 md:w-36 lg:h-44 lg:w-44"
      fill="none"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect fill="#001B36" height="22" width="22" x="8" y="8" />
      <rect fill="#001B36" height="22" transform="rotate(45 71 19)" width="22" x="60" y="8" />
      <rect fill="#001B36" height="22" width="22" x="90" y="8" />
      <rect fill="#001B36" height="22" width="22" x="8" y="49" />
      <rect fill="#001B36" height="28" width="28" x="46" y="46" />
      <rect fill="#001B36" height="22" width="22" x="90" y="49" />
      <rect fill="#001B36" height="22" transform="rotate(45 19 71)" width="22" x="8" y="60" />
      <rect fill="#001B36" height="22" width="22" x="8" y="90" />
      <rect fill="#001B36" height="22" width="22" x="49" y="90" />
      <rect fill="#001B36" height="22" transform="rotate(45 71 71)" width="22" x="60" y="60" />
      <rect fill="#001B36" height="22" width="22" x="90" y="90" />
    </svg>
  );
}

function FieldLine({
  id,
  label,
  type = "text",
  required,
  multiline,
  inline,
}) {
  const inputClass =
    "w-full border-0 bg-transparent py-3 pl-4 text-sm text-[#001B36] outline-none placeholder:text-[#001B36]/40";

  return (
    <label className="flex flex-col" htmlFor={id}>
      <span className="mb-1 text-sm text-[#001B36]">{label}</span>
      <div
        className={
          inline
            ? "border-l-2 border-[#001B36]"
            : "border-l-2 border-b border-[#001B36]"
        }
      >
        {multiline ? (
          <textarea
            className={`${inputClass} min-h-[72px] resize-none`}
            id={id}
            name={id}
            rows={2}
          />
        ) : (
          <input
            className={inputClass}
            id={id}
            name={id}
            required={required}
            type={type}
          />
        )}
      </div>
    </label>
  );
}

export default function Footer() {
  const lenis = useLenis();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer>
      {/* CTA — contact form (scroll target for navbar) */}
      <section
        id="contact"
        className="bg-[#F2F0EB] px-6 py-16 md:px-12 md:py-20 lg:px-16 lg:py-24"
      >
        <div className="mx-auto grid max-w-7xl gap-14 lg:grid-cols-2 lg:gap-24">
          <div className="max-w-md pt-2">
            <h2 className="text-3xl leading-snug font-normal tracking-tight text-[#001B36] md:text-4xl lg:text-[2.5rem] lg:leading-tight">
              Besoin d&apos;aide pour choisir la layette ?
            </h2>
            <p className="mt-6 text-sm leading-relaxed text-[#001B36]/75 md:text-[15px]">
              Notre service s&apos;adresse aux parents qui souhaitent offrir à
              leur bébé des vêtements naissance doux, sûrs et élégants — avec
              livraison soignée partout au Maroc.
            </p>
          </div>

          <form
            className="flex flex-col"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Name | Email — side by side with vertical divider */}
            <div className="grid grid-cols-2 border-b border-[#001B36]">
              <div className="pr-6 md:pr-10">
                <FieldLine id="name" inline label="Nom" required />
              </div>
              <div className="pl-6 md:pl-10">
                <FieldLine
                  id="email"
                  inline
                  label="E-mail"
                  required
                  type="email"
                />
              </div>
            </div>

            <div className="mt-10">
              <FieldLine id="phone" label="Téléphone" type="tel" />
            </div>

            <div className="mt-10">
              <FieldLine
                id="message"
                label="Un message pour nous ?"
                multiline
              />
            </div>

            <div className="mt-12 flex justify-end">
              <button
                className="bg-[#001B36] px-12 py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-85"
                type="submit"
              >
                Envoyer
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Main footer — graphic left, brand + 3 columns right */}
      <section className="bg-[#8FB3B5] px-6 py-14 md:px-12 md:py-16 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-16 xl:gap-24">
            <BrandMark />

            <div className="min-w-0 flex-1">
              <Link
                className="font-heading text-5xl font-medium tracking-tight text-[#001B36] md:text-6xl lg:text-7xl"
                href="/"
              >
                Chahrazad Baby
              </Link>

              <div className="mt-10 grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-x-12 md:mt-12 lg:gap-x-16">
                {linkColumns.map((col) => (
                  <div key={col.title}>
                    <h3 className="text-sm font-semibold text-[#001B36]">
                      {col.title}
                    </h3>
                    <ul className="mt-4 flex flex-col gap-2.5">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <Link
                            className="text-sm text-[#001B36]/80 transition-colors hover:text-[#001B36]"
                            href={link.href}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar — copyright | terms | back to top */}
          <div className="mt-14 grid grid-cols-1 items-center gap-4 border-t border-[#001B36]/25 pt-8 sm:grid-cols-3">
            <p className="text-center text-sm text-[#001B36]/80 sm:text-left">
              &copy; {currentYear} – Designed &amp; developed by{" "}
              <a
                className="underline"
                href="https://www.stallionadvertising.ma/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stallion Advertising
              </a>
              .
            </p>
            <Link
              className="text-sm text-[#001B36]/80 transition-colors hover:text-[#001B36] text-center"
              href={STORE_URL}
              rel="noopener noreferrer"
              target="_blank"
            >
              Conditions générales de vente
            </Link>
            <button
              className="flex items-center justify-center gap-2 text-sm text-[#001B36]/80 transition-colors hover:text-[#001B36] sm:justify-end"
              onClick={scrollToTop}
              type="button"
            >
              Retour en haut
              <span className="flex size-7 items-center justify-center border border-[#001B36] bg-transparent">
                <ArrowUp className="size-3.5 text-[#001B36]" strokeWidth={2} />
              </span>
            </button>
          </div>
        </div>
      </section>
    </footer>
  );
}
