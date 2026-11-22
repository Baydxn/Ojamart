"use client";

import { usePathname } from "next/navigation";
import { TopNav } from "@/components/layout/top-nav";
import { BottomNav } from "@/components/layout/bottom-nav";

export function StorefrontShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <div className="relative z-0">
      <TopNav />
      <main className="relative z-0 w-full pt-20 md:pt-18 pb-24 overflow-x-clip">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
