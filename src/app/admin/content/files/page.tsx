import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function FilesPage() {
  const supabase = await createServerClient();
  const { data: files } = await supabase
    .from("files")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (files || []).map((f: any) => ({
    id: f.id,
    name: f.file_name,
    size: f.file_size ? (f.file_size / 1024).toFixed(1) + " KB" : "-",
    type: f.mime_type || "Unknown",
    uploaded: new Date(f.created_at).toLocaleDateString(),
  }));

  const columns = [
    { key: "name", label: "File Name" },
    { key: "type", label: "Type" },
    { key: "size", label: "Size" },
    { key: "uploaded", label: "Uploaded" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Media Library</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}