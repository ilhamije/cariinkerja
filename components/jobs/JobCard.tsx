import Link from "next/link";
import Badge from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface JobCardProps {
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
  matchRate?: number | null;
}

export default function JobCard({ job, matchRate }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.slug}`} className="block group">
      <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-accent hover:shadow-md transition-all duration-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-primary group-hover:text-accent transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">{job.company}</p>
          </div>
          {matchRate != null && (
            <div className="shrink-0 flex flex-col items-end">
              <span className="text-lg font-bold text-accent">{matchRate}%</span>
              <span className="text-xs text-slate-400">match</span>
            </div>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant={job.remote ? "accent" : "default"}>
            {job.remote ? "Remote" : job.location}
          </Badge>
          <Badge variant="outline">
            {job.type.replace("_", " ")}
          </Badge>
          {job.salary && (
            <Badge variant="success">{job.salary}</Badge>
          )}
        </div>

        {(() => {
          const tagList = Array.isArray(job.tags)
            ? job.tags
            : job.tags.split(",").map((t) => t.trim()).filter(Boolean);
          return tagList.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {tagList.slice(0, 4).map((tag) => (
                <span key={tag} className="text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : null;
        })()}

        <p className="mt-3 text-xs text-slate-400">{formatDate(job.createdAt)}</p>
      </div>
    </Link>
  );
}
