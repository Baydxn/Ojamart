"use client";

import { createContext, useContext, useCallback, useEffect, useState, createElement } from "react";
import { Product } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase";
import type { CartItem as CartItemType } from "@/lib/types";

export type CartItem = CartItemType & {
  product: Product;
};

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  subtotal: number;
  addItem: (input: { productId: string; size: string; color: string; quantity?: number }) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
  refresh: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const supabase = createClient();

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + (i.product?.price || 0) * i.quantity, 0);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let serverItems: any[] = [];
      if (user) {
        const { data } = await supabase
          .from("cart_items")
          .select("*, products(*)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        serverItems = (data || []).map((row: any) => ({
          id: row.id,
          productId: row.product_id,
          size: row.size,
          color: row.color,
          quantity: row.quantity,
          product: row.products,
        }));
      }
      setItems(serverItems as CartItem[]);
    } catch {
      // fall back to empty
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const persist = useCallback(async (items: CartItem[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("cart_items").delete().eq("user_id", user.id);
      if (items.length) {
        await supabase.from("cart_items").insert(
          items.map((i) => ({
            user_id: user.id,
            product_id: i.productId,
            size: i.size,
            color: i.color,
            quantity: i.quantity,
          }))
        );
      }
    } else {
      try {
        localStorage.setItem("ojamart_guest_cart", JSON.stringify(items.map(({ product, ...rest }) => rest)));
      } catch { /* ignore */ }
    }
  }, [supabase]);

  const addItem = useCallback(async (input: { productId: string; size: string; color: string; quantity?: number }) => {
    const qty = input.quantity || 1;
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: existing } = await supabase
          .from("cart_items")
          .select("*")
          .eq("user_id", user.id)
          .eq("product_id", input.productId)
          .eq("size", input.size)
          .eq("color", input.color)
          .maybeSingle();
        if (existing) {
          await supabase.from("cart_items").update({ quantity: (existing.quantity || 0) + qty }).eq("id", existing.id);
        } else {
          await supabase.from("cart_items").insert({
            user_id: user.id,
            product_id: input.productId,
            size: input.size,
            color: input.color,
            quantity: qty,
          });
        }
      } else {
        let guest: any[] = [];
        try { guest = JSON.parse(localStorage.getItem("ojamart_guest_cart") || "[]"); } catch { guest = []; }
        const found = guest.find((i) => i.productId === input.productId && i.size === input.size && i.color === input.color);
        if (found) found.quantity = (found.quantity || 0) + qty;
        else guest.push({ productId: input.productId, size: input.size, color: input.color, quantity: qty });
        localStorage.setItem("ojamart_guest_cart", JSON.stringify(guest));
      }
      await load();
      toast({ title: "Added to cart", description: "Item added successfully." });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to add item to cart" });
    } finally {
      setLoading(false);
    }
  }, [supabase, load, toast]);

  const removeItem = useCallback(async (itemId: string) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("cart_items").delete().eq("id", itemId).eq("user_id", user.id);
      } else {
        let guest: any[] = [];
        try { guest = JSON.parse(localStorage.getItem("ojamart_guest_cart") || "[]"); } catch { guest = []; }
        const next = guest.filter((i) => i.id !== itemId);
        localStorage.setItem("ojamart_guest_cart", JSON.stringify(next));
      }
      await load();
      toast({ title: "Removed", description: "Item removed from cart." });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to remove item" });
    } finally { setLoading(false); }
  }, [supabase, load, toast]);

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    if (quantity < 1) { removeItem(itemId); return; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("cart_items").update({ quantity }).eq("id", itemId).eq("user_id", user.id);
      } else {
        let guest: any[] = [];
        try { guest = JSON.parse(localStorage.getItem("ojamart_guest_cart") || "[]"); } catch { guest = []; }
        const found = guest.find((i) => i.id === itemId);
        if (found) found.quantity = quantity;
        localStorage.setItem("ojamart_guest_cart", JSON.stringify(guest));
      }
      await load();
    } catch { /* handled by refresh */ } finally { setLoading(false); }
  }, [supabase, load, removeItem]);

  const clear = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("cart_items").delete().eq("user_id", user.id);
      } else {
        localStorage.removeItem("ojamart_guest_cart");
      }
      setItems([]);
    } catch { /* ignore */ }
  }, [supabase]);

  const value: CartContextType = {
    items,
    loading,
    itemCount,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refresh: load,
  };

  return createElement(CartContext.Provider, { value }, children);
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

