import { S as testimonials, d as STORE, p as categories, v as offers } from "./catalog-db-CghLbik8.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { n as ProductCardSkeleton, r as Stars, t as ProductCard } from "./ProductCard-J3zyhahX.js";
import { t as grooming_hero_default } from "./grooming-hero-CIEd6lu0.js";
import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, MapPin, Package, PawPrint, ShieldCheck, Stethoscope, Truck, Wallet } from "lucide-react";
import { toast } from "sonner";
//#region src/assets/hero-pets.jpg
var hero_pets_default = "/assets/hero-pets-D3SYTPNQ.jpg";
//#endregion
//#region src/routes/index.tsx?tsr-split=component
var banners = [
	{
		eyebrow: "Monsoon Sale is live",
		title: "Big bowls of joy, up to 40% off",
		body: "Premium kibble, gravy pouches and treats your pet will do tricks for.",
		cta: "Shop dog food",
		slug: "dog-food"
	},
	{
		eyebrow: "New in store",
		title: "Grooming that feels like a spa day",
		body: "Gentle shampoos, deshedders and paw balms — plus salon slots at our store.",
		cta: "Shop grooming",
		slug: "dog-grooming"
	},
	{
		eyebrow: "For the fussy ones",
		title: "Cat food they actually finish",
		body: "Hairball control, indoor formulas and freeze-dried treats cats can't resist.",
		cta: "Shop cat food",
		slug: "cat-food"
	}
];
function Home() {
	const { products, catalogLoading } = useStore();
	const [slide, setSlide] = useState(0);
	const [pet, setPet] = useState("dog");
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		const t = setInterval(() => setSlide((s) => (s + 1) % banners.length), 6e3);
		return () => clearInterval(t);
	}, []);
	useEffect(() => {
		setLoading(true);
		const t = setTimeout(() => setLoading(false), 450);
		return () => clearTimeout(t);
	}, [pet, catalogLoading]);
	const featured = useMemo(() => products.filter((p) => p.pet === pet).sort((a, b) => b.popularity - a.popularity).slice(0, 8), [pet, products]);
	const newArrivals = useMemo(() => products.filter((p) => p.isNew).slice(0, 4), [products]);
	const banner = banners[slide];
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("section", {
			className: "paw-grid border-b border-border",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-7xl items-center gap-5 px-3 py-6 sm:px-4 sm:py-10 lg:grid-cols-2 lg:gap-8 lg:py-16",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary",
						children: [
							/* @__PURE__ */ jsx(PawPrint, { size: 14 }),
							" ",
							banner.eyebrow
						]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-3 font-display text-[1.65rem] font-extrabold leading-[1.1] sm:mt-4 sm:text-5xl lg:text-6xl",
						children: banner.title
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-3 max-w-md text-sm text-muted-foreground sm:mt-4 sm:text-base",
						children: banner.body
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3",
						children: [/* @__PURE__ */ jsxs(Link, {
							to: "/category/$slug",
							params: { slug: banner.slug },
							className: "inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground transition-shadow hover:shadow-glow sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm",
							children: [
								banner.cta,
								" ",
								/* @__PURE__ */ jsx(ArrowRight, { size: 16 })
							]
						}), /* @__PURE__ */ jsx(Link, {
							to: "/grooming",
							className: "inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold hover:bg-secondary sm:rounded-2xl sm:px-6 sm:py-3 sm:text-sm",
							children: "Book grooming"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-8 flex items-center gap-3",
						children: [banners.map((_, i) => /* @__PURE__ */ jsx("button", {
							type: "button",
							"aria-label": `Go to slide ${i + 1}`,
							onClick: () => setSlide(i),
							className: `h-2 rounded-full transition-all ${i === slide ? "w-8 bg-primary" : "w-2 bg-border"}`
						}, i)), /* @__PURE__ */ jsxs("div", {
							className: "ml-auto flex gap-2",
							children: [/* @__PURE__ */ jsx(CarouselBtn, {
								label: "Previous banner",
								onClick: () => setSlide((s) => (s - 1 + banners.length) % banners.length),
								children: /* @__PURE__ */ jsx(ChevronLeft, { size: 18 })
							}), /* @__PURE__ */ jsx(CarouselBtn, {
								label: "Next banner",
								onClick: () => setSlide((s) => (s + 1) % banners.length),
								children: /* @__PURE__ */ jsx(ChevronRight, { size: 18 })
							})]
						})]
					})
				] }), /* @__PURE__ */ jsx("div", {
					className: "overflow-hidden rounded-3xl border border-border bg-card shadow-lift",
					children: /* @__PURE__ */ jsx("img", {
						src: hero_pets_default,
						alt: "A happy dog and cat side by side",
						width: 1600,
						height: 900,
						className: "h-full w-full object-cover"
					})
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "border-b border-border bg-card",
			children: /* @__PURE__ */ jsx("div", {
				className: "mx-auto grid max-w-7xl grid-cols-2 gap-3 px-3 py-4 sm:gap-4 sm:px-4 sm:py-6 lg:grid-cols-4",
				children: [
					{
						icon: Truck,
						title: "Free delivery",
						sub: "On orders above ₹499"
					},
					{
						icon: ShieldCheck,
						title: "Vet recommended",
						sub: "Reviewed by our vets"
					},
					{
						icon: Package,
						title: "Easy returns",
						sub: "7-day Tail Wag Guarantee"
					},
					{
						icon: Wallet,
						title: "COD available",
						sub: "19,000+ pincodes"
					}
				].map((t) => /* @__PURE__ */ jsxs("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ jsx("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary sm:h-11 sm:w-11 sm:rounded-2xl",
						children: /* @__PURE__ */ jsx(t.icon, { size: 20 })
					}), /* @__PURE__ */ jsxs("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ jsx("p", {
							className: "truncate text-xs font-bold sm:text-sm",
							children: t.title
						}), /* @__PURE__ */ jsx("p", {
							className: "truncate text-xs text-muted-foreground",
							children: t.sub
						})]
					})]
				}, t.title))
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Shop by Category",
			subtitle: "Everything for the four-legged member of the family",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4",
				children: [categories.map((c) => /* @__PURE__ */ jsxs(Link, {
					to: "/category/$slug",
					params: { slug: c.slug },
					className: "card-lift group overflow-hidden rounded-2xl border border-border bg-card",
					children: [/* @__PURE__ */ jsx("div", {
						className: "overflow-hidden bg-sand",
						children: /* @__PURE__ */ jsx("img", {
							src: c.image,
							alt: c.name,
							loading: "lazy",
							className: "aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
						})
					}), /* @__PURE__ */ jsxs("div", {
						className: "p-2.5 sm:p-4",
						children: [/* @__PURE__ */ jsx("p", {
							className: "font-display text-sm font-bold sm:text-base",
							children: c.name
						}), /* @__PURE__ */ jsx("p", {
							className: "text-xs text-muted-foreground",
							children: c.blurb
						})]
					})]
				}, c.slug)), /* @__PURE__ */ jsxs(Link, {
					to: "/grooming",
					className: "card-lift flex flex-col justify-center gap-2 rounded-2xl bg-primary p-5 text-primary-foreground",
					children: [
						/* @__PURE__ */ jsx(PawPrint, { size: 26 }),
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-lg font-bold",
							children: "Grooming at our store"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "text-xs opacity-90",
							children: "Book a bath, trim or full spa day"
						})
					]
				})]
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Best sellers",
			subtitle: "Loved by pet parents across the city",
			action: /* @__PURE__ */ jsx("div", {
				className: "inline-flex rounded-2xl border border-border bg-card p-1",
				children: ["dog", "cat"].map((p) => /* @__PURE__ */ jsx("button", {
					type: "button",
					onClick: () => setPet(p),
					className: `rounded-xl px-5 py-2 text-sm font-bold capitalize transition-colors ${pet === p ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`,
					children: p
				}, p))
			}),
			children: /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4",
				children: loading ? Array.from({ length: 8 }).map((_, i) => /* @__PURE__ */ jsx(ProductCardSkeleton, {}, i)) : featured.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Deals worth wagging about",
			children: /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 md:grid-cols-3",
				children: offers.map((o) => /* @__PURE__ */ jsxs("div", {
					className: `card-lift rounded-2xl border border-border p-6 ${o.tone === "primary" ? "bg-primary text-primary-foreground" : o.tone === "accent" ? "bg-accent text-accent-foreground" : "bg-sand"}`,
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-2xl font-extrabold",
							children: o.title
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm opacity-90",
							children: o.subtitle
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 inline-block rounded-lg border border-current/30 px-3 py-1 text-xs font-bold tracking-widest",
							children: o.code
						})
					]
				}, o.title))
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "New arrivals",
			subtitle: "Fresh off the shelf this week",
			children: /* @__PURE__ */ jsx("div", {
				className: "grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4",
				children: newArrivals.map((p) => /* @__PURE__ */ jsx(ProductCard, { product: p }, p.id))
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-7xl px-3 py-6 sm:px-4",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid items-center gap-6 overflow-hidden rounded-3xl border border-border bg-accent-soft p-6 md:grid-cols-[1fr_auto] md:p-10",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-accent-foreground",
						children: [/* @__PURE__ */ jsx(Stethoscope, { size: 14 }), " Vet Consultation"]
					}),
					/* @__PURE__ */ jsx("h2", {
						className: "mt-3 font-display text-2xl font-extrabold sm:text-3xl",
						children: "Talk to a vet in under 15 minutes"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-2 max-w-xl text-sm text-muted-foreground",
						children: "Video or in-store consults for skin issues, diet plans, vaccinations and second opinions. First consult free for Nuzz members."
					})
				] }), /* @__PURE__ */ jsxs(Link, {
					to: "/contact",
					className: "inline-flex items-center gap-2 rounded-2xl bg-foreground px-6 py-3 text-sm font-bold text-background",
					children: ["Book a consult ", /* @__PURE__ */ jsx(ArrowRight, { size: 16 })]
				})]
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Happy pets, happier parents",
			children: /* @__PURE__ */ jsx("div", {
				className: "no-scrollbar flex snap-x gap-4 overflow-x-auto pb-2",
				children: testimonials.map((t) => /* @__PURE__ */ jsxs("figure", {
					className: "w-[85%] shrink-0 snap-start rounded-2xl border border-border bg-card p-6 sm:w-[380px]",
					children: [
						/* @__PURE__ */ jsx(Stars, { rating: t.rating }),
						/* @__PURE__ */ jsxs("blockquote", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: [
								"“",
								t.text,
								"”"
							]
						}),
						/* @__PURE__ */ jsxs("figcaption", {
							className: "mt-4 flex items-center gap-3",
							children: [/* @__PURE__ */ jsx("span", {
								className: "grid h-10 w-10 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary",
								children: t.name.charAt(0)
							}), /* @__PURE__ */ jsxs("span", { children: [/* @__PURE__ */ jsx("span", {
								className: "block text-sm font-bold",
								children: t.name
							}), /* @__PURE__ */ jsx("span", {
								className: "text-xs text-muted-foreground",
								children: t.pet
							})] })]
						})
					]
				}, t.name))
			})
		}),
		/* @__PURE__ */ jsx(Section, {
			title: "Visit our store",
			subtitle: "Pick up supplies, book grooming, say hi to Momo the shop cat",
			children: /* @__PURE__ */ jsxs("div", {
				className: "grid gap-6 overflow-hidden rounded-3xl border border-border bg-card md:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", {
					className: "p-6 sm:p-8",
					children: [
						/* @__PURE__ */ jsxs("p", {
							className: "font-display text-xl font-bold",
							children: [STORE.name, " · Chittaranjan Park"]
						}),
						/* @__PURE__ */ jsxs("ul", {
							className: "mt-4 space-y-3 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ jsxs("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx(MapPin, {
									size: 16,
									className: "mt-0.5 shrink-0 text-primary"
								}), STORE.address]
							}), /* @__PURE__ */ jsxs("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ jsx(Clock, {
									size: 16,
									className: "mt-0.5 shrink-0 text-primary"
								}), STORE.hours]
							})]
						}),
						/* @__PURE__ */ jsxs("a", {
							href: "#",
							className: "mt-6 inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
							children: ["Get directions ", /* @__PURE__ */ jsx(ArrowRight, { size: 15 })]
						})
					]
				}), /* @__PURE__ */ jsxs("div", {
					className: "relative min-h-[220px] bg-sand",
					children: [/* @__PURE__ */ jsx("img", {
						src: grooming_hero_default,
						alt: "Inside the The Nuzz Story grooming studio",
						loading: "lazy",
						width: 1200,
						height: 700,
						className: "h-full w-full object-cover"
					}), /* @__PURE__ */ jsx("span", {
						className: "absolute bottom-4 left-4 rounded-xl bg-card px-3 py-2 text-xs font-semibold shadow-soft",
						children: "Map embed placeholder"
					})]
				})]
			})
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-7xl px-4 pb-14 pt-6",
			children: /* @__PURE__ */ jsxs("form", {
				onSubmit: (e) => {
					e.preventDefault();
					toast.success("You're on the list!", { description: "Watch out for treats in your inbox." });
					e.currentTarget.reset();
				},
				className: "grid items-center gap-5 rounded-3xl bg-foreground p-8 text-background md:grid-cols-2 md:p-12",
				children: [/* @__PURE__ */ jsxs("div", { children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-2xl font-extrabold sm:text-3xl",
					children: "Get ₹150 off your first order"
				}), /* @__PURE__ */ jsx("p", {
					className: "mt-2 text-sm opacity-80",
					children: "Join 40,000+ pet parents for care tips, restock alerts and early sale access."
				})] }), /* @__PURE__ */ jsxs("div", {
					className: "flex flex-col gap-3 sm:flex-row",
					children: [/* @__PURE__ */ jsx("input", {
						type: "email",
						required: true,
						placeholder: "you@example.com",
						"aria-label": "Email address",
						className: "w-full rounded-2xl border border-background/20 bg-background/10 px-4 py-3 text-sm outline-none placeholder:text-background/50 focus:border-background/50"
					}), /* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "shrink-0 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground",
						children: "Subscribe"
					})]
				})]
			})
		})
	] });
}
function CarouselBtn({ children, onClick, label }) {
	return /* @__PURE__ */ jsx("button", {
		type: "button",
		"aria-label": label,
		onClick,
		className: "grid h-9 w-9 place-items-center rounded-xl border border-border bg-card hover:bg-secondary",
		children
	});
}
function Section({ title, subtitle, action, children }) {
	return /* @__PURE__ */ jsxs("section", {
		className: "mx-auto max-w-7xl px-3 py-7 sm:px-4 sm:py-10",
		children: [/* @__PURE__ */ jsxs("div", {
			className: "mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3 sm:mb-6 sm:gap-4",
			children: [/* @__PURE__ */ jsxs("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-extrabold sm:text-3xl",
					children: title
				}), subtitle && /* @__PURE__ */ jsx("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: subtitle
				})]
			}), action]
		}), children]
	});
}
//#endregion
export { Home as component };
