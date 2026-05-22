"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CartButton from "@/components/cart/CartButton";
import FavoritesButton from "@/components/favorites/FavoritesButton";
import PromoBar from "@/components/PromoBar";
import logo from "@/app/assets/logo.png";
import { productsUrlByGenre } from "@/lib/shopify/filters";
import { cn } from "@/lib/utils";

const navigationLinks = [
  { href: "/products", label: "Boutique", match: "/products" },
  {
    href: productsUrlByGenre("fille"),
    label: "Bébé fille",
    match: "/products",
    genre: "fille",
  },
  {
    href: productsUrlByGenre("garcon"),
    label: "Bébé garçon",
    match: "/products",
    genre: "garcon",
  },
  { href: "/products", label: "Idée cadeaux", match: "/products" },
  { href: "/#contact", label: "Contact" },
  { href: "/#about", label: "À propos" },
];

const navLinkClassName =
  "relative rounded-md bg-transparent px-2.5 py-2 text-sm font-medium text-[#001B36] transition-colors hover:bg-transparent hover:text-[#9B4D44] data-active:text-[#9B4D44] lg:px-3";

function NavbarInner() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre");

  const isActive = (link) => {
    if (link.genre) {
      return (
        pathname === "/products" && activeGenre === link.genre
      );
    }
    if (link.match === "/products") {
      return pathname === "/products" && !activeGenre;
    }
    if (link.match) {
      return pathname === link.match || pathname.startsWith(`${link.match}/`);
    }
    return false;
  };

  return (
    <header className="sticky top-0 z-50">
      <PromoBar />
      <div className="border-b border-[#E8E4DC] bg-[#F9F8F6]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none">
            <Popover open={menuOpen} onOpenChange={setMenuOpen}>
              <PopoverTrigger asChild>
                <Button
                  aria-label="Ouvrir le menu"
                  className="size-9 shrink-0 text-[#001B36] hover:bg-[#001B36]/5 hover:text-[#9B4D44] md:hidden"
                  size="icon"
                  variant="ghost"
                >
                  <Menu className="size-5" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="max-h-[70vh] w-56 overflow-y-auto border-[#E8E4DC] bg-[#F9F8F6] p-2 md:hidden"
              >
                <nav aria-label="Navigation mobile">
                  <ul className="flex flex-col gap-0.5">
                    {navigationLinks.map((link) => (
                      <li key={link.label}>
                        <Link
                          className={cn(
                            "block rounded-md px-3 py-2.5 text-sm font-medium text-[#001B36] transition-colors hover:bg-[#001B36]/5 hover:text-[#9B4D44]",
                            isActive(link) && "text-[#9B4D44]",
                          )}
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </PopoverContent>
            </Popover>

            <Link
              className="shrink-0 transition-opacity hover:opacity-90"
              href="/"
            >
              <Image
                alt="Chahrazad Baby — vêtements bébé naissance"
                className="h-10 w-auto md:h-11"
                priority
                src={logo}
              />
            </Link>
          </div>

          <NavigationMenu className="hidden lg:flex" viewport={false}>
            <NavigationMenuList className="gap-0.5">
              {navigationLinks.map((link) => (
                <NavigationMenuItem key={link.label}>
                  <NavigationMenuLink
                    active={isActive(link)}
                    asChild
                    className={navLinkClassName}
                  >
                    <Link href={link.href}>
                      <span>{link.label}</span>
                      {isActive(link) ? (
                        <span
                          aria-hidden
                          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-[#9B4D44] lg:inset-x-3"
                        />
                      ) : null}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex flex-1 items-center justify-end gap-1 md:flex-none">
            <FavoritesButton />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}

function NavbarFallback() {
  return (
    <header className="sticky top-0 z-50">
      <PromoBar />
      <div className="border-b border-[#E8E4DC] bg-[#F9F8F6]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <Link className="shrink-0" href="/">
            <Image
              alt="Chahrazad Baby — vêtements bébé naissance"
              className="h-10 w-auto md:h-11"
              priority
              src={logo}
            />
          </Link>
          <div className="flex items-center gap-1">
            <FavoritesButton />
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarFallback />}>
      <NavbarInner />
    </Suspense>
  );
}
