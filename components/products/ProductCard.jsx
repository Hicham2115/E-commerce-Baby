"use client";

import Image from "next/image";
import Link from "next/link";
import FavoriteToggle from "@/components/favorites/FavoriteToggle";
import { formatPrice } from "@/lib/shopify/products";

export default function ProductCard({ product }) {
  return (
    <div className="group relative">
      <Link className="block" href={`/products/${product.handle}`}>
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#EDEAE6]">
          {product.imageUrl ? (
            <Image
              alt={product.imageAlt ?? product.title}
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              fill
              sizes="(max-width: 768px) 50vw, 33vw"
              src={product.imageUrl}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#5C5C5C]/40">
              Image produit
            </div>
          )}
          {product.isNew ? (
            <span className="absolute bottom-3 left-3 rounded-md bg-[#9B4D44] px-2.5 py-1 text-[10px] font-semibold tracking-wide text-white uppercase">
              Nouveau
            </span>
          ) : null}
        </div>
        <div className="mt-4 px-0.5">
          <h3 className="text-sm leading-snug text-[#001B36] transition-colors group-hover:text-[#9B4D44]">
            {product.title}
          </h3>
          <p className="mt-1.5 font-heading text-base text-[#9B4D44]">
            {formatPrice(product.price, product.currencyCode)}
          </p>
        </div>
      </Link>
      <FavoriteToggle
        className="absolute top-3 right-3 z-10"
        product={product}
        size="sm"
      />
    </div>
  );
}
