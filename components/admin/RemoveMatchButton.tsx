"use client";

import { useTransition } from "react";
import { deleteMatch } from "@/lib/actions/matches";

export default function RemoveMatchButton({
  matchId,
  candidateId,
}: {
  matchId: string;
  candidateId: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        startTransition(async () => { await deleteMatch(matchId, candidateId); })
      }
      className="text-xs text-red-500 hover:text-red-700 disabled:opacity-40 transition-colors"
    >
      {isPending ? "Removing…" : "Remove"}
    </button>
  );
}
