import { getOrderById } from "@/lib/queries";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ListOrdered, Package, Truck, CheckCircle2, Clock } from "lucide-react";

const STATUS_ICON: Record<string, any> = {
  pending: Clock,
  paid: CheckCircle2,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle2,
  cancelled: Clock,
  refunded: Clock,
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrderById(id, "current-user").catch(() => null);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-oj-black mb-2">Order not found</h2>
        <p className="text-oj-gray-800 mb-6">The order you're looking for doesn't exist.</p>
        <Link href="/orders" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors inline-block">
          Back to Orders
        </Link>
      </div>
    );
  }

  const STATUS_LABEL: Record<string, string> = {
    pending: "Pending",
    paid: "Paid",
    processing: "Processing",
    shipped: "Shipped",
    delivered: "Delivered",
    cancelled: "Cancelled",
    refunded: "Refunded",
  };
  const StatusIcon = STATUS_ICON[order.status] ?? Clock;

  return (
    <div className="py-8 px-4 max-w-4xl mx-auto">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-oj-gray-800 mb-6">
        Order History
      </Link>
      <h1 className="text-2xl font-bold text-oj-black mb-6">Order #{order.orderNumber}</h1>
      <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <p className="text-xs text-oj-gray-800 uppercase tracking-wider font-semibold mb-1">Order Date</p>
            <p className="text-oj-gray-800">{new Date(order.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-oj-gray-800 uppercase tracking-wider font-semibold mb-1">Status</p>
            <div className="flex items-center gap-2">
              <StatusIcon className="w-4 h-4" />
              <span className="font-medium text-oj-black capitalize">{STATUS_LABEL[order.status] || order.status}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-oj-gray-800 uppercase tracking-wider font-semibold mb-1">Payment</p>
            <span className={`font-medium ${order.paymentStatus === "paid" ? "text-green-700" : "text-oj-gray-800"}`}>
              {order.paymentStatus}
            </span>
          </div>
        </div>
        <div className="border-t border-oj-border pt-6">
          <h3 className="font-semibold text-oj-black mb-4">Order Items</h3>
          <div className="space-y-4">
            {(order.orderItems || []).map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b border-oj-gray-100 pb-4 last:border-0">
                <div className="w-16 h-16 rounded-lg bg-oj-gray-100 flex items-center justify-center overflow-hidden">
                  <span className="text-xs font-medium text-oj-gray-800">{item.quantity}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-oj-black">{item.productName}</h4>
                  <p className="text-sm text-oj-gray-800">Size: {item.size} | Color: {item.color}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-oj-black">{formatPrice(item.price)} x{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-oj-border">
            <div className="flex justify-between mb-2">
              <span className="text-oj-gray-800">Subtotal</span>
              <span className="font-medium text-oj-black">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-oj-gray-800">Shipping</span>
              <span className="font-medium text-oj-black">{formatPrice(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-oj-gray-800">Tax</span>
              <span className="font-medium text-oj-black">{formatPrice(order.tax)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-oj-red">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Link href="/orders" className="px-6 py-3 rounded-lg border border-oj-border font-semibold text-oj-black hover:bg-oj-gray-100 transition-colors">
          Back to Orders
        </Link>
        <Link href="/" className="bg-oj-red text-white px-8 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
