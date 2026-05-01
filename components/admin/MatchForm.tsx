"use client";

import { useState, useTransition } from "react";
import { User, Job } from "@prisma/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createMatch } from "@/lib/actions/matches";

export default function MatchForm({
  candidates,
  jobs,
}: {
  candidates: User[];
  jobs: Job[];
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createMatch(data);
      setMessage(result.message);
      if (result.ok) (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="userId" className="text-sm font-medium">Candidate</label>
        <select id="userId" name="userId" required className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">Select candidate…</option>
          {candidates.map((c) => (
            <option key={c.id} value={c.id}>{c.name ?? c.email}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="jobId" className="text-sm font-medium">Job</label>
        <select id="jobId" name="jobId" required className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
          <option value="">Select job…</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title} — {j.company}</option>
          ))}
        </select>
      </div>

      <Input label="Match rate (%)" id="matchRate" name="matchRate" type="number" min="0" max="100" placeholder="e.g. 85" />

      <Textarea label="Admin note (optional)" id="note" name="note" rows={3} placeholder="Why this match?" />

      {message && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{message}</p>
      )}

      <Button type="submit" disabled={isPending}>
        {isPending ? "Creating…" : "Create match & notify"}
      </Button>
    </form>
  );
}
