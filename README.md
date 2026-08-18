# The Nuzz Story — Pet Food & Grooming E-commerce

A fully responsive, front-end e-commerce experience for a pet store selling dog & cat food,
grooming products and accessories. Built with TanStack Start (React 19 + TanStack Router),
Tailwind CSS v4 and lucide-react. All data is mock data — no backend required.

## Design system

- Tokens defined in `src/styles.css` with `@theme inline` (oklch colors).
- Palette: coral primary, warm cream/sand backgrounds, charcoal text.
- Fonts: Baloo 2 (display) + Manrope (body), loaded via `<link>` in `__root.tsx`.
- Custom utilities: `card-lift`, `paw-grid`, `shadow-lift`, `shadow-glow`.
- Generated imagery in `src/assets/` (hero, categories, grooming).

## Pages implemented

| Route | Description |
| --- | --- |
| `/` | Hero carousel, trust strip, category grid, best sellers with dog/cat filter, offers, testimonials |
| `/category/$slug` | Product listing: sidebar filters (price, brand, pet type, rating), sorting, responsive grid |
| `/product/$slug` | Gallery + thumbnails, variants/pack sizes, Subscribe & Save, pincode check, frequently bought together, tabs (description, ingredients, specs, reviews) |
| `/cart` | Full cart with qty controls, coupons, savings summary |
| `/checkout` | 3-step stepper: address → payment (UPI/Card/COD) → review |
| `/order-confirmation` | Success screen, order summary, loyalty points earned |
| `/grooming` | Services grid, trust points, booking form (pet, service, date, time slot) |
| `/account` | Sidebar layout with loyalty points |
| `/account/login` | Mock login / sign-up |
| `/account/profile` | Profile, pet profiles (add/remove), saved addresses |
| `/account/orders` | Order history with statuses |
| `/account/track/$id` | Order tracking timeline |
| `/account/wishlist` | Saved products |
| `/about`, `/contact`, `/faq`, `/shipping`, `/privacy` | Static content pages |

## Global components

- `Header` — sticky, live search suggestions, cart badge, wishlist, account menu, mobile nav.
- `CartDrawer` — slide-out cart with qty controls and price breakdown.
- `Footer` — links, contact info, socials, newsletter.
- `ProductCard`, `Stars` — reusable product UI.

## State

`src/store/StoreContext.tsx` (React context + localStorage persistence) handles:
cart (with Subscribe & Save pricing), coupons, delivery-fee/free-shipping logic, wishlist,
pet profiles, saved addresses, mock auth, order placement and loyalty points.

## Data

`src/data/catalog.ts` — 30+ products with variants, ratings, badges, brands and specs, plus
categories, coupons, testimonials, grooming services, FAQs and store metadata.

## Extra functionality

Subscribe & Save (10% off recurring), pet profiles, loyalty points on every order,
vet consultation banner/contact topic, coupon engine and free-shipping threshold.

## Running locally

```bash
bun install
bun run dev
```
