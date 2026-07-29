import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/layout/user/DashboardSidebar";
import { DashboardHeader } from "@/layout/user/DashboardHeader";
import { requireAuth } from "@/lib/requireAuth";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth(["user", "admin"]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <DashboardSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <main className="flex-1 overflow-auto bg-background p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
