import { getOrderById } from "@/lib/queries";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Truck } from "lucide-react";

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams?: { session_id?: string };
}) {
  const sessionId = searchParams?.session_id;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-6">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h1 className="text-3xl font-bold text-oj-black mb-2">Order Placed Successfully!</h1>
      <p className="text-oj-gray-800 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
      {sessionId && (
        <div className="bg-white p-6 rounded-xl border border-oj-border shadow-sm mb-8 max-w-md w-full">
          <h3 className="font-semibold text-oj-black mb-2">Order Confirmation</h3>
          <p className="text-sm text-oj-gray-800 mb-2">Payment verified securely via Stripe.</p>
          <p className="text-xs text-oj-gray-600 mb-4">Session: {sessionId}</p>
          <Link href="/orders" className="inline-flex items-center gap-1 text-sm font-semibold text-oj-red hover:text-red-800">
            View Order History <Truck className="w-3 h-3" />
          </Link>
        </div>
      )}
      <div className="flex gap-3">
        <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
          Continue Shopping
        </Link>
        <Link href="/account" className="px-8 py-3 rounded-lg border border-oj-border font-semibold text-oj-black hover:bg-oj-gray-100 transition-colors">
          My Account
        </Link>
      </div>
    </div>
  );
}
