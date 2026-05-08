import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import AdminFilters from "@/components/admin/AdminFilters";

const STATUS_OPTIONS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

interface Props {
  searchParams: Promise<{ q?: string; status?: string }>;
}

export default async function AdminJobsPage({ searchParams }: Props) {
  const { q, status } = await searchParams;

  const published =
    status === "published" ? true : status === "draft" ? false : undefined;

  const jobs = await prisma.job.findMany({
    where: {
      ...(published !== undefined ? { published } : {}),
      ...(q
        ? {
            OR: [
              { title: { contains: q } },
              { company: { contains: q } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-primary">Jobs</h1>
        <Link href="/admin/jobs/new">
          <Button size="sm">+ New job</Button>
        </Link>
      </div>

      <AdminFilters
        searchPlaceholder="Search by title or company…"
        filterLabel="All statuses"
        filterOptions={STATUS_OPTIONS}
        filterName="status"
        filterValue={status}
        clearHref="/admin/jobs"
        q={q}
      />

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full text-sm min-w-[380px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Title</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden sm:table-cell">Company</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden lg:table-cell">Expires</th>
              <th className="text-left px-4 py-3 text-slate-500 font-medium hidden md:table-cell">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-800">
                  <span>{job.title}</span>
                  <span className="block sm:hidden text-xs text-slate-400 font-normal">{job.company}</span>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden sm:table-cell">{job.company}</td>
                <td className="px-4 py-3">
                  <Badge variant={job.published ? "success" : "warning"}>
                    {job.published ? "Published" : "Draft"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-400 hidden lg:table-cell">
                  {job.expiresAt === null ? (
                    <span className="text-slate-500">Never</span>
                  ) : job.expiresAt < new Date() ? (
                    <Badge variant="danger">Expired</Badge>
                  ) : (
                    formatDate(job.expiresAt)
                  )}
                </td>
                <td className="px-4 py-3 text-slate-400 hidden md:table-cell">{formatDate(job.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="text-accent hover:underline text-xs font-medium"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {jobs.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-slate-400">
                  {q || status ? "No jobs match your filters." : "No jobs yet."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        {jobs.length} job{jobs.length !== 1 ? "s" : ""}
      </p>
    </div>
  );
}
