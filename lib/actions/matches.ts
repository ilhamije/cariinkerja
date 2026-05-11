"use server";

import { prisma } from "@/lib/prisma";
import { sendJobMatch } from "@/lib/email";
import { isAdminAuthorized } from "@/lib/admin-token";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

export async function createMatch(data: FormData) {
  if (!(await isAdminAuthorized())) return { ok: false, message: "Unauthorized" };

  const userId = data.get("userId") as string;
  const jobId = data.get("jobId") as string;
  const matchRate = data.get("matchRate") ? Number(data.get("matchRate")) : null;
  const note = data.get("note") as string;

  const [user, job] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.job.findUnique({ where: { id: jobId } }),
  ]);

  if (!user || !job) return { ok: false, message: "User or job not found." };

  const match = await prisma.match.create({
    data: { userId, jobId, matchRate, note: note || null, status: "PENDING" },
  });

  // Send email and then update status to NOTIFIED
  await sendJobMatch(user.email, user.name, job, note);
  await prisma.match.update({
    where: { id: match.id },
    data: { status: "NOTIFIED" },
  });

  revalidatePath("/admin/matches");
  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${userId}`);
  revalidatePath("/dashboard");
  return { ok: true, message: "Match created and email sent." };
}

export async function deleteMatch(matchId: string, candidateId?: string) {
  if (!(await isAdminAuthorized())) return { ok: false, message: "Unauthorized" };

  await prisma.match.delete({ where: { id: matchId } });

  revalidatePath("/admin/matches");
  revalidatePath("/admin/candidates");
  if (candidateId) revalidatePath(`/admin/candidates/${candidateId}`);
  return { ok: true };
}

export async function updateMatchStatus(matchId: string, status: "PENDING" | "NOTIFIED" | "VIEWED" | "APPLIED" | "DISMISSED") {
  const session = await auth();
  if (!session?.user?.id) return { ok: false, message: "Unauthorized" };

  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) return { ok: false, message: "Match not found" };
  if (match.userId !== session.user.id) return { ok: false, message: "Unauthorized" };

  await prisma.match.update({
    where: { id: matchId },
    data: { status },
  });

  revalidatePath("/dashboard");
  return { ok: true };
}
