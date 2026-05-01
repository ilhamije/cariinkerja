import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const [totalJobs, publishedJobs, totalCandidates, pendingCandidates, activeCandidates, totalMatches] =
    await Promise.all([
      prisma.job.count(),
      prisma.job.count({ where: { published: true } }),
      prisma.user.count(),
      prisma.user.count({ where: { status: "PENDING" } }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
      prisma.match.count(),
    ]);

  const stats = [
    { label: "Total jobs", value: totalJobs, sub: `${publishedJobs} published`, href: "/admin/jobs" },
    { label: "Candidates", value: totalCandidates, sub: `${pendingCandidates} pending review`, href: "/admin/candidates" },
    { label: "Active profiles", value: activeCandidates, sub: "receiving matches", href: "/admin/candidates" },
    { label: "Matches sent", value: totalMatches, sub: "total", href: "/admin/matches" },
  ];

  const newCandidates = await prisma.user.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map(({ label, value, sub, href }) => (
          <Link key={label} href={href} className="bg-white rounded-xl border border-slate-200 p-5 hover:border-accent transition-colors">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="text-3xl font-bold text-primary mt-1">{value}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
          </Link>
        ))}
      </div>

      {newCandidates.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-primary">New candidates to review</h2>
            <Link href="/admin/candidates" className="text-sm text-accent hover:underline">View all →</Link>
          </div>
          <div className="divide-y divide-slate-100">
            {newCandidates.map((c) => (
              <Link key={c.id} href={`/admin/candidates/${c.id}`} className="flex items-center justify-between py-3 hover:bg-slate-50 px-2 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.name ?? "—"}</p>
                  <p className="text-xs text-slate-400">{c.email}</p>
                </div>
                <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Pending</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
