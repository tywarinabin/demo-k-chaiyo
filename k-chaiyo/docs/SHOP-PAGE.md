# Shop Page — "View More" Experience

## What it does
When a visitor clicks **View More** inside the "K Huda Paincha?" section of the
landing page, they are taken to a dedicated shop page at `/shop`. The page lets
them browse products category by category, just like a fast-delivery grocery app.

## The flow
1. Visitor scrolls to the product preview on the landing page.
2. Clicks the **View More** button at the bottom of the grid.
3. Lands on `/shop` — a focused catalog screen.
4. Left sidebar shows every category; clicking one instantly swaps the grid.
5. Each product card shows the image, name, size, price (with MRP strike‑through),
   discount badge, and an **ADD** button.
6. Tapping **ADD** turns the button into a + / − counter for quick quantity tweaks.
7. A short "category online" info block sits below the grid for context.
8. The sticky top bar carries the K Chaiyo? logo, delivery promise, search, login,
   and cart — always one tap away.

## Branding
- "K Chaiyo?" replaces the Blinkit logo in the top-left corner.
- Gradient wordmark uses the existing brand purple → blue palette.
- Poppins is the single font used across the shop screen for a clean, modern look.
- Animations (fade-up cards, shimmer image loaders, button pop on add) are subtle
  and consistent — they guide the eye without distracting.

## Why this structure
- Splitting the page into **header**, **sidebar**, **grid**, **card**, and **info**
  components keeps each piece small and easy to change independently.
- A shared **Custom Image** component handles loading placeholders and broken
  images, so product grids always look tidy.
- A single **Product Service** owns categories and catalog state, which means any
  other screen can reuse the same data later without duplication.

## Files at a glance
- `src/app/components/shop/` — the shop screen and its sub-components
- `src/app/shared/custom-image/` — reusable image block
- `src/app/shared/models/product.model.ts` — typed product shape
- `src/app/services/product.service.ts` — categories + catalog + active state
- Route: `/shop` (lazy-loaded) in `src/app/app.routes.ts`
- CTA: **View More** button inside `products.component.html`
