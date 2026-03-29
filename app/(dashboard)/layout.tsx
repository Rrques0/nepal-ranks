import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 main-content overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
