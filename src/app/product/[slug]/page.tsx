"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Minus, Plus, RefreshCw } from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = typeof params.slug === "string" ? params.slug : "";
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [buyNowAdding, setBuyNowAdding] = useState(false);

  const { addItem } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    loadProduct();
  }, [slug]);

  async function loadProduct() {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Product not found");
      const data = await res.json();
      setProduct(data);
      if (data.sizes?.[0]) setSelectedSize(data.sizes[0]);
      if (data.colors?.[0]) setSelectedColor(data.colors[0]);
    } catch {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  const price = product?.is_flash_deal && product?.flash_deal_price != null ? product.flash_deal_price : product?.price;
  const inStock = product ? product.stock_quantity > 0 : false;
  const canAdd = inStock && selectedSize && selectedColor && quantity > 0;

  const handleAddToCart = async () => {
    if (!canAdd) return;
    setAdding(true);
    try {
      await addItem({ productId: product.id, size: selectedSize, color: selectedColor, quantity });
      toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
      router.refresh();
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to add to cart" });
    } finally {
      setAdding(false);
    }
  };

  const handleBuyNow = async () => {
    if (!canAdd) return;
    setBuyNowAdding(true);
    try {
      await addItem({ productId: product.id, size: selectedSize, color: selectedColor, quantity });
      router.push("/checkout");
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to proceed to checkout" });
    } finally {
      setBuyNowAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-4xl mx-auto">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-8 h-[400px] bg-oj-gray-200 rounded-xl animate-pulse" />
          <div className="md:col-span-4 flex flex-col gap-4">
            <div className="h-20 bg-oj-gray-200 rounded-lg animate-pulse" />
            <div className="h-12 bg-oj-gray-200 rounded-lg animate-pulse" />
            <div className="h-8 bg-oj-gray-200 rounded-lg animate-pulse w-3/4" />
            <div className="h-6 bg-oj-gray-200 rounded-lg animate-pulse w-1/2" />
            <div className="h-48 bg-oj-gray-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-20 px-4 text-center max-w-xl mx-auto">
        <h2 className="text-2xl font-bold text-oj-black mb-2">Product not found</h2>
        <p className="text-oj-gray-800 mb-6">The product you're looking for doesn't exist.</p>
        <Button onClick={() => router.push("/")} className="w-full">Back to Home</Button>
      </div>
    );
  }
  const images = Array.isArray(product.images) && product.images.length ? product.images : [`https://placehold.co/800x800?text=${encodeURIComponent(product.name)}`];

  return (
    <div className="py-8 px-4">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">Home</Link>
      <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square rounded-xl border-oj-border bg-oj-gray-100 overflow-hidden">
            <Image src={images[0]} alt={product.name} fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm">
              {images.map((_img: string, i: number) => (
                <button key={i} className="w-2 h-2 rounded-full bg-oj-gray-300" aria-label={`Image ${i + 1}`} />
              ))}
            </div>
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid gap-3 sm:grid-cols-4">
              {images.map((img: string, i: number) => (
                <button key={i} className="aspect-square rounded-lg border border-oj-border overflow-hidden bg-oj-gray-100">
                  <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover object-center" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="text-xs uppercase tracking-wider">{product.category?.name || "Category"}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-oj-black leading-tight mb-2">{product.name}</h1>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold text-oj-black">{formatPrice(price)}</span>
              {product.is_flash_deal && product.flash_deal_price != null && product.price && (
                <span className="text-lg text-green-700 font-medium line-through text-oj-gray-800">{formatPrice(product.price)}</span>
              )}
            </div>
            <p className="text-oj-gray-800 mb-6 leading-relaxed">{product.description}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-oj-black mb-2">Size</label>
                <div className="flex gap-2">
                  {(product.sizes || []).map((size: string) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-sm text-sm font-medium border transition-all ${selectedSize === size ? "bg-oj-red text-white border-oj-red" : "bg-white border-oj-border text-oj-black hover:border-oj-red"}`}>{size}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-oj-black mb-2">Color</label>
                <div className="flex gap-2 flex-wrap">
                  {(product.colors || []).map((color: string) => (
                    <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? "ring-2 ring-oj-red ring-offset-2" : ""} ${color === "Default" ? "bg-oj-gray-300" : color === "Black" ? "bg-black" : color === "White" ? "bg-white" : color === "Red" ? "bg-red-500" : "bg-gray-400"}`} title={color} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-oj-black mb-2">Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="w-10 h-10 rounded-lg border border-oj-border bg-white flex items-center justify-center text-oj-black disabled:opacity-50">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-8 text-center font-medium text-oj-black">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-lg border border-oj-border bg-white flex items-center justify-center text-oj-black hover:bg-oj-gray-100">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-oj-border space-y-3">
            <Button onClick={handleAddToCart} disabled={adding || !canAdd} className="w-full py-4 text-lg">
              {adding ? <RefreshCw className="w-5 h-5 animate-spin" /> : <><Plus className="w-5 h-5" /> Add to Cart</>}</Button>
            <Button variant="outline" onClick={handleBuyNow} disabled={buyNowAdding || !canAdd} className="w-full py-4 text-lg border-oj-red text-oj-red hover:bg-oj-red hover:text-white">
              {buyNowAdding ? "Processing..." : "Buy Now"}
            </Button>
          </div>
          {!inStock && <div className="p-3 rounded-lg bg-red-50 text-red-800 text-sm">Out of stock</div>}
          {canAdd && <div className="flex items-center gap-2 text-xs text-oj-gray-800">Usually ships in 1-3 business days</div>}
          <div className="flex gap-2 text-xs text-oj-gray-800">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-oj-border"><span className="text-oj-red">🔒</span><span>Secure payment</span></div>
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-oj-border"><span className="text-oj-red">🚚</span><span>Fast delivery</span></div>
          </div>
        </div>
      </div>

      <section className="mt-12 px-4">
        <h3 className="text-xl font-bold text-oj-black mb-6 px-4">You may also like</h3>
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-[320px]" />
          ))}
        </div>
      </section>
    </div>
  );
}

