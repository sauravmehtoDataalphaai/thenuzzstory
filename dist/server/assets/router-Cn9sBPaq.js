import { _ as money, b as products, d as STORE, i as fetchProductBySlug, l as isSupabaseConfigured, m as coupons, n as fetchCatalogCoupons, p as categories, r as fetchCatalogProducts, u as supabase, x as resolveCatalogImage } from "./catalog-db-CghLbik8.js";
import { n as maxRedeemRupees, r as pointsForRupees, t as loyaltyPointsForOrder } from "./loyalty-rGqQQJ4S.js";
import { a as fetchAddresses, c as fetchProfile, f as signOutSupabase, i as deleteAddress, l as insertAddress, m as upsertProfile, p as updateProfile, r as createOrder, t as addLoyaltyPoints, u as profileToAppUser } from "./auth-D9i6D0LJ.js";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { HeadContent, Link, Outlet, Scripts, createFileRoute, createRootRouteWithContext, createRouter, lazyRouteComponent, notFound, useNavigate, useRouter, useRouterState } from "@tanstack/react-router";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Bone, Cat, Clock, Dog, Heart, HeartPulse, LogOut, Mail, MapPin, Menu, Minus, PackageOpen, PawPrint, Phone, Plus, Scissors, Search, ShoppingCart, Stethoscope, Trash2, User, X } from "lucide-react";
import { Toaster, toast } from "sonner";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/styles.css?url
var styles_default = "/assets/styles-C1QwTIaR.css";
//#endregion
//#region src/store/StoreContext.tsx
var StoreContext = createContext(null);
var KEY = "nuzz-store-v1";
function mapAddress(row) {
	return {
		id: row.id,
		name: row.name,
		phone: row.phone,
		pincode: row.pincode,
		address: row.address,
		city: row.city,
		state: row.state,
		landmark: row.landmark,
		type: row.type
	};
}
function moneyish(n) {
	return `₹${n.toLocaleString("en-IN")}`;
}
function StoreProvider({ children }) {
	const [cart, setCart] = useState([]);
	const [wishlist, setWishlist] = useState([]);
	const [pets, setPets] = useState([]);
	const [addresses, setAddresses] = useState([]);
	const [user, setUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);
	const [coupon, setCoupon] = useState(null);
	const [redeemLoyalty, setRedeemLoyalty] = useState(false);
	const [cartOpen, setCartOpen] = useState(false);
	const [lastOrderId, setLastOrderId] = useState(null);
	const [hydrated, setHydrated] = useState(false);
	const [products$1, setProducts] = useState(products);
	const [coupons$1, setCoupons] = useState(coupons);
	const [catalogLoading, setCatalogLoading] = useState(true);
	const loadUserData = useCallback(async (userId) => {
		const profile = await fetchProfile(userId);
		if (profile) setUser(profileToAppUser(profile));
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
			const appUser = {
				id: authUser.id,
				name: authUser.user_metadata?.["full_name"] || authUser.email?.split("@")[0] || "Pet Parent",
				email: authUser.email ?? "",
				phone: authUser.user_metadata?.["phone"] ?? "",
				loyaltyPoints: 100,
				role: "customer"
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
				const p = JSON.parse(raw);
				if (p.cart) setCart(p.cart);
				if (p.wishlist) setWishlist(p.wishlist);
				if (p.pets) setPets(p.pets);
			}
		} catch {}
		setHydrated(true);
	}, []);
	useEffect(() => {
		let cancelled = false;
		(async () => {
			try {
				const [nextProducts, nextCoupons] = await Promise.all([fetchCatalogProducts(), fetchCatalogCoupons()]);
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
		localStorage.setItem(KEY, JSON.stringify({
			cart,
			wishlist,
			pets
		}));
	}, [
		cart,
		wishlist,
		pets,
		hydrated
	]);
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
	const value = useMemo(() => {
		const subtotal = cart.reduce((s, l) => s + l.unitPrice * l.qty, 0);
		const mrpTotal = cart.reduce((s, l) => {
			const p = products$1.find((x) => x.slug === l.slug);
			const ratio = p ? p.mrp / p.price : 1;
			return s + l.unitPrice * ratio * l.qty;
		}, 0);
		const discount = (coupon ? coupon.type === "percent" ? Math.round(subtotal * coupon.value / 100) : coupon.value : 0) + cart.reduce((s, l) => s + (l.subscription ? Math.round(l.unitPrice * l.qty * .1) : 0), 0);
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
			products: products$1,
			coupons: coupons$1,
			catalogLoading,
			refreshUser,
			setUserFromAuth: (next) => setUser(next),
			addToCart: (p, variant, qty = 1, subscription = false) => {
				const v = variant ?? p.variants[0]?.label ?? "Standard pack";
				const delta = p.variants.find((x) => x.label === v)?.priceDelta ?? 0;
				const unitPrice = p.price + delta;
				setCart((prev) => {
					const existing = prev.find((l) => l.slug === p.slug && l.variant === v);
					if (existing) return prev.map((l) => l === existing ? {
						...l,
						qty: l.qty + qty,
						subscription
					} : l);
					return [...prev, {
						slug: p.slug,
						variant: v,
						qty,
						subscription,
						unitPrice
					}];
				});
				toast.success("Added to cart", { description: `${p.name} · ${v}` });
				setCartOpen(true);
			},
			updateQty: (slug, variant, qty) => setCart((prev) => qty <= 0 ? prev.filter((l) => !(l.slug === slug && l.variant === variant)) : prev.map((l) => l.slug === slug && l.variant === variant ? {
				...l,
				qty
			} : l)),
			removeLine: (slug, variant) => {
				setCart((prev) => prev.filter((l) => !(l.slug === slug && l.variant === variant)));
				toast("Removed from cart");
			},
			clearCart: () => setCart([]),
			applyCoupon: (code) => {
				const found = coupons$1.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
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
			toggleWishlist: (slug) => setWishlist((prev) => {
				const on = prev.includes(slug);
				toast[on ? "message" : "success"](on ? "Removed from wishlist" : "Added to wishlist");
				return on ? prev.filter((s) => s !== slug) : [...prev, slug];
			}),
			addPet: (p) => {
				setPets((prev) => [...prev, {
					...p,
					id: crypto.randomUUID()
				}]);
				toast.success(`${p.name} added to your pet profiles`);
			},
			removePet: (id) => setPets((prev) => prev.filter((p) => p.id !== id)),
			addAddress: async (a) => {
				if (!user) {
					toast.error("Please login to save addresses");
					throw new Error("Not authenticated");
				}
				const created = mapAddress(await insertAddress(user.id, a));
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
				setUser({
					...user,
					...patch
				});
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
				const id = `NZ-${Math.floor(2e4 + Math.random() * 9e4)}`;
				const items = cart.map((l) => {
					const p = products$1.find((x) => x.slug === l.slug);
					return {
						product_slug: l.slug,
						product_name: p?.name ?? l.slug,
						variant: l.variant,
						qty: l.qty,
						unit_price: l.unitPrice,
						image_url: typeof p?.image === "string" ? p.image : ""
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
					items
				});
				let nextBalance = user.loyaltyPoints;
				if (pointsRedeemed > 0) try {
					nextBalance = await addLoyaltyPoints(user.id, -pointsRedeemed);
					setUser({
						...user,
						loyaltyPoints: nextBalance
					});
					toast.success(`Redeemed ${pointsRedeemed} points`, { description: `${moneyish(loyaltyDiscount)} off this order` });
				} catch (err) {
					console.error(err);
				}
				const earned = loyaltyPointsForOrder(total);
				try {
					nextBalance = await addLoyaltyPoints(user.id, earned);
					setUser({
						...user,
						loyaltyPoints: nextBalance
					});
					toast.success(`+${earned} Paw Points`, { description: `Added to loyalty · balance ${nextBalance}` });
				} catch (err) {
					console.error(err);
				}
				setLastOrderId(id);
				setCart([]);
				setCoupon(null);
				setRedeemLoyalty(false);
				return id;
			}
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
		products$1,
		coupons$1,
		redeemLoyalty
	]);
	return /* @__PURE__ */ jsx(StoreContext.Provider, {
		value,
		children
	});
}
function useStore() {
	const ctx = useContext(StoreContext);
	if (!ctx) throw new Error("useStore must be used inside StoreProvider");
	return ctx;
}
//#endregion
//#region src/assets/logo/logo2.png
var logo2_default = "/assets/logo2-sxcdcqUU.png";
//#endregion
//#region src/lib/utils.ts
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
//#endregion
//#region src/components/BrandLockup.tsx
function BrandLockup({ compact = false, className }) {
	return /* @__PURE__ */ jsxs(Link, {
		to: "/",
		"aria-label": "The Nuzz Story",
		className: cn("flex min-w-0 items-center gap-2", className),
		children: [/* @__PURE__ */ jsx("img", {
			src: logo2_default,
			alt: "",
			className: cn("w-auto shrink-0 object-contain", compact ? "h-8" : "h-11 xl:h-12")
		}), /* @__PURE__ */ jsxs("span", {
			className: "min-w-0 leading-none",
			children: [/* @__PURE__ */ jsx("span", {
				className: cn("block whitespace-nowrap font-[family-name:var(--font-wordmark)] font-bold uppercase tracking-[0.04em] text-[#c79236]", compact ? "text-[18px] sm:text-[20px]" : "text-lg xl:text-xl"),
				children: "The Nuzz Story"
			}), !compact && /* @__PURE__ */ jsxs("span", {
				className: "mt-1 flex items-center gap-1.5 text-[9px] font-[family-name:var(--font-wordmark)] font-semibold uppercase tracking-[0.12em] text-[#c79236] xl:text-[10px]",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "h-px w-3 shrink-0 bg-[#c79236] sm:w-4",
						"aria-hidden": true
					}),
					"Pet Retail & Spa",
					/* @__PURE__ */ jsx("span", {
						className: "h-px w-3 shrink-0 bg-[#c79236] sm:w-4",
						"aria-hidden": true
					})
				]
			})]
		})]
	});
}
//#endregion
//#region src/components/Header.tsx
var navLinks = [
	{
		to: "/category/$slug",
		params: { slug: "dog-food" },
		label: "Dog",
		icon: Dog
	},
	{
		to: "/category/$slug",
		params: { slug: "cat-food" },
		label: "Cat",
		icon: Cat
	},
	{
		to: "/category/$slug",
		params: { slug: "toys" },
		label: "Toys",
		icon: Bone
	},
	{
		to: "/category/$slug",
		params: { slug: "healthcare" },
		label: "Healthcare",
		icon: HeartPulse
	}
];
var mobileShopLinks = [
	{
		slug: "dog-food",
		label: "Dog Food"
	},
	{
		slug: "cat-grooming",
		label: "Cat Grooming"
	},
	{
		slug: "toys",
		label: "Toys"
	},
	{
		slug: "accessories",
		label: "Accessories"
	},
	{
		slug: "healthcare",
		label: "Healthcare"
	}
];
var linkClass = "rounded-xl px-3 py-2 text-[13px] font-semibold text-[#c79236] hover:bg-[#c79236]/10 sm:text-sm";
function Header() {
	const { cartCount, setCartOpen, wishlist, user, products, signOut } = useStore();
	const [query, setQuery] = useState("");
	const [menuOpen, setMenuOpen] = useState(false);
	const [focused, setFocused] = useState(false);
	const navigate = useNavigate();
	const boxRef = useRef(null);
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	useEffect(() => {
		setMenuOpen(false);
		setFocused(false);
	}, [pathname]);
	useEffect(() => {
		document.body.style.overflow = menuOpen ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [menuOpen]);
	const suggestions = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 2) return [];
		return products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.type.toLowerCase().includes(q)).slice(0, 6);
	}, [query, products]);
	async function handleLogout() {
		setMenuOpen(false);
		await signOut();
		navigate({ to: "/" });
	}
	return /* @__PURE__ */ jsxs("header", {
		className: "sticky top-0 z-50 border-b border-[#0d1b4b] bg-[rgb(13,27,75)] text-[#c79236] backdrop-blur",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "relative flex items-center gap-2 px-3 py-2 lg:hidden",
				children: [
					/* @__PURE__ */ jsx("button", {
						type: "button",
						"aria-label": "Open menu",
						onClick: () => setMenuOpen(true),
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl border-2 border-[#c79236]/60 text-[#c79236]",
						children: /* @__PURE__ */ jsx(Menu, {
							size: 18,
							strokeWidth: 2.75
						})
					}),
					/* @__PURE__ */ jsx(BrandLockup, {
						compact: true,
						className: "min-w-0 flex-1"
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "ml-auto flex shrink-0 items-center gap-1 text-[#c79236]",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/account/profile",
							"aria-label": "Profile",
							className: "grid h-9 w-9 place-items-center overflow-hidden rounded-full border-2 border-[#c79236]/60 bg-card text-xs font-bold text-[#c79236]",
							children: user?.name ? user.name.charAt(0).toUpperCase() : /* @__PURE__ */ jsx(User, {
								size: 17,
								strokeWidth: 2.75
							})
						}), /* @__PURE__ */ jsxs("button", {
							type: "button",
							"aria-label": "Open cart",
							onClick: () => setCartOpen(true),
							className: "relative grid h-9 w-9 place-items-center rounded-xl border-2 border-[#c79236]/60 bg-[rgb(13,27,75)] text-[#c79236]",
							children: [/* @__PURE__ */ jsx(ShoppingCart, {
								size: 17,
								strokeWidth: 2.75
							}), cartCount > 0 && /* @__PURE__ */ jsx(Badge, { count: cartCount })]
						})]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "mx-auto hidden max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-6 px-4 py-3 text-[#c79236] lg:grid",
				children: [
					/* @__PURE__ */ jsx(BrandLockup, {}),
					/* @__PURE__ */ jsxs("div", {
						ref: boxRef,
						className: "relative min-w-0",
						children: [/* @__PURE__ */ jsx("form", {
							onSubmit: (e) => {
								e.preventDefault();
								const first = suggestions[0];
								if (first) navigate({
									to: "/product/$slug",
									params: { slug: first.slug }
								});
							},
							children: /* @__PURE__ */ jsxs("label", {
								className: "flex items-center gap-2 rounded-2xl border border-[#c79236]/40 bg-card px-3 py-2.5 focus-within:border-[#c79236]",
								children: [/* @__PURE__ */ jsx(Search, {
									size: 17,
									className: "shrink-0 text-[#c79236]"
								}), /* @__PURE__ */ jsx("input", {
									value: query,
									onChange: (e) => setQuery(e.target.value),
									onFocus: () => setFocused(true),
									onBlur: () => setTimeout(() => setFocused(false), 150),
									placeholder: "Search food, grooming, toys…",
									className: "w-full min-w-0 bg-transparent text-sm text-[#c79236] outline-none placeholder:text-[#c79236]/60",
									"aria-label": "Search products"
								})]
							})
						}), focused && suggestions.length > 0 && /* @__PURE__ */ jsx("div", {
							className: "absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-lift",
							children: suggestions.map((p) => /* @__PURE__ */ jsxs(Link, {
								to: "/product/$slug",
								params: { slug: p.slug },
								onClick: () => setQuery(""),
								className: "flex items-center gap-3 px-3 py-2.5 text-[#c79236] transition-colors hover:bg-secondary",
								children: [
									/* @__PURE__ */ jsx("img", {
										src: resolveCatalogImage(p.image, p.category),
										alt: "",
										loading: "lazy",
										className: "h-10 w-10 rounded-lg object-cover"
									}),
									/* @__PURE__ */ jsxs("span", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ jsx("span", {
											className: "block truncate text-sm font-semibold",
											children: p.name
										}), /* @__PURE__ */ jsx("span", {
											className: "text-xs text-[#c79236]/70",
											children: p.brand
										})]
									}),
									/* @__PURE__ */ jsx("span", {
										className: "text-sm font-bold",
										children: money(p.price)
									})
								]
							}, p.id))
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex shrink-0 items-center gap-1 text-[#c79236]",
						children: [
							/* @__PURE__ */ jsxs(Link, {
								to: "/account/wishlist",
								"aria-label": "Wishlist",
								className: "relative grid h-10 w-10 place-items-center rounded-xl hover:bg-[#c79236]/10",
								children: [/* @__PURE__ */ jsx(Heart, {
									size: 19,
									strokeWidth: 2.5
								}), wishlist.length > 0 && /* @__PURE__ */ jsx(Badge, { count: wishlist.length })]
							}),
							/* @__PURE__ */ jsx(Link, {
								to: "/account/profile",
								"aria-label": "Account",
								className: "grid h-10 w-10 place-items-center rounded-xl hover:bg-[#c79236]/10",
								children: /* @__PURE__ */ jsx(User, {
									size: 19,
									strokeWidth: 2.5
								})
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "button",
								"aria-label": "Open cart",
								onClick: () => setCartOpen(true),
								className: "relative grid h-10 w-10 place-items-center rounded-xl bg-[rgb(13,27,75)] text-[#c79236] transition-shadow hover:shadow-glow",
								children: [/* @__PURE__ */ jsx(ShoppingCart, {
									size: 19,
									strokeWidth: 2.5
								}), cartCount > 0 && /* @__PURE__ */ jsx(Badge, { count: cartCount })]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("nav", {
				className: "mx-auto hidden max-w-7xl items-center gap-6 px-4 pb-3 text-sm font-semibold text-[#c79236] lg:flex",
				children: [
					navLinks.map((l) => /* @__PURE__ */ jsxs(Link, {
						to: l.to,
						params: l.params,
						className: "flex items-center gap-1.5 transition-colors hover:opacity-80",
						children: [
							/* @__PURE__ */ jsx(l.icon, {
								size: 16,
								strokeWidth: 2.5
							}),
							" ",
							l.label
						]
					}, l.label)),
					/* @__PURE__ */ jsxs(Link, {
						to: "/grooming",
						className: "flex items-center gap-1.5 transition-colors hover:opacity-80",
						children: [/* @__PURE__ */ jsx(Scissors, {
							size: 16,
							strokeWidth: 2.5
						}), " Grooming Services"]
					}),
					/* @__PURE__ */ jsxs(Link, {
						to: "/contact",
						className: "flex items-center gap-1.5 transition-colors hover:opacity-80",
						children: [/* @__PURE__ */ jsx(Stethoscope, {
							size: 16,
							strokeWidth: 2.5
						}), " Vet Consultation"]
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/about",
						className: "ml-auto transition-colors hover:opacity-80",
						children: "About"
					}),
					/* @__PURE__ */ jsx(Link, {
						to: "/faq",
						className: "transition-colors hover:opacity-80",
						children: "FAQ"
					})
				]
			}),
			/* @__PURE__ */ jsx("div", {
				className: "overflow-hidden border-t border-[#c79236]/20 bg-[rgb(13,27,75)] py-1.5",
				children: /* @__PURE__ */ jsxs("div", {
					className: "flex w-max animate-promo-marquee whitespace-nowrap text-xs font-semibold text-white",
					children: [
						/* @__PURE__ */ jsx("span", {
							className: "px-8",
							children: "Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "px-8",
							"aria-hidden": true,
							children: "Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "px-8",
							"aria-hidden": true,
							children: "Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products"
						}),
						/* @__PURE__ */ jsx("span", {
							className: "px-8",
							"aria-hidden": true,
							children: "Free delivery above ₹499 · Use code PAW20 for flat 20% off · Vet-reviewed products"
						})
					]
				})
			}),
			menuOpen && /* @__PURE__ */ jsxs("div", {
				className: "fixed inset-0 z-50 lg:hidden",
				children: [/* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": "Close menu",
					onClick: () => setMenuOpen(false),
					className: "absolute inset-0 bg-foreground/50"
				}), /* @__PURE__ */ jsxs("div", {
					className: "absolute left-0 top-0 flex h-full w-[78%] max-w-[280px] flex-col bg-background text-[#c79236]",
					children: [
						/* @__PURE__ */ jsxs("div", {
							className: "flex items-center justify-between border-b border-border px-4 py-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "font-display text-base font-extrabold text-[#c79236]",
								children: "Menu"
							}), /* @__PURE__ */ jsx("button", {
								type: "button",
								"aria-label": "Close menu",
								onClick: () => setMenuOpen(false),
								className: "text-[#c79236]",
								children: /* @__PURE__ */ jsx(X, { size: 18 })
							})]
						}),
						/* @__PURE__ */ jsxs("nav", {
							className: "flex flex-1 flex-col gap-0.5 overflow-y-auto p-3",
							children: [
								mobileShopLinks.map((c) => /* @__PURE__ */ jsx(Link, {
									to: "/category/$slug",
									params: { slug: c.slug },
									className: linkClass,
									children: c.label
								}, c.slug)),
								/* @__PURE__ */ jsx("div", { className: "my-2 h-px bg-border" }),
								/* @__PURE__ */ jsx(Link, {
									to: "/account/profile",
									className: linkClass,
									children: "Profile"
								})
							]
						}),
						/* @__PURE__ */ jsx("div", {
							className: "border-t border-border p-3",
							children: user ? /* @__PURE__ */ jsxs("button", {
								type: "button",
								onClick: () => void handleLogout(),
								className: "flex w-full items-center justify-center gap-2 rounded-xl border border-[#c79236]/40 px-3 py-2.5 text-[13px] font-semibold text-[#c79236]",
								children: [/* @__PURE__ */ jsx(LogOut, { size: 15 }), " Logout"]
							}) : /* @__PURE__ */ jsxs(Link, {
								to: "/account/login",
								className: "flex w-full items-center justify-center gap-2 rounded-xl bg-[rgb(13,27,75)] px-3 py-2.5 text-[13px] font-semibold text-[#c79236]",
								children: [/* @__PURE__ */ jsx(User, { size: 15 }), " Login"]
							})
						})
					]
				})]
			})
		]
	});
}
function Badge({ count }) {
	return /* @__PURE__ */ jsx("span", {
		className: "absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#c79236] px-1 text-[9px] font-bold text-[rgb(13,27,75)] sm:h-5 sm:min-w-5 sm:text-[10px]",
		children: count
	});
}
//#endregion
//#region src/components/Footer.tsx
function InstagramIcon({ size = 20, strokeWidth = 2.5 }) {
	return /* @__PURE__ */ jsxs("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "none",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ jsx("rect", {
				x: "2",
				y: "2",
				width: "20",
				height: "20",
				rx: "5",
				stroke: "currentColor",
				strokeWidth
			}),
			/* @__PURE__ */ jsx("circle", {
				cx: "12",
				cy: "12",
				r: "4",
				stroke: "currentColor",
				strokeWidth
			}),
			/* @__PURE__ */ jsx("circle", {
				cx: "17.5",
				cy: "6.5",
				r: "1.35",
				fill: "currentColor"
			})
		]
	});
}
function FacebookIcon({ size = 20 }) {
	return /* @__PURE__ */ jsx("svg", {
		width: size,
		height: size,
		viewBox: "0 0 24 24",
		fill: "currentColor",
		"aria-hidden": "true",
		children: /* @__PURE__ */ jsx("path", { d: "M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" })
	});
}
var socialLinks = [{
	Icon: InstagramIcon,
	href: "https://www.instagram.com/thenuzzstory/",
	label: "Instagram"
}, {
	Icon: FacebookIcon,
	href: "https://www.facebook.com/people/The-Nuzz-Story/61590037156313/",
	label: "Facebook"
}];
function Footer() {
	return /* @__PURE__ */ jsxs("footer", {
		className: "mt-10 border-t border-[#0d1b4b] bg-[rgb(13,27,75)] text-[#c79236] sm:mt-16",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mx-auto grid max-w-7xl gap-6 px-3 py-8 sm:px-4 sm:py-12 md:grid-cols-2 md:gap-10 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsx(BrandLockup, {}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-xs text-xs italic text-[#c79236]/80 sm:text-sm",
						children: "A neighbourhood pet store gone online — genuine food, gentle grooming and vet-reviewed care for dogs and cats."
					}),
					/* @__PURE__ */ jsx("div", {
						className: "mt-4 flex gap-2",
						children: socialLinks.map(({ Icon, href, label }) => /* @__PURE__ */ jsx("a", {
							href,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": label,
							className: "grid h-10 w-10 place-items-center rounded-xl border border-[#c79236]/40 text-[#c79236] transition-colors hover:bg-[#c79236]/10",
							children: /* @__PURE__ */ jsx(Icon, { size: 20 })
						}, label))
					})
				] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold uppercase tracking-wide text-[#c79236]",
					children: "Shop"
				}), /* @__PURE__ */ jsx("ul", {
					className: "mt-3 space-y-1.5 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-2 sm:text-sm",
					children: categories.map((c) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
						to: "/category/$slug",
						params: { slug: c.slug },
						className: "hover:opacity-80",
						children: c.name
					}) }, c.slug))
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold uppercase tracking-wide text-[#c79236]",
					children: "Quick links"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-3 space-y-1.5 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-2 sm:text-sm",
					children: [
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/about",
							className: "hover:opacity-80",
							children: "About Us"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/grooming",
							className: "hover:opacity-80",
							children: "Grooming Services"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/contact",
							className: "hover:opacity-80",
							children: "Contact Us"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/faq",
							className: "hover:opacity-80",
							children: "FAQ"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/shipping",
							className: "hover:opacity-80",
							children: "Shipping & Returns"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/privacy",
							className: "hover:opacity-80",
							children: "Privacy Policy"
						}) }),
						/* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(Link, {
							to: "/account/orders",
							className: "hover:opacity-80",
							children: "Track Order"
						}) })
					]
				})] }),
				/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h4", {
					className: "text-sm font-bold uppercase tracking-wide text-[#c79236]",
					children: "Visit our store"
				}), /* @__PURE__ */ jsxs("ul", {
					className: "mt-3 space-y-2 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-3 sm:text-sm",
					children: [
						/* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(MapPin, {
								size: 17,
								strokeWidth: 2.5,
								className: "mt-0.5 shrink-0 text-[#c79236]"
							}), STORE.address]
						}),
						/* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Clock, {
								size: 17,
								strokeWidth: 2.5,
								className: "mt-0.5 shrink-0 text-[#c79236]"
							}), STORE.hours]
						}),
						/* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Phone, {
								size: 17,
								strokeWidth: 2.5,
								className: "mt-0.5 shrink-0 text-[#c79236]"
							}), STORE.phone]
						}),
						/* @__PURE__ */ jsxs("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ jsx(Mail, {
								size: 17,
								strokeWidth: 2.5,
								className: "mt-0.5 shrink-0 text-[#c79236]"
							}), STORE.email]
						})
					]
				})] })
			]
		}), /* @__PURE__ */ jsx("div", {
			className: "border-t border-[#c79236]/25",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-3 py-4 text-[11px] text-[#c79236] sm:flex-row sm:px-4 sm:py-5 sm:text-xs",
				children: [/* @__PURE__ */ jsxs("p", { children: [
					"© ",
					(/* @__PURE__ */ new Date()).getFullYear(),
					" ",
					STORE.name,
					". All rights reserved."
				] }), /* @__PURE__ */ jsx("div", {
					className: "flex flex-wrap items-center justify-center gap-2",
					children: [
						"UPI",
						"VISA",
						"Mastercard",
						"RuPay",
						"Net Banking",
						"COD"
					].map((m) => /* @__PURE__ */ jsx("span", {
						className: "rounded-lg border border-[#c79236]/40 px-2.5 py-1 font-semibold text-[#c79236]",
						children: m
					}, m))
				})]
			})
		})]
	});
}
//#endregion
//#region src/components/CartDrawer.tsx
function CartDrawer() {
	const { cartOpen, setCartOpen, cart, updateQty, removeLine, subtotal, discount, deliveryFee, total, products } = useStore();
	if (!cartOpen) return null;
	return /* @__PURE__ */ jsxs("div", {
		className: "fixed inset-0 z-[60]",
		children: [/* @__PURE__ */ jsx("button", {
			type: "button",
			"aria-label": "Close cart",
			onClick: () => setCartOpen(false),
			className: "absolute inset-0 bg-foreground/50"
		}), /* @__PURE__ */ jsxs("aside", {
			className: "absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-lift",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4",
				children: [/* @__PURE__ */ jsxs("h2", {
					className: "font-display text-base font-extrabold sm:text-lg",
					children: [
						"Your Cart (",
						cart.length,
						")"
					]
				}), /* @__PURE__ */ jsx("button", {
					type: "button",
					"aria-label": "Close cart",
					onClick: () => setCartOpen(false),
					children: /* @__PURE__ */ jsx(X, { size: 18 })
				})]
			}), cart.length === 0 ? /* @__PURE__ */ jsxs("div", {
				className: "flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center",
				children: [
					/* @__PURE__ */ jsx("span", {
						className: "grid h-20 w-20 place-items-center rounded-full bg-primary-soft text-primary",
						children: /* @__PURE__ */ jsx(PackageOpen, { size: 34 })
					}),
					/* @__PURE__ */ jsx("p", {
						className: "font-display text-lg font-bold",
						children: "Your cart is empty"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "Treats, kibble and toys are waiting for a very good pet."
					}),
					/* @__PURE__ */ jsx("button", {
						type: "button",
						onClick: () => setCartOpen(false),
						className: "mt-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground",
						children: "Continue Shopping"
					})
				]
			}) : /* @__PURE__ */ jsxs(Fragment, { children: [/* @__PURE__ */ jsx("div", {
				className: "flex-1 space-y-3 overflow-y-auto px-4 py-3 sm:space-y-4 sm:px-5 sm:py-4",
				children: cart.map((line) => {
					const p = products.find((x) => x.slug === line.slug);
					return /* @__PURE__ */ jsxs("div", {
						className: "flex gap-2.5 sm:gap-3",
						children: [/* @__PURE__ */ jsx("img", {
							src: p?.image,
							alt: p?.name ?? "",
							loading: "lazy",
							className: "h-16 w-16 shrink-0 rounded-xl object-cover sm:h-20 sm:w-20"
						}), /* @__PURE__ */ jsxs("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ jsx("p", {
									className: "truncate text-xs font-semibold sm:text-sm",
									children: p?.name
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [line.variant, line.subscription && " · Monthly subscription"]
								}),
								/* @__PURE__ */ jsxs("div", {
									className: "mt-2 flex items-center gap-3",
									children: [
										/* @__PURE__ */ jsxs("div", {
											className: "flex items-center rounded-lg border border-border",
											children: [
												/* @__PURE__ */ jsx("button", {
													type: "button",
													"aria-label": "Decrease quantity",
													onClick: () => updateQty(line.slug, line.variant, line.qty - 1),
													className: "px-2 py-1.5",
													children: /* @__PURE__ */ jsx(Minus, { size: 14 })
												}),
												/* @__PURE__ */ jsx("span", {
													className: "w-7 text-center text-sm font-semibold",
													children: line.qty
												}),
												/* @__PURE__ */ jsx("button", {
													type: "button",
													"aria-label": "Increase quantity",
													onClick: () => updateQty(line.slug, line.variant, line.qty + 1),
													className: "px-2 py-1.5",
													children: /* @__PURE__ */ jsx(Plus, { size: 14 })
												})
											]
										}),
										/* @__PURE__ */ jsx("span", {
											className: "text-sm font-bold",
											children: money(line.unitPrice * line.qty)
										}),
										/* @__PURE__ */ jsx("button", {
											type: "button",
											"aria-label": "Remove item",
											onClick: () => removeLine(line.slug, line.variant),
											className: "ml-auto text-muted-foreground hover:text-destructive",
											children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
										})
									]
								})
							]
						})]
					}, line.slug + line.variant);
				})
			}), /* @__PURE__ */ jsxs("div", {
				className: "space-y-2 border-t border-border px-4 py-3 text-xs sm:px-5 sm:py-4 sm:text-sm",
				children: [
					/* @__PURE__ */ jsx(Row, {
						label: "Subtotal",
						value: money(subtotal)
					}),
					discount > 0 && /* @__PURE__ */ jsx(Row, {
						label: "Discount",
						value: `- ${money(discount)}`,
						good: true
					}),
					/* @__PURE__ */ jsx(Row, {
						label: "Delivery",
						value: deliveryFee === 0 ? "FREE" : money(deliveryFee)
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "flex items-center justify-between border-t border-border pt-2 text-base font-bold",
						children: [/* @__PURE__ */ jsx("span", { children: "Total" }), /* @__PURE__ */ jsx("span", { children: money(total) })]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "grid grid-cols-2 gap-2 pt-2",
						children: [/* @__PURE__ */ jsx(Link, {
							to: "/cart",
							onClick: () => setCartOpen(false),
							className: "rounded-xl border border-border px-4 py-2.5 text-center text-sm font-semibold hover:bg-secondary",
							children: "View Cart"
						}), /* @__PURE__ */ jsx(Link, {
							to: "/checkout",
							onClick: () => setCartOpen(false),
							className: "rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground hover:shadow-glow",
							children: "Checkout"
						})]
					})
				]
			})] })]
		})]
	});
}
function Row({ label, value, good }) {
	return /* @__PURE__ */ jsxs("div", {
		className: "flex items-center justify-between",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("span", {
			className: good ? "font-semibold text-success" : "font-semibold",
			children: value
		})]
	});
}
//#endregion
//#region src/components/ui/sonner.tsx
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ jsx(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
//#endregion
//#region src/routes/__root.tsx
function NotFoundComponent() {
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-[70vh] items-center justify-center bg-background px-4 py-16",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("span", {
					className: "mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary-soft text-primary",
					children: /* @__PURE__ */ jsx(PawPrint, { size: 44 })
				}),
				/* @__PURE__ */ jsx("h1", {
					className: "mt-6 font-display text-6xl font-extrabold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ jsx("h2", {
					className: "mt-2 font-display text-xl font-bold text-foreground",
					children: "This page ran off chasing a squirrel"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "We sniffed around but couldn't find it. Let's get you back to the treats."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow",
						children: "Go home"
					}), /* @__PURE__ */ jsx(Link, {
						to: "/category/$slug",
						params: { slug: "dog-food" },
						className: "inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary",
						children: "Shop dog food"
					})]
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ jsx("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ jsxs("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ jsx("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ jsxs("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ jsx("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ jsx("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$34 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
			{
				name: "description",
				content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming."
			},
			{
				name: "author",
				content: "The Nuzz Story"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				property: "og:title",
				content: "The Nuzz Story — Premium Pet Food, Grooming & Care"
			},
			{
				name: "twitter:title",
				content: "The Nuzz Story — Premium Pet Food, Grooming & Care"
			},
			{
				property: "og:description",
				content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming."
			},
			{
				name: "twitter:description",
				content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming."
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@600;700&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/x-icon"
			},
			{
				rel: "icon",
				href: "/favicon.png",
				type: "image/png",
				sizes: "256x256"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ jsxs("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }), /* @__PURE__ */ jsxs("body", {
			suppressHydrationWarning: true,
			children: [children, /* @__PURE__ */ jsx(Scripts, {})]
		})]
	});
}
function RootComponent() {
	const { queryClient } = Route$34.useRouteContext();
	const isAdmin = useRouterState({ select: (s) => s.location.pathname }).startsWith("/admin");
	return /* @__PURE__ */ jsx(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ jsxs(StoreProvider, { children: [
			/* @__PURE__ */ jsxs("div", {
				className: "flex min-h-screen flex-col",
				children: [
					!isAdmin && /* @__PURE__ */ jsx(Header, {}),
					/* @__PURE__ */ jsx("main", {
						className: "flex-1",
						children: /* @__PURE__ */ jsx(Outlet, {})
					}),
					!isAdmin && /* @__PURE__ */ jsx(Footer, {})
				]
			}),
			!isAdmin && /* @__PURE__ */ jsx(CartDrawer, {}),
			/* @__PURE__ */ jsx(Toaster$1, {
				position: "top-right",
				richColors: true
			})
		] })
	});
}
//#endregion
//#region src/routes/index.tsx
var $$splitComponentImporter$33 = () => import("./routes-c_ZIuqX3.js");
var Route$33 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
		{
			name: "description",
			content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming."
		},
		{
			property: "og:title",
			content: "The Nuzz Story — Premium Pet Food, Grooming & Care"
		},
		{
			property: "og:description",
			content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$33, "component")
});
//#endregion
//#region src/routes/about.tsx
var $$splitComponentImporter$32 = () => import("./about-DdgRfCAY.js");
var Route$32 = createFileRoute("/about")({
	head: () => ({ meta: [
		{ title: "About The Nuzz Story — Our Story" },
		{
			name: "description",
			content: "A New Delhi pet store turned online destination: vet-reviewed products, gentle grooming and 1% of every order for community animals."
		},
		{
			property: "og:title",
			content: "About The Nuzz Story — Our Story"
		},
		{
			property: "og:description",
			content: "Only selling what we'd feed our own pets, since 2019."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
//#endregion
//#region src/routes/account.tsx
var $$splitComponentImporter$31 = () => import("./account-Gipq3W_3.js");
var Route$31 = createFileRoute("/account")({
	head: () => ({ meta: [
		{ title: "My Account — The Nuzz Story" },
		{
			name: "description",
			content: "Manage your profile, pet profiles, wishlist, loyalty points and order history."
		},
		{
			property: "og:title",
			content: "My Account — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Your orders, pets, wishlist and loyalty points in one place."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
//#endregion
//#region src/routes/admin.tsx
var $$splitComponentImporter$30 = () => import("./admin-CXFtBekl.js");
var Route$30 = createFileRoute("/admin")({ component: lazyRouteComponent($$splitComponentImporter$30, "component") });
//#endregion
//#region src/routes/cart.tsx
var $$splitComponentImporter$29 = () => import("./cart-De8I2dnK.js");
var Route$29 = createFileRoute("/cart")({
	head: () => ({ meta: [
		{ title: "Your Cart — The Nuzz Story" },
		{
			name: "description",
			content: "Review your pet food, grooming and accessory picks before checkout."
		},
		{
			property: "og:title",
			content: "Your Cart — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Review your cart and apply coupons before checkout."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
//#endregion
//#region src/routes/checkout.tsx
var $$splitComponentImporter$28 = () => import("./checkout-C_nCW2EX.js");
var Route$28 = createFileRoute("/checkout")({
	head: () => ({ meta: [
		{ title: "Checkout — The Nuzz Story" },
		{
			name: "description",
			content: "Add your delivery address, choose a payment method and place your pet supplies order."
		},
		{
			property: "og:title",
			content: "Checkout — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Secure checkout with UPI, cards, net banking and cash on delivery."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
//#endregion
//#region src/routes/contact.tsx
var $$splitComponentImporter$27 = () => import("./contact-C3cr-A7X.js");
var Route$27 = createFileRoute("/contact")({
	head: () => ({ meta: [
		{ title: "Contact Us & Vet Consultation — The Nuzz Story" },
		{
			name: "description",
			content: "Visit our Chittaranjan Park store, call us, or book a vet consultation for your dog or cat."
		},
		{
			property: "og:title",
			content: "Contact Us — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Store address, hours, support contacts and vet consultation booking."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
//#endregion
//#region src/routes/faq.tsx
var $$splitComponentImporter$26 = () => import("./faq-B7HmML8h.js");
var Route$26 = createFileRoute("/faq")({
	head: () => ({ meta: [
		{ title: "FAQ — Delivery, Returns & Subscriptions | The Nuzz Story" },
		{
			name: "description",
			content: "Answers about delivery timelines, COD, product authenticity, Subscribe & Save and cat grooming."
		},
		{
			property: "og:title",
			content: "The Nuzz Story FAQ"
		},
		{
			property: "og:description",
			content: "Everything pet parents ask us, answered."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
//#endregion
//#region src/routes/grooming.tsx
var $$splitComponentImporter$25 = () => import("./grooming-CRfe_JKn.js");
var Route$25 = createFileRoute("/grooming")({
	head: () => ({ meta: [
		{ title: "Pet Grooming Services in New Delhi — The Nuzz Story" },
		{
			name: "description",
			content: "Book bath & brush, haircuts, nail trims, ear cleaning or a full spa package for your dog or cat at our Chittaranjan Park store."
		},
		{
			property: "og:title",
			content: "Pet Grooming Services — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Gentle, fear-free grooming by certified groomers. Book a slot online."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
//#endregion
//#region src/routes/order-confirmation.tsx
var $$splitComponentImporter$24 = () => import("./order-confirmation-Cfp8ithe.js");
var Route$24 = createFileRoute("/order-confirmation")({
	validateSearch: z.object({ order: z.string().optional() }),
	head: () => ({ meta: [
		{ title: "Order Confirmed — The Nuzz Story" },
		{
			name: "description",
			content: "Your pet supplies order is confirmed and on its way."
		},
		{
			property: "og:title",
			content: "Order Confirmed — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Thanks for shopping with The Nuzz Story."
		},
		{
			name: "robots",
			content: "noindex"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
//#endregion
//#region src/routes/privacy.tsx
var $$splitComponentImporter$23 = () => import("./privacy-Dj_wGw6J.js");
var Route$23 = createFileRoute("/privacy")({
	head: () => ({ meta: [
		{ title: "Privacy Policy — The Nuzz Story" },
		{
			name: "description",
			content: "What data we collect, how we use it, who we share it with and how to opt out."
		},
		{
			property: "og:title",
			content: "Privacy Policy — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "We collect the minimum we need to deliver your order."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
//#endregion
//#region src/routes/shipping.tsx
var $$splitComponentImporter$22 = () => import("./shipping-DPAXBzvh.js");
var Route$22 = createFileRoute("/shipping")({
	head: () => ({ meta: [
		{ title: "Shipping & Returns Policy — The Nuzz Story" },
		{
			name: "description",
			content: "Delivery timelines, shipping charges, the 7-day Tail Wag Guarantee and refund timelines."
		},
		{
			property: "og:title",
			content: "Shipping & Returns — The Nuzz Story"
		},
		{
			property: "og:description",
			content: "Free delivery above ₹499 and easy 7-day returns."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
//#endregion
//#region src/routes/account.index.tsx
var $$splitComponentImporter$21 = () => import("./account.index-V6QNOjE-.js");
var Route$21 = createFileRoute("/account/")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
//#endregion
//#region src/routes/account.login.tsx
var $$splitComponentImporter$20 = () => import("./account.login-DnKWEK5k.js");
var Route$20 = createFileRoute("/account/login")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
//#endregion
//#region src/routes/account.orders.tsx
var $$splitComponentImporter$19 = () => import("./account.orders-CnwGQjMj.js");
var Route$19 = createFileRoute("/account/orders")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
//#endregion
//#region src/routes/account.profile.tsx
var $$splitComponentImporter$18 = () => import("./account.profile-D-OsCRTZ.js");
var Route$18 = createFileRoute("/account/profile")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
//#endregion
//#region src/routes/account.wishlist.tsx
var $$splitComponentImporter$17 = () => import("./account.wishlist-COCG6SaF.js");
var Route$17 = createFileRoute("/account/wishlist")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
//#endregion
//#region src/routes/admin.index.tsx
var $$splitComponentImporter$16 = () => import("./admin.index-BAMUipBt.js");
var Route$16 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
//#endregion
//#region src/routes/admin.audit.tsx
var $$splitComponentImporter$15 = () => import("./admin.audit-ha0qT2V2.js");
var Route$15 = createFileRoute("/admin/audit")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
//#endregion
//#region src/routes/admin.coupons.tsx
var $$splitComponentImporter$14 = () => import("./admin.coupons-BXajQfI-.js");
var Route$14 = createFileRoute("/admin/coupons")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
//#endregion
//#region src/routes/admin.dashboard.tsx
var $$splitComponentImporter$13 = () => import("./admin.dashboard-wgZjzPMW.js");
var Route$13 = createFileRoute("/admin/dashboard")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
//#endregion
//#region src/routes/admin.login.tsx
var $$splitComponentImporter$12 = () => import("./admin.login-6HeS3hLO.js");
var Route$12 = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
//#endregion
//#region src/routes/admin.orders.tsx
var $$splitComponentImporter$11 = () => import("./admin.orders-CLSzSOey.js");
var Route$11 = createFileRoute("/admin/orders")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
//#endregion
//#region src/routes/admin.permissions.tsx
var $$splitComponentImporter$10 = () => import("./admin.permissions-Ca6zeaiN.js");
var Route$10 = createFileRoute("/admin/permissions")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
//#endregion
//#region src/routes/admin.products.tsx
var $$splitComponentImporter$9 = () => import("./admin.products-0ZK2Habo.js");
var Route$9 = createFileRoute("/admin/products")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
//#endregion
//#region src/routes/admin.reports.tsx
var $$splitComponentImporter$8 = () => import("./admin.reports-3Iv-jcCV.js");
var Route$8 = createFileRoute("/admin/reports")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
//#endregion
//#region src/routes/admin.staff.tsx
var $$splitComponentImporter$7 = () => import("./admin.staff-Cam8nbV8.js");
var Route$7 = createFileRoute("/admin/staff")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
//#endregion
//#region src/routes/admin.users.tsx
var $$splitComponentImporter$6 = () => import("./admin.users-B9lLhWLR.js");
var Route$6 = createFileRoute("/admin/users")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
//#endregion
//#region src/routes/category.$slug.tsx
var $$splitComponentImporter$5 = () => import("./category._slug-aXIjq3XR.js");
var Route$5 = createFileRoute("/category/$slug")({
	loader: ({ params }) => {
		const category = categories.find((c) => c.slug === params.slug);
		if (!category) throw notFound();
		return { category };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Category unavailable — The Nuzz Story" }, {
			name: "robots",
			content: "noindex"
		}] };
		const t = `${loaderData.category.name} — Buy Online | The Nuzz Story`;
		const d = `Shop ${loaderData.category.name.toLowerCase()} (${loaderData.category.blurb}) with free delivery above ₹499, vet-reviewed picks and easy returns.`;
		return { meta: [
			{ title: t },
			{
				name: "description",
				content: d
			},
			{
				property: "og:title",
				content: t
			},
			{
				property: "og:description",
				content: d
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
//#endregion
//#region src/routes/product.$slug.tsx
var $$splitComponentImporter$4 = () => import("./product._slug-IWRXX-4B.js");
var Route$4 = createFileRoute("/product/$slug")({
	loader: async ({ params }) => {
		const product = await fetchProductBySlug(params.slug);
		if (!product) throw notFound();
		return { product };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Product unavailable — The Nuzz Story" }, {
			name: "robots",
			content: "noindex"
		}] };
		const p = loaderData.product;
		const t = `${p.name} by ${p.brand} — The Nuzz Story`;
		const d = `${p.name} at ${money(p.price)} (MRP ${money(p.mrp)}). Rated ${p.rating}/5 by ${p.reviews} pet parents. Free delivery above ₹499.`;
		return { meta: [
			{ title: t },
			{
				name: "description",
				content: d
			},
			{
				property: "og:title",
				content: t
			},
			{
				property: "og:description",
				content: d
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
//#endregion
//#region src/routes/account.track.$id.tsx
var $$splitComponentImporter$3 = () => import("./account.track._id-BR9XYWFs.js");
var Route$3 = createFileRoute("/account/track/$id")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
//#endregion
//#region src/routes/admin.orders.$id.tsx
var $$splitComponentImporter$2 = () => import("./admin.orders._id-DeuLZ4aR.js");
var Route$2 = createFileRoute("/admin/orders/$id")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
//#endregion
//#region src/routes/admin.products.$id.tsx
var $$splitComponentImporter$1 = () => import("./admin.products._id-QHfHtdoN.js");
var Route$1 = createFileRoute("/admin/products/$id")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
//#endregion
//#region src/routes/admin.users.$id.tsx
var $$splitComponentImporter = () => import("./admin.users._id-BQTxvwCr.js");
var Route = createFileRoute("/admin/users/$id")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
//#endregion
//#region src/routeTree.gen.ts
var IndexRoute = Route$33.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$34
});
var AboutRoute = Route$32.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$34
});
var AccountRoute = Route$31.update({
	id: "/account",
	path: "/account",
	getParentRoute: () => Route$34
});
var AdminRoute = Route$30.update({
	id: "/admin",
	path: "/admin",
	getParentRoute: () => Route$34
});
var CartRoute = Route$29.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$34
});
var CheckoutRoute = Route$28.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$34
});
var ContactRoute = Route$27.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$34
});
var FaqRoute = Route$26.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$34
});
var GroomingRoute = Route$25.update({
	id: "/grooming",
	path: "/grooming",
	getParentRoute: () => Route$34
});
var OrderConfirmationRoute = Route$24.update({
	id: "/order-confirmation",
	path: "/order-confirmation",
	getParentRoute: () => Route$34
});
var PrivacyRoute = Route$23.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$34
});
var ShippingRoute = Route$22.update({
	id: "/shipping",
	path: "/shipping",
	getParentRoute: () => Route$34
});
var AccountIndexRoute = Route$21.update({
	id: "/",
	path: "/",
	getParentRoute: () => AccountRoute
});
var AccountLoginRoute = Route$20.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AccountRoute
});
var AccountOrdersRoute = Route$19.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AccountRoute
});
var AccountProfileRoute = Route$18.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => AccountRoute
});
var AccountWishlistRoute = Route$17.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => AccountRoute
});
var AdminIndexRoute = Route$16.update({
	id: "/",
	path: "/",
	getParentRoute: () => AdminRoute
});
var AdminAuditRoute = Route$15.update({
	id: "/audit",
	path: "/audit",
	getParentRoute: () => AdminRoute
});
var AdminCouponsRoute = Route$14.update({
	id: "/coupons",
	path: "/coupons",
	getParentRoute: () => AdminRoute
});
var AdminDashboardRoute = Route$13.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AdminRoute
});
var AdminLoginRoute = Route$12.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => AdminRoute
});
var AdminOrdersRoute = Route$11.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => AdminRoute
});
var AdminPermissionsRoute = Route$10.update({
	id: "/permissions",
	path: "/permissions",
	getParentRoute: () => AdminRoute
});
var AdminProductsRoute = Route$9.update({
	id: "/products",
	path: "/products",
	getParentRoute: () => AdminRoute
});
var AdminReportsRoute = Route$8.update({
	id: "/reports",
	path: "/reports",
	getParentRoute: () => AdminRoute
});
var AdminStaffRoute = Route$7.update({
	id: "/staff",
	path: "/staff",
	getParentRoute: () => AdminRoute
});
var AdminUsersRoute = Route$6.update({
	id: "/users",
	path: "/users",
	getParentRoute: () => AdminRoute
});
var CategorySlugRoute = Route$5.update({
	id: "/category/$slug",
	path: "/category/$slug",
	getParentRoute: () => Route$34
});
var ProductSlugRoute = Route$4.update({
	id: "/product/$slug",
	path: "/product/$slug",
	getParentRoute: () => Route$34
});
var AccountTrackIdRoute = Route$3.update({
	id: "/track/$id",
	path: "/track/$id",
	getParentRoute: () => AccountRoute
});
var AdminOrdersIdRoute = Route$2.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminOrdersRoute
});
var AdminProductsIdRoute = Route$1.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminProductsRoute
});
var AdminUsersIdRoute = Route.update({
	id: "/$id",
	path: "/$id",
	getParentRoute: () => AdminUsersRoute
});
var AccountRouteChildren = {
	AccountLoginRoute,
	AccountOrdersRoute,
	AccountProfileRoute,
	AccountWishlistRoute,
	AccountIndexRoute,
	AccountTrackIdRoute
};
var AccountRouteWithChildren = AccountRoute._addFileChildren(AccountRouteChildren);
var AdminOrdersRouteChildren = { AdminOrdersIdRoute };
var AdminOrdersRouteWithChildren = AdminOrdersRoute._addFileChildren(AdminOrdersRouteChildren);
var AdminProductsRouteChildren = { AdminProductsIdRoute };
var AdminProductsRouteWithChildren = AdminProductsRoute._addFileChildren(AdminProductsRouteChildren);
var AdminUsersRouteChildren = { AdminUsersIdRoute };
var AdminRouteChildren = {
	AdminAuditRoute,
	AdminCouponsRoute,
	AdminDashboardRoute,
	AdminLoginRoute,
	AdminOrdersRoute: AdminOrdersRouteWithChildren,
	AdminPermissionsRoute,
	AdminProductsRoute: AdminProductsRouteWithChildren,
	AdminReportsRoute,
	AdminStaffRoute,
	AdminUsersRoute: AdminUsersRoute._addFileChildren(AdminUsersRouteChildren),
	AdminIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AccountRoute: AccountRouteWithChildren,
	AdminRoute: AdminRoute._addFileChildren(AdminRouteChildren),
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	FaqRoute,
	GroomingRoute,
	OrderConfirmationRoute,
	PrivacyRoute,
	ShippingRoute,
	CategorySlugRoute,
	ProductSlugRoute
};
var routeTree = Route$34._addFileChildren(rootRouteChildren)._addFileTypes();
//#endregion
//#region src/router.tsx
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { Route$3 as a, Route$24 as c, getRouter, Route$2 as i, cn as l, Route as n, Route$4 as o, Route$1 as r, Route$5 as s, router_exports as t, useStore as u };
