import { getAddresses, getProfile, getOrders } from "@/lib/queries";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, ListOrdered, MapPin, Phone, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AccountPage() {
  const [profile, addresses, orders] = await Promise.all([
    getProfile("current-user").catch(() => null),
    getAddresses("current-user").catch(() => []),
    getOrders("current-user").catch(() => []),
  ]);

  return (
    <div className="py-8 px-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-oj-black mb-6">My Account</h1>
      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-oj-gray-100 flex items-center justify-center">
                <User className="w-8 h-8 text-oj-gray-500" />
              </div>
              <div>
                <h2 className="font-bold text-oj-black">{profile?.fullName || "Customer"}</h2>
                <p className="text-sm text-oj-gray-800">{profile?.email || "No email"}</p>
              </div>
            </div>
            <div className="space-y-4">
              {profile?.phone && (
                <div className="flex items-center gap-3 text-sm text-oj-gray-800">
                  <Phone className="w-4 h-4 text-oj-red" />
                  <span>{profile.phone}</span>
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-3 text-sm text-oj-gray-800">
                  <Mail className="w-4 h-4 text-oj-red" />
                  <span>{profile.email}</span>
                </div>
              )}
              <Link href="/account" className="text-sm font-semibold text-oj-red hover:text-red-800 transition-colors">
                Edit Profile
              </Link>
            </div>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm">
            <h3 className="font-bold text-oj-black mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-oj-red" /> Delivery Addresses
            </h3>
            {addresses.length === 0 ? (
              <p className="text-sm text-oj-gray-800">No saved addresses.</p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-3 rounded-lg border border-oj-border bg-oj-gray-50">
                    <p className="text-sm font-medium text-oj-black">{addr.fullName}</p>
                    <p className="text-xs text-oj-gray-800">{addr.addressLine}, {addr.city}, {addr.state}</p>
                    {addr.isDefault && (
                      <Badge variant="success" className="text-xs mt-1 inline-block">Default</Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
            <Button className="w-full" onClick={() => {}}>
              Add Address
            </Button>
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="bg-white rounded-xl border border-oj-border p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-oj-black">Recent Orders</h3>
              <Link href="/orders" className="text-sm font-semibold text-oj-red hover:text-red-800">View all</Link>
            </div>
            {orders.length === 0 ? (
              <p className="text-sm text-oj-gray-800">No recent orders.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 3).map((order) => (
                  <div key={order.id} className="p-3 rounded-lg border border-oj-border bg-oj-gray-50">
                    <p className="text-sm font-medium text-oj-black">Order #{order.orderNumber}</p>
                    <p className="text-xs text-oj-gray-800">{formatPrice(order.total)}</p>
                    <p className="text-xs text-oj-gray-600">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
