import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { toast } from "sonner";
import { coupons as staticCoupons, products as staticProducts, STORE, type Coupon, type Product } from "@/data/catalog";
import { fetchCatalogCoupons, fetchCatalogProducts } from "@/lib/catalog-db";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  addLoyaltyPoints,
  createOrder,
  deleteAddress,
  fetchAddresses,
  fetchProfile,
  insertAddress,
  loyaltyPointsForOrder,
  profileToAppUser,
  signOutSupabase,
  updateProfile,
  upsertProfile,
} from "@/lib/auth";
import type { AppUser } from "@/types/database";
import { WELCOME_LOYALTY_POINTS, maxRedeemRupees, pointsForRupees } from "@/lib/loyalty";

export interface CartLine {
  slug: string;
  variant: string;
  qty: number;
  subscription: boolean;
  unitPrice: number;
}

export interface PetProfile {
  id: string;
  name: string;
  type: "dog" | "cat";
  breed: string;
  age: string;
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  type: "Home" | "Work";
}

export interface PlaceOrderInput {
  paymentMethod: string;
  addressId: string;
}

interface StoreValue {
  cart: CartLine[];
  addToCart: (p: Product, variant?: string, qty?: number, subscription?: boolean) => void;
  updateQty: (slug: string, variant: string, qty: number) => void;
  removeLine: (slug: string, variant: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  savings: number;
  discount: number;
  loyaltyDiscount: number;
  redeemLoyalty: boolean;
  setRedeemLoyalty: (v: boolean) => void;
  deliveryFee: number;
  total: number;
  coupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  wishlist: string[];
  toggleWishlist: (slug: string) => void;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  pets: PetProfile[];
  addPet: (p: Omit<PetProfile, "id">) => void;
  removePet: (id: string) => void;
  addresses: Address[];
  addAddress: (a: Omit<Address, "id">) => Promise<Address>;
  removeAddress: (id: string) => Promise<void>;
  user: AppUser | null;
  authLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUserProfile: (patch: Partial<Pick<AppUser, "name" | "phone">>) => Promise<void>;
  setUserFromAuth: (user: AppUser | null) => void;
  signOut: () => Promise<void>;
  lastOrderId: string | null;
  placeOrder: (input: PlaceOrderInput) => Promise<string>;
  loyaltyPoints: number;
  isSupabaseConfigured: boolean;
  products: Product[];
  coupons: Coupon[];
  catalogLoading: boolean;
}

const StoreContext = createContext<StoreValue | null>(null);

const KEY = "nuzz-store-v1";

interface Persisted {
  cart: CartLine[];
  wishlist: string[];
  pets: PetProfile[];
}

function mapAddress(row: {
  id: string;
  name: string;
  phone: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark: string;
  type: "Home" | "Work";
}): Address {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    pincode: row.pincode,
    address: row.address,
    city: row.city,
    state: row.state,
    landmark: row.landmark,
    type: row.type,
  };
}

