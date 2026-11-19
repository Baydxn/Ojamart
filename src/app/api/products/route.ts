import { createServerClient } from "@/lib/supabase-server";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const supabase = await createServerClient();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const featured = searchParams.get("featured") === "true" || undefined;
  const flashDeal = searchParams.get("flash") === "true" || undefined;
  const search = searchParams.get("search") || undefined;
  const limit = parseInt(searchParams.get("limit") || "24");

  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (category) query = query.eq("category_id", category);
  if (featured) query = query.eq("is_featured", true);
  if (flashDeal) query = query.eq("is_flash_deal", true);
  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
  }
  query = query.limit(limit);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}
