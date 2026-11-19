import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function CollectionsPage() {
  const supabase = await createServerClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  const rows = (categories || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    is_active: c.is_active ? "Active" : "Inactive",
    sort_order: c.sort_order,
  }));

  const columns = [
    { key: "name", label: "Collection Name" },
    { key: "slug", label: "Slug" },
    { key: "is_active", label: "Status" },
    { key: "sort_order", label: "Sort Order", className: "text-center" },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Collections</h1>
          <p className="text-oj-gray-800">Manage product collections.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Product Collections</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}