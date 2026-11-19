import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PurchaseOrdersPage() {
  const supabase = await createServerClient();
  const { data: orders } = await supabase
    .from("purchase_orders")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (orders || []).map((o: any) => ({
    id: o.id,
    po_number: o.po_number,
    supplier: o.supplier_name,
    status: o.status,
    total: o.total.toString(),
    expected: o.expected_date ? new Date(o.expected_date).toLocaleDateString() : "-",
    received: o.received_date ? new Date(o.received_date).toLocaleDateString() : "-",
  }));

  const columns = [
    { key: "po_number", label: "PO Number" },
    { key: "supplier", label: "Supplier" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total", className: "text-right" },
    { key: "expected", label: "Expected Delivery" },
    { key: "received", label: "Received" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Purchase Orders</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Vendor Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}