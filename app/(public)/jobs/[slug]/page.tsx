import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  const job = await prisma.job.findUnique({
    where: { slug, published: true },
  });
  if (!job) notFound();
  if (job.expiresAt && job.expiresAt < new Date()) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/jobs" className="text-sm text-accent hover:underline mb-6 inline-block">
        ← Back to jobs
      </Link>

      <div className="bg-white border border-slate-200 rounded-2xl p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-primary">{job.title}</h1>
            <p className="text-lg text-slate-600 mt-1">{job.company}</p>
          </div>
          {job.applyUrl ? (
            <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
              <Button>Apply now →</Button>
            </a>
          ) : (
            <Link href="/subscribe">
              <Button>Apply via profile</Button>
            </Link>
          )}
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge variant={job.remote ? "accent" : "default"}>
            {job.remote ? "Remote" : job.location}
          </Badge>
          <Badge variant="outline">{job.type.replace("_", " ")}</Badge>
          {job.salary && <Badge variant="success">{job.salary}</Badge>}
        </div>

        {(() => {
          const tagList = job.tags.split(",").map((t) => t.trim()).filter(Boolean);
          return tagList.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tagList.map((tag) => (
                <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          ) : null;
        })()}

        <hr className="my-6 border-slate-100" />

        <div className="prose prose-slate max-w-none text-sm leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>

        <p className="mt-8 text-xs text-slate-400">Posted {formatDate(job.createdAt)} · Updated {formatDate(job.updatedAt)}</p>
      </div>
    </div>
  );
}
