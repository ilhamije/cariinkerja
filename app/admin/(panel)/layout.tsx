import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { computeAdminToken } from "@/lib/admin-token";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdminByEmail = session?.user.isAdmin;

  if (!isAdminByEmail) {
    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;
    const expected = await computeAdminToken();
    if (!adminToken || adminToken !== expected) redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar userEmail={session?.user.email ?? undefined} />

      {/* mt-14 on mobile clears the fixed top bar, then p-* adds proper breathing room */}
      <main className="flex-1 bg-slate-50 overflow-auto">
        <div className="mt-14 lg:mt-0 p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
