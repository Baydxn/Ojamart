import type { Metadata } from "next";
import { SideNav } from "@/components/admin/side-nav";
import { TopBar } from "@/components/admin/top-bar";
import { SearchModal } from "@/components/admin/search-modal";
import { getServerSession } from "@/actions/admin/auth";

export const metadata: Metadata = {
  title: "Ojamart Admin",
  description: "Ojamart E-Commerce Administration Panel",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen flex overflow-hidden bg-oj-gray-50 text-oj-black antialiased">
      <SideNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto bg-oj-gray-50">
          {children}
        </main>
      </div>
      <SearchModal />
    </div>
  );
}
