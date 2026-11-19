import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function MetaobjectsPage() {
  const supabase = await createServerClient();
  const { data: metaobjects } = await supabase
    .from("metaobjects")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (metaobjects || []).map((m: any) => ({
    id: m.id,
    type: m.type,
    key: m.key,
    value: JSON.stringify(m.value || {}),
  }));

  const columns = [
    { key: "type", label: "Type" },
    { key: "key", label: "Key" },
    { key: "value", label: "Value" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Metaobjects</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Custom Metaobjects</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}