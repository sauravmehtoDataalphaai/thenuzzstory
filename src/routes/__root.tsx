import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import { PawPrint } from "lucide-react";

import appCss from "../styles.css?url";
import { StoreProvider } from "@/store/StoreContext";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md text-center">
        <span className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-primary-soft text-primary">
          <PawPrint size={44} />
        </span>
        <h1 className="mt-6 font-display text-6xl font-extrabold text-foreground">404</h1>
        <h2 className="mt-2 font-display text-xl font-bold text-foreground">
          This page ran off chasing a squirrel
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We sniffed around but couldn't find it. Let's get you back to the treats.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-shadow hover:shadow-glow"
          >
            Go home
          </Link>
          <Link
            to="/category/$slug"
            params={{ slug: "dog-food" }}
            className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Shop dog food
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
      {
        name: "description",
        content:
          "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming.",
      },
      { name: "author", content: "The Nuzz Story" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
      { name: "twitter:title", content: "The Nuzz Story — Premium Pet Food, Grooming & Care" },
      { property: "og:description", content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming." },
      { name: "twitter:description", content: "Vet-reviewed dog & cat food, grooming products, toys and accessories. Free delivery above ₹499, easy returns and in-store grooming." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&family=Oswald:wght@600;700&display=swap",
      },
      { rel: "icon", href: "/favicon.png", type: "image/x-icon" },
      { rel: "icon", href: "/favicon.png", type: "image/png", sizes: "256x256" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <div className="flex min-h-screen flex-col">
          {!isAdmin && <Header />}
          <main className="flex-1">
            <Outlet />
          </main>
          {!isAdmin && <Footer />}
        </div>
        {!isAdmin && <CartDrawer />}
        <Toaster position="top-right" richColors />
      </StoreProvider>
    </QueryClientProvider>
  );
}
