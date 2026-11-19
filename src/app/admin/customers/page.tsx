import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function CustomersPage() {
  const supabase = await createServerClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, created_at, role")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  const rows = (profiles || []).map((p: any) => ({
    id: p.id,
    name: p.full_name || "No Name",
    email: p.email || "-",
    phone: p.phone || "-",
    role: p.role,
    joined: new Date(p.created_at).toLocaleDateString(),
  }));

  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    { key: "joined", label: "Joined" },
  ];

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-oj-black">Customers</h1>
          <p className="text-oj-gray-800">Manage customer accounts.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}