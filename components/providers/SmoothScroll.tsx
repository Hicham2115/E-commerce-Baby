"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";
import { useFavoritesStore } from "@/stores/favorites-store";
import "lenis/dist/lenis.css";

const LENIS_OPTIONS = {
  lerp: 0.09,
  duration: 1.15,
  smoothWheel: true,
  syncTouch: false,
  anchors: true,
} as const;

const SCROLL_OFFSET = -120;

function LenisController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const cartOpen = useCartStore((s) => s.isOpen);
  const favoritesOpen = useFavoritesStore((s) => s.isOpen);

  useEffect(() => {
    if (!lenis) return;
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  useEffect(() => {
    if (!lenis) return;
    if (cartOpen || favoritesOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [cartOpen, favoritesOpen, lenis]);

  useEffect(() => {
    if (!lenis || typeof window === "undefined") return;

    const hash = window.location.hash;
    if (!hash) return;

    const target = document.querySelector<HTMLElement>(hash);
    if (target) {
      lenis.scrollTo(target, { offset: SCROLL_OFFSET });
    }
  }, [pathname, lenis]);

  return <>{children}</>;
}

function SmoothScrollInner({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <LenisController>{children}</LenisController>
    </ReactLenis>
  );
}

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children}</>}>
      <SmoothScrollInner>{children}</SmoothScrollInner>
    </Suspense>
  );
}
