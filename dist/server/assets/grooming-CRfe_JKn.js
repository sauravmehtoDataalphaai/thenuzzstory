import { C as timeSlots, _ as money, g as groomingServices } from "./catalog-db-CghLbik8.js";
import { t as grooming_hero_default } from "./grooming-hero-CIEd6lu0.js";
import { useState } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
import { Clock, HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/grooming.tsx?tsr-split=component
function Grooming() {
	const [service, setService] = useState(groomingServices[0].id);
	const [slot, setSlot] = useState(timeSlots[0]);
	return /* @__PURE__ */ jsxs("div", { children: [
		/* @__PURE__ */ jsx("section", {
			className: "paw-grid border-b border-border",
			children: /* @__PURE__ */ jsxs("div", {
				className: "mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 lg:grid-cols-2",
				children: [/* @__PURE__ */ jsxs("div", { children: [
					/* @__PURE__ */ jsxs("span", {
						className: "inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-bold uppercase text-primary",
						children: [/* @__PURE__ */ jsx(Sparkles, { size: 14 }), " In-store grooming"]
					}),
					/* @__PURE__ */ jsx("h1", {
						className: "mt-4 font-display text-4xl font-extrabold sm:text-5xl",
						children: "A spa day, tail-approved"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-4 max-w-md text-sm text-muted-foreground",
						children: "Fear-free handling, breed-specific styling and pet-safe products. Cats groomed in a separate quiet room by feline-trained specialists."
					})
				] }), /* @__PURE__ */ jsx("img", {
					src: grooming_hero_default,
					alt: "A small dog being groomed",
					loading: "lazy",
					width: 1200,
					height: 700,
					className: "rounded-3xl border border-border object-cover shadow-lift"
				})]
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			className: "mx-auto max-w-7xl px-4 py-12",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-2xl font-extrabold sm:text-3xl",
				children: "Our services"
			}), /* @__PURE__ */ jsx("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: groomingServices.map((s) => /* @__PURE__ */ jsxs("article", {
					className: "card-lift flex flex-col rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ jsx("p", {
							className: "font-display text-lg font-bold",
							children: s.name
						}),
						/* @__PURE__ */ jsxs("p", {
							className: "mt-1 flex items-center gap-1.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ jsx(Clock, { size: 13 }),
								" ",
								s.duration
							]
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 flex-1 text-sm text-muted-foreground",
							children: s.description
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-4 font-display text-2xl font-extrabold",
							children: money(s.price)
						}),
						/* @__PURE__ */ jsx("a", {
							href: "#book",
							onClick: () => setService(s.id),
							className: "mt-3 rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-bold text-primary-foreground hover:shadow-glow",
							children: "Book Now"
						})
					]
				}, s.id))
			})]
		}),
		/* @__PURE__ */ jsx("section", {
			className: "mx-auto max-w-7xl px-4 pb-4",
			children: /* @__PURE__ */ jsx("div", {
				className: "grid gap-4 sm:grid-cols-3",
				children: [
					{
						icon: ShieldCheck,
						t: "Certified groomers",
						d: "Every groomer is trained in fear-free handling and pet first aid."
					},
					{
						icon: HeartHandshake,
						t: "One pet at a time",
						d: "No cages, no queues — your pet gets undivided attention."
					},
					{
						icon: Sparkles,
						t: "Pet-safe products",
						d: "Sulphate-free, pH-balanced shampoos suited to coat and skin type."
					}
				].map((x) => /* @__PURE__ */ jsxs("div", {
					className: "rounded-2xl border border-border bg-sand p-6",
					children: [
						/* @__PURE__ */ jsx(x.icon, {
							size: 22,
							className: "text-primary"
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-3 font-display text-lg font-bold",
							children: x.t
						}),
						/* @__PURE__ */ jsx("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: x.d
						})
					]
				}, x.t))
			})
		}),
		/* @__PURE__ */ jsxs("section", {
			id: "book",
			className: "mx-auto max-w-3xl px-4 py-12",
			children: [/* @__PURE__ */ jsx("h2", {
				className: "font-display text-2xl font-extrabold sm:text-3xl",
				children: "Book an appointment"
			}), /* @__PURE__ */ jsxs("form", {
				className: "mt-6 grid gap-4 rounded-3xl border border-border bg-card p-6 sm:grid-cols-2",
				onSubmit: (e) => {
					e.preventDefault();
					toast.success("Booking request sent!", { description: "We'll confirm your slot on WhatsApp within an hour." });
					e.currentTarget.reset();
				},
				children: [
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Pet type"
						}), /* @__PURE__ */ jsxs("select", {
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
							children: [/* @__PURE__ */ jsx("option", { children: "Dog" }), /* @__PURE__ */ jsx("option", { children: "Cat" })]
						})]
					}),
					/* @__PURE__ */ jsx(Input, {
						label: "Breed",
						placeholder: "e.g. Shih Tzu"
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm sm:col-span-2",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Service"
						}), /* @__PURE__ */ jsx("select", {
							value: service,
							onChange: (e) => setService(e.target.value),
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
							children: groomingServices.map((s) => /* @__PURE__ */ jsxs("option", {
								value: s.id,
								children: [
									s.name,
									" — ",
									money(s.price)
								]
							}, s.id))
						})]
					}),
					/* @__PURE__ */ jsxs("label", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Preferred date"
						}), /* @__PURE__ */ jsx("input", {
							type: "date",
							required: true,
							className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
						})]
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "text-sm",
						children: [/* @__PURE__ */ jsx("span", {
							className: "text-xs font-semibold text-muted-foreground",
							children: "Time slot"
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-1 flex flex-wrap gap-2",
							children: timeSlots.map((t) => /* @__PURE__ */ jsx("button", {
								type: "button",
								onClick: () => setSlot(t),
								className: `rounded-full border px-3 py-1.5 text-xs font-semibold ${slot === t ? "border-primary bg-primary-soft text-primary" : "border-border"}`,
								children: t
							}, t))
						})]
					}),
					/* @__PURE__ */ jsx(Input, {
						label: "Your name",
						placeholder: "Full name"
					}),
					/* @__PURE__ */ jsx(Input, {
						label: "Phone number",
						placeholder: "10-digit mobile"
					}),
					/* @__PURE__ */ jsx("button", {
						type: "submit",
						className: "rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground sm:col-span-2",
						children: "Request booking"
					})
				]
			})]
		})
	] });
}
function Input({ label, placeholder }) {
	return /* @__PURE__ */ jsxs("label", {
		className: "text-sm",
		children: [/* @__PURE__ */ jsx("span", {
			className: "text-xs font-semibold text-muted-foreground",
			children: label
		}), /* @__PURE__ */ jsx("input", {
			required: true,
			placeholder,
			className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
		})]
	});
}
//#endregion
export { Grooming as component };
