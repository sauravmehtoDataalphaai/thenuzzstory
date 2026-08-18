import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  PawPrint,
  Package,
  ShieldCheck,
  Stethoscope,
  Truck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import heroImg from "@/assets/hero-pets.jpg";
import groomingImg from "@/assets/grooming-hero.jpg";
import { ProductCard, ProductCardSkeleton } from "@/components/ProductCard";
import { Stars } from "@/components/Stars";
import { categories, offers, STORE, testimonials } from "@/data/catalog";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
      {
        name: "description",
        content:
          "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming.",
      },
      { property: "og:title", content: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
      {
        property: "og:description",
        content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming.",
      },
    ],
  }),
  component: Home,
});

const banners = [
  {
    eyebrow: "Monsoon Sale is live",
    title: "Big bowls of joy, up to 40% off",
    body: "Premium kibble, gravy pouches and treats your pet will do tricks for.",
    cta: "Shop dog food",
    slug: "dog-food" as const,
  },
  {
    eyebrow: "New in store",
    title: "Grooming that feels like a spa day",
    body: "Gentle shampoos, deshedders and paw balms — plus salon slots at our store.",
    cta: "Shop grooming",
    slug: "dog-grooming" as const,
  },
  {
    eyebrow: "For the fussy ones",
    title: "Cat food they actually finish",
    body: "Hairball control, indoor formulas and freeze-dried treats cats can't resist.",
    cta: "Shop cat food",
    slug: "cat-food" as const,
  },
];

