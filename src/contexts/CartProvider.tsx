"use client";

import * as React from "react";
import { CartProvider as CartCtxProvider } from "@/hooks/use-cart";
import { WishlistProvider } from "@/hooks/use-wishlist";

export function CartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartCtxProvider>
      <WishlistProvider>{children}</WishlistProvider>
    </CartCtxProvider>
  );
}
