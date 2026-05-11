import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import JobCard from "@/components/jobs/JobCard";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import Button from "@/components/ui/Button";
import DashboardMatches from "@/components/dashboard/DashboardMatches";

const STATUS_LABEL: Record<string, { label: string; variant: "warning" | "accent" | "success" | "default" | "outline" | "danger" }> = {
  PENDING: { label: "Profile under review", variant: "warning" },
  UNDER_REVIEW: { label: "Being reviewed", variant: "accent" },
  ACTIVE: { label: "Active — receiving matches", variant: "success" },
  PAUSED: { label: "Paused", variant: "default" },
};

export default async function DashboardPage() {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: {
      matches: {
        include: { job: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) return null;

  const statusInfo = STATUS_LABEL[user.status] ?? STATUS_LABEL.PENDING;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary">
            Hi, {user.name?.split(" ")[0] ?? "there"} 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm">{user.email}</p>
        </div>
        <Link href="/profile">
          <Button variant="outline" size="sm">Edit profile</Button>
        </Link>
      </div>

      {/* Status card */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Profile status</p>
          <div className="mt-1">
            <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
          </div>
          {user.status === "PENDING" && (
            <p className="text-xs text-slate-400 mt-2">
              Upload your CV in your{" "}
              <Link href="/profile" className="text-accent hover:underline">profile</Link>{" "}
              to speed up review.
            </p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-sm text-slate-500">Matches</p>
          <p className="text-2xl font-bold text-primary">{user.matches.length}</p>
        </div>
      </div>

      {/* Matched jobs */}
      <h2 className="text-lg font-semibold text-primary mb-4">Your matches</h2>
      {user.matches.length === 0 ? (
        <div className="bg-slate-50 rounded-xl p-10 text-center text-slate-400">
          <p>No matches yet.</p>
          <p className="text-sm mt-1">Our curator will notify you when a great role comes up.</p>
        </div>
      ) : (
        <DashboardMatches matches={user.matches} />
      )}
    </div>
  );
}
