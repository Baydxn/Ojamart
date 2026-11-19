import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function TransfersPage() {
  const supabase = await createServerClient();
  const { data: transfers } = await supabase
    .from("transfers")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (transfers || []).map((t: any) => ({
    id: t.id,
    transfer_number: t.transfer_number,
    from: t.from_location,
    to: t.to_location,
    status: t.status,
    items_count: t.transfer_items?.length || 0,
  }));

  const columns = [
    { key: "transfer_number", label: "Transfer #" },
    { key: "from", label: "From" },
    { key: "to", label: "To" },
    { key: "status", label: "Status" },
    { key: "items_count", label: "Items", className: "text-center" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Stock Transfers</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Inventory Transfers</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}