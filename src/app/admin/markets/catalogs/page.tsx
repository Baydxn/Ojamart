import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CatalogsPage() {
  const supabase = await createServerClient();
  const { data: catalogs } = await supabase
    .from("market_catalogs")
    .select("*, markets(name), products(name)")
    .order("created_at", { ascending: false });

  const rows = (catalogs || []).map((c: any) => ({
    id: c.id,
    market: c.markets?.name || "-",
    product: c.products?.name || "-",
    price_override: c.price_override || "Default",
    is_available: c.is_available ? "Available" : "Unavailable",
  }));

  const columns = [
    { key: "market", label: "Market" },
    { key: "product", label: "Product" },
    { key: "price_override", label: "Price Override" },
    { key: "is_available", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Market Catalogs</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Product Availability by Market</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}