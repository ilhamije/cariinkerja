import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { signIn } from "@/lib/auth";
import { cookies } from "next/headers";
import { computeAdminToken } from "@/lib/admin-token";

export default async function DevLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (process.env.NODE_ENV === "production") redirect("/");

  const cookieStore = await cookies();
  const adminToken = cookieStore.get("admin_token")?.value;
  const expected = await computeAdminToken();
  const isUnlocked = adminToken && adminToken === expected;

  const { error } = await searchParams;

  // --- Password gate ---
  async function unlock(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;
    if (password !== process.env.ADMIN_PASSWORD) {
      redirect("/dev-login?error=1");
    }
    const token = await computeAdminToken();
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    redirect("/dev-login");
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-xs">
          <div className="mb-6 text-center">
            <div className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              Dev only
            </div>
            <h1 className="text-xl font-bold text-slate-800">Dev login</h1>
            <p className="text-sm text-slate-500 mt-1">Enter the admin password to continue</p>
          </div>

          <form action={unlock} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-3">
            <input
              type="password"
              name="password"
              placeholder="Admin password"
              autoFocus
              className="h-10 w-full rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {error && <p className="text-xs text-red-500">Wrong password.</p>}
            <button
              type="submit"
              className="h-10 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- User picker ---
  const users = await prisma.user.findMany({ orderBy: { name: "asc" } });

  const STATUS_COLOR: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-700",
    UNDER_REVIEW: "bg-blue-100 text-blue-700",
    ACTIVE: "bg-green-100 text-green-700",
    PAUSED: "bg-slate-100 text-slate-500",
  };

  async function loginAs(formData: FormData) {
    "use server";
    const email = formData.get("email") as string;
    await signIn("dev", { email, redirectTo: "/dashboard" });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="inline-block bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            Dev only
          </div>
          <h1 className="text-xl font-bold text-slate-800">Login as candidate</h1>
          <p className="text-sm text-slate-500 mt-1">Bypasses OAuth — development only</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
          {users.map((user) => (
            <form key={user.id} action={loginAs}>
              <input type="hidden" name="email" value={user.email} />
              <button
                type="submit"
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors text-left"
              >
                <div>
                  <p className="text-sm font-medium text-slate-800">{user.name ?? user.email}</p>
                  <p className="text-xs text-slate-400">{user.email}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLOR[user.status] ?? "bg-slate-100 text-slate-500"}`}>
                  {user.status.replace("_", " ")}
                </span>
              </button>
            </form>
          ))}

          {users.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              No users in DB. Run <code className="bg-slate-100 px-1 rounded">npx prisma db seed</code> first.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
