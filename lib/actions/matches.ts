"use server";

import { prisma } from "@/lib/prisma";
// import { sendJobMatch } from "@/lib/email";
import { isAdminAuthorized } from "@/lib/admin-token";
import { revalidatePath } from "next/cache";

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

  await prisma.match.create({
    data: { userId, jobId, matchRate, note: note || null, notified: true },
  });

  // await sendJobMatch(user.email, user.name, job, note);
  console.log("[email] Job match →", user.name ?? "unknown", `<${user.email}>`, "|", job.title, "at", job.company, note ? `| note: ${note}` : "");

  revalidatePath("/admin/matches");
  revalidatePath("/admin/candidates");
  revalidatePath(`/admin/candidates/${userId}`);
  return { ok: true, message: `Match created. (Email logged to console — Resend not wired yet.)` };
}

export async function deleteMatch(matchId: string, candidateId?: string) {
  if (!(await isAdminAuthorized())) return { ok: false, message: "Unauthorized" };

  await prisma.match.delete({ where: { id: matchId } });

  revalidatePath("/admin/matches");
  revalidatePath("/admin/candidates");
  if (candidateId) revalidatePath(`/admin/candidates/${candidateId}`);
  return { ok: true };
}
