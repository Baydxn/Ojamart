import { getCategories, getProducts } from "@/lib/queries";
import Link from "next/link";
import Image from "next/image";
import { ProductCard } from "@/components/products/product-card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams?: { category?: string; flash?: string; trending?: string };
}) {
  const category = searchParams?.category;
  const flash = searchParams?.flash === "true";
  const trending = searchParams?.trending === "true";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({
      category,
      flashDeal: flash,
      featured: trending,
      limit: 48,
    }),
  ]);

  let pageTitle = "All Categories";
  let pageSubtitle = "Browse our complete collection";
  if (flash) {
    pageTitle = "Flash Deals";
    pageSubtitle = "Limited-time offers you won't want to miss";
  } else if (trending) {
    pageTitle = "Trending Now";
    pageSubtitle = "Most loved by our customers";
  } else if (category) {
    const cat = categories.find((c) => c.slug === category);
    pageTitle = cat ? cat.name : "Category";
    pageSubtitle = cat?.description || "Shop this category";
  }

  return (
    <div className="min-h-screen bg-oj-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 mb-8 text-sm text-oj-gray-800">
          <Link href="/" className="hover:text-oj-red transition-colors">Home</Link>
          <span className="mx-1 text-oj-gray-600">/</span>
          <span className="font-medium text-oj-black">{pageTitle}</span>
        </nav>
        <h1 className="text-3xl font-bold text-oj-black mb-2">{pageTitle}</h1>
        <p className="text-oj-gray-800 mb-8">{pageSubtitle}</p>

        {!category && !flash && !trending && (
          <section className="mb-12">
            <h2 className="text-xl font-bold text-oj-black mb-6">Shop by Category</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group block p-6 rounded-2xl border border-oj-border bg-white hover:border-oj-red hover:shadow-md transition-all text-center"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-oj-gray-100 flex items-center justify-center group-hover:bg-oj-red group-hover:text-white transition-colors">
                    <Image
                      src={cat.image_url || "https://placehold.co/80x80?text=Cat"}
                      alt={cat.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-oj-black">{cat.name}</h3>
                  <p className="text-xs text-oj-gray-800 mt-1">{cat.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {products.length > 0 ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="col-span-full text-center py-20">
                <p className="text-oj-gray-800">No products found.</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
