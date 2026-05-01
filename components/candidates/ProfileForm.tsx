"use client";

import { useState, useTransition } from "react";
import { User } from "@prisma/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { updateProfile } from "@/lib/actions/profile";

export default function ProfileForm({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      setMessage("CV uploaded successfully.");
    } catch {
      setMessage("CV upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await updateProfile(data);
      setMessage(result.message);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-5">
      <Input
        label="Full name"
        id="name"
        name="name"
        defaultValue={user.name ?? ""}
        placeholder="Jane Doe"
      />

      <Input
        label="LinkedIn URL"
        id="linkedinUrl"
        name="linkedinUrl"
        type="url"
        defaultValue={user.linkedinUrl ?? ""}
        placeholder="https://linkedin.com/in/yourprofile"
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">CV / Resume (PDF)</label>
        {user.cvUrl && (
          <p className="text-xs text-green-600">
            ✓ CV uploaded.{" "}
            <a href={user.cvUrl} target="_blank" rel="noopener noreferrer" className="underline">
              View current
            </a>
          </p>
        )}
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark"
        />
        {uploading && <p className="text-xs text-slate-400">Uploading…</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-foreground">Preferences</label>
        <Input
          id="roles"
          name="roles"
          placeholder="e.g. Frontend Engineer, Product Designer"
          defaultValue={(() => { try { return JSON.parse(user.preferences as string ?? "{}").roles ?? ""; } catch { return ""; } })()}
        />
        <Input
          id="locations"
          name="locations"
          placeholder="e.g. Jakarta, Remote"
          defaultValue={(() => { try { return JSON.parse(user.preferences as string ?? "{}").locations ?? ""; } catch { return ""; } })()}
          className="mt-2"
        />
      </div>

      {message && (
        <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">{message}</p>
      )}

      <Button type="submit" disabled={isPending} className="self-end">
        {isPending ? "Saving…" : "Save profile"}
      </Button>
    </form>
  );
}
