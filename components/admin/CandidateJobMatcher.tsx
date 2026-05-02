"use client";

import { useState, useTransition } from "react";
import { Job } from "@prisma/client";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import { createMatch } from "@/lib/actions/matches";

export default function CandidateJobMatcher({
  candidateId,
  jobs,
}: {
  candidateId: string;
  jobs: Job[];
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Job | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase())
  );

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    const data = new FormData(e.currentTarget);
    data.set("userId", candidateId);
    data.set("jobId", selected.id);
    startTransition(async () => {
      const result = await createMatch(data);
      setMessage({ text: result.message, ok: result.ok });
      if (result.ok) {
        setSelected(null);
        (e.target as HTMLFormElement).reset();
        setSearch("");
      }
    });
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <p className="text-sm font-medium text-slate-700 mb-3">Match to a job</p>

      {jobs.length === 0 ? (
        <p className="text-sm text-slate-400">All published jobs are already matched.</p>
      ) : (
        <>
          <input
            type="text"
            placeholder="Search jobs…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent mb-2"
          />

          <div className="max-h-48 overflow-y-auto flex flex-col gap-0.5 mb-4 border border-slate-100 rounded-lg">
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">No jobs match your search.</p>
            ) : (
              filtered.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => setSelected(selected?.id === j.id ? null : j)}
                  className={`text-left px-3 py-2.5 text-sm transition-colors first:rounded-t-lg last:rounded-b-lg ${
                    selected?.id === j.id
                      ? "bg-accent/20 text-primary font-medium"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className="font-medium">{j.title}</span>
                  <span className="text-slate-400 ml-1">— {j.company}</span>
                  {j.location && (
                    <span className="text-slate-400 text-xs ml-2">· {j.location}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </>
      )}

      {selected && (
        <form onSubmit={handleSubmit} className="border-t border-slate-100 pt-4 flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Matching to:{" "}
            <span className="font-medium text-primary">
              {selected.title} — {selected.company}
            </span>
          </p>
          <Input
            label="Match rate (%)"
            name="matchRate"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 85"
          />
          <Textarea
            label="Note (optional)"
            name="note"
            rows={2}
            placeholder="Why this match?"
          />
          <Button type="submit" disabled={isPending} size="sm">
            {isPending ? "Creating…" : "Create match & notify"}
          </Button>
        </form>
      )}

      {message && (
        <p
          className={`mt-3 text-sm px-3 py-2 rounded-lg ${
            message.ok
              ? "text-green-700 bg-green-50"
              : "text-red-700 bg-red-50"
          }`}
        >
          {message.text}
        </p>
      )}
    </div>
  );
}
