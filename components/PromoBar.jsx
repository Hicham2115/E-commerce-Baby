import Link from "next/link";

export default function PromoBar() {
  return (
    <div className="border-b border-[#E8E4DC] bg-[#001B36] text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 py-2 text-center text-xs md:text-sm">
        <p>
          Livraison gratuite partout au Maroc à partir de{" "}
          <span className="font-semibold text-[#D6A99D]">400 dh</span>
        </p>
        <span aria-hidden className="hidden text-white/30 md:inline">
          |
        </span>
        <Link
          className="font-medium transition-colors hover:text-[#D6A99D]"
          href="tel:+212631319297"
        >
          +212 631 319 297
        </Link>
      </div>
    </div>
  );
}
