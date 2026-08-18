import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { WELCOME_LOYALTY_POINTS, loyaltyPointsForOrder, profileLoyaltyPoints } from "@/lib/loyalty";
import type { AddressRow, AppUser, OrderItemRow, OrderRow, Profile } from "@/types/database";

export { isSupabaseConfigured, loyaltyPointsForOrder };

export async function sendEmailOtp(params: {
  email: string;
  name?: string;
  phone?: string;
  createUser: boolean;
}) {
  if (!isSupabaseConfigured) {
    return { error: new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env") };
  }

  const email = params.email.trim().toLowerCase();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: params.createUser,
      data: {
        full_name: params.name?.trim() ?? "",
        phone: params.phone?.trim() ?? "",
      },
    },
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("rate limit") || msg.includes("over_email")) {
      return {
        error: new Error(
          "Email rate limit exceeded. Wait ~1 hour, or use the custom OTP flow (server console).",
        ),
      };
    }
  }

  return { error };
}

export async function verifyEmailOtp(
  email: string,
  token: string,
  options?: { isSignup?: boolean },
) {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error("Supabase is not configured") };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  // Signup confirmation often needs type "signup"; login OTP uses "email".
  const types = options?.isSignup
    ? (["signup", "email"] as const)
    : (["email", "signup"] as const);

  let lastError: Error | null = null;
  for (const type of types) {
    const { data, error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedToken,
      type,
    });
    if (!error && data?.user) return { data, error: null };
    if (error) lastError = error;
  }

  return { data: null, error: lastError ?? new Error("Invalid OTP") };
}

export async function signOutSupabase() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}

export async function applySupabaseSession(tokens: {
  access_token: string;
  refresh_token: string;
}) {
  if (!isSupabaseConfigured) {
    return { error: new Error("Supabase is not configured") };
  }
  const { error } = await supabase.auth.setSession({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });
  return { error };
}

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(user: AppUser) {
  const existing = await fetchProfile(user.id);
  if (existing) {
    const { error } = await supabase
      .from("profiles")
      .update({
        name: user.name,
        email: user.email,
        phone: user.phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);
    if (error) throw error;
    return existing;
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      loyalty_points: WELCOME_LOYALTY_POINTS,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function addLoyaltyPoints(userId: string, points: number): Promise<number> {
  const profile = await fetchProfile(userId);
  const next = Math.max(0, profileLoyaltyPoints(profile) + points);
  const { error } = await supabase
    .from("profiles")
    .update({ loyalty_points: next, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
  return next;
}

export async function updateProfile(userId: string, patch: Partial<Pick<Profile, "name" | "phone">>) {
  const { error } = await supabase
    .from("profiles")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("id", userId);
  if (error) throw error;
}

export async function fetchAddresses(userId: string): Promise<AddressRow[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function insertAddress(
  userId: string,
  address: Omit<AddressRow, "id" | "user_id" | "created_at">,
): Promise<AddressRow> {
  const { data, error } = await supabase
    .from("addresses")
    .insert({ ...address, user_id: userId })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(userId: string, addressId: string) {
  const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);
  if (error) throw error;
}

export async function fetchOrders(userId: string): Promise<(OrderRow & { items: OrderItemRow[] })[]> {
  const { data: orders, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  if (!orders?.length) return [];

  const ids = orders.map((o) => o.id);
  const { data: items, error: itemsError } = await supabase.from("order_items").select("*").in("order_id", ids);
  if (itemsError) throw itemsError;

  return orders.map((o) => ({
    ...o,
    items: (items ?? []).filter((i) => i.order_id === o.id),
  }));
}

export async function fetchOrderById(
  userId: string,
  orderId: string,
): Promise<(OrderRow & { items: OrderItemRow[] }) | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  if (!order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);
  if (itemsError) throw itemsError;

  return { ...order, items: items ?? [] };
}

export async function createOrder(input: {
  userId: string;
  orderId: string;
  status?: string;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  paymentMethod: string;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  items: Array<{
    product_slug: string;
    product_name: string;
    variant: string;
    qty: number;
    unit_price: number;
    image_url: string;
  }>;
}) {
  const { error } = await supabase.from("orders").insert({
    id: input.orderId,
    user_id: input.userId,
    status: input.status ?? "Processing",
    subtotal: input.subtotal,
    discount: input.discount,
    delivery_fee: input.deliveryFee,
    total: input.total,
    payment_method: input.paymentMethod,
    shipping_name: input.shippingName,
    shipping_phone: input.shippingPhone,
    shipping_address: input.shippingAddress,
  });
  if (error) throw error;

  if (input.items.length) {
    const { error: itemsError } = await supabase.from("order_items").insert(
      input.items.map((item) => ({ ...item, order_id: input.orderId })),
    );
    if (itemsError) throw itemsError;
  }
}

export function profileToAppUser(profile: Profile): AppUser {
  return {
    id: profile.id,
    name: profile.name || profile.email.split("@")[0] || "Pet Parent",
    email: profile.email,
    phone: profile.phone,
    loyaltyPoints: profileLoyaltyPoints(profile),
    role: profile.role ?? "customer",
  };
}
