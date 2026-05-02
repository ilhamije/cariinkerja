import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import CandidateActions from "@/components/admin/CandidateActions";
import CandidateJobMatcher from "@/components/admin/CandidateJobMatcher";
import RemoveMatchButton from "@/components/admin/RemoveMatchButton";
import Link from "next/link";

const STATUS_VARIANT: Record<string, "warning" | "accent" | "success" | "default"> = {
  PENDING: "warning",
  UNDER_REVIEW: "accent",
  ACTIVE: "success",
  PAUSED: "default",
};

interface Props {
  params: Promise<{ id: string }>;
}

function safeParsePrefs(raw: string | null): { roles?: string; locations?: string } | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return { roles: raw };
  }
}

export default async function AdminCandidateDetailPage({ params }: Props) {
  const { id } = await params;

  const [candidate, publishedJobs] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        matches: {
          include: { job: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.job.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!candidate) notFound();

  const prefs = safeParsePrefs(candidate.preferences as string | null);

  const matchedJobIds = new Set(candidate.matches.map((m) => m.jobId));
  const unmatchedJobs = publishedJobs.filter((j) => !matchedJobIds.has(j.id));

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-1">
        <Link href="/admin/candidates" className="text-sm text-slate-400 hover:text-slate-600">
          ← Candidates
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-primary mb-1">{candidate.name ?? "Unknown"}</h1>
      <p className="text-slate-500 text-sm mb-8">
        {candidate.email} · {candidate.provider} · Joined {formatDate(candidate.createdAt)}
      </p>

      {/* Profile card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col gap-4 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-500">Status</span>
          <Badge variant={STATUS_VARIANT[candidate.status] ?? "default"}>
            {candidate.status.replace("_", " ")}
          </Badge>
        </div>
        {candidate.linkedinUrl && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">LinkedIn</span>
            <a
              href={candidate.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              View profile →
            </a>
          </div>
        )}
        {candidate.cvUrl ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">CV</span>
            <a
              href={candidate.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-accent hover:underline"
            >
              Download CV →
            </a>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-500">CV</span>
            <span className="text-sm text-slate-300">Not uploaded</span>
          </div>
        )}
        {prefs && (
          <div className="flex flex-col gap-1 pt-1 border-t border-slate-100">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Preferences</span>
            {prefs.roles && <p className="text-sm text-slate-700">{prefs.roles}</p>}
            {prefs.locations && <p className="text-sm text-slate-400">{prefs.locations}</p>}
          </div>
        )}
      </div>

      {/* Status actions */}
      <div className="mb-6">
        <CandidateActions candidateId={id} currentStatus={candidate.status} />
      </div>

      {/* Matched jobs */}
      <h2 className="font-semibold text-primary mb-3">
        Matched jobs{" "}
        <span className="text-slate-400 font-normal text-sm">({candidate.matches.length})</span>
      </h2>

      {candidate.matches.length > 0 ? (
        <div className="flex flex-col gap-2 mb-6">
          {candidate.matches.map((m) => (
            <div
              key={m.id}
              className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 truncate">
                  {m.job.title}{" "}
                  <span className="font-normal text-slate-500">— {m.job.company}</span>
                </p>
                <div className="flex items-center gap-3 mt-1">
                  {m.matchRate != null && (
                    <span className="text-xs text-slate-400">{m.matchRate}% match</span>
                  )}
                  {m.notified && (
                    <span className="text-xs text-green-600">Notified</span>
                  )}
                  <span className="text-xs text-slate-300">{formatDate(m.createdAt)}</span>
                </div>
                {m.note && <p className="text-xs text-slate-400 mt-1">{m.note}</p>}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/jobs/${m.job.slug}`}
                  target="_blank"
                  className="text-xs text-accent hover:underline"
                >
                  View job
                </Link>
                <RemoveMatchButton matchId={m.id} candidateId={id} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-400 mb-6">No matches yet.</p>
      )}

      {/* Add match */}
      <CandidateJobMatcher candidateId={id} jobs={unmatchedJobs} />
    </div>
  );
}
