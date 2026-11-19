import { createServerClient } from "@/lib/supabase-server";
import { formatPrice } from "@/lib/utils";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const STATUS_CONFIG: Record<string, { variant: string; label: string }> = {
  pending: { variant: "warning", label: "Pending" },
  paid: { variant: "success", label: "Paid" },
  processing: { variant: "default", label: "Processing" },
  shipped: { variant: "default", label: "Shipped" },
  delivered: { variant: "success", label: "Delivered" },
  cancelled: { variant: "destructive", label: "Cancelled" },
  refunded: { variant: "destructive", label: "Refunded" },
};

export default async function OrdersPage() {
  const supabase = await createServerClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*), profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const rows = (orders || []).map((o: any) => ({
    id: o.id,
    order_number: o.order_number,
    customer: o.profiles?.full_name || o.profiles?.email || "Guest",
    total: formatPrice(o.total),
    status: o.status,
    items: o.order_items?.length || 0,
    date: new Date(o.created_at).toLocaleDateString(),
  }));

  const columns = [
    { key: "order_number", label: "Order #" },
    { key: "customer", label: "Customer" },
    { key: "total", label: "Total", className: "text-right" },
    { key: "items", label: "Items", className: "text-center" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Orders</h1>
          <p className="text-oj-gray-800">Manage all customer orders.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders/draft" className="px-4 py-2 bg-oj-gray-100 text-oj-black rounded-lg text-sm font-medium hover:bg-oj-gray-200 transition-colors">
            Draft Orders
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">All Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}