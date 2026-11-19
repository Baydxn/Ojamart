import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MenusPage() {
  const supabase = await createServerClient();
  const { data: menus } = await supabase
    .from("menus")
    .select("*, menu_items(title, sort_order)")
    .order("created_at", { ascending: false });

  const rows = (menus || []).map((m: any) => ({
    id: m.id,
    name: m.name,
    slug: m.slug,
    item_count: m.menu_items?.length || 0,
    is_active: m.is_active ? "Active" : "Inactive",
  }));

  const columns = [
    { key: "name", label: "Menu Name" },
    { key: "slug", label: "Slug" },
    { key: "item_count", label: "Items", className: "text-center" },
    { key: "is_active", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Menus</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Navigation Menus</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}