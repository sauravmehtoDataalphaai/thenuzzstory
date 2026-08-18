import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About The Nuzz Story — Our Story" },
      { name: "description", content: "A New Delhi pet store turned online destination: vet-reviewed products, gentle grooming and 1% of every order for community animals." },
      { property: "og:title", content: "About The Nuzz Story — Our Story" },
      { property: "og:description", content: "Only selling what we'd feed our own pets, since 2019." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">About Us</h1>
      <p className="mt-3 text-base text-muted-foreground">
        {STORE.name} started in 2019 as a 300 sq ft corner store in Chittaranjan Park with one promise:
        only sell what we'd feed our own pets.
      </p>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Our story</h2>
          <p className="mt-2">
            What began as a weekend project between two dog parents is now a full pet-care
            destination — a store, a grooming studio and an online shop trusted by 40,000+ families.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">How we pick products</h2>
          <p className="mt-2">
            Every product is reviewed by our in-house veterinarian for ingredient quality, sourcing
            and safety. If a formula changes, we re-review it. If it fails, we delist it.
          </p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Giving back</h2>
          <p className="mt-2">
            1% of every order funds sterilisation and vaccination drives for community animals in
            New Delhi — 1,240 procedures last year.
          </p>
        </section>
      </div>
    </article>
  ),
});
