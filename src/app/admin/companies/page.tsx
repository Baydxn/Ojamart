import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CompaniesPage() {
  const supabase = await createServerClient();
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (companies || []).map((c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    email: c.email || "-",
    phone: c.phone || "-",
    is_active: c.is_active ? "Active" : "Inactive",
  }));

  const columns = [
    { key: "name", label: "Company Name" },
    { key: "slug", label: "Slug" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "is_active", label: "Status" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Companies</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">B2B Companies</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}