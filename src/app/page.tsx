import { getProducts, getCategories } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/products/product-card";
import { ArrowRight } from "lucide-react";

const BANNERS = [
  {
    title: "Summer Flash Sale",
    subtitle: "Up to 50% off on selected items",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop",
    cta: "Shop Now",
    href: "/categories",
  },
  {
    title: "New Collection",
    subtitle: "Premium fashion for every occasion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
    cta: "Explore",
    href: "/categories?category=fashion",
  },
  {
    title: "Tech Deals",
    subtitle: "Latest gadgets at unbeatable prices",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=400&fit=crop",
    cta: "Shop Tech",
    href: "/categories?category=electronics",
  },
];

const SectionHeader = ({ title, subtitle, href, count }: { title: string; subtitle?: string; href?: string; count?: number }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6 px-4">
    <div>
      <h3 className="text-xl md:text-2xl font-bold text-oj-black">{title}</h3>
      {subtitle && <p className="text-sm text-oj-gray-800">{subtitle}</p>}
    </div>
    {href && (
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-oj-red hover:text-red-800">
        View all {count ? `(${count})` : ""} <ArrowRight className="w-3 h-3" />
      </Link>
    )}
  </div>
);

export default async function HomePage() {
  const [flashDeals, trending, recommended, categories] = await Promise.all([
    getProducts({ flashDeal: true, limit: 8 }),
    getProducts({ featured: true, limit: 8 }),
    getProducts({ limit: 8 }),
    getCategories(),
  ]);
  return (
    <div className="min-h-screen bg-oj-gray-50">
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[200px] md:h-[320px] overflow-hidden">
          {BANNERS.map((banner, i) => (
            <div
              key={i}
              className="absolute inset-0 flex items-center justify-center px-6 md:px-12 bg-oj-black/80 text-white transition-opacity duration-700 ease-in-out"
              style={{
                opacity: i === 0 ? 1 : 0,
                transform: i === 0 ? "translateX(0)" : "translateX(100%)",
                transition: "all 0.7s ease-in-out",
              }}
            >
              <div className="max-w-2xl text-center">
                <h2 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight">{banner.title}</h2>
                <p className="text-lg md:text-xl mb-6 opacity-90">{banner.subtitle}</p>
                <Link href={banner.href} className="inline-flex items-center gap-2 bg-oj-red text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
                  {banner.cta} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {BANNERS.map((_, i) => (
              <button
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${i === 0 ? "bg-oj-red" : "bg-white/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-6 px-4">
        <div className="overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {categories.slice(0, 6).map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-2xl border border-oj-border bg-white text-sm font-medium text-oj-black shadow-sm hover:shadow-md transition-all"
              >
                <Image
                  src={cat.image_url || "https://placehold.co/32x32?text=Cat"}
                  alt={cat.name}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 px-4 bg-white">
        <SectionHeader title="Flash Deals" subtitle="Limited-time offers. Grab them before they're gone." href="/categories?flash=true" count={flashDeals.length} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {flashDeals.length > 0 ? (
            flashDeals.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-oj-gray-800">No flash deals available right now.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 px-4 bg-oj-gray-50">
        <SectionHeader title="Trending Now" subtitle="Most loved by our customers" href="/categories?trending=true" count={trending.length} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {trending.length > 0 ? (
            trending.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-oj-gray-800">No trending products available right now.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 px-4 bg-white">
        <SectionHeader title="Recommended for You" subtitle="Handpicked just for you" href="/categories" count={recommended.length} />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {recommended.length > 0 ? (
            recommended.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-oj-gray-800">No recommended products available right now.</p>
            </div>
          )}
        </div>
      </section>

      <section className="py-8 px-4 bg-oj-black">
        <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
          <div className="flex flex-col sm:flex-row gap-4 items-center text-sm text-gray-300">
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-oj-red text-oj-red flex items-center justify-center text-[10px]">✈</span><span>Free delivery on orders above ₦25,000</span></div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-oj-red text-oj-red flex items-center justify-center text-[10px]">🔒</span><span>Secure payment guaranteed</span></div>
            <div className="flex items-center gap-2"><span className="w-5 h-5 rounded-full border border-oj-red text-oj-red flex items-center justify-center text-[10px]">★</span><span>Quality assured products</span></div>
          </div>
        </div>
      </section>
    </div>
  );
}

