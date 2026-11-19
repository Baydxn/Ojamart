"use client";

import { createContext, useContext, useCallback, useEffect, useState, createElement } from "react";
import { useToast } from "@/hooks/use-toast";
import { toggleWishlistAction } from "@/lib/actions";

interface WishlistContextType {
  productIds: Set<string>;
  isLoaded: boolean;
  toggle: (productId: string) => Promise<void>;
  has: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [productIds, setProductIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ojamart_wishlist");
      if (raw) setProductIds(new Set(JSON.parse(raw)));
    } catch { /* ignore */ }
    setIsLoaded(true);
  }, []);

  const persist = useCallback((ids: Set<string>) => {
    try { localStorage.setItem("ojamart_wishlist", JSON.stringify([...ids])); } catch { /* ignore */ }
  }, []);

  const toggle = useCallback(async (productId: string) => {
    const next = new Set(productIds);
    if (next.has(productId)) next.delete(productId);
    else next.add(productId);
    setProductIds(next);
    persist(next);
    try {
      await toggleWishlistAction(productId);
      toast({ title: next.has(productId) ? "Added to wishlist" : "Removed from wishlist", description: "" });
    } catch (e: any) {
      // Revert on failure if unauthenticated etc.
      if (e?.message?.includes("Not authenticated")) {
        toast({ title: "Log in to save to wishlist", description: "Please sign in to keep your wishlist across devices." });
      } else {
        setProductIds(productIds);
        persist(productIds);
        toast({ title: "Error", description: e?.message || "Failed to update wishlist" });
      }
    }
  }, [productIds, toast, persist]);

  const has = (productId: string) => productIds.has(productId);

  return createElement(WishlistContext.Provider, { value: { productIds, isLoaded, toggle, has } }, children);
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
