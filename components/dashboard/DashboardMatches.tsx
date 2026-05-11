"use client";

import { useEffect, useState, useTransition } from "react";
import JobCard from "@/components/jobs/JobCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { updateMatchStatus } from "@/lib/actions/matches";

interface Match {
  id: string;
  status: "PENDING" | "NOTIFIED" | "VIEWED" | "APPLIED" | "DISMISSED";
  matchRate: number | null;
  job: {
    id: string;
    slug: string;
    title: string;
    company: string;
    location: string;
    remote: boolean;
    type: string;
    salary?: string | null;
    tags: string[] | string;
    createdAt: Date;
  };
}

const MATCH_STATUS_VARIANT: Record<Match["status"], "warning" | "accent" | "success" | "default" | "danger"> = {
  PENDING: "warning",
  NOTIFIED: "accent",
  VIEWED: "default",
  APPLIED: "success",
  DISMISSED: "danger",
};

export default function DashboardMatches({ matches: initialMatches }: { matches: Match[] }) {
  const [matches, setMatches] = useState(initialMatches);
  const [isPending, startTransition] = useTransition();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const notifiedMatches = matches.filter((m) => m.status === "NOTIFIED");
    if (notifiedMatches.length === 0) return;

    // Auto-mark NOTIFIED matches as VIEWED
    notifiedMatches.forEach((match) => {
      startTransition(async () => {
        await updateMatchStatus(match.id, "VIEWED");
        setMatches((prev) =>
          prev.map((m) => (m.id === match.id ? { ...m, status: "VIEWED" } : m))
        );
      });
    });
  }, []);

  const handleStatusChange = (matchId: string, status: Match["status"]) => {
    setUpdatingId(matchId);
    startTransition(async () => {
      await updateMatchStatus(matchId, status);
      setMatches((prev) =>
        prev.map((m) => (m.id === matchId ? { ...m, status } : m))
      );
      setUpdatingId(null);
    });
  };

  return (
    <div className="space-y-4">
      {matches.map((match) => (
        <div
          key={match.id}
          className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start"
        >
          <div className="flex-1 min-w-0">
            <JobCard job={match.job} matchRate={match.matchRate} />
          </div>
          <div className="flex flex-col gap-2 w-full sm:w-auto shrink-0">
            <Badge variant={MATCH_STATUS_VARIANT[match.status]}>
              {match.status}
            </Badge>
            {match.status !== "APPLIED" && match.status !== "DISMISSED" && (
              <>
                <Button
                  size="sm"
                  variant={match.status === "APPLIED" ? "success" : "default"}
                  disabled={updatingId === match.id || match.status === "APPLIED"}
                  onClick={() => handleStatusChange(match.id, "APPLIED")}
                >
                  {updatingId === match.id ? "..." : "Applied"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={updatingId === match.id || match.status === "DISMISSED"}
                  onClick={() => handleStatusChange(match.id, "DISMISSED")}
                >
                  {updatingId === match.id ? "..." : "Dismiss"}
                </Button>
              </>
            )}
            {(match.status === "APPLIED" || match.status === "DISMISSED") && (
              <span className="text-xs text-slate-400">
                {match.status === "APPLIED" ? "Applied ✓" : "Dismissed"}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
