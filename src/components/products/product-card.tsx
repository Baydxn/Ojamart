"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Plus, Heart, Tag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProductCard({ product }: { product: Product }) {
  const [adding, setAdding] = useState(false);
  const { addItem } = useCart();
  const { toggle, has } = useWishlist();
  const { toast } = useToast();
  const isWishlisted = has(product.id);

  const images = Array.isArray(product.images) && product.images.length
    ? product.images
    : [`https://placehold.co/600x600?text=${encodeURIComponent(product.name)}`];
  const price = product.is_flash_deal && product.flash_deal_price != null ? product.flash_deal_price : product.price;

  const handleAdd = async () => {
    setAdding(true);
    try {
      const defaultSize = product.sizes?.[0] || "M";
      const defaultColor = product.colors?.[0] || "Default";
      await addItem({ productId: product.id, size: defaultSize, color: defaultColor, quantity: 1 });
      toast({ title: "Added to cart", description: `${product.name} added to your cart.` });
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Failed to add to cart" });
    } finally {
      setAdding(false);
    }
  };

  const handleWishlist = async () => {
    await toggle(product.id);
  };

  return (
    <article
      className="group rounded-xl border border-oj-border bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1"
      style={{ animation: "reveal 0.6s ease-out both" }}
    >
      <div className="relative h-48 bg-oj-gray-100 overflow-hidden">
        <Image
          src={images[0]}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          priority
        />
        {product.is_flash_deal && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-xs font-bold text-white shadow-sm">
            <Tag className="w-3 h-3 fill-white" /> Flash Deal
          </div>
        )}
        {product.is_featured && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-oj-black text-xs font-bold text-white shadow-sm">
            <Tag className="w-3 h-3 fill-white" /> Featured
          </div>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); handleWishlist(); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur text-oj-black-soft opacity-0 group-hover:opacity-100 transition-opacity hover:bg-oj-red hover:text-white"
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("w-4 h-4", isWishlisted ? "fill-red-600" : "")} />
        </button>
      </div>
      <div className="p-3">
        <Link href={`/product/${product.slug}`} className="block">
          <h3 className="font-semibold text-oj-black leading-tight mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-xs text-oj-gray-800">{formatPrice(price)}</p>
        </Link>
        <div className="mt-3 flex items-center justify-between">
          <button
            onClick={handleAdd}
            disabled={adding}
            className="flex-1 bg-oj-red text-white text-xs font-bold px-3 py-2 rounded-lg disabled:opacity-60 hover:bg-red-800 transition-colors flex items-center justify-center gap-1.5"
          >
            {adding ? (
              <Plus className="w-3 h-3 animate-spin" />
            ) : (
              <>
                <Plus className="w-3 h-3" /> Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
