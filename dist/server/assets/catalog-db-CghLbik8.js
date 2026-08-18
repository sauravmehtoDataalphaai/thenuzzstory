import { createClient } from "@supabase/supabase-js";
//#region src/assets/p-dogfood.jpg
var p_dogfood_default = "/assets/p-dogfood-DZPssGR1.jpg";
//#endregion
//#region src/assets/p-catfood.jpg
var p_catfood_default = "/assets/p-catfood-DfnZwJhU.jpg";
//#endregion
//#region src/assets/p-grooming.jpg
var p_grooming_default = "/assets/p-grooming-i2yISxd7.jpg";
//#endregion
//#region src/assets/p-toys.jpg
var p_toys_default = "/assets/p-toys-Ij5VSlrF.jpg";
//#endregion
//#region src/assets/p-accessories.jpg
var p_accessories_default = "/assets/p-accessories-CVyxet2n.jpg";
//#endregion
//#region src/assets/p-health.jpg
var p_health_default = "/assets/p-health-CCffJZ5P.jpg";
//#endregion
//#region src/data/catalog.ts
var CATEGORY_IMAGES = {
	"dog-food": p_dogfood_default,
	"cat-food": p_catfood_default,
	"dog-grooming": p_grooming_default,
	"cat-grooming": p_grooming_default,
	toys: p_toys_default,
	accessories: p_accessories_default,
	healthcare: p_health_default
};
var LOCAL_ASSETS = {
	"p-dogfood.jpg": p_dogfood_default,
	"p-catfood.jpg": p_catfood_default,
	"p-grooming.jpg": p_grooming_default,
	"p-toys.jpg": p_toys_default,
	"p-accessories.jpg": p_accessories_default,
	"p-health.jpg": p_health_default
};
/** Map Vite-dev paths stored in the DB (`/src/assets/p-dogfood.jpg`) to bundled URLs. */
function resolveCatalogImage(url, category) {
	if (!url) return category ? CATEGORY_IMAGES[category] : p_dogfood_default;
	if (/^https?:\/\//.test(url) || url.startsWith("/assets/")) return url;
	const filename = url.split("/").pop()?.split("?")[0] ?? "";
	if (LOCAL_ASSETS[filename]) return LOCAL_ASSETS[filename];
	return category ? CATEGORY_IMAGES[category] : url;
}
var categories = [
	{
		slug: "dog-food",
		name: "Dog Food",
		blurb: "Dry, wet & treats",
		image: p_dogfood_default,
		pet: "dog"
	},
	{
		slug: "cat-food",
		name: "Cat Food",
		blurb: "Kibble, gravy & pâté",
		image: p_catfood_default,
		pet: "cat"
	},
	{
		slug: "dog-grooming",
		name: "Dog Grooming",
		blurb: "Shampoo & brushes",
		image: p_grooming_default,
		pet: "dog"
	},
	{
		slug: "cat-grooming",
		name: "Cat Grooming",
		blurb: "Wipes & deshedders",
		image: p_grooming_default,
		pet: "cat"
	},
	{
		slug: "toys",
		name: "Toys",
		blurb: "Chew, fetch & play",
		image: p_toys_default,
		pet: "both"
	},
	{
		slug: "accessories",
		name: "Accessories",
		blurb: "Collars, bowls & beds",
		image: p_accessories_default,
		pet: "both"
	},
	{
		slug: "healthcare",
		name: "Healthcare",
		blurb: "Supplements & care",
		image: p_health_default,
		pet: "both"
	}
];
var FOOD_VARIANTS = [
	{
		label: "1 kg",
		priceDelta: 0
	},
	{
		label: "3 kg",
		priceDelta: 1150
	},
	{
		label: "7 kg",
		priceDelta: 2600
	}
];
var ML_VARIANTS = [{
	label: "200 ml",
	priceDelta: 0
}, {
	label: "500 ml",
	priceDelta: 210
}];
var SIZE_VARIANTS = [
	{
		label: "Small",
		priceDelta: 0
	},
	{
		label: "Medium",
		priceDelta: 180
	},
	{
		label: "Large",
		priceDelta: 340
	}
];
var SINGLE = [{
	label: "Standard pack",
	priceDelta: 0
}];
var seeds = [
	[
		"Chicken & Rice Adult Dry Food",
		"Barkwell",
		"dog",
		"dog-food",
		"Dry Food",
		1249,
		1599,
		4.6,
		412
	],
	[
		"Grain-Free Salmon Kibble",
		"Nutrikind",
		"dog",
		"dog-food",
		"Dry Food",
		1899,
		2450,
		4.8,
		268
	],
	[
		"Puppy Starter Chicken Chunks",
		"Barkwell",
		"dog",
		"dog-food",
		"Wet Food",
		899,
		1150,
		4.4,
		195
	],
	[
		"Lamb & Pumpkin Wet Gravy",
		"Feastly",
		"dog",
		"dog-food",
		"Wet Food",
		649,
		799,
		4.3,
		143
	],
	[
		"Chicken Jerky Training Treats",
		"Snoutly",
		"dog",
		"dog-food",
		"Treats",
		399,
		549,
		4.7,
		620
	],
	[
		"Senior Joint-Care Dry Food",
		"Nutrikind",
		"dog",
		"dog-food",
		"Dry Food",
		1749,
		2199,
		4.5,
		187
	],
	[
		"Peanut Butter Biscuit Bites",
		"Snoutly",
		"dog",
		"dog-food",
		"Treats",
		299,
		399,
		4.2,
		331
	],
	[
		"High-Protein Ocean Fish Kibble",
		"Feastly",
		"dog",
		"dog-food",
		"Dry Food",
		1549,
		1999,
		4.6,
		221
	],
	[
		"Tuna & Salmon Adult Dry Food",
		"Whiskerly",
		"cat",
		"cat-food",
		"Dry Food",
		1099,
		1399,
		4.7,
		356
	],
	[
		"Kitten Chicken Mousse Pack",
		"Whiskerly",
		"cat",
		"cat-food",
		"Wet Food",
		749,
		949,
		4.5,
		208
	],
	[
		"Hairball Control Kibble",
		"Purrfect Co",
		"cat",
		"cat-food",
		"Dry Food",
		1299,
		1699,
		4.4,
		176
	],
	[
		"Ocean Fish Gravy Pouches",
		"Feastly",
		"cat",
		"cat-food",
		"Wet Food",
		599,
		799,
		4.3,
		264
	],
	[
		"Freeze-Dried Chicken Treats",
		"Purrfect Co",
		"cat",
		"cat-food",
		"Treats",
		449,
		599,
		4.8,
		402
	],
	[
		"Indoor Weight-Care Formula",
		"Whiskerly",
		"cat",
		"cat-food",
		"Dry Food",
		1399,
		1799,
		4.2,
		121
	],
	[
		"Oatmeal Soothing Dog Shampoo",
		"Fluffly",
		"dog",
		"dog-grooming",
		"Shampoo",
		549,
		749,
		4.6,
		289
	],
	[
		"Tearless Puppy Shampoo",
		"Fluffly",
		"dog",
		"dog-grooming",
		"Shampoo",
		479,
		649,
		4.4,
		152
	],
	[
		"Slicker Deshedding Brush",
		"Groomio",
		"dog",
		"dog-grooming",
		"Brush",
		699,
		999,
		4.5,
		340
	],
	[
		"Paw Balm & Nose Butter",
		"Fluffly",
		"dog",
		"dog-grooming",
		"Skin Care",
		399,
		549,
		4.7,
		176
	],
	[
		"Waterless Cat Foam Cleanser",
		"Purrfect Co",
		"cat",
		"cat-grooming",
		"Shampoo",
		529,
		699,
		4.3,
		133
	],
	[
		"Gentle Cat Grooming Glove",
		"Groomio",
		"cat",
		"cat-grooming",
		"Brush",
		349,
		499,
		4.2,
		219
	],
	[
		"Cat Deshedding Comb Pro",
		"Groomio",
		"cat",
		"cat-grooming",
		"Brush",
		599,
		849,
		4.6,
		187
	],
	[
		"Cat Wipes (80 pulls)",
		"Fluffly",
		"cat",
		"cat-grooming",
		"Skin Care",
		299,
		399,
		4.1,
		96
	],
	[
		"Tough Rope Tug Toy",
		"Playpaws",
		"dog",
		"toys",
		"Chew Toy",
		349,
		499,
		4.5,
		512
	],
	[
		"Squeaky Rubber Fetch Ball",
		"Playpaws",
		"dog",
		"toys",
		"Fetch",
		249,
		349,
		4.4,
		388
	],
	[
		"Catnip Teaser Wand",
		"Playpaws",
		"cat",
		"toys",
		"Interactive",
		299,
		449,
		4.7,
		274
	],
	[
		"Crinkle Mice Trio",
		"Purrfect Co",
		"cat",
		"toys",
		"Interactive",
		199,
		299,
		4.3,
		168
	],
	[
		"Padded Coral Collar & Leash",
		"Trotters",
		"dog",
		"accessories",
		"Walk Gear",
		1099,
		1499,
		4.6,
		231
	],
	[
		"Anti-Skid Steel Bowl Set",
		"Trotters",
		"dog",
		"accessories",
		"Feeding",
		799,
		1099,
		4.5,
		190
	],
	[
		"Cloud Cuddle Pet Bed",
		"Trotters",
		"cat",
		"accessories",
		"Bedding",
		2199,
		2999,
		4.8,
		145
	],
	[
		"Breakaway Cat Collar + Bell",
		"Trotters",
		"cat",
		"accessories",
		"Walk Gear",
		449,
		649,
		4.2,
		118
	],
	[
		"Multivitamin Chews for Dogs",
		"VetNest",
		"dog",
		"healthcare",
		"Supplement",
		899,
		1199,
		4.6,
		260
	],
	[
		"Tick & Flea Spot-On",
		"VetNest",
		"dog",
		"healthcare",
		"Parasite Care",
		649,
		899,
		4.4,
		205
	],
	[
		"Omega-3 Skin & Coat Oil",
		"VetNest",
		"cat",
		"healthcare",
		"Supplement",
		749,
		999,
		4.5,
		173
	],
	[
		"Probiotic Digestive Powder",
		"VetNest",
		"cat",
		"healthcare",
		"Supplement",
		699,
		949,
		4.3,
		128
	]
];
var slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
var products = seeds.map((s, i) => {
	const [name, brand, pet, category, type, price, mrp, rating, reviews] = s;
	const isFood = category === "dog-food" || category === "cat-food";
	const isLiquid = type === "Shampoo" || type === "Skin Care" || type === "Supplement";
	return {
		id: `P${1e3 + i}`,
		slug: slugify(name),
		name,
		brand,
		pet,
		category,
		type,
		price,
		mrp,
		rating,
		reviews,
		image: CATEGORY_IMAGES[category],
		variants: isFood ? FOOD_VARIANTS : isLiquid ? ML_VARIANTS : category === "accessories" ? SIZE_VARIANTS : SINGLE,
		inStock: i % 11 !== 5,
		isNew: i % 7 === 3,
		popularity: reviews + Math.round(rating * 40),
		subscribable: isFood,
		lifeStage: name.includes("Puppy") ? "puppy" : name.includes("Kitten") ? "kitten" : name.includes("Senior") ? "senior" : "all",
		description: `${name} from ${brand} is crafted for ${pet === "dog" ? "dogs" : "cats"} who deserve better. Made in small batches with responsibly sourced ingredients, no artificial colours, and a recipe reviewed by in-house veterinarians. Loved by ${reviews}+ pet parents at our store.`,
		specs: [
			{
				label: "Brand",
				value: brand
			},
			{
				label: "Suitable for",
				value: pet === "dog" ? "Dogs" : "Cats"
			},
			{
				label: "Product type",
				value: type
			},
			{
				label: "Shelf life",
				value: "18 months from manufacture"
			},
			{
				label: "Country of origin",
				value: "India"
			}
		],
		ingredients: isFood ? "Deboned chicken, brown rice, oats, chicken fat, dried egg, pumpkin, flaxseed, salmon oil (source of Omega-3), chicory root, vitamins & chelated minerals, taurine, natural rosemary extract." : "Purified water, plant-derived surfactants, aloe vera extract, oatmeal protein, glycerin, vitamin E, chamomile oil, natural fragrance. Free from parabens, sulphates and artificial dyes."
	};
});
var brands = Array.from(new Set(products.map((p) => p.brand))).sort();
var productTypes = Array.from(new Set(products.map((p) => p.type))).sort();
var coupons = [
	{
		code: "PAW20",
		label: "Flat 20% off on orders above ₹999",
		type: "percent",
		value: 20,
		minCart: 999
	},
	{
		code: "NEWPET",
		label: "₹150 off your first order",
		type: "flat",
		value: 150,
		minCart: 499
	},
	{
		code: "GROOM10",
		label: "10% off grooming essentials",
		type: "percent",
		value: 10,
		minCart: 0
	}
];
var offers = [
	{
		title: "Flat 20% off",
		subtitle: "On all dry food above ₹999",
		code: "PAW20",
		tone: "primary"
	},
	{
		title: "Buy 1 Get 1",
		subtitle: "On treats & training snacks",
		code: "BOGO",
		tone: "accent"
	},
	{
		title: "Free grooming kit",
		subtitle: "On every order above ₹999",
		code: "AUTO",
		tone: "sand"
	}
];
var testimonials = [
	{
		name: "Ananya Rao",
		pet: "Simba · Golden Retriever",
		text: "Simba's coat has never looked better. Delivery was next-day and the free grooming kit was such a lovely surprise.",
		rating: 5
	},
	{
		name: "Rohit Menon",
		pet: "Mishti · Indie Cat",
		text: "The subscribe & save option means I never run out of kibble. Support even helped me switch the flavour mid-cycle.",
		rating: 5
	},
	{
		name: "Fatima Sheikh",
		pet: "Coco · Shih Tzu",
		text: "Booked a spa package at the store through the site. Slot picker was simple and Coco came back smelling amazing.",
		rating: 4
	},
	{
		name: "Dev Patel",
		pet: "Bruno · Labrador",
		text: "Genuine products, vet-reviewed recommendations and honest pricing. This is now my only pet store.",
		rating: 5
	}
];
var groomingServices = [
	{
		id: "bath-brush",
		name: "Bath & Brush",
		price: 799,
		duration: "45 min",
		description: "Warm-water bath with pH-balanced shampoo, blow dry and full-coat brush out."
	},
	{
		id: "haircut",
		name: "Haircut & Styling",
		price: 1299,
		duration: "75 min",
		description: "Breed-specific trim or a custom style, finished with sanitary and paw-pad tidy-up."
	},
	{
		id: "nails",
		name: "Nail Trimming",
		price: 349,
		duration: "20 min",
		description: "Gentle nail clip and file with treats between every paw. Great for anxious pets."
	},
	{
		id: "ears",
		name: "Ear Cleaning",
		price: 399,
		duration: "20 min",
		description: "Vet-approved ear solution, gentle wipe-down and a quick health check for infection."
	},
	{
		id: "spa",
		name: "Signature Spa Package",
		price: 2199,
		duration: "2 hrs",
		description: "Bath, haircut, nails, ears, teeth brushing, de-shed treatment and a paw balm finish."
	}
];
var timeSlots = [
	"10:00 AM",
	"11:30 AM",
	"01:00 PM",
	"02:30 PM",
	"04:00 PM",
	"05:30 PM"
];
var faqs = [
	{
		q: "How fast will my order arrive?",
		a: "Orders placed before 4 PM ship the same day. Metro cities receive delivery in 1–2 days, rest of India in 3–5 days."
	},
	{
		q: "Do you offer Cash on Delivery?",
		a: "Yes, COD is available on orders up to ₹5,000 across 19,000+ pincodes. A ₹29 handling fee applies."
	},
	{
		q: "Are the products genuine?",
		a: "Every product is sourced directly from brands or their authorised distributors, with batch and expiry checks at our warehouse."
	},
	{
		q: "How does Subscribe & Save work?",
		a: "Choose a monthly cycle on any food product and save 10% on every delivery. Pause, skip or cancel anytime from your account."
	},
	{
		q: "Can I return an opened food bag?",
		a: "If your pet doesn't like it, tell us within 7 days. We'll refund or swap the flavour once — our Tail Wag Guarantee."
	},
	{
		q: "Do you groom cats too?",
		a: "Yes. Our cat grooming is handled by feline-trained groomers in a separate quiet room, by appointment only."
	}
];
var STORE = {
	name: "The Nuzz Story",
	phone: "+91 98450 11223",
	email: "hello@thenuzzstory.in",
	address: "Market No 1, 40/42 UGF, Main Rd, opposite to Looks Salon, Pocket 40, Chittaranjan Park, New Delhi, Delhi 110019",
	hours: "Mon–Sat 9:30 AM – 9:00 PM · Sun 10:00 AM – 6:00 PM",
	freeShippingAbove: 499,
	deliveryFee: 49
};
var money = (n) => `₹${Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
//#endregion
//#region src/lib/supabase.ts
var url = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_URL": "https://ittmbsqsgndgmwmtavim.supabase.co"
}["VITE_SUPABASE_URL"];
var publishableKey = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_URL": "https://ittmbsqsgndgmwmtavim.supabase.co"
}["VITE_SUPABASE_PUBLISHABLE_KEY"] || {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_ANON_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_ctUdGpQ6Eijw1d0tbcHjnQ_5l970XSZ",
	"VITE_SUPABASE_URL": "https://ittmbsqsgndgmwmtavim.supabase.co"
}["VITE_SUPABASE_ANON_KEY"];
var isSupabaseConfigured = Boolean(url && publishableKey);
function createSupabase() {
	if (!url || !publishableKey) return createClient("https://placeholder.supabase.co", "placeholder-key");
	return createClient(url, publishableKey, { auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true
	} });
}
var supabase = createSupabase();
//#endregion
//#region src/lib/catalog-db.ts
function parseProductRow(row) {
	const r = row;
	return {
		...r,
		variants: r.variants ?? [],
		specs: r.specs ?? []
	};
}
function rowToProduct(row) {
	return {
		id: row.id,
		slug: row.slug,
		name: row.name,
		brand: row.brand,
		pet: row.pet,
		category: row.category,
		type: row.type,
		price: Number(row.price),
		mrp: Number(row.mrp),
		rating: Number(row.rating),
		reviews: row.reviews,
		image: resolveCatalogImage(row.image_url, row.category),
		variants: row.variants ?? [],
		inStock: row.in_stock,
		isNew: row.is_new,
		popularity: row.popularity,
		subscribable: row.subscribable,
		lifeStage: row.life_stage,
		description: row.description,
		specs: row.specs ?? [],
		ingredients: row.ingredients
	};
}
function productToRow(p, active = true) {
	return {
		id: p.id,
		slug: p.slug,
		name: p.name,
		brand: p.brand,
		pet: p.pet,
		category: p.category,
		type: p.type,
		price: p.price,
		mrp: p.mrp,
		rating: p.rating,
		reviews: p.reviews,
		image_url: typeof p.image === "string" ? p.image : "",
		variants: p.variants,
		in_stock: p.inStock,
		is_new: p.isNew,
		popularity: p.popularity,
		subscribable: p.subscribable,
		life_stage: p.lifeStage,
		description: p.description,
		specs: p.specs,
		ingredients: p.ingredients,
		active
	};
}
function rowToCoupon(row) {
	return {
		code: row.code,
		label: row.label,
		type: row.type,
		value: Number(row.value),
		minCart: Number(row.min_cart)
	};
}
function couponToRow(c, active = true) {
	return {
		code: c.code.toUpperCase(),
		label: c.label,
		type: c.type,
		value: c.value,
		min_cart: c.minCart,
		active
	};
}
async function fetchCatalogProducts(includeInactive = false) {
	if (!isSupabaseConfigured) return products;
	let query = supabase.from("products").select("*").order("name");
	if (!includeInactive) query = query.eq("active", true);
	const { data, error } = await query;
	if (error || !data?.length) return products;
	return data.map((row) => rowToProduct(parseProductRow(row)));
}
async function fetchProductBySlug(slug) {
	if (!isSupabaseConfigured) return products.find((p) => p.slug === slug) ?? null;
	const { data, error } = await supabase.from("products").select("*").eq("slug", slug).eq("active", true).maybeSingle();
	if (error || !data) return products.find((p) => p.slug === slug) ?? null;
	return rowToProduct(parseProductRow(data));
}
async function fetchCatalogCoupons() {
	if (!isSupabaseConfigured) return coupons;
	const { data, error } = await supabase.from("coupons").select("*").eq("active", true);
	if (error || !data?.length) return coupons;
	return data.map((row) => rowToCoupon(row));
}
//#endregion
export { timeSlots as C, testimonials as S, money as _, parseProductRow as a, products as b, rowToProduct as c, STORE as d, brands as f, groomingServices as g, faqs as h, fetchProductBySlug as i, isSupabaseConfigured as l, coupons as m, fetchCatalogCoupons as n, productToRow as o, categories as p, fetchCatalogProducts as r, rowToCoupon as s, couponToRow as t, supabase as u, offers as v, resolveCatalogImage as x, productTypes as y };
