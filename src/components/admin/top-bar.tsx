"use client";

import { useState } from "react";
import { Bell, Search, UserCircle, Menu, X, ShoppingCart } from "lucide-react";

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 border-b border-oj-border bg-white/90 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100 transition-colors md:hidden" aria-label="Toggle sidebar">
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden md:flex items-center gap-4 max-w-[600px] mx-10">
          <Search className="w-4 h-4 text-oj-gray-800" />
          <input
            type="text"
            placeholder="Search orders, products, customers..."
            className="w-full pl-8 pr-4 py-2 rounded-xl border-oj-border bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-oj-red"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100 transition-colors" aria-label="Notifications">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 rounded-lg text-oj-gray-800 hover:bg-oj-gray-100 transition-colors" aria-label="Cart">
          <ShoppingCart className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-oj-black flex items-center justify-center text-white text-xs font-bold">
          A
        </div>
      </div>
    </header>
  );
}