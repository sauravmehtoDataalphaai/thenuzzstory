import { l as isSupabaseConfigured, u as supabase } from "./catalog-db-CghLbik8.js";
import { i as profileLoyaltyPoints } from "./loyalty-rGqQQJ4S.js";
//#region src/lib/auth.ts
async function sendEmailOtp(params) {
	if (!isSupabaseConfigured) return { error: /* @__PURE__ */ new Error("Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env") };
	const email = params.email.trim().toLowerCase();
	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: params.createUser,
			data: {
				full_name: params.name?.trim() ?? "",
				phone: params.phone?.trim() ?? ""
			}
		}
	});
	if (error) {
		const msg = error.message.toLowerCase();
		if (msg.includes("rate limit") || msg.includes("over_email")) return { error: /* @__PURE__ */ new Error("Email rate limit exceeded. Wait ~1 hour, or use the custom OTP flow (server console).") };
	}
	return { error };
}
async function verifyEmailOtp(email, token, options) {
	if (!isSupabaseConfigured) return {
		data: null,
		error: /* @__PURE__ */ new Error("Supabase is not configured")
	};
	const normalizedEmail = email.trim().toLowerCase();
	const normalizedToken = token.trim();
	const types = options?.isSignup ? ["signup", "email"] : ["email", "signup"];
	let lastError = null;
	for (const type of types) {
		const { data, error } = await supabase.auth.verifyOtp({
			email: normalizedEmail,
			token: normalizedToken,
			type
		});
		if (!error && data?.user) return {
			data,
			error: null
		};
		if (error) lastError = error;
	}
	return {
		data: null,
		error: lastError ?? /* @__PURE__ */ new Error("Invalid OTP")
	};
}
async function signOutSupabase() {
	if (!isSupabaseConfigured) return;
	await supabase.auth.signOut();
}
async function applySupabaseSession(tokens) {
	if (!isSupabaseConfigured) return { error: /* @__PURE__ */ new Error("Supabase is not configured") };
	const { error } = await supabase.auth.setSession({
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token
	});
	return { error };
}
async function fetchProfile(userId) {
	const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();
	if (error) throw error;
	return data;
}
async function upsertProfile(user) {
	const existing = await fetchProfile(user.id);
	if (existing) {
		const { error } = await supabase.from("profiles").update({
			name: user.name,
			email: user.email,
			phone: user.phone,
			updated_at: (/* @__PURE__ */ new Date()).toISOString()
		}).eq("id", user.id);
		if (error) throw error;
		return existing;
	}
	const { data, error } = await supabase.from("profiles").insert({
		id: user.id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		loyalty_points: 100
	}).select("*").single();
	if (error) throw error;
	return data;
}
async function addLoyaltyPoints(userId, points) {
	const profile = await fetchProfile(userId);
	const next = Math.max(0, profileLoyaltyPoints(profile) + points);
	const { error } = await supabase.from("profiles").update({
		loyalty_points: next,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", userId);
	if (error) throw error;
	return next;
}
async function updateProfile(userId, patch) {
	const { error } = await supabase.from("profiles").update({
		...patch,
		updated_at: (/* @__PURE__ */ new Date()).toISOString()
	}).eq("id", userId);
	if (error) throw error;
}
async function fetchAddresses(userId) {
	const { data, error } = await supabase.from("addresses").select("*").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw error;
	return data ?? [];
}
async function insertAddress(userId, address) {
	const { data, error } = await supabase.from("addresses").insert({
		...address,
		user_id: userId
	}).select("*").single();
	if (error) throw error;
	return data;
}
async function deleteAddress(userId, addressId) {
	const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);
	if (error) throw error;
}
async function fetchOrders(userId) {
	const { data: orders, error } = await supabase.from("orders").select("*").eq("user_id", userId).order("created_at", { ascending: false });
	if (error) throw error;
	if (!orders?.length) return [];
	const ids = orders.map((o) => o.id);
	const { data: items, error: itemsError } = await supabase.from("order_items").select("*").in("order_id", ids);
	if (itemsError) throw itemsError;
	return orders.map((o) => ({
		...o,
		items: (items ?? []).filter((i) => i.order_id === o.id)
	}));
}
async function fetchOrderById(userId, orderId) {
	const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).eq("user_id", userId).maybeSingle();
	if (error) throw error;
	if (!order) return null;
	const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId);
	if (itemsError) throw itemsError;
	return {
		...order,
		items: items ?? []
	};
}
async function createOrder(input) {
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
		shipping_address: input.shippingAddress
	});
	if (error) throw error;
	if (input.items.length) {
		const { error: itemsError } = await supabase.from("order_items").insert(input.items.map((item) => ({
			...item,
			order_id: input.orderId
		})));
		if (itemsError) throw itemsError;
	}
}
function profileToAppUser(profile) {
	return {
		id: profile.id,
		name: profile.name || profile.email.split("@")[0] || "Pet Parent",
		email: profile.email,
		phone: profile.phone,
		loyaltyPoints: profileLoyaltyPoints(profile),
		role: profile.role ?? "customer"
	};
}
//#endregion
export { fetchAddresses as a, fetchProfile as c, sendEmailOtp as d, signOutSupabase as f, verifyEmailOtp as h, deleteAddress as i, insertAddress as l, upsertProfile as m, applySupabaseSession as n, fetchOrderById as o, updateProfile as p, createOrder as r, fetchOrders as s, addLoyaltyPoints as t, profileToAppUser as u };
