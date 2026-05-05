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

const STATUSES = ["PENDING", "UNDER_REVIEW", "ACTIVE", "PAUSED"];

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminCandidatesPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  const candidates = await prisma.user.findMany({
    where: {
      ...(status ? { status } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q } },
              { email: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { matches: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-6">Candidates</h1>

      {/* Filters */}
      <form method="GET" className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search by name or email…"
          className="h-9 flex-1 max-w-xs rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-9 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-9 px-4 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Filter
        </button>
        {(q || status) && (
          <a
            href="/admin/candidates"
            className="h-9 px-4 rounded-lg border border-slate-200 text-slate-500 text-sm font-medium hover:bg-slate-50 transition-colors flex items-center"
          >
            Clear
          </a>
        )}
      </form>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[560px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden md:table-cell">CV</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Matches</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden lg:table-cell">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <span>{c.name ?? "—"}</span>
                  <span className="block sm:hidden text-xs text-slate-400 font-normal">{c.email}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANT[c.status] ?? "default"}>
                    {c.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  {c.cvUrl ? (
                    <span className="text-green-600 text-xs font-medium">✓ Uploaded</span>
                  ) : (
                    <span className="text-slate-300 text-xs">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{c._count.matches}</td>
                <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">{formatDate(c.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/candidates/${c.id}`}
                    className="text-accent hover:underline text-xs font-medium whitespace-nowrap"
                  >
                    View →
                  </Link>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  {q || status ? "No candidates match your filters." : "No candidates yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400">{candidates.length} candidate{candidates.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
