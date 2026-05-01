import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

const STATUS_VARIANT: Record<string, "warning" | "accent" | "success" | "default"> = {
  PENDING: "warning",
  UNDER_REVIEW: "accent",
  ACTIVE: "success",
  PAUSED: "default",
};

export default async function AdminCandidatesPage() {
  const candidates = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Candidates</h1>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Email</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Matches</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{c.name ?? "—"}</td>
                <td className="px-4 py-3 text-slate-500">{c.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[c.status] ?? "default"}>{c.status}</Badge>
                </td>
                <td className="px-4 py-3 text-slate-500">{c._count.matches}</td>
                <td className="px-4 py-3 text-slate-400">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/candidates/${c.id}`} className="text-accent hover:underline text-xs font-medium">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">No candidates yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
