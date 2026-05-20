"use client";

import type Lenis from "lenis";
import { ReactLenis, useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { Suspense, useCallback, useEffect } from "react";
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

function scrollToHashTarget(lenis: Lenis) {
  const hash = window.location.hash;
  if (!hash) return false;

  const target = document.querySelector<HTMLElement>(hash);
  if (!target) return false;

  lenis.scrollTo(target, { offset: SCROLL_OFFSET });
  return true;
}

function LenisController({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const cartOpen = useCartStore((s) => s.isOpen);
  const favoritesOpen = useFavoritesStore((s) => s.isOpen);

  const scrollToHash = useCallback(() => {
    if (!lenis) return;

    const run = (attempt = 0) => {
      if (scrollToHashTarget(lenis)) return;
      if (attempt < 8) {
        requestAnimationFrame(() => run(attempt + 1));
      }
    };

    requestAnimationFrame(() => run());
  }, [lenis]);

  useEffect(() => {
    if (!lenis) return;
    if (window.location.hash) {
      scrollToHash();
      return;
    }
    lenis.scrollTo(0, { immediate: true });
  }, [pathname, lenis, scrollToHash]);

  useEffect(() => {
    if (!lenis) return;
    if (cartOpen || favoritesOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [cartOpen, favoritesOpen, lenis]);

  useEffect(() => {
    if (!lenis) return;

    const onHashChange = () => scrollToHash();
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onHashChange);

    const onDocumentClick = (event: MouseEvent) => {
      const anchor = (event.target as Element).closest("a[href*='#']");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;

      let url: URL;
      try {
        url = new URL(anchor.href);
      } catch {
        return;
      }

      if (url.origin !== window.location.origin || !url.hash) return;

      const sameRoute =
        url.pathname === window.location.pathname &&
        url.search === window.location.search;

      if (!sameRoute) return;

      event.preventDefault();
      const target = document.querySelector<HTMLElement>(url.hash);
      if (!target) return;

      window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
      lenis.scrollTo(target, { offset: SCROLL_OFFSET });
    };

    document.addEventListener("click", onDocumentClick, true);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onHashChange);
      document.removeEventListener("click", onDocumentClick, true);
    };
  }, [lenis, scrollToHash]);

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
