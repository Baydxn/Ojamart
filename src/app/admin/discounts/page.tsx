import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function DiscountsPage() {
  const supabase = await createServerClient();
  const { data: discounts } = await supabase
    .from("discounts")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (discounts || []).map((d: any) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    type: d.type,
    value: d.value,
    is_active: d.is_active ? "Active" : "Inactive",
    usage: `${d.usage_count}${d.usage_limit ? "/" + d.usage_limit : ""}`,
  }));

  const columns = [
    { key: "code", label: "Code" },
    { key: "name", label: "Name" },
    { key: "type", label: "Type" },
    { key: "value", label: "Value" },
    { key: "usage", label: "Usage" },
    { key: "is_active", label: "Status" },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Discounts</h1>
          <p className="text-oj-gray-800">Manage promo codes and discounts.</p>
        </div>
        <Link href="#" className="px-4 py-2 bg-oj-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
          + Add Discount
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Discount Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}