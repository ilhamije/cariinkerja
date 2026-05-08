"use client";

import { useState, useTransition } from "react";
import { Job } from "@prisma/client";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { saveJob } from "@/lib/actions/jobs";

export default function JobForm({ job }: { job?: Job }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await saveJob(data, job?.id);
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <Input label="Job title" id="title" name="title" required defaultValue={job?.title} placeholder="e.g. Senior Frontend Engineer" />
        <Input label="Company" id="company" name="company" required defaultValue={job?.company} placeholder="e.g. Acme Corp" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input label="Location" id="location" name="location" required defaultValue={job?.location} placeholder="e.g. Jakarta" />
        <Input label="Salary range" id="salary" name="salary" defaultValue={job?.salary ?? ""} placeholder="e.g. Rp 15–25M/mo" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="type" className="text-sm font-medium">Job type</label>
          <select
            id="type" name="type"
            defaultValue={job?.type ?? "FULL_TIME"}
            className="h-10 rounded-lg border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="FREELANCE">Freelance</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Options</label>
          <div className="flex flex-col gap-2 mt-1">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="remote" defaultChecked={job?.remote} className="accent-primary" />
              Remote
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked={job?.published} className="accent-primary" />
              Published
            </label>
          </div>
        </div>
      </div>

      <Input
        label="Tags (comma separated)"
        id="tags"
        name="tags"
        defaultValue={job?.tags ?? ""}
        placeholder="e.g. React, TypeScript, Remote"
      />

      <Input
        label="External apply link (optional)"
        id="applyUrl"
        name="applyUrl"
        type="url"
        defaultValue={job?.applyUrl ?? ""}
        placeholder="https://linkedin.com/jobs/... or https://indeed.com/..."
      />

      <Input
        label="Expiry date (blank = never expires)"
        id="expiresAt"
        name="expiresAt"
        type="date"
        defaultValue={job?.expiresAt ? job.expiresAt.toISOString().split('T')[0] : ""}
      />

      <Textarea
        label="Job description"
        id="description"
        name="description"
        required
        rows={10}
        defaultValue={job?.description}
        placeholder="Describe the role, requirements, responsibilities…"
      />

      {message && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{message}</p>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving…" : job ? "Save changes" : "Create job"}
        </Button>
      </div>
    </form>
  );
}
