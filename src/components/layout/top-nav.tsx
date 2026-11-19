"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Search, ShoppingCart, Menu, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/account", label: "Account" },
];

export function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    toast({ title: "Search", description: `Searching for "${q}"...` });
    setSearchOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-oj-border">
      <div className="flex items-center justify-between px-4 md:px-6 h-16 md:h-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-sm bg-oj-red flex items-center justify-center text-white font-bold text-xs shadow-sm">
              O
            </div>
            <span className="font-display font-bold text-xl tracking-tight text-oj-black">Ojamart</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 max-w-[600px] mx-10">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-oj-gray-800 w-5 h-5" />
            <input
              type="text"
              placeholder="Search products, brands & more"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border-oj-border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-oj-red text-white rounded-lg px-4 py-2.5 text-sm font-medium hover:bg-red-800 transition-colors"
              aria-label="Search"
            >
              Search
            </button>
          </form>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            className="p-2.5 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100 transition-colors md:hidden"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            onClick={() => { toast({ title: "Cart", description: itemCount === 0 ? "Your cart is empty." : `You have ${itemCount} item(s) in your cart.` }); }}
            className="relative p-2.5 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100 transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-oj-red text-xs font-bold text-white border border-white">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="md:hidden border-t border-oj-border bg-white p-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search products"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 pl-4 pr-3 py-2 rounded-lg border-oj-border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red"
            />
            <button type="submit" className="bg-oj-red text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 transition-colors">
              Go
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="ml-2 p-2 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
