import Link from "next/link";

const CONTENT_ITEMS = [
  { name: "Metaobjects", href: "/admin/content/metaobjects", description: "Custom data structures and objects" },
  { name: "Files", href: "/admin/content/files", description: "Media library and file uploads" },
  { name: "Menus", href: "/admin/content/menus", description: "Navigation menus and links" },
  { name: "Blog Posts", href: "/admin/content/blog-posts", description: "Articles and blog management" },
];

export default function ContentPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-oj-black mb-6">Content Management</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CONTENT_ITEMS.map((item) => (
          <Link key={item.name} href={item.href} className="border border-oj-border rounded-xl p-6 hover:border-oj-red transition-colors">
            <h3 className="font-semibold text-oj-black mb-1">{item.name}</h3>
            <p className="text-xs text-oj-gray-800">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}