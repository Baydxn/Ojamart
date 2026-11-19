"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Grid, ShoppingCart, ListOrdered, User } from "lucide-react";
import { useCart } from "@/hooks/use-cart";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/categories", label: "Categories", icon: Grid },
  { href: "/cart", label: "Cart", icon: ShoppingCart },
  { href: "/orders", label: "Orders", icon: ListOrdered },
  { href: "/account", label: "Account", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-oj-border">
      <div className="flex items-center justify-around h-14 md:h-20 px-2 md:px-0">
        {NAV_LINKS.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-1.5 md:px-4 text-sm font-medium transition-colors",
                isActive ? "text-oj-red" : "text-oj-gray-600",
              )}
            >
              <Icon className={cn("w-5 h-5 md:w-6 md:h-6", isActive ? "fill-oj-red" : "")} />
              <span className={isActive ? "font-bold" : ""}>{link.label}</span>
              {link.label === "Cart" && itemCount > 0 && (
                <span className="absolute top-1 right-0 w-2.5 h-2.5 rounded-full bg-oj-red border-2 border-white">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
