import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SegmentsPage() {
  const supabase = await createServerClient();
  const { data: segments } = await supabase
    .from("customer_segments")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (segments || []).map((s: any) => ({
    id: s.id,
    name: s.name,
    description: s.description || "-",
    count: s.customer_count,
    created: new Date(s.created_at).toLocaleDateString(),
  }));

  const columns = [
    { key: "name", label: "Segment Name" },
    { key: "description", label: "Description" },
    { key: "count", label: "Customers", className: "text-center" },
    { key: "created", label: "Created" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Customer Segments</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Segments</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}