function Home() {
  const { products, catalogLoading } = useStore();
  const [slide, setSlide] = useState(0);
  const [pet, setPet] = useState<"dog" | "cat">("dog");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 6000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, [pet, catalogLoading]);

  const featured = useMemo(
    () =>
      products
        .filter((p) => p.pet === pet)
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, 8),
    [pet, products],
  );
  const newArrivals = useMemo(() => products.filter((p) => p.isNew).slice(0, 4), [products]);
  const banner = banners[slide]!;

  return (
    <div>
      {/* Hero */}
      <section className="paw-grid border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-5 px-3 py-6 sm:px-4 sm:py-10 lg:grid-cols-2 lg:gap-8 lg:py-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary">
              <PawPrint size={14} /> {banner.eyebrow}
            </span>
            <h1 className="mt-3 font-display text-[1.65rem] font-extrabold leading-[1.1] sm:mt-4 sm:text-5xl lg:text-6xl">
              {banner.title}
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground sm:mt-4 sm:text-base">{banner.body}</p>
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <Link
                to="/category/$slug"
                params={{ slug: banner.slug }}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-shadow hover:shadow-glow sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
              >
                {banner.cta} <ArrowRight size={16} />
              </Link>
              <Link
                to="/grooming"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold hover:bg-secondary sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm"
              >
                Book grooming
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              {banners.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => setSlide(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === slide ? "w-8 bg-primary" : "w-2 bg-border"
                  }`}
                />
              ))}
              <div className="ml-auto flex gap-2">
                <CarouselBtn
                  label="Previous banner"
                  onClick={() => setSlide((s) => (s - 1 + banners.length) % banners.length)}
                >
                  <ChevronLeft size={18} />
                </CarouselBtn>
                <CarouselBtn
                  label="Next banner"
                  onClick={() => setSlide((s) => (s + 1) % banners.length)}
                >
                  <ChevronRight size={18} />
                </CarouselBtn>
              </div>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-lift">
            <img
              src={heroImg}
              alt="A happy dog and cat side by side"
              width={1600}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-6 lg:grid-cols-4">
          {[
            { icon: Truck, title: "Free delivery", sub: "On orders above ₹499" },
            { icon: ShieldCheck, title: "Vet recommended", sub: "Reviewed by our vets" },
            { icon: Package, title: "Easy returns", sub: "7-day Tail Wag Guarantee" },
            { icon: Wallet, title: "COD available", sub: "19,000+ pincodes" },
          ].map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary sm:h-11 sm:w-11 sm:rounded-2xl">
                <t.icon size={20} />
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold sm:text-sm">{t.title}</p>
                <p className="truncate text-xs text-muted-foreground">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <Section title="Shop by Category" subtitle="Everything for the four-legged member of the family">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="card-lift group overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="overflow-hidden bg-sand">
                <img
                  src={c.image}
                  alt={c.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-2.5 sm:p-4">
                <p className="font-display text-sm font-bold sm:text-base">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.blurb}</p>
              </div>
            </Link>
          ))}
          <Link
            to="/grooming"
            className="card-lift flex flex-col justify-center gap-2 rounded-2xl bg-primary p-5 text-primary-foreground"
          >
            <PawPrint size={26} />
            <p className="font-display text-lg font-bold">Grooming at our store</p>
            <p className="text-xs opacity-90">Book a bath, trim or full spa day</p>
          </Link>
        </div>
      </Section>

      {/* Shop by pet + featured */}
      <Section
        title="Best sellers"
        subtitle="Loved by pet parents across the city"
        action={
          <div className="inline-flex rounded-2xl border border-border bg-card p-1">
            {(["dog", "cat"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPet(p)}
                className={`rounded-xl px-5 py-2 text-sm font-bold capitalize transition-colors ${
                  pet === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        }
      >
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* Offers */}
      <Section title="Deals worth wagging about">
        <div className="grid gap-4 md:grid-cols-3">
          {offers.map((o) => (
            <div
              key={o.title}
              className={`card-lift rounded-2xl border border-border p-6 ${
                o.tone === "primary"
                  ? "bg-primary text-primary-foreground"
                  : o.tone === "accent"
                    ? "bg-accent text-accent-foreground"
                    : "bg-sand"
              }`}
            >
              <p className="font-display text-2xl font-extrabold">{o.title}</p>
              <p className="mt-1 text-sm opacity-90">{o.subtitle}</p>
              <p className="mt-4 inline-block rounded-lg border border-current/30 px-3 py-1 text-xs font-bold tracking-widest">
                {o.code}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* New arrivals */}
      <Section title="New arrivals" subtitle="Fresh off the shelf this week">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
          {newArrivals.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* Vet consultation */}
      <section className="mx-auto max-w-7xl px-3 py-6 sm:px-4">
        <div className="grid items-center gap-6 overflow-hidden rounded-3xl border border-border bg-accent-soft p-6 md:grid-cols-[1fr_auto] md:p-10">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground">
              <Stethoscope size={14} /> Vet Consultation
            </span>
            <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">
              Talk to a vet in under 15 minutes
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Video or in-store consults for skin issues, diet plans, vaccinations and second
              opinions. First consult free for Nuzz members.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-bold text-background"
          >
            Book a consult <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Testimonials */}
      <Section title="Happy pets, happier parents">
        <div className="no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="w-[85%] shrink-0 snap-start rounded-2xl border border-border bg-card p-6 sm:w-[380px]"
            >
              <Stars rating={t.rating} />
              <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                “{t.text}”
              </blockquote>
              <figcaption className="mt-4 flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary">
                  {t.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold">{t.name}</span>
                  <span className="text-xs text-muted-foreground">{t.pet}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Store locator */}
      <Section title="Visit our store" subtitle="Pick up supplies, book grooming, say hi to Momo the shop cat">
        <div className="grid gap-6 overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2">
          <div className="p-6 sm:p-8">
            <p className="font-display text-xl font-bold">{STORE.name} · Chittaranjan Park</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primary" />
                {STORE.address}
              </li>
              <li className="flex gap-2">
                <Clock size={16} className="mt-0.5 shrink-0 text-primary" />
                {STORE.hours}
              </li>
            </ul>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
            >
              Get directions <ArrowRight size={15} />
            </a>
          </div>
          <div className="relative min-h-[220px] bg-sand">
            <img
              src={groomingImg}
              alt="Inside the The Nuzz Story grooming studio"
              loading="lazy"
              width={1200}
              height={700}
              className="h-full w-full object-cover"
            />
            <span className="absolute bottom-4 left-4 rounded-xl bg-card px-3 py-2 text-xs font-semibold shadow-soft">
              Map embed placeholder
            </span>
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pb-14 pt-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("You're on the list!", { description: "Watch out for treats in your inbox." });
            (e.currentTarget as HTMLFormElement).reset();
          }}
          className="grid items-center gap-5 rounded-3xl bg-foreground p-8 text-background md:grid-cols-2 md:p-12"
        >
          <div>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl">
              Get ₹150 off your first order
            </h2>
            <p className="mt-2 text-sm opacity-80">
              Join 40,000+ pet parents for care tips, restock alerts and early sale access.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@example.com"
              aria-label="Email address"
              className="w-full rounded-2xl border border-background/20 bg-background/10 px-4 py-3 text-sm outline-none placeholder:text-background/50 focus:border-background/50"
            />
            <button
              type="submit"
              className="shrink-0 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground"
            >
              Subscribe
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CarouselBtn({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card hover:bg-secondary"
    >
      {children}
    </button>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-7xl px-3 py-7 sm:px-4 sm:py-10">
      <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:mb-6 sm:gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-extrabold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
