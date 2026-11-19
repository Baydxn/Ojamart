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
    return null;
  }

  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-oj-gray-50 text-oj-black antialiased">
        <div className="flex h-screen overflow-hidden">
          <SideNav />
          <div className="flex-1 flex flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-y-auto bg-oj-gray-50">
              {children}
            </main>
          </div>
        </div>
        <SearchModal />
        <style>{`
          body { margin: 0; font-family: var(--font-sans); }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        `}</style>
      </body>
    </html>
  );
}