import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MarketsPage() {
  const supabase = await createServerClient();
  const { data: markets } = await supabase
    .from("markets")
    .select("*")
    .order("name", { ascending: true });

  const rows = (markets || []).map((m: any) => ({
    id: m.id,
    name: m.name,
    code: m.code,
    currency: m.currency,
    is_active: m.is_active ? "Active" : "Inactive",
    tax_rate: m.tax_rate + "%",
  }));

  const columns = [
    { key: "name", label: "Market Name" },
    { key: "code", label: "Code" },
    { key: "currency", label: "Currency" },
    { key: "tax_rate", label: "Tax Rate" },
    { key: "is_active", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Markets</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Country Markets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}