"use client";

import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductDetailError({ reset }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <PackageSearch
        aria-hidden
        className="size-12 text-[#9B4D44]"
        strokeWidth={1.25}
      />
      <h2 className="font-heading mt-6 text-2xl font-medium text-[#001B36]">
        Produit introuvable
      </h2>
      <p className="mt-3 max-w-sm text-sm text-[#5C5C5C]">
        Ce produit n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button
          className="h-11 rounded-full bg-[#001B36] px-6 hover:bg-[#001B36]/90"
          onClick={reset}
          type="button"
        >
          Réessayer
        </Button>
        <Button
          asChild
          className="h-11 rounded-full border border-[#001B36] bg-transparent px-6 text-[#001B36] hover:bg-[#001B36]/5"
          variant="outline"
        >
          <Link href="/products">Voir la boutique</Link>
        </Button>
      </div>
    </div>
  );
}
