import { getCategoryBySlug, getProducts } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/product-card";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [category, products] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ category: slug, limit: 48 }),
  ]);

  if (!category) {
    return (
      <div className="min-h-screen bg-oj-gray-50 py-20 px-4 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-oj-black mb-2">Category not found</h2>
        <p className="text-oj-gray-800 mb-6">The category you're looking for doesn't exist.</p>
        <Link href="/categories" className="inline-flex items-center gap-1 bg-oj-red text-white px-6 py-2 rounded-lg font-medium hover:bg-red-800 transition-colors">
          Browse Categories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-oj-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-sm text-oj-gray-800">
          <Link href="/" className="hover:text-oj-red transition-colors">Home</Link>
          <span className="mx-1 text-oj-gray-600">/</span>
          <Link href="/categories" className="hover:text-oj-red transition-colors">Categories</Link>
          <span className="mx-1 text-oj-gray-600">/</span>
          <span className="font-medium text-oj-black">{category.name}</span>
        </nav>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-oj-black">{category.name}</h1>
            {category.description && (
              <p className="text-oj-gray-800">{category.description}</p>
            )}
          </div>
          {category.image_url && (
            <Image
              src={category.image_url}
              alt={category.name}
              className="w-32 h-32 rounded-full object-cover shadow-lg border-4 border-white"
              width={128}
              height={128}
            />
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.length > 0 ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-oj-gray-800">No products in this category yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
