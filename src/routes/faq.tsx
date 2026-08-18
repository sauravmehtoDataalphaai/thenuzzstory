import { createFileRoute } from "@tanstack/react-router";
import { faqs } from "@/data/catalog";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Delivery, Returns & Subscriptions | The Nuzz Story" },
      { name: "description", content: "Answers about delivery timelines, COD, product authenticity, Subscribe & Save and cat grooming." },
      { property: "og:title", content: "The Nuzz Story FAQ" },
      { property: "og:description", content: "Everything pet parents ask us, answered." },
    ],
  }),
  component: () => (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Frequently asked questions</h1>
      <div className="mt-8 divide-y divide-border rounded-3xl border border-border bg-card">
        {faqs.map((f) => (
          <details key={f.q} className="px-5 py-4">
            <summary className="cursor-pointer list-none text-sm font-bold">{f.q}</summary>
            <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </article>
  ),
});
