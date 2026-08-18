import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import groomingImg from "@/assets/grooming-hero.jpg";
import { groomingServices, money, timeSlots } from "@/data/catalog";

export const Route = createFileRoute("/grooming")({
  head: () => ({
    meta: [
      { title: "Pet Grooming Services in New Delhi — The Nuzz Story" },
      { name: "description", content: "Book bath & brush, haircuts, nail trims, ear cleaning or a full spa package for your dog or cat at our Chittaranjan Park store." },
      { property: "og:title", content: "Pet Grooming Services — The Nuzz Story" },
      { property: "og:description", content: "Gentle, fear-free grooming by certified groomers. Book a slot online." },
    ],
  }),
  component: Grooming,
});

function Grooming() {
  const [service, setService] = useState(groomingServices[0]!.id);
  const [slot, setSlot] = useState(timeSlots[0]!);

  return (
    <div>
      <section className="paw-grid border-b border-border">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase text-primary">
              <Sparkles size={14} /> In-store grooming
            </span>
            <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl">A spa day, tail-approved</h1>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              Fear-free handling, breed-specific styling and pet-safe products. Cats groomed in a
              separate quiet room by feline-trained specialists.
            </p>
          </div>
          <img src={groomingImg} alt="A small dog being groomed" loading="lazy" width={1200} height={700}
            className="rounded-3xl border border-border object-cover shadow-lift" />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Our services</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groomingServices.map((s) => (
            <article key={s.id} className="card-lift flex flex-col rounded-2xl border border-border bg-card p-6">
              <p className="font-display text-lg font-bold">{s.name}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock size={13} /> {s.duration}</p>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{s.description}</p>
              <p className="mt-4 font-display text-2xl font-extrabold">{money(s.price)}</p>
              <a href="#book" onClick={() => setService(s.id)}
                className="mt-3 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground hover:shadow-glow">
                Book Now
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-4">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, t: "Certified groomers", d: "Every groomer is trained in fear-free handling and pet first aid." },
            { icon: HeartHandshake, t: "One pet at a time", d: "No cages, no queues — your pet gets undivided attention." },
            { icon: Sparkles, t: "Pet-safe products", d: "Sulphate-free, pH-balanced shampoos suited to coat and skin type." },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-border bg-sand p-6">
              <x.icon size={22} className="text-primary" />
              <p className="mt-3 font-display text-lg font-bold">{x.t}</p>
              <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="book" className="mx-auto max-w-3xl px-4 py-12">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Book an appointment</h2>
        <form
          className="mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Booking request sent!", { description: "We'll confirm your slot on WhatsApp within an hour." });
            (e.currentTarget as HTMLFormElement).reset();
          }}
        >
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Pet type</span>
            <select className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
              <option>Dog</option><option>Cat</option>
            </select>
          </label>
          <Input label="Breed" placeholder="e.g. Shih Tzu" />
          <label className="text-sm sm:col-span-2">
            <span className="text-xs font-semibold text-muted-foreground">Service</span>
            <select value={service} onChange={(e) => setService(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
              {groomingServices.map((s) => (
                <option key={s.id} value={s.id}>{s.name} — {money(s.price)}</option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Preferred date</span>
            <input type="date" required className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
          </label>
          <div className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Time slot</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {timeSlots.map((t) => (
                <button key={t} type="button" onClick={() => setSlot(t)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${slot === t ? "border-primary bg-primary-soft text-primary" : "border-border"}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Input label="Your name" placeholder="Full name" />
          <Input label="Phone number" placeholder="10-digit mobile" />
          <button type="submit" className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground sm:col-span-2">
            Request booking
          </button>
        </form>
      </section>
    </div>
  );
}

function Input({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="text-sm">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <input required placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </label>
  );
}