function moneyish(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [pets, setPets] = useState<PetProfile[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [user, setUser] = useState<AppUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [redeemLoyalty, setRedeemLoyalty] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [coupons, setCoupons] = useState<Coupon[]>(staticCoupons);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const loadUserData = useCallback(async (userId: string) => {
    const profile = await fetchProfile(userId);
    if (profile) {
      setUser(profileToAppUser(profile));
    }
    const rows = await fetchAddresses(userId);
    setAddresses(rows.map(mapAddress));
  }, []);

  const refreshUser = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    const { data } = await supabase.auth.getUser();
    const authUser = data.user;
    if (!authUser) {
      setUser(null);
      setAddresses([]);
      setAuthLoading(false);
      return;
    }

    let profile = await fetchProfile(authUser.id);
    if (!profile) {
      const appUser: AppUser = {
        id: authUser.id,
        name:
          (authUser.user_metadata?.["full_name"] as string | undefined) ||
          authUser.email?.split("@")[0] ||
          "Pet Parent",
        email: authUser.email ?? "",
        phone: (authUser.user_metadata?.["phone"] as string | undefined) ?? "",
        loyaltyPoints: WELCOME_LOYALTY_POINTS,
        role: "customer",
      };
      await upsertProfile(appUser);
      profile = await fetchProfile(authUser.id);
    }
    if (profile) setUser(profileToAppUser(profile));
    const rows = await fetchAddresses(authUser.id);
    setAddresses(rows.map(mapAddress));
    setAuthLoading(false);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw) as Partial<Persisted>;
        if (p.cart) setCart(p.cart);
        if (p.wishlist) setWishlist(p.wishlist);
        if (p.pets) setPets(p.pets);
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [nextProducts, nextCoupons] = await Promise.all([
          fetchCatalogProducts(),
          fetchCatalogCoupons(),
        ]);
        if (!cancelled) {
          setProducts(nextProducts);
          setCoupons(nextCoupons);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (!cancelled) setCatalogLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ cart, wishlist, pets }));
  }, [cart, wishlist, pets, hydrated]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await refreshUser();
      } catch (err) {
        console.error(err);
        if (mounted) setAuthLoading(false);
      }
    })();

    if (!isSupabaseConfigured) return;

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setAddresses([]);
        setAuthLoading(false);
        return;
      }
      try {
        await loadUserData(session.user.id);
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setAuthLoading(false);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadUserData, refreshUser]);

  const value = useMemo<StoreValue>(() => {
    const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
    const mrpTotal = cart.reduce((s, l) => {
      const p = products.find((x) => x.slug === l.slug);
      const ratio = p ? p.mrp / p.price : 1;
      return s + l.unitPrice * ratio * l.qty;
    }, 0);
    const couponDiscount = coupon
      ? coupon.type === "percent"
        ? Math.round((subtotal * coupon.value) / 100)
        : coupon.value
      : 0;
    const subDiscount = cart.reduce(
      (s, l) => s + (l.subscription ? Math.round(l.unitPrice * l.qty * 0.1) : 0),
      0,
    );
    const discount = couponDiscount + subDiscount;
    const deliveryFee = subtotal === 0 || subtotal >= STORE.freeShippingAbove ? 0 : STORE.deliveryFee;
    const payableBeforeLoyalty = Math.max(0, subtotal - discount + deliveryFee);
    const balance = user?.loyaltyPoints ?? 0;
    const loyaltyDiscount = redeemLoyalty ? maxRedeemRupees(balance, payableBeforeLoyalty) : 0;
    const pointsRedeemed = pointsForRupees(loyaltyDiscount);
    const total = Math.max(0, payableBeforeLoyalty - loyaltyDiscount);

    return {
      cart,
      cartCount: cart.reduce((s, l) => s + l.qty, 0),
      subtotal,
      savings: Math.max(0, Math.round(mrpTotal - subtotal)),
      discount,
      loyaltyDiscount,
      redeemLoyalty,
      setRedeemLoyalty,
      deliveryFee,
      total,
      coupon,
      cartOpen,
      setCartOpen,
      wishlist,
      pets,
      addresses,
      user,
      authLoading,
      lastOrderId,
      loyaltyPoints: user?.loyaltyPoints ?? 0,
      isSupabaseConfigured,
      products,
      coupons,
      catalogLoading,
      refreshUser,
      setUserFromAuth: (next) => setUser(next),
      addToCart: (p, variant, qty = 1, subscription = false) => {
        const v = variant ?? p.variants[0]?.label ?? "Standard pack";
        const delta = p.variants.find((x) => x.label === v)?.priceDelta ?? 0;
        const unitPrice = p.price + delta;
        setCart((prev) => {
          const existing = prev.find((l) => l.slug === p.slug && l.variant === v);
          if (existing) {
            return prev.map((l) =>
              l === existing ? { ...l, qty: l.qty + qty, subscription } : l,
            );
          }
          return [...prev, { slug: p.slug, variant: v, qty, subscription, unitPrice }];
        });
        toast.success("Added to cart", { description: `${p.name} · ${v}` });
        setCartOpen(true);
      },
      updateQty: (slug, variant, qty) =>
        setCart((prev) =>
          qty <= 0
            ? prev.filter((l) => !(l.slug === slug && l.variant === variant))
            : prev.map((l) => (l.slug === slug && l.variant === variant ? { ...l, qty } : l)),
        ),
      removeLine: (slug, variant) => {
        setCart((prev) => prev.filter((l) => !(l.slug === slug && l.variant === variant)));
        toast("Removed from cart");
      },
      clearCart: () => setCart([]),
      applyCoupon: (code) => {
        const found = coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
        if (!found) {
          toast.error("Invalid coupon code");
          return false;
        }
        if (subtotal < found.minCart) {
          toast.error(`Add ₹${found.minCart - subtotal} more to use ${found.code}`);
          return false;
        }
        setCoupon(found);
        toast.success("Coupon applied", { description: found.label });
        return true;
      },
      removeCoupon: () => setCoupon(null),
      toggleWishlist: (slug) =>
        setWishlist((prev) => {
          const on = prev.includes(slug);
          toast[on ? "message" : "success"](on ? "Removed from wishlist" : "Added to wishlist");
          return on ? prev.filter((s) => s !== slug) : [...prev, slug];
        }),
      addPet: (p) => {
        setPets((prev) => [...prev, { ...p, id: crypto.randomUUID() }]);
        toast.success(`${p.name} added to your pet profiles`);
      },
      removePet: (id) => setPets((prev) => prev.filter((p) => p.id !== id)),
      addAddress: async (a) => {
        if (!user) {
          toast.error("Please login to save addresses");
          throw new Error("Not authenticated");
        }
        const row = await insertAddress(user.id, a);
        const created = mapAddress(row);
        setAddresses((prev) => [created, ...prev]);
        toast.success("Address saved");
        return created;
      },
      removeAddress: async (id) => {
        if (!user) return;
        await deleteAddress(user.id, id);
        setAddresses((prev) => prev.filter((a) => a.id !== id));
      },
      updateUserProfile: async (patch) => {
        if (!user) return;
        await updateProfile(user.id, patch);
        setUser({ ...user, ...patch });
        toast.success("Profile updated");
      },
      signOut: async () => {
        await signOutSupabase();
        setUser(null);
        setAddresses([]);
        toast("Signed out");
      },
      placeOrder: async ({ paymentMethod, addressId }) => {
        if (!user) {
          toast.error("Please login before placing an order");
          throw new Error("Not authenticated");
        }
        const addr = addresses.find((a) => a.id === addressId);
        if (!addr) {
          toast.error("Select a delivery address");
          throw new Error("No address");
        }

        const id = `NZ-${Math.floor(20000 + Math.random() * 90000)}`;
        const items = cart.map((l) => {
          const p = products.find((x) => x.slug === l.slug);
          return {
            product_slug: l.slug,
            product_name: p?.name ?? l.slug,
            variant: l.variant,
            qty: l.qty,
            unit_price: l.unitPrice,
            image_url: typeof p?.image === "string" ? p.image : "",
          };
        });

        await createOrder({
          userId: user.id,
          orderId: id,
          subtotal,
          discount: discount + loyaltyDiscount,
          deliveryFee,
          total,
          paymentMethod,
          shippingName: addr.name,
          shippingPhone: addr.phone,
          shippingAddress: `${addr.address}, ${addr.landmark}, ${addr.city}, ${addr.state} — ${addr.pincode}`,
          items,
        });

        let nextBalance = user.loyaltyPoints;
        if (pointsRedeemed > 0) {
          try {
            nextBalance = await addLoyaltyPoints(user.id, -pointsRedeemed);
            setUser({ ...user, loyaltyPoints: nextBalance });
            toast.success(`Redeemed ${pointsRedeemed} points`, {
              description: `${moneyish(loyaltyDiscount)} off this order`,
            });
          } catch (err) {
            console.error(err);
          }
        }

        const earned = loyaltyPointsForOrder(total);
        try {
          nextBalance = await addLoyaltyPoints(user.id, earned);
          setUser({ ...user, loyaltyPoints: nextBalance });
          toast.success(`+${earned} Paw Points`, {
            description: `Added to loyalty · balance ${nextBalance}`,
          });
        } catch (err) {
          console.error(err);
        }

        setLastOrderId(id);
        setCart([]);
        setCoupon(null);
        setRedeemLoyalty(false);
        return id;
      },
    };
  }, [
    cart,
    wishlist,
    pets,
    addresses,
    user,
    authLoading,
    coupon,
    cartOpen,
    lastOrderId,
    refreshUser,
    products,
    coupons,
    redeemLoyalty,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
