import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InventoryPage() {
  const supabase = await createServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("name, sku, stock_quantity, is_active, categories(name)")
    .order("stock_quantity", { ascending: true });

  const rows = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku || "-",
    stock: p.stock_quantity,
    category: p.categories?.name || "-",
    status: p.is_active ? "Active" : "Inactive",
  }));

  const columns = [
    { key: "name", label: "Product" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "stock", label: "Stock", className: "text-center" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Inventory</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Stock Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}