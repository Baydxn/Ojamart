"use server";

import { createServerClient } from "@/lib/supabase-server";
import type { Product, Category, Order, Address } from "@/lib/types";

export async function getProducts({
  category,
  featured,
  flashDeal,
  limit = 24,
  search,
}: {
  category?: string;
  featured?: boolean;
  flashDeal?: boolean;
  limit?: number;
  search?: string;
} = {}) {
  const supabase = await createServerClient();
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category_id", category);
  if (featured) query = query.eq("is_featured", true);
  if (flashDeal) query = query.eq("is_flash_deal", true);
  if (search) {
    query = query.ilike("name", `%${search}%`).or(`description.ilike.%${search}%`);
  }
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) throw error;
  return (data || []) as Product[];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  if (error) throw error;
  return data as Product | null;
}

export async function getCategories() {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []) as Category[];
}

export async function getCategoryBySlug(slug: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) throw error;
  return (data || null) as Category | null;
}

export async function getOrders(userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Order[];
}

export async function getOrderById(id: string, userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return (data || null) as Order | null;
}

export async function getAddresses(userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as Address[];
}

export async function getProfile(userId: string) {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}
