import { getProducts } from "@/lib/queries";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const q = searchParams?.q || "";
  const products = q ? await getProducts({ search: q, limit: 48 }).catch(() => []) : [];

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">
        Home
      </Link>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-oj-black mb-2">
          Search Results for "{q}"
        </h1>
        <p className="text-oj-gray-800">
          {products.length} {products.length === 1 ? "result" : "results"} found
        </p>
      </div>
      {q && products.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-oj-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-oj-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-oj-black mb-2">No products found</h2>
          <p className="text-oj-gray-800 mb-6">Try a different search term.</p>
          <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
