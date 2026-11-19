import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function DraftOrdersPage() {
  const supabase = await createServerClient();
  const { data: drafts } = await supabase
    .from("draft_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (drafts || []).map((d: any) => ({
    id: d.id,
    order_number: d.order_number,
    customer: d.customer_name || d.customer_email || "Guest",
    total: d.total.toString(),
    status: d.status,
    date: new Date(d.created_at).toLocaleDateString(),
  }));

  const columns = [
    { key: "order_number", label: "Draft #" },
    { key: "customer", label: "Customer" },
    { key: "total", label: "Total", className: "text-right" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Draft Orders</h1>
          <p className="text-oj-gray-800">Manage draft orders before invoicing.</p>
        </div>
        <Link href="/admin/orders" className="px-4 py-2 bg-oj-gray-100 text-oj-black rounded-lg text-sm font-medium hover:bg-oj-gray-200 transition-colors">
          ← Back to Orders
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">All Draft Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}