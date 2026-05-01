import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default async function AdminJobsPage() {
  const jobs = await prisma.job.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-primary">Jobs</h1>
        <Link href="/admin/jobs/new">
          <Button>+ New job</Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Company</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">{job.title}</td>
                <td className="px-4 py-3 text-slate-500">{job.company}</td>
                <td className="px-4 py-3">
                  <Badge variant={job.published ? "success" : "warning"}>
                    {job.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400">{formatDate(job.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/jobs/${job.id}/edit`} className="text-accent hover:underline text-xs font-medium">
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-400">No jobs yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
