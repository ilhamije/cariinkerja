import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { computeAdminToken } from "@/lib/admin-token";
import Link from "next/link";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/jobs", label: "Jobs" },
  { href: "/admin/candidates", label: "Candidates" },
  { href: "/admin/matches", label: "Matches" },
];

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
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-primary text-white flex flex-col">
        <div className="p-5 border-b border-white/10">
          <Link href="/" className="text-lg font-bold">CariinKerja</Link>
          <p className="text-xs text-white/60 mt-0.5">Admin panel</p>
        </div>
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-2 rounded-lg text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/50">
            {session?.user.email ?? "Password auth"}
          </p>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 bg-slate-50 p-8 overflow-auto">{children}</main>
    </div>
  );
}
