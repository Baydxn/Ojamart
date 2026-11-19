"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Truck, CreditCard, Lock, ChevronRight } from "lucide-react";
import { createCheckoutSessionAction } from "@/lib/actions";

const SHIPPING_METHODS = [
  { id: "standard", name: "Standard Delivery", description: "3-5 business days", fee: 50000, minDays: 3, maxDays: 5 },
  { id: "express", name: "Express Delivery", description: "1-2 business days", fee: 100000, minDays: 1, maxDays: 2 },
];

export default function CheckoutPage() {
  const { items, subtotal, itemCount, clear } = useCart();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
  });

  const shippingMethod = SHIPPING_METHODS.find((m) => m.id === selectedShipping)!;
  const total = subtotal + shippingMethod.fee;

  useEffect(() => {
    if (!selectedShipping) setSelectedShipping("standard");
  }, []);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddress) {
      toast({ title: "Address required", description: "Please select or add a delivery address", variant: "destructive" });
      return;
    }
    if (items.length === 0) {
      toast({ title: "Cart empty", description: "Your cart is empty", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const lineItems = items.map((i) => ({
        productId: i.productId,
        productName: i.product?.name || "Product",
        price: i.product?.is_flash_deal && i.product?.flash_deal_price != null
          ? i.product.flash_deal_price
          : i.product?.price || 0,
        quantity: i.quantity,
      }));
      const res = await createCheckoutSessionAction({ items: lineItems, shippingFee: shippingMethod.fee });
      if (res.url) {
        window.location.href = res.url;
      } else {
        toast({ title: "Checkout failed", description: "Unable to start payment", variant: "destructive" });
      }
    } catch (err: any) {
      toast({ title: "Checkout failed", description: err.message || "Payment could not be processed", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 rounded-full bg-oj-gray-100 flex items-center justify-center mb-4">
          <span className="text-2xl">🛒</span>
        </div>
        <h2 className="text-xl font-bold text-oj-black mb-2">Your cart is empty</h2>
        <p className="text-oj-gray-800 mb-6">Add items to your cart before checking out.</p>
        <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block">
          Start Shopping
        </Link>
      </div>
    );
  }
  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <Link href="/cart" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">Cart</Link>
      <h1 className="text-2xl font-bold text-oj-black mb-8">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="w-5 h-5 text-oj-red" />
              <h2 className="font-bold text-oj-black">Delivery Address</h2>
            </div>
            <div className="space-y-3" id="address-list">
              <button
                onClick={() => setSelectedAddress(null)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${selectedAddress === null ? "bg-oj-red/10 border-oj-red text-oj-red" : "bg-white border-oj-border hover:bg-oj-gray-50"}`}
              >
                <div className={`w-5 h-5 rounded-full border-2 ${selectedAddress === null ? "bg-oj-red" : "bg-white"}`} />
                <span className="font-medium text-oj-black">Add a new address</span>
                <ChevronRight className="w-3 h-3 ml-auto" />
              </button>
              {[
                { id: "addr1", label: "123 Adeyemo Alakija Street, Victoria Island, Lagos" },
                { id: "addr2", label: "45b Allen Avenue, Ikeja, Lagos" },
              ].map((addr) => (
                <button
                  key={addr.id}
                  onClick={() => setSelectedAddress(addr.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${selectedAddress === addr.id ? "bg-oj-red/10 border-oj-red text-oj-red" : "bg-white border-oj-border hover:bg-oj-gray-50"}`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedAddress === addr.id ? "bg-oj-red" : "bg-white"}`} />
                  <span className="font-medium text-oj-black line-clamp-1">{addr.label}</span>
                  <ChevronRight className="w-3 h-3 ml-auto" />
                </button>
              ))}
            </div>
            {selectedAddress === null && (
              <div className="mt-4 p-4 rounded-lg border border-oj-border bg-oj-gray-50">
                <h3 className="font-semibold text-oj-black mb-3">Enter delivery address</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Full Name</label>
                    <Input
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Phone</label>
                    <Input
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <label className="text-sm font-medium text-oj-black">Address Line</label>
                    <Input
                      value={newAddress.addressLine}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-oj-black">City</label>
                      <Input
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-oj-black">State</label>
                      <Input
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-oj-black">Postal Code</label>
                    <Input
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm sticky top-24">
            <div className="flex items-center gap-2 mb-6">
              <Truck className="w-5 h-5 text-oj-red" />
              <h2 className="font-bold text-oj-black">Shipping Method</h2>
            </div>
            <div className="space-y-3">
              {SHIPPING_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedShipping(method.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${selectedShipping === method.id ? "bg-oj-red/10 border-oj-red" : "bg-white border-oj-border hover:bg-oj-gray-50"}`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-oj-black">{method.name}</span>
                      <span className="text-xs text-oj-gray-600">{method.description}</span>
                    </div>
                    <p className="text-xs text-oj-gray-800">{method.minDays}-{method.maxDays} days</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ${selectedShipping === method.id ? "bg-oj-red" : "bg-white"}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <CreditCard className="w-5 h-5 text-oj-red" />
              <h2 className="font-bold text-oj-black">Payment</h2>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-oj-border bg-oj-gray-50 mb-4">
              <div className="w-10 h-10 rounded bg-white flex items-center justify-center text-oj-red"><span className="text-sm">💳</span></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-oj-black">Secure Card Payment</p>
                <p className="text-xs text-oj-gray-600">Powered by Stripe</p>
              </div>
              <Lock className="w-4 h-4 text-oj-gray-600" />
            </div>
            <p className="text-xs text-oj-gray-600 mb-6">
              Your payment is securely processed by Stripe. We never store your card details.
            </p>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-oj-gray-800">Subtotal ({itemCount} items)</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-oj-gray-800">Shipping ({shippingMethod.name})</span><span className="font-medium">{formatPrice(shippingMethod.fee)}</span></div>
              <div className="flex justify-between pt-2 border-t border-oj-border text-lg font-bold"><span className="text-oj-black">Total</span><span className="text-oj-red">{formatPrice(total)}</span></div>
            </div>
            <Button
              onClick={handleCheckout}
              disabled={loading || !selectedAddress}
              className="w-full py-4 text-lg font-semibold bg-oj-red text-white hover:bg-red-800 transition-colors disabled:opacity-60"
            >
              {loading ? "Processing Payment..." : "Pay Now"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

