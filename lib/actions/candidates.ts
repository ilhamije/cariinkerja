"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendProfileActivated } from "@/lib/email";
import { revalidatePath } from "next/cache";

export async function updateCandidateStatus(candidateId: string, status: string) {
  const session = await auth();
  if (!session?.user.isAdmin) return { message: "Unauthorized" };

  const user = await prisma.user.update({
    where: { id: candidateId },
    data: { status: status as never },
  });

  if (status === "ACTIVE") {
    await sendProfileActivated(user.email, user.name);
  }

  revalidatePath(`/admin/candidates/${candidateId}`);
  revalidatePath("/admin/candidates");
  return { message: `Status updated to ${status}.` };
}
