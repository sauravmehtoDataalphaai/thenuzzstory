import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { STORE } from "@/data/catalog";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Vet Consultation — The Nuzz Story" },
      { name: "description", content: "Visit our Chittaranjan Park store, call us, or book a vet consultation for your dog or cat." },
      { property: "og:title", content: "Contact Us — The Nuzz Story" },
      { property: "og:description", content: "Store address, hours, support contacts and vet consultation booking." },
    ],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <h1 className="font-display text-4xl font-extrabold">Contact us</h1>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Questions about an order, a product, grooming slots or your pet's diet? We reply within a few hours.
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="rounded-3xl border border-border bg-card p-6">
            <p className="font-display text-lg font-bold">Store &amp; support</p>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-primary" />{STORE.address}</li>
              <li className="flex gap-2"><Clock size={16} className="mt-0.5 shrink-0 text-primary" />{STORE.hours}</li>
              <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-primary" />{STORE.phone}</li>
              <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-primary" />{STORE.email}</li>
            </ul>
          </div>
          <div className="grid h-56 place-items-center rounded-3xl border border-dashed border-border bg-sand text-sm font-semibold text-muted-foreground">
            Map embed placeholder
          </div>
        </div>

        <form
          className="grid gap-4 rounded-3xl border border-border bg-card p-6"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Message sent!", { description: "Our team will get back to you shortly." });
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <p className="flex items-center gap-2 font-display text-lg font-bold">
            <Stethoscope size={18} className="text-primary" /> Send a message / book a vet consult
          </p>
          <F label="Your name" />
          <F label="Email or phone" />
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Topic</span>
            <select className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
              <option>Order support</option><option>Vet consultation</option>
              <option>Grooming appointment</option><option>Something else</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Message</span>
            <textarea rows={5} required className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground hover:shadow-glow">Send message</button>
        </form>
      </div>
    </div>
  );
}

function F({ label }: { label: string }) {
  return (
    <label className="text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input required className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}
