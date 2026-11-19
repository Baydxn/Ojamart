import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";

export const metadata: Metadata = {
  title: "Ojamart – Premium E-Commerce Storefront",
  description:
    "Ojamart is your premium marketplace for quality products. Shop flash deals, trending items and recommended picks with fast delivery and secure payment.",
  openGraph: {
    siteName: "Ojamart",
    title: "Ojamart – Premium E-Commerce Storefront",
    description:
      "Ojamart is your premium marketplace for quality products.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col text-oj-black selection:bg-oj-red/20">
        <CartProvider>
          <ToastProvider>
            <Toaster position="bottom-right" />
            <div className="relative z-0">
              <TopNav />
              <main
                className="relative z-0 w-full pt-20 md:pt-18 pb-24 overflow-x-clip"
              >
                {children}
              </main>
              <BottomNav />
            </div>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
