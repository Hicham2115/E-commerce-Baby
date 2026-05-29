"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F9F8F6] px-4 text-center">
      <AlertTriangle
        aria-hidden
        className="size-12 text-[#9B4D44]"
        strokeWidth={1.25}
      />
      <h1 className="font-heading mt-6 text-2xl font-medium text-[#001B36]">
        Une erreur est survenue
      </h1>
      <p className="mt-3 max-w-sm text-sm text-[#5C5C5C]">
        Quelque chose s&apos;est mal passé. Veuillez réessayer ou recharger la
        page.
      </p>
      <Button
        className="mt-8 h-11 rounded-full bg-[#001B36] px-6 hover:bg-[#001B36]/90"
        onClick={reset}
        type="button"
      >
        Réessayer
      </Button>
    </div>
  );
}
