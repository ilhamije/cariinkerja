import { prisma } from "@/lib/prisma";
import MatchForm from "@/components/admin/MatchForm";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminMatchesPage() {
  const [candidates, jobs, matches] = await Promise.all([
    prisma.user.findMany({ where: { status: "ACTIVE" }, orderBy: { name: "asc" } }),
    prisma.job.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }),
    prisma.match.findMany({
      include: { user: true, job: true },
      orderBy: { createdAt: "desc" },
      take: 30,
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary mb-8">Matches</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold text-primary mb-4">Create match</h2>
          <MatchForm candidates={candidates} jobs={jobs} />
        </div>

        <div>
          <h2 className="font-semibold text-primary mb-4">Recent matches</h2>
          <div className="flex flex-col gap-3">
            {matches.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-xl p-4 text-sm">
                <p className="font-medium text-slate-800">{m.user.name ?? m.user.email}</p>
                <p className="text-slate-500 mt-0.5">→ {m.job.title} at {m.job.company}</p>
                <div className="mt-2 flex items-center gap-2">
                  {m.matchRate != null && (
                    <Badge variant="accent">{m.matchRate}% match</Badge>
                  )}
                  <Badge variant={m.notified ? "success" : "warning"}>
                    {m.notified ? "Notified" : "Pending notify"}
                  </Badge>
                  <span className="text-xs text-slate-400 ml-auto">{formatDate(m.createdAt)}</span>
                </div>
                {m.note && <p className="mt-2 text-xs text-slate-400 italic">{m.note}</p>}
              </div>
            ))}
            {matches.length === 0 && (
              <p className="text-slate-400 text-sm">No matches yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
