import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default async function ProductsPage() {
  const supabase = await createServerClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  const rows = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    sku: p.sku || "-",
    category: p.categories?.name || "-",
    price: formatPrice(p.price),
    stock: p.stock_quantity,
    status: p.is_active ? "Active" : "Inactive",
  }));

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU" },
    { key: "category", label: "Category" },
    { key: "price", label: "Price", className: "text-right" },
    { key: "stock", label: "Stock", className: "text-center" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Products</h1>
          <p className="text-oj-gray-800">Manage your product catalog.</p>
        </div>
        <Link href="#" className="px-4 py-2 bg-oj-red text-white rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
          + Add Product
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}