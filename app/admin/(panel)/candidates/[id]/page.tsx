import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import CandidateActions from "@/components/admin/CandidateActions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCandidateDetailPage({ params }: Props) {
  const { id } = await params;
  const candidate = await prisma.user.findUnique({
    where: { id },
    include: { matches: { include: { job: true } } },
  });
  if (!candidate) notFound();

  const prefs = candidate.preferences
    ? (JSON.parse(candidate.preferences as string) as { roles?: string; locations?: string })
    : null;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-2">{candidate.name ?? "Unknown"}</h1>
      <p className="text-slate-500 text-sm mb-8">{candidate.email} · {candidate.provider} · Joined {formatDate(candidate.createdAt)}</p>

      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Status</span>
          <Badge variant={candidate.status === "ACTIVE" ? "success" : candidate.status === "PENDING" ? "warning" : "default"}>
            {candidate.status}
          </Badge>
        </div>
        {candidate.linkedinUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">LinkedIn</span>
            <a href={candidate.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              View profile →
            </a>
          </div>
        )}
        {candidate.cvUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">CV</span>
            <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline">
              Download CV →
            </a>
          </div>
        )}
        {prefs && (
          <div className="flex flex-col gap-1">
            <span className="text-sm text-slate-500">Preferences</span>
            <p className="text-sm">{prefs.roles}</p>
            <p className="text-sm text-slate-400">{prefs.locations}</p>
          </div>
        )}
      </div>

      <CandidateActions candidateId={id} currentStatus={candidate.status} />

      {candidate.matches.length > 0 && (
        <div className="mt-8">
          <h2 className="font-semibold text-primary mb-3">Matched jobs</h2>
          <div className="flex flex-col gap-2">
            {candidate.matches.map((m) => (
              <div key={m.id} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm">
                <p className="font-medium">{m.job.title} — {m.job.company}</p>
                {m.note && <p className="text-slate-400 text-xs mt-1">{m.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
