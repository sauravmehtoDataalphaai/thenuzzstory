import { a as rupeesFromPoints } from "./loyalty-rGqQQJ4S.js";
import { u as useStore } from "./router-Cn9sBPaq.js";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { Gift, PawPrint, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
//#region src/routes/account.profile.tsx?tsr-split=component
function Profile() {
	const { user, pets, addPet, removePet, addresses, removeAddress, loyaltyPoints, updateUserProfile } = useStore();
	const [name, setName] = useState("");
	const [breed, setBreed] = useState("");
	const [age, setAge] = useState("");
	const [type, setType] = useState("dog");
	const [profileName, setProfileName] = useState("");
	const [profilePhone, setProfilePhone] = useState("");
	const [saving, setSaving] = useState(false);
	useEffect(() => {
		if (!user) return;
		setProfileName(user.name);
		setProfilePhone(user.phone);
	}, [user]);
	if (!user) return /* @__PURE__ */ jsxs("div", {
		className: "rounded-3xl border border-border bg-card p-8 text-center",
		children: [
			/* @__PURE__ */ jsx("h1", {
				className: "font-display text-2xl font-extrabold",
				children: "Profile"
			}),
			/* @__PURE__ */ jsx("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Sign in to sync your profile across devices."
			}),
			/* @__PURE__ */ jsx(Link, {
				to: "/account/login",
				className: "mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground",
				children: "Login / Sign up"
			})
		]
	});
	return /* @__PURE__ */ jsxs("div", {
		className: "grid gap-6",
		children: [
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ jsx("h1", {
						className: "font-display text-2xl font-extrabold",
						children: "Profile"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: user.email
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-5 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary-soft via-sand to-card p-5",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ jsxs("div", { children: [
								/* @__PURE__ */ jsxs("p", {
									className: "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary",
									children: [/* @__PURE__ */ jsx(PawPrint, { size: 14 }), " Paw Points"]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "mt-2 font-display text-4xl font-extrabold leading-none",
									children: loyaltyPoints
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-2 text-sm font-semibold text-muted-foreground",
									children: [
										"Redeemable for ₹",
										rupeesFromPoints(loyaltyPoints),
										" at checkout"
									]
								})
							] }), /* @__PURE__ */ jsx("span", {
								className: "grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-sm",
								children: /* @__PURE__ */ jsx(Gift, { size: 22 })
							})]
						}), /* @__PURE__ */ jsx("div", {
							className: "mt-4 grid gap-2 sm:grid-cols-3",
							children: [
								{
									icon: Gift,
									title: "Welcome bonus",
									body: "+100 on signup"
								},
								{
									icon: ShoppingBag,
									title: "Every order",
									body: "+50 Paw Points"
								},
								{
									icon: PawPrint,
									title: "Redeem",
									body: "100 pts = ₹10"
								}
							].map((item) => /* @__PURE__ */ jsxs("div", {
								className: "rounded-xl bg-background/70 px-3 py-2.5",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "flex items-center gap-1.5 text-xs font-bold",
									children: [/* @__PURE__ */ jsx(item.icon, {
										size: 13,
										className: "text-primary"
									}), item.title]
								}), /* @__PURE__ */ jsx("p", {
									className: "mt-0.5 text-xs text-muted-foreground",
									children: item.body
								})]
							}, item.title))
						})]
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "mt-5 grid gap-3 sm:grid-cols-2",
						onSubmit: (e) => {
							e.preventDefault();
							(async () => {
								setSaving(true);
								try {
									await updateUserProfile({
										name: profileName.trim(),
										phone: profilePhone.trim()
									});
								} catch (err) {
									toast.error(err instanceof Error ? err.message : "Could not update profile");
								} finally {
									setSaving(false);
								}
							})();
						},
						children: [
							/* @__PURE__ */ jsxs("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Full name"
								}), /* @__PURE__ */ jsx("input", {
									required: true,
									value: profileName,
									onChange: (e) => setProfileName(e.target.value),
									className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
								})]
							}),
							/* @__PURE__ */ jsxs("label", {
								className: "text-sm",
								children: [/* @__PURE__ */ jsx("span", {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Phone"
								}), /* @__PURE__ */ jsx("input", {
									required: true,
									value: profilePhone,
									onChange: (e) => setProfilePhone(e.target.value),
									className: "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
								})]
							}),
							/* @__PURE__ */ jsx("button", {
								type: "submit",
								disabled: saving,
								className: "rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-2 disabled:opacity-60",
								children: saving ? "Saving…" : "Save profile"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ jsx("h2", {
						className: "font-display text-xl font-bold",
						children: "Pet profiles"
					}),
					/* @__PURE__ */ jsx("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "We use these to personalise food and grooming recommendations."
					}),
					/* @__PURE__ */ jsxs("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-2",
						children: [pets.map((p) => /* @__PURE__ */ jsxs("div", {
							className: "flex items-start justify-between gap-3 rounded-2xl border border-border bg-sand p-4",
							children: [/* @__PURE__ */ jsxs("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ jsxs("p", {
									className: "truncate font-display text-base font-bold",
									children: [
										p.name,
										" (",
										p.type,
										")"
									]
								}), /* @__PURE__ */ jsxs("p", {
									className: "text-xs text-muted-foreground",
									children: [
										p.breed,
										" · ",
										p.age
									]
								})]
							}), /* @__PURE__ */ jsx("button", {
								onClick: () => removePet(p.id),
								className: "shrink-0 text-muted-foreground hover:text-destructive",
								"aria-label": `Remove ${p.name}`,
								children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
							})]
						}, p.id)), pets.length === 0 && /* @__PURE__ */ jsx("p", {
							className: "text-sm text-muted-foreground",
							children: "No pets added yet."
						})]
					}),
					/* @__PURE__ */ jsxs("form", {
						className: "mt-5 grid gap-3 sm:grid-cols-4",
						onSubmit: (e) => {
							e.preventDefault();
							addPet({
								name,
								type,
								breed,
								age
							});
							toast.success(`${name} added to your pack`);
							setName("");
							setBreed("");
							setAge("");
						},
						children: [
							/* @__PURE__ */ jsx("input", {
								required: true,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "Pet name",
								className: "rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
							}),
							/* @__PURE__ */ jsxs("select", {
								value: type,
								onChange: (e) => setType(e.target.value),
								className: "rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary",
								children: [/* @__PURE__ */ jsx("option", {
									value: "dog",
									children: "Dog"
								}), /* @__PURE__ */ jsx("option", {
									value: "cat",
									children: "Cat"
								})]
							}),
							/* @__PURE__ */ jsx("input", {
								required: true,
								value: breed,
								onChange: (e) => setBreed(e.target.value),
								placeholder: "Breed",
								className: "rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
							}),
							/* @__PURE__ */ jsx("input", {
								required: true,
								value: age,
								onChange: (e) => setAge(e.target.value),
								placeholder: "Age (e.g. 2 yrs)",
								className: "rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
							}),
							/* @__PURE__ */ jsxs("button", {
								type: "submit",
								className: "inline-flex items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground sm:col-span-4",
								children: [/* @__PURE__ */ jsx(Plus, { size: 15 }), " Add pet"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ jsxs("div", {
				className: "rounded-3xl border border-border bg-card p-6",
				children: [/* @__PURE__ */ jsx("h2", {
					className: "font-display text-xl font-bold",
					children: "Saved addresses"
				}), /* @__PURE__ */ jsxs("div", {
					className: "mt-4 grid gap-3 sm:grid-cols-2",
					children: [addresses.map((a) => /* @__PURE__ */ jsxs("div", {
						className: "flex items-start justify-between gap-3 rounded-2xl border border-border p-4 text-sm",
						children: [/* @__PURE__ */ jsxs("div", {
							className: "min-w-0",
							children: [
								/* @__PURE__ */ jsxs("p", {
									className: "font-bold",
									children: [
										a.name,
										" ",
										/* @__PURE__ */ jsx("span", {
											className: "rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase",
											children: a.type
										})
									]
								}),
								/* @__PURE__ */ jsxs("p", {
									className: "mt-1 text-muted-foreground",
									children: [
										a.address,
										", ",
										a.city,
										", ",
										a.state,
										" — ",
										a.pincode
									]
								}),
								/* @__PURE__ */ jsx("p", {
									className: "text-muted-foreground",
									children: a.phone
								})
							]
						}), /* @__PURE__ */ jsx("button", {
							onClick: () => void removeAddress(a.id),
							className: "shrink-0 text-muted-foreground hover:text-destructive",
							"aria-label": "Remove address",
							children: /* @__PURE__ */ jsx(Trash2, { size: 16 })
						})]
					}, a.id)), addresses.length === 0 && /* @__PURE__ */ jsx("p", {
						className: "text-sm text-muted-foreground",
						children: "No saved addresses. Add one at checkout."
					})]
				})]
			})
		]
	});
}
//#endregion
export { Profile as component };
