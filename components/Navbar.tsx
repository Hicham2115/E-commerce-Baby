import { Handbag, Heart, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
import PromoBar from "@/components/PromoBar";
import logo from "@/app/assets/logo.png";
import { cn } from "@/lib/utils";

const STORE_URL = "https://chahrazadbaby.com/";

const navigationLinks: {
  href: string;
  label: string;
  active?: boolean;
}[] = [
  { href: `${STORE_URL}`, label: "Bébé fille", active: true },
  { href: `${STORE_URL}`, label: "Bébé garçon" },
  { href: `${STORE_URL}`, label: "Idée cadeaux" },
  { href: `${STORE_URL}`, label: "Promotion" },
  { href: `${STORE_URL}`, label: "Blog" },
  { href: `${STORE_URL}`, label: "Contact" },
  { href: `${STORE_URL}`, label: "À propos" },
];

const navLinkClassName =
  "relative rounded-md bg-transparent px-2.5 py-2 text-sm font-medium text-[#001B36] transition-colors hover:bg-transparent hover:text-[#9B4D44] data-active:text-[#9B4D44] lg:px-3";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50">
      <PromoBar />
      <div className="border-b border-[#E8E4DC] bg-[#F9F8F6]/90 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2 md:flex-none">
            <Popover>
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
                            link.active === true && "text-[#9B4D44]",
                          )}
                          href={link.href}
                          rel="noopener noreferrer"
                          target="_blank"
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
                    active={link.active}
                    asChild
                    className={navLinkClassName}
                  >
                    <Link
                      href={link.href}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <span>{link.label}</span>
                      {link.active ? (
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
            <Button
              aria-label="Liste de souhaits"
              asChild
              className="size-10 text-[#001B36] hover:bg-[#001B36]/5 hover:text-[#9B4D44]"
              size="icon"
              variant="ghost"
            >
              <Link
                href={`${STORE_URL}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Heart className="size-5" strokeWidth={1.75} />
              </Link>
            </Button>
            <Button
              aria-label="Panier"
              asChild
              className="relative size-10 text-[#001B36] hover:bg-[#001B36]/5 hover:text-[#9B4D44]"
              size="icon"
              variant="ghost"
            >
              <Link
                href={`${STORE_URL}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <Handbag className="size-5" strokeWidth={1.75} />
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-[#9B4D44] text-[10px] font-semibold text-white">
                  0
                </span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
