import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import JobForm from "@/components/admin/JobForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditJobPage({ params }: Props) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-primary mb-8">Edit job</h1>
      <JobForm job={job} />
    </div>
  );
}
