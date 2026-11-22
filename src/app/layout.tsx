import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartProvider";
import { ToastProvider } from "@/contexts/ToastProvider";
import { StorefrontShell } from "@/components/layout/storefront-shell";

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
            <StorefrontShell>{children}</StorefrontShell>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
