import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Gift, PawPrint, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { rupeesFromPoints } from "@/lib/loyalty";
import { useStore } from "@/store/StoreContext";

export const Route = createFileRoute("/account/profile")({
  component: Profile,
});

function Profile() {
  const {
    user,
    pets,
    addPet,
    removePet,
    addresses,
    removeAddress,
    loyaltyPoints,
    updateUserProfile,
  } = useStore();
  const [name, setName] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [type, setType] = useState<"dog" | "cat">("dog");
  const [profileName, setProfileName] = useState("");
  const [profilePhone, setProfilePhone] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfileName(user.name);
    setProfilePhone(user.phone);
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center">
        <h1 className="font-display text-2xl font-extrabold">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">Sign in to sync your profile across devices.</p>
        <Link
          to="/account/login"
          className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground"
        >
          Login / Sign up
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <h1 className="font-display text-2xl font-extrabold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-soft via-sand to-card p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                <PawPrint size={14} /> Paw Points
              </p>
              <p className="mt-2 font-display text-4xl font-extrabold leading-none">{loyaltyPoints}</p>
              <p className="mt-2 text-sm font-semibold text-muted-foreground">
                Redeemable for ₹{rupeesFromPoints(loyaltyPoints)} at checkout
              </p>
            </div>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
              <Gift size={22} />
            </span>
          </div>

          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {[
              { icon: Gift, title: "Welcome bonus", body: "+100 on signup" },
              { icon: ShoppingBag, title: "Every order", body: "+50 Paw Points" },
              { icon: PawPrint, title: "Redeem", body: "100 pts = ₹10" },
            ].map((item) => (
              <div key={item.title} className="rounded-xl bg-background/70 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-xs font-bold">
                  <item.icon size={13} className="text-primary" />
                  {item.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <form
          className="mt-5 grid gap-3 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            void (async () => {
              setSaving(true);
              try {
                await updateUserProfile({ name: profileName.trim(), phone: profilePhone.trim() });
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Could not update profile");
              } finally {
                setSaving(false);
              }
            })();
          }}
        >
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Full name</span>
            <input
              required
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs font-semibold text-muted-foreground">Phone</span>
            <input
              required
              value={profilePhone}
              onChange={(e) => setProfilePhone(e.target.value)}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-2 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Pet profiles</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          We use these to personalise food and grooming recommendations.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {pets.map((p) => (
            <div
              key={p.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border bg-sand p-4"
            >
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold">
                  {p.name} ({p.type})
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.breed} · {p.age}
                </p>
              </div>
              <button
                onClick={() => removePet(p.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label={`Remove ${p.name}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {pets.length === 0 && <p className="text-sm text-muted-foreground">No pets added yet.</p>}
        </div>

        <form
          className="mt-5 grid gap-3 sm:grid-cols-4"
          onSubmit={(e) => {
            e.preventDefault();
            addPet({ name, type, breed, age });
            toast.success(`${name} added to your pack`);
            setName("");
            setBreed("");
            setAge("");
          }}
        >
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pet name"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value as "dog" | "cat")}
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
          </select>
          <input
            required
            value={breed}
            onChange={(e) => setBreed(e.target.value)}
            placeholder="Breed"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <input
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age (e.g. 2 yrs)"
            className="rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-4"
          >
            <Plus size={15} /> Add pet
          </button>
        </form>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Saved addresses</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="flex items-start justify-between gap-3 rounded-2xl border border-border p-4 text-sm"
            >
              <div className="min-w-0">
                <p className="font-bold">
                  {a.name}{" "}
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase">
                    {a.type}
                  </span>
                </p>
                <p className="mt-1 text-muted-foreground">
                  {a.address}, {a.city}, {a.state} — {a.pincode}
                </p>
                <p className="text-muted-foreground">{a.phone}</p>
              </div>
              <button
                onClick={() => void removeAddress(a.id)}
                className="shrink-0 text-muted-foreground hover:text-destructive"
                aria-label="Remove address"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          {addresses.length === 0 && (
            <p className="text-sm text-muted-foreground">No saved addresses. Add one at checkout.</p>
          )}
        </div>
      </div>
    </div>
  );
}
