# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> **Important:** This project uses Next.js 16, which has breaking changes from prior versions. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code that touches Next.js APIs. Heed deprecation notices.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture

**Chahrazad Baby** is a Next.js 16 App Router e-commerce storefront for baby clothing, backed by the Shopify Storefront API. The UI is in French, targeting Moroccan customers.

### Key Directories

- `app/` — Next.js App Router pages and server actions
- `components/` — React components (mostly Server Components; Client Components marked with `"use client"`)
- `lib/shopify/` — Shopify Storefront API wrappers
- `stores/` — Zustand client state (cart, favorites)

### Data Flow

**Server-side reads** go through `lib/shopify/storefront.js`:
- `storefrontFetch()` — cached GraphQL queries for products/collections
- `storefrontMutate()` — no-store mutations for cart operations

**Server Actions** in `app/actions/` handle cart and wishlist mutations using `"use server"`. These call `storefrontMutate()` and revalidate paths.

**Client state** is managed by Zustand:
- `stores/cart-store.js` — cart synced with Shopify cart API; cart ID persisted in an httpOnly cookie (30-day expiry)
- `stores/favorites-store.js` — wishlist persisted to localStorage

### Component Patterns

- Most page-level and section components are Server Components (no `"use client"`)
- Interactive UI (drawers, toggles, animations) uses `"use client"`
- Animation wrappers live in `components/motion/index.jsx` — use `FadeInUp`, `FadeIn`, `StaggerContainer`, `StaggerItem` for scroll-triggered animations
- `components/providers/AppProviders.jsx` wraps the app with Zustand providers and Lenis smooth scroll

### Routing

| Route | Description |
|---|---|
| `/` | Home: Hero, CategoryCards, FeaturedProducts, Testimonials |
| `/products` | `ProductsCatalog` with filter/sort sidebar |
| `/products/[handle]` | `ProductDetail` + `ProductGallery` + `SimilarProducts` |

### Styling

- Tailwind CSS v4 via PostCSS (`@tailwindcss/postcss`)
- Custom CSS variables in `app/globals.css` for brand colors (dark navy `#001B36`, warm browns, beige)
- Fonts: Lato (body), Playfair Display (headings) via `next/font/google`
- Path alias `@/*` maps to project root (configured in `jsconfig.json`)
- shadcn/ui components (Radix Nova style) live in `components/ui/`

### Shopify Integration

Environment variables required (in `.env`):

```
SHOPIFY_STORE_DOMAIN=
SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_ADMIN_ACCESS_TOKEN=   # server-only, never expose to client
SHOPIFY_API_VERSION=2025-01
```

Product metadata (fabric, color, size, gender, age group) is extracted from Shopify metafields in `lib/shopify/products.js`. Variant filtering by genre and size is handled in `lib/shopify/filters.js`.
