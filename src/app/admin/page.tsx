import { createServerClient } from "@/lib/supabase-server";
import { formatPrice } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Users, Package, DollarSign } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function AdminDashboard() {
  const supabase = await createServerClient();
  const [o, r, p, c] = await Promise.all([
    supabase.from("orders").select("id", { count: "exact" }),
    supabase.from("orders").select("total"),
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("profiles").select("id", { count: "exact" }).eq("role", "customer"),
  ]);
  const orderCount = o.count || 0;
  const revenue = (r.data || []).reduce((s: number, x: any) => s + (x.total || 0), 0);
  const productCount = p.count || 0;
  const customerCount = c.count || 0;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card><CardHeader><CardTitle className="text-sm">Orders</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{orderCount}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Revenue</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{formatPrice(revenue)}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Products</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{productCount}</div></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Customers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{customerCount}</div></CardContent></Card>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
          <CardContent>
            <Link href="/admin/orders" className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-oj-gray-50"><ShoppingCart className="w-4 h-4" />Orders</Link>
            <Link href="/admin/products" className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-oj-gray-50 mt-2"><Package className="w-4 h-4" />Products</Link>
            <Link href="/admin/customers" className="flex items-center gap-2 px-3 py-2 border rounded-lg hover:bg-oj-gray-50 mt-2"><Users className="w-4 h-4" />Customers</Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">Status</CardTitle></CardHeader>
          <CardContent>
            <div className="text-sm space-y-2"><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />Supabase Connected</span><span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />Payments: Coming Soon</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}