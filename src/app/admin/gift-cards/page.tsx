import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function GiftCardsPage() {
  const supabase = await createServerClient();
  const { data: cards } = await supabase
    .from("gift_cards")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (cards || []).map((g: any) => ({
    id: g.id,
    code: g.code,
    balance: g.balance.toString(),
    original: g.original_balance.toString(),
    is_active: g.is_active ? "Active" : "Inactive",
    expires: g.expires_at ? new Date(g.expires_at).toLocaleDateString() : "-",
  }));

  const columns = [
    { key: "code", label: "Gift Card Code" },
    { key: "balance", label: "Balance", className: "text-right" },
    { key: "original", label: "Original", className: "text-right" },
    { key: "is_active", label: "Status" },
    { key: "expires", label: "Expires" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Gift Cards</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Gift Cards</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}