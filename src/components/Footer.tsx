import { Link } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { categories, STORE } from "@/data/catalog";

function InstagramIcon({ size = 20, strokeWidth = 2.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth={strokeWidth} />
      <circle cx="17.5" cy="6.5" r="1.35" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
    </svg>
  );
}

const socialLinks = [
  {
    Icon: InstagramIcon,
    href: "https://www.instagram.com/thenuzzstory/",
    label: "Instagram",
  },
  {
    Icon: FacebookIcon,
    href: "https://www.facebook.com/people/The-Nuzz-Story/61590037156313/",
    label: "Facebook",
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-10 border-t border-[#0d1b4b] bg-[rgb(13,27,75)] text-[#c79236] sm:mt-16">
      <div className="mx-auto grid max-w-7xl gap-6 px-3 py-8 sm:px-4 sm:py-12 md:grid-cols-2 md:gap-10 lg:grid-cols-4">
        <div>
          <BrandLockup />
          <p className="mt-3 max-w-xs text-xs italic text-[#c79236]/80 sm:text-sm">
            A neighbourhood pet store gone online — genuine food, gentle grooming and vet-reviewed
            care for dogs and cats.
          </p>
          <div className="mt-4 flex gap-2">
            {socialLinks.map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-xl border border-[#c79236]/40 text-[#c79236] transition-colors hover:bg-[#c79236]/10"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-[#c79236]">Shop</h4>
          <ul className="mt-3 space-y-1.5 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-2 sm:text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="hover:opacity-80"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-[#c79236]">Quick links</h4>
          <ul className="mt-3 space-y-1.5 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-2 sm:text-sm">
            <li><Link to="/about" className="hover:opacity-80">About Us</Link></li>
            <li><Link to="/grooming" className="hover:opacity-80">Grooming Services</Link></li>
            <li><Link to="/contact" className="hover:opacity-80">Contact Us</Link></li>
            <li><Link to="/faq" className="hover:opacity-80">FAQ</Link></li>
            <li><Link to="/shipping" className="hover:opacity-80">Shipping &amp; Returns</Link></li>
            <li><Link to="/privacy" className="hover:opacity-80">Privacy Policy</Link></li>
            <li><Link to="/account/orders" className="hover:opacity-80">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-[#c79236]">Visit our store</h4>
          <ul className="mt-3 space-y-2 text-xs text-[#c79236]/85 sm:mt-4 sm:space-y-3 sm:text-sm">
            <li className="flex gap-2">
              <MapPin size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#c79236]" />
              {STORE.address}
            </li>
            <li className="flex gap-2">
              <Clock size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#c79236]" />
              {STORE.hours}
            </li>
            <li className="flex gap-2">
              <Phone size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#c79236]" />
              {STORE.phone}
            </li>
            <li className="flex gap-2">
              <Mail size={17} strokeWidth={2.5} className="mt-0.5 shrink-0 text-[#c79236]" />
              {STORE.email}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[#c79236]/25">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-3 py-4 text-[11px] text-[#c79236] sm:flex-row sm:px-4 sm:py-5 sm:text-xs">
          <p>© {new Date().getFullYear()} {STORE.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {["UPI", "VISA", "Mastercard", "RuPay", "Net Banking", "COD"].map((m) => (
              <span
                key={m}
                className="rounded-lg border border-[#c79236]/40 px-2.5 py-1 font-semibold text-[#c79236]"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
