"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase-client";
import { X, Search, Package, ShoppingCart, Users, DollarSign, Tag, FileText, Globe, BarChart3, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onOpenSearch = () => setIsOpen(true);
    window.addEventListener("admin:open-search", onOpenSearch);
    return () => window.removeEventListener("admin:open-search", onOpenSearch);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      const supabase = createClient();
      const [products, orders, customers] = await Promise.all([
        supabase.from("products").select("name").eq("is_active", true).ilike("name", `%${query}%`).limit(5),
        supabase.from("orders").select("order_number, customer_name").ilike("order_number", `%${query}%`).limit(5),
        supabase.from("profiles").select("full_name, email").ilike("email", `%${query}%`).eq("role", "customer").limit(5),
      ]);
      setResults([
        ...((products.data || [])).map((p: any) => ({ type: "product", label: p.name, href: `/admin/products?search=${encodeURIComponent(p.name)}`, icon: Package })),
        ...((orders.data || [])).map((o: any) => ({ type: "order", label: o.order_number, href: `/admin/orders?search=${encodeURIComponent(o.order_number)}`, icon: ShoppingCart })),
        ...((customers.data || [])).map((c: any) => ({ type: "customer", label: c.full_name || c.email, href: `/admin/customers?search=${encodeURIComponent(c.email)}`, icon: Users })),
      ]);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] bg-black/20" onClick={() => setIsOpen(false)}>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-oj-border">
          <Search className="w-4 h-4 text-oj-gray-800" />
          <input
            autoFocus
            type="text"
            placeholder="Search orders, products, customers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-3 pr-3 py-2 text-sm rounded-lg border-oj-border bg-white focus:outline-none focus:ring-2 focus:ring-oj-red"
          />
          <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-oj-gray-100">
            <X className="w-4 h-4 text-oj-gray-800" />
          </button>
        </div>
        {loading ? (
          <div className="p-4 text-sm text-oj-gray-800">Searching...</div>
        ) : query.length < 2 ? (
          <div className="p-4 text-sm text-oj-gray-800">Type at least 2 characters to search.</div>
        ) : results.length === 0 ? (
          <div className="p-4 text-sm text-oj-gray-800">No results found for "{query}".</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.map((r, i) => (
              <a key={i} href={r.href} className="flex items-center gap-3 px-4 py-3 border-b border-oj-border/50 hover:bg-oj-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-lg bg-oj-gray-100 flex items-center justify-center">
                  <r.icon className="w-4 h-4 text-oj-gray-800" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-oj-black truncate">{r.label}</div>
                  <div className="text-xs text-oj-gray-800">{r.type} results</div>
                </div>
                <ChevronRight className="w-4 h-4 text-oj-gray-600" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}