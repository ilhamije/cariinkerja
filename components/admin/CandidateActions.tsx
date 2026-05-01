"use client";

import { useTransition, useState } from "react";
import Button from "@/components/ui/Button";
import { updateCandidateStatus } from "@/lib/actions/candidates";

const STATUSES = ["PENDING", "UNDER_REVIEW", "ACTIVE", "PAUSED"] as const;

export default function CandidateActions({
  candidateId,
  currentStatus,
}: {
  candidateId: string;
  currentStatus: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleStatusChange(status: string) {
    startTransition(async () => {
      const result = await updateCandidateStatus(candidateId, status);
      setMessage(result.message);
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm font-medium text-slate-700 mb-3">Update status</p>
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <Button
            key={s}
            size="sm"
            variant={currentStatus === s ? "primary" : "outline"}
            disabled={isPending || currentStatus === s}
            onClick={() => handleStatusChange(s)}
          >
            {s.replace("_", " ")}
          </Button>
        ))}
      </div>
      {message && <p className="mt-3 text-sm text-green-600">{message}</p>}
    </div>
  );
}
