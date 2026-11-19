import { getOrders } from "@/lib/queries";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, Clock, CheckCircle2, Package, XCircle, Truck } from "lucide-react";

const STATUS_ICON: Record<string, React.ComponentType<any>> = {
  pending: Clock,
  paid: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: XCircle,
  refunded: XCircle,
};

export default async function OrdersPage() {
  // In a real app, get userId from session/auth. Here we rely on RLS.
  const orders = await getOrders("current-user").catch(() => []);

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Link href="/account" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">
        Account
      </Link>
      <h1 className="text-2xl font-bold text-oj-black mb-6">Order History</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-full bg-oj-gray-100 flex items-center justify-center mx-auto mb-4">
            <ListOrdered className="w-8 h-8 text-oj-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-oj-black mb-2">No orders yet</h2>
          <p className="text-oj-gray-800 mb-6">Your order history will appear here.</p>
          <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-oj-border p-5 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="font-semibold text-oj-black">Order #{order.orderNumber}</h3>
                  <p className="text-sm text-oj-gray-800">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={order.paymentStatus === "paid" ? "success" : "warning"}>
                  {order.paymentStatus}
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-oj-gray-800 text-xs">Status</p>
                  <p className="font-medium text-oj-black capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-oj-gray-800 text-xs">Subtotal</p>
                  <p className="font-medium text-oj-black">{formatPrice(order.subtotal)}</p>
                </div>
                <div>
                  <p className="text-oj-gray-800 text-xs">Shipping</p>
                  <p className="font-medium text-oj-black">{formatPrice(order.shippingFee)}</p>
                </div>
                <div>
                  <p className="text-oj-gray-800 text-xs">Total</p>
                  <p className="font-medium text-oj-red">{formatPrice(order.total)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/orders/${order.id}`}
                  className="flex-1 bg-oj-gray-100 text-oj-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-oj-gray-200 transition-colors text-center"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
