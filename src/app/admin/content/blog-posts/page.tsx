import { createServerClient } from "@/lib/supabase-server";
import { DataTable } from "@/components/admin/data-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function BlogPostsPage() {
  const supabase = await createServerClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (posts || []).map((p: any) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    status: p.status,
    excerpt: p.excerpt ? p.excerpt.substring(0, 50) + "..." : "-",
  }));

  const columns = [
    { key: "title", label: "Title" },
    { key: "slug", label: "Slug" },
    { key: "status", label: "Status" },
    { key: "excerpt", label: "Excerpt" },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Blog Posts</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-oj-black">All Blog Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={rows} pageSize={10} />
        </CardContent>
      </Card>
    </div>
  );
}