"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function CartPage() {
  const { items, loading, itemCount, subtotal, updateQuantity, removeItem } = useCart();
  const { toast } = useToast();
  const [coupon, setCoupon] = useState("");
  const [couponValid, setCouponValid] = useState(false);

  const shippingFee = 50000;
  const discount = couponValid ? Math.floor(subtotal * 0.1) : 0;
  const total = subtotal + shippingFee - discount;

  useEffect(() => {
    if (coupon === "SAVE10") setCouponValid(true);
    else if (coupon) setCouponValid(false);
  }, [coupon]);

  if (loading) {
    return (
      <div className="py-8 px-4 max-w-3xl mx-auto">
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 items-center p-4 bg-white rounded-xl border border-oj-border">
              <div className="w-24 h-24 bg-oj-gray-200 rounded-xl animate-pulse" />
              <div className="flex-1 flex flex-col gap-2">
                <div className="h-4 bg-oj-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-12 bg-oj-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-oj-gray-200 rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-oj-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-oj-black mb-2">Your cart is empty</h2>
        <p className="text-oj-gray-800 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="py-8 px-4">
      <Link href="/" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">Home</Link>
      <div className="max-w-4xl mx-auto">
        <div className="grid gap-6 lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3 space-y-4">
            <h2 className="text-2xl font-bold text-oj-black">Your Cart ({itemCount})</h2>
            {items.map((item) => {
              const product = item.product;
              const images = Array.isArray(product?.images) && product.images.length
                ? product.images
                : [`https://placehold.co/400x400?text=${encodeURIComponent(product?.name || "Product")}`];
              const itemPrice = product?.is_flash_deal && product?.flash_deal_price != null ? product.flash_deal_price : product?.price || 0;
              return (
                <div key={item.id} className="flex gap-4 items-start p-4 bg-white rounded-xl border border-oj-border shadow-sm">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-oj-gray-100">
                    <Image src={images[0]} alt={product?.name} fill className="object-cover object-center" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${product?.slug}`} className="block">
                      <h3 className="font-semibold text-oj-black leading-tight mb-1 line-clamp-2">{product?.name || "Product"}</h3>
                    </Link>
                    <p className="text-sm text-oj-gray-800 mb-1">
                      Size: <span className="font-medium">{item.size}</span> | Color: <span className="font-medium capitalize">{item.color}</span>
                    </p>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-lg font-bold text-oj-black">{formatPrice(itemPrice)}</span>
                      {item.quantity > 1 && <span className="text-sm text-oj-gray-800">x{item.quantity}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 rounded border border-oj-border bg-white flex items-center justify-center text-oj-black disabled:opacity-50"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-oj-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-oj-border bg-white flex items-center justify-center text-oj-black hover:bg-oj-gray-100"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-2 p-1.5 rounded text-oj-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <span className="w-4 h-4">✕</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-bold text-oj-black mb-6">Order Summary</h2>
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-oj-gray-800">
                  <span>Subtotal ({itemCount} items)</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-oj-gray-800">
                  <span>Shipping</span>
                  <span className="font-medium">{formatPrice(shippingFee)}</span>
                </div>
                {couponValid && (
                  <div className="flex justify-between text-green-700 font-medium">
                    <span>Discount (SAVE10)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {!coupon && (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 rounded border border-oj-border text-sm focus:outline-none focus:ring-2 focus:ring-oj-red"
                    />
                    <button className="px-3 py-2 bg-oj-gray-100 text-oj-black text-sm rounded hover:bg-oj-gray-200">
                      Apply
                    </button>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-oj-border text-lg font-bold">
                  <span className="text-oj-black">Total</span>
                  <span className="text-oj-red">{formatPrice(total)}</span>
                </div>
              </div>
              <Button
                className="w-full py-4 text-lg font-semibold bg-oj-red text-white hover:bg-red-800 transition-colors"
              >
                Proceed to Checkout
              </Button>
              <p className="mt-4 text-xs text-center text-oj-gray-800">Secure checkout with Stripe</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

