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

      {/* Content — pt-14 offsets the fixed mobile top bar */}
      <main className="flex-1 bg-slate-50 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
