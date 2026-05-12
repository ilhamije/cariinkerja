import { prisma } from "@/lib/prisma";
import JobCard from "@/components/jobs/JobCard";
import JobsFilter from "@/components/jobs/JobsFilter";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function JobsPage({ searchParams }: Props) {
  const { q } = await searchParams;

  const jobs = await prisma.job.findMany({
    where: {
      published: true,
      AND: [
        {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      ],
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
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary">Open positions</h1>
        <p className="mt-2 text-slate-600">{jobs.length} curated {jobs.length === 1 ? "role" : "roles"}</p>
      </div>

      <JobsFilter q={q} />

      {jobs.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          <p className="text-lg">{q ? "No jobs match your search." : "No jobs posted yet."}</p>
          <p className="text-sm mt-1">Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
