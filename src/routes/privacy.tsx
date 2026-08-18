import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — The Nuzz Story" },
      { name: "description", content: "What data we collect, how we use it, who we share it with and how to opt out." },
      { property: "og:title", content: "Privacy Policy — The Nuzz Story" },
      { property: "og:description", content: "We collect the minimum we need to deliver your order." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Privacy Policy</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">What we collect</h2>
          <p className="mt-2">Name, contact details, delivery addresses, order history and any pet profile details you add. Payment details are handled by our payment partners and never stored on our servers.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">How we use it</h2>
          <p className="mt-2">To fulfil orders, provide support, send order updates and — only with your consent — share offers and restock reminders.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Sharing</h2>
          <p className="mt-2">Only with delivery partners and payment processors needed to complete your order. We never sell your data.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Your rights</h2>
          <p className="mt-2">Write to {STORE.email} any time to access, correct or delete your data, or to opt out of marketing.</p>
        </section>
      </div>
    </article>
  ),
});
