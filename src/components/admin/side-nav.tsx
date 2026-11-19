"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingCart, Package, Users, Settings, Search as SearchIcon, ChevronRight, LogOut, TrendingUp, Globe, FileText, BarChart3, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { name: "Home", href: "/admin", icon: LayoutDashboard },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Discounts", href: "/admin/discounts", icon: Tag },
  { name: "Content", href: "/admin/content", icon: FileText },
  { name: "Markets", href: "/admin/markets", icon: Globe },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function SideNav() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); window.dispatchEvent(new CustomEvent("admin:open-search")); } };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <aside className={`fixed left-0 top-0 bottom-0 z-50 border-r border-oj-border bg-white transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 px-3 py-4 border-b border-oj-border bg-white">
          <div className="w-8 h-8 rounded-sm bg-oj-red flex items-center justify-center text-white font-bold text-xs shadow-sm">O</div>
          {!collapsed && <span className="font-bold text-xl tracking-tight text-oj-black">Ojamart</span>}
        </div>
        <div className={cn("px-3 py-2 border-b border-oj-border bg-white", collapsed && "justify-center")}>
          <button onClick={() => window.dispatchEvent(new CustomEvent("admin:open-search"))} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-oj-border bg-white text-sm hover:bg-oj-gray-50 transition-colors", collapsed ? "justify-center" : "justify-between")}>
            <SearchIcon className="w-4 h-4 text-oj-gray-800" />
            {!collapsed && <span className="text-oj-gray-800">Search</span>}
            <span className="text-xs text-oj-gray-500">⌘K</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {NAV.map((item) => (
            <Link key={item.name} href={item.href} className={cn("flex w-full items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", isActive(item.href) ? "bg-oj-red/10 text-oj-red border-l-2 border-oj-red" : "text-oj-gray-700 hover:bg-oj-gray-100 hover:text-oj-black", collapsed ? "justify-center" : "")}>
              <item.icon className={cn("w-5 h-5", collapsed && "mx-auto")} />
              {!collapsed && item.name}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-oj-border bg-white">
          <button onClick={() => { window.location.href = "/admin/auth/signout"; }} className={cn("w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors", collapsed ? "justify-center" : "")}>
            <LogOut className="w-4 h-4" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}