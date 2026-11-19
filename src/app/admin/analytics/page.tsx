import { createServerClient } from "@/lib/supabase-server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AnalyticsPage() {
  const supabase = await createServerClient();
  const [ordersRes, productsRes, customersRes] = await Promise.all([
    supabase.from("orders").select("total, created_at"),
    supabase.from("products").select("id"),
    supabase.from("profiles").select("id").eq("role", "customer"),
  ]);

  const orders = ordersRes.data || [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todaySales = orders
    .filter((o: any) => new Date(o.created_at) >= today)
    .reduce((sum, o) => sum + (o.total || 0), 0);
  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Analytics</h1>
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-oj-black">{totalSales > 0 ? totalSales.toLocaleString() : "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Today Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-oj-black">{todaySales > 0 ? todaySales.toLocaleString() : "0"}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-oj-black">{productsRes.count || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-oj-black">Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-oj-black">{customersRes.count || 0}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}