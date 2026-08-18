import { createFileRoute } from "@tanstack/react-router";
import { STORE } from "@/data/catalog";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Returns Policy — The Nuzz Story" },
      { name: "description", content: "Delivery timelines, shipping charges, the 7-day Tail Wag Guarantee and refund timelines." },
      { property: "og:title", content: "Shipping & Returns — The Nuzz Story" },
      { property: "og:description", content: "Free delivery above ₹499 and easy 7-day returns." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Shipping &amp; Returns</h1>
      <div className="mt-8 space-y-8 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Delivery timelines</h2>
          <p className="mt-2">Orders placed before 4 PM ship the same day. Metro cities: 1–2 business days. Rest of India: 3–5 business days.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Shipping charges</h2>
          <p className="mt-2">Free delivery above ₹{STORE.freeShippingAbove}. Below that, a flat ₹{STORE.deliveryFee}. COD orders carry a ₹29 handling fee.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Returns</h2>
          <p className="mt-2">Unopened products can be returned within 7 days. Damaged or wrong items are replaced free. Our Tail Wag Guarantee covers one opened food bag per household.</p>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold text-foreground">Refunds</h2>
          <p className="mt-2">Prepaid refunds reach your source account in 3–5 business days after pickup. COD refunds are issued as bank transfer or store credit.</p>
        </section>
      </div>
    </article>
  ),
});
