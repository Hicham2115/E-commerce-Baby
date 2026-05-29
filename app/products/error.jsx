"use client";

import Link from "next/link";
import { PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProductsError({ reset }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <PackageX
        aria-hidden
        className="size-12 text-[#9B4D44]"
        strokeWidth={1.25}
      />
      <h2 className="font-heading mt-6 text-2xl font-medium text-[#001B36]">
        Impossible de charger les produits
      </h2>
      <p className="mt-3 max-w-sm text-sm text-[#5C5C5C]">
        Une erreur est survenue lors du chargement de la boutique. Veuillez
        réessayer.
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
          <Link href="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  );
}
