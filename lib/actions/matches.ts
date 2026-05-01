"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendJobMatch } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function createMatch(data: FormData) {
  const session = await auth();
  if (!session?.user.isAdmin) return { ok: false, message: "Unauthorized" };

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

  await sendJobMatch(user.email, user.name, job, note);

  revalidatePath("/admin/matches");
  return { ok: true, message: `Match created and email sent to ${user.email}.` };
}